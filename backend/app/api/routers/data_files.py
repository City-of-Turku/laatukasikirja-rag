import logging
import os
import json
from pathlib import Path
from functools import lru_cache

from fastapi import APIRouter, Depends,  HTTPException, status

from app.auth import get_api_token
from app.api.routers.models import DataFilesData, SourceNodes

data_files_router = r = APIRouter()

logger = logging.getLogger("uvicorn")


@lru_cache
def get_data_files(json_file: Path) -> dict | json.JSONDecodeError:
    try:
        with open(json_file, "r") as f:
            json_data = json.load(f)
    except json.JSONDecodeError as e:
        return e    
    try:
        docstore_data = json_data["docstore/data"]
        ret_list = []
        file_names_added = []
        for key in list(set(docstore_data.keys())):
            file_name = docstore_data[key]["__data__"]["metadata"]["file_name"]
            if file_name in file_names_added:
                continue
            metadata = {"file_name": file_name, "file_path": docstore_data[key]["__data__"]["metadata"]["file_path"]}
            url = SourceNodes.get_url_from_metadata(metadata)
            ret_list.append({"file_name": file_name, "url":url})
            file_names_added.append(file_name) 
        return ret_list
    except KeyError as e:
        return e


def raise_error(detail_msg: str, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR):
    # Clear cache in errors, this allows fixing errors without restarting the server.        
    get_data_files.cache_clear()    
    logger.error(detail_msg)
    raise HTTPException(
        status_code=status_code,
        detail=detail_msg
    )


@r.get("/data_files")
def data_files(api_token: str = Depends(get_api_token)) -> DataFilesData:
    data_dir = Path.cwd() / "storage"
    json_file = data_dir / "docstore.json"

    if not data_dir.exists() or not data_dir.is_dir():
        raise_error("'storage' directory not found.")

    if not os.path.exists(json_file):
        raise_error("'docstore.json' not found.")       

    ret_data = get_data_files(json_file)
    
    if type(ret_data) == list:
        return {"files": ret_data}  
    elif isinstance(ret_data, json.JSONDecodeError):
        raise_error( f"Failed to decode JSON from '{json_file}'")
    elif isinstance(ret_data, KeyError):
        raise_error(f"KeyError: {str(ret_data)}")        

import logging
import os
import json
from pathlib import Path
from functools import lru_cache

from fastapi import APIRouter, Depends,  HTTPException, status

from app.auth import get_api_token
from app.api.routers.models import DataFilesData

data_files_router = r = APIRouter()

logger = logging.getLogger("uvicorn")


@lru_cache
def get_data_files(json_file: Path) -> dict | json.JSONDecodeError:
    try:
        with open(json_file, "r") as f:
            return json.load(f)
    except json.JSONDecodeError as e:
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
    
    if type(ret_data) == dict:
        files = None
        try:
            docstore_data = ret_data["docstore/data"]
            files = list(set([docstore_data[key]["__data__"]["metadata"]["file_name"] for key in docstore_data.keys()]))
        except KeyError as e:
            raise_error(f"KeyError: {str(e)}")        
        return {"files": files}   
    else:
        raise_error( f"Failed to decode JSON from '{json_file}'")
     
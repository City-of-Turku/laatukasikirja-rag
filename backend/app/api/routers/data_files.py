import logging
import os
import json
from pathlib import Path

from fastapi import APIRouter, Depends,  HTTPException, status

from app.auth import get_api_token
from app.api.routers.models import DataFilesData

data_files_router = r = APIRouter()

logger = logging.getLogger("uvicorn")

@r.get("/data_files")
def data_files(api_token: str = Depends(get_api_token)) -> DataFilesData:
    data_dir = Path.cwd() / "storage"
    json_file = data_dir / "docstore.json"

    if not data_dir.exists() or not data_dir.is_dir():
        detail_msg = f"'storage' directory not found."
        logger.error(detail_msg)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail_msg
        )
    
    if not os.path.exists(json_file):
        detail_msg = f"'docstore.json' not found."
        logger.error(detail_msg)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail_msg
        )   
     
    try:
        with open(json_file, "r") as f:
            content = json.load(f)
    except json.JSONDecodeError:
        detail_msg =  f"Failed to decode JSON from '{json_file}'"
        logger.error(detail_msg)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail_msg
        )
    
    docstore_data = content["docstore/data"]

    try:
        files = list(set([docstore_data[key]["__data__"]["metadata"]["file_name"] for key in docstore_data.keys()]))
    except KeyError as e:
        detail_msg = f"KeyError: {str(e)}"
        logger.error(detail_msg)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail_msg
        )
    
    return {"files": files}
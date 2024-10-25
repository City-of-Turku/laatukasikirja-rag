import os

from fastapi import Depends, HTTPException
from fastapi.security import APIKeyHeader


token = os.getenv("API_TOKEN")

api_key_header = APIKeyHeader(name="X-API-Token", auto_error=False)

async def get_api_token(api_token: str = Depends(api_key_header)):
    if api_token != token:
        raise HTTPException(status_code=403, detail="Invalid API Token")
    return api_token
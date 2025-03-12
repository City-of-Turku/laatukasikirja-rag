# flake8: noqa: E402
from app.config import DATA_DIR
from dotenv import load_dotenv

load_dotenv()

import logging
import os

import uvicorn
from app.api.routers import api_router
from app.observability import init_observability
from app.settings import init_settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from llama_index.core.constants import DEFAULT_TEMPERATURE, DEFAULT_EMBEDDING_DIM


app = FastAPI(root_path="/fastapi")

init_settings()
init_observability()

environment = os.getenv("ENVIRONMENT", "dev")  # Default to 'development' if not set
logger = logging.getLogger("uvicorn")

if environment == "prod":
    logger.info("Running in production mode.")    
    allow_origins = [o.strip() for o in os.getenv("CORS_ORIGIN_WHITELIST", "").split(",")]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allow_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    logger.warning("Running in development mode - allowing CORS for all origins")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Redirect to documentation page when accessing base URL
    @app.get("/")
    async def redirect_to_docs():
        return RedirectResponse(url="/docs")
    
logger.info(f"MODEL: {os.getenv('MODEL')}")
logger.info(f"EMBEDDING_MODEL: {os.getenv('EMBEDDING_MODEL')}")
logger.info(f"EMBEDDING_DIM: {os.getenv('EMBEDDING_DIM', DEFAULT_EMBEDDING_DIM)}")
logger.info(f"LLM_TEMPERATURE: {os.getenv('LLM_TEMPERATURE', DEFAULT_TEMPERATURE)}")
logger.info(f"TOP_K: {os.getenv('TOP_K', 0)}")
logger.info(f"LLAMA_PARSE_MODES: {os.getenv('LLAMA_PARSE_MODES', 'accurate')}")
logger.info(f"LLAMA_PARSE_RESULT_TYPE: {os.getenv('LLAMA_PARSE_RESULT_TYPE', 'markdown')}")


def mount_static_files(directory, path):
    if os.path.exists(directory):
        logger.info(f"Mounting static files '{directory}' at '{path}'")
        app.mount(
            path,
            StaticFiles(directory=directory, check_dir=False),
            name=f"{directory}-static",
        )


# Mount the data files to serve the file viewer
mount_static_files(DATA_DIR, "/api/files/data")
# Mount the output files from tools
mount_static_files("output", "/api/files/output")

app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    app_host = os.getenv("APP_HOST", "0.0.0.0")
    app_port = int(os.getenv("APP_PORT", "8000"))
    reload = True if environment != "prod" else False

    uvicorn.run(app="main:app", host=app_host, port=app_port, reload=reload)

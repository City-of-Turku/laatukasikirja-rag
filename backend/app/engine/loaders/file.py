import os
import logging
from typing import Dict
from llama_parse import LlamaParse
from pydantic import BaseModel

from app.config import DATA_DIR

logger = logging.getLogger(__name__)

FAST_MODE = "fast"
PREMIUM_MODE = "premium"
CONTINUOUS_MODE = "continuous"
GPT4O_MODE = "gpt4o"
MODE_OPTIONS=[FAST_MODE, PREMIUM_MODE, CONTINUOUS_MODE, GPT4O_MODE]


class FileLoaderConfig(BaseModel):
    use_llama_parse: bool = False


def llama_parse_parser():
    if os.getenv("LLAMA_CLOUD_API_KEY") is None:
        raise ValueError(
            "LLAMA_CLOUD_API_KEY environment variable is not set. "
            "Please set it in .env file or in your shell environment then run again!"
        )
    
    mode_env = os.getenv("LLAMA_PARSE_MODE", "").lower()   
    modes = {k: False for k in MODE_OPTIONS}
    for mode in MODE_OPTIONS:
        if mode_env in mode:
            modes[mode] = True
            break
    
    if modes[GPT4O_MODE]:
        if os.getenv("GPT4O_API_KEY") is None:
            raise ValueError(
                "GTP4O_API_KEY environment variable is not set, required in when running Llama parse in gpt4o mode. "
                "Please set it in .env file or in your shell environment then run again!"
            )
  
    parser = LlamaParse(
        result_type=os.getenv("LLAMA_PARSE_RESULT_TYPE", "markdown"),
        verbose=True,
        language="en",
        ignore_errors=False,
        premium_mode=modes[PREMIUM_MODE],
        fast_mode=modes[FAST_MODE],
        continuous_mode=modes[CONTINUOUS_MODE],
        gpt4o_mode=modes[GPT4O_MODE],
        gpt4o_api_key=os.getenv("GPT4O_API_KEY")
    )
    return parser


def llama_parse_extractor() -> Dict[str, LlamaParse]:
    from llama_parse.utils import SUPPORTED_FILE_TYPES

    parser = llama_parse_parser()
    return {file_type: parser for file_type in SUPPORTED_FILE_TYPES}


def get_file_documents(config: FileLoaderConfig):
    from llama_index.core.readers import SimpleDirectoryReader

    try:
        file_extractor = None
        if config.use_llama_parse:
            # LlamaParse is async first,
            # so we need to use nest_asyncio to run it in sync mode
            import nest_asyncio

            nest_asyncio.apply()

            file_extractor = llama_parse_extractor()
        reader = SimpleDirectoryReader(
            DATA_DIR,
            recursive=True,
            filename_as_id=True,
            raise_on_error=False, # if faulty file, skips instead of erroring
            file_extractor=file_extractor,
        )
        return reader.load_data()
    except Exception as e:
        import sys
        import traceback

        # Catch the error if the data dir is empty
        # and return as empty document list
        _, _, exc_traceback = sys.exc_info()
        function_name = traceback.extract_tb(exc_traceback)[-1].name
        if function_name == "_add_files":
            logger.warning(
                f"Failed to load file documents, error message: {e} . Return as empty document list."
            )
            return []
        else:
            # Raise the error if it is not the case of empty data dir
            raise e

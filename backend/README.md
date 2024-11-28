# Laatukäsikirja backend

This is a [LlamaIndex](https://www.llamaindex.ai/) project using [FastAPI](https://fastapi.tiangolo.com/) bootstrapped with [`create-llama`](https://github.com/run-llama/LlamaIndexTS/tree/main/packages/create-llama).

Requirements:

- Python version 3.11 or 3.12

## Getting Started

First, setup the environment with poetry:

> **_Note:_** This step is not needed if you are using the dev-container (not tested with this project).

```
poetry install
poetry shell
```

Then check the parameters that have been pre-configured in the `.env` file in this directory. (E.g. you might need to configure an `OPENAI_API_KEY` if you're using OpenAI as model provider).

If you are using any tools or data sources, you can update their config files in the `config` folder.

Add folder `storage` in backend root and add following files with content `{}`

- docstore.json
- graph_store.json
- image__vector_store.json
- index_store.json

Generate the embeddings of the documents in the `./data` directory (if this folder exists - otherwise, skip this step):

### LlamaParse
To use LlamaParse set `use_llama_parse` to `true` in `loaders.yaml` and configure `LLAMA_CLOUD_API_KEY` and optionally `LLAMA_PARSE_MODES`, `GPT4O_API_KEY` and `LLAMA_PARSE_RESULT_TYPE` in the `.env` file.  
For `vendor_multimodal` mode the variables `VENDOR_MULTIMODAL_API_KEY` and `VENDOR_MULTIMODAL_MODEL_NAME` must be set in the `.env` file. 
#### Azure
To use Azure, set mode to `vendor_multimodal` in the `env` file and set the following variables `AZURE_OPENAI_EMBEDDING_DEPLOYMENT`, `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_VERSION` and `AZURE_OPENAI_API_KEY`. Note that using Azure will exclude other modes.

```
poetry run generate
```

Third, run the development server:

```
python main.py
```

The example provides two different API endpoints:

1. `fastapi/api/chat` - a streaming chat endpoint
2. `fastapi/api/chat/request` - a non-streaming chat endpoint

You can test the streaming endpoint with the following curl request:

```
curl --location 'localhost:8000/fastapi/api/chat' \
--header 'Content-Type: application/json' \
--header 'X-API-Token: your_api_token' \
--data '{ "messages": [{ "role": "user", "content": "Hello" }] }'
```

And for the non-streaming endpoint run:

```
curl --location 'localhost:8000/fastapi/api/chat/request' \
--header 'Content-Type: application/json' \
--header 'X-API-Token: your_api_token' \
--data '{ "messages": [{ "role": "user", "content": "Hello" }] }'
```

You can start editing the API endpoints by modifying `app/api/routers/chat.py`. The endpoints auto-update as you save the file. You can delete the endpoint you're not using.

Open [http://localhost:8000/docs](http://localhost:8000/docs) with your browser to see the Swagger UI of the API.

The API allows CORS for all origins to simplify development. You can change this behavior by setting the `ENVIRONMENT` environment variable to `prod`:

```
ENVIRONMENT=prod python main.py
```

## Using Docker

1. Build an image for the FastAPI app:

```
docker build -t <your_backend_image_name> .
```

2. Generate embeddings:

Parse the data and generate the vector embeddings if the `./data` folder exists - otherwise, skip this step:

```
docker run \
  --rm \
  -v $(pwd)/.env:/app/.env \ # Use ENV variables and configuration from your file-system
  -v $(pwd)/config:/app/config \
  -v $(pwd)/data:/app/data \ # Use your local folder to read the data
  -v $(pwd)/storage:/app/storage \ # Use your file system to store the vector database
  <your_backend_image_name> \
  poetry run generate
```

3. Start the API:

```
docker run \
  -v $(pwd)/.env:/app/.env \ # Use ENV variables and configuration from your file-system
  -v $(pwd)/config:/app/config \
  -v $(pwd)/storage:/app/storage \ # Use your file system to store gea vector database
  -p 8000:8000 \
  <your_backend_image_name>
```

## Learn More

To learn more about LlamaIndex, take a look at the following resources:

- [LlamaIndex Documentation](https://docs.llamaindex.ai) - learn about LlamaIndex.

You can check out [the LlamaIndex GitHub repository](https://github.com/run-llama/llama_index) - your feedback and contributions are welcome!

# Laatukäsikirja RAG app

This is a [LlamaIndex](https://www.llamaindex.ai/) project bootstrapped with [`create-llama`](https://github.com/run-llama/LlamaIndexTS/tree/main/packages/create-llama).

## Getting Started

First, startup the backend as described in the [backend README](./backend/README.md).

Second, run the development server of the frontend as described in the [frontend README](./frontend/README.md).

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to run with docker compose

First check setup instructions in both frontend and backend and set env's. Make sure you have docker installed. Create file `Caddyfile` in project root based on `Caddyfile.example`.

Then first run:

```
docker compose up -d
```

optionally before running `up` command, you can build images first individually or all at once:

```
docker compose build
```

or

```
docker compose build <service>
```

When services are up, generate AI embeddings:

```
docker compose exec backend /bin/bash
poetry run generate
exit
```

## Learn More

To learn more about LlamaIndex, take a look at the following resources:

- [LlamaIndex Documentation](https://docs.llamaindex.ai) - learn about LlamaIndex (Python features).
- [LlamaIndexTS Documentation](https://ts.llamaindex.ai) - learn about LlamaIndex (Typescript features).

You can check out [the LlamaIndexTS GitHub repository](https://github.com/run-llama/LlamaIndexTS) - your feedback and contributions are welcome!

# Laatukäsikirja frontend

This is a [LlamaIndex](https://www.llamaindex.ai/) project using [Next.js](https://nextjs.org/) bootstrapped with [`create-llama`](https://github.com/run-llama/LlamaIndexTS/tree/main/packages/create-llama).

Requirements:

- Nodejs version 20

## Getting Started

First, install the dependencies:

```
npm install
```

Second, generate the embeddings of the documents in the `./data` directory (if this folder exists - otherwise, skip this step):

```
npm run generate
```

Create a `.env.local` file in frontend root and add following:

- `API_TOKEN` which is used for backend calls.
- `USE_TUNNISTAMO` if set, users are required to authenticate before being able to use AI-chat.
- `AUTH_CLIENT_ID` given by auth provider (optional, only used when auth provider in use like Tunnistamo).
- `AUTH_CLIENT_SECRET` given by auth provider (optional, only used when auth provider in use like Tunnistamo).
- `AUTH_TRUST_HOST` set to `"true"`, see more info: <https://authjs.dev/reference/core/errors#untrustedhost>.
- `AUTH_URL` set to `yourbaseurl/api/auth`, is used for redirecting from auth provider.
- `NEXT_PUBLIC_CHAT_API` which is backend chat API's URL when accessing from browser.
- `CHAT_API` URL for Nextjs backend to access chat API. Set to `http://backend:8000/api/chat` when using root level `docker-compose.yml`.

Add `AUTH_SECRET` to `.env.local` manually or generate by running:

```
npx auth secret
```

Run the development server:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Using Docker

1. Build an image for the Next.js app:

```
docker build -t <your_app_image_name> .
```

2. Generate embeddings:

Parse the data and generate the vector embeddings if the `./data` folder exists - otherwise, skip this step:

```
docker run \
  --rm \
  -v $(pwd)/.env:/app/.env \ # Use ENV variables and configuration from your file-system
  -v $(pwd)/config:/app/config \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/cache:/app/cache \ # Use your file system to store the vector database
  <your_app_image_name> \
  npm run generate
```

3. Start the app:

```
docker run \
  --rm \
  -v $(pwd)/.env:/app/.env \ # Use ENV variables and configuration from your file-system
  -v $(pwd)/config:/app/config \
  -v $(pwd)/cache:/app/cache \ # Use your file system to store gea vector database
  -p 3000:3000 \
  <your_app_image_name>
```

## Learn More

To learn more about LlamaIndex, take a look at the following resources:

- [LlamaIndex Documentation](https://docs.llamaindex.ai) - learn about LlamaIndex (Python features).
- [LlamaIndexTS Documentation](https://ts.llamaindex.ai) - learn about LlamaIndex (Typescript features).

You can check out [the LlamaIndexTS GitHub repository](https://github.com/run-llama/LlamaIndexTS) - your feedback and contributions are welcome!

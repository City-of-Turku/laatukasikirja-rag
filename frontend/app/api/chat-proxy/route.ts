import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { messages } = await request.json();

  if (!process.env.CHAT_API || !process.env.API_TOKEN) {
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  try {
    const response = await fetch(`${process.env.CHAT_API}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Token': `${process.env.API_TOKEN}`
      },
      body: JSON.stringify({ messages }),
    });

    // Create a TransformStream to process the incoming data
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        // Process each chunk here if needed
        controller.enqueue(chunk);
      },
    });

    // Pipe the response body through our transform stream
    // const stream = response.body.pipeThrough(transformStream);
    const stream = response.body?.pipeThrough(transformStream);

    // Return a streaming response
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    /*
    console.error('Error in chat proxy:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    */
    if (error instanceof Error) {
      console.error('Error in chat proxy:', error);
      return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  } else {
      console.error('Unknown error type:', error);
      return NextResponse.json({ message: 'Internal server error', error: 'Unknown error' }, { status: 500 });
  }
  }
}
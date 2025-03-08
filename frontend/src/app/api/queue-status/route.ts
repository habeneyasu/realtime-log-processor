import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/queue-status`);
    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch queue status' }, { status: 500 });
  }
}
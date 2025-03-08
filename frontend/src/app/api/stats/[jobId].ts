import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { jobId: string } }) {
  const { jobId } = params;

  try {
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stats/${jobId}`);
    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch job stats' }, { status: 500 });
  }
}
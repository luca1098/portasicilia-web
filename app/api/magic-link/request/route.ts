import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.API_URL || 'http://localhost:7002'

export async function POST(req: NextRequest) {
  const body = await req.arrayBuffer()

  const res = await fetch(`${BACKEND_URL}/auth/magic-link/request`, {
    method: 'POST',
    headers: {
      'Content-Type': req.headers.get('content-type') ?? 'application/json',
      ...(req.headers.get('accept-language') && {
        'Accept-Language': req.headers.get('accept-language') as string,
      }),
    },
    body,
  })

  return new NextResponse(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
  })
}

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const testPaths = [
    '/FisherMan Slot/index.html',
    '/FisherMan%20Slot/index.html',
    '/templates/game/game.html',
  ]
  
  return NextResponse.json({
    requestUrl: request.url,
    pathname: request.nextUrl.pathname,
    testResults: testPaths.map(path => ({
      path,
      startsWithSpace: path.startsWith('/FisherMan Slot/'),
      startsWithEncoded: path.startsWith('/FisherMan%20Slot/'),
    })),
    timestamp: new Date().toISOString(),
  })
}

import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function middleware() {
  try {
    const notesDocID = headers().get('notesDocID');
    if (!notesDocID) {
      return NextResponse.json(
        { error: 'FROM MIDDLEWARE : notesDocID header is required!' },
        { status: 400 },
      );
    }
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const config = {
  matcher: ['/api/notes/:path*', '/api/notes', '/api/notebook/:path*'],
};


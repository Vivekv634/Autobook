import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function middleware(request) {
    const usernotesID = headers().get('usernotesID');
    if (!usernotesID) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next();
}

export const config = {
    matcher: '/api/notes/:path*'
}
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';


export function middleware(req: NextRequest) {
  const session = cookies().get(name);
  return session ? JSON.parse(session?.value ?? '{}') : undefined;
  const user = session.user ? JSON.parse(session.user) : null;

  if(req.nextUrl.pathname !== "/sign-in" && !user){
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  if(req.nextUrl.pathname === "/" && !user){
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ['/chatrooms/:path*',]
};

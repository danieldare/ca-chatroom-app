import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';


export async  function middleware(req: NextRequest) {
  const session = (await cookies()).get("user");
  const user =  session ? JSON.parse(session?.value ?? '{}') : undefined;

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

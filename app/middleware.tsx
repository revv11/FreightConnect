
import { NextResponse, NextRequest } from "next/server";

import { getToken } from "next-auth/jwt";




export async function middleware(req: NextRequest,) {
  // Access cookies from the request
    const secret = process.env.NEXTAUTH_SECRET;
    
    const token2 = await getToken({ req, secret });
    
    
    
    
    
    const url = req.nextUrl;
  if(url.pathname === ('/')){
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  else if (!token2 && (url.pathname.startsWith('/dashboard'))) {
    // If token is not found, you can redirect or return an error response
    return NextResponse.redirect(new URL('/login', req.url)); // Or any page you want to redirect to
  }
  else if(token2 && (url.pathname.startsWith('/login')|| url.pathname.startsWith('/signup'))){
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  else if(!token2 && (url.pathname.startsWith('/api/messages') || url.pathname.startsWith('/api/find')) ){
    return NextResponse.json({message: "login to kr pehle"})
  }
  else if (!token2  &&(url.pathname.startsWith('/details'))) {

      

    // If token is not found, you can redirect or return an error response
    return NextResponse.redirect(new URL('/signup', req.url)); // Or any page you want to redirect to
      
 
    
  }
 
}
export const config={
    matcher:[
        "/dashboard/:path*",
        "/login",
        "/signup",
        "/api/messages/:path*",
        "/api/find", 
        "/details"
        
    ]
}
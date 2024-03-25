import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";

export function middleware(request: NextRequest) {
  // get acc query param
  const path = new URL(request.url).pathname;

  if (path === "/wallets" || path === "/login" || path === "/create") {
    return NextResponse.next();
  }

  const acc = new URL(request.url).searchParams.get("acc");
  if (!acc) {
    return NextResponse.redirect(new URL("/wallets", request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|images|_next/static|_next/image|favicon.ico).*)"],
};

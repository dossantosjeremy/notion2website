import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost:3000";

  // Skip middleware for the app itself, localhost, and Next.js internals
  if (
    hostname === appDomain ||
    hostname.startsWith("localhost") ||
    hostname.startsWith("127.0.0.1")
  ) {
    return NextResponse.next();
  }

  // Subdomain routing: strip the apex domain
  // e.g., my-site.notion2website.com → subdomain = "my-site"
  const subdomain = hostname.replace(`.${appDomain}`, "");
  if (!subdomain || subdomain === appDomain) {
    return NextResponse.next();
  }

  // Rewrite to /s/[subdomain]/[...path]
  const url = request.nextUrl.clone();
  const originalPath = url.pathname;
  url.pathname = `/s/${subdomain}${originalPath}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

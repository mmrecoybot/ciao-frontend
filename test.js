import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

let locales = ["it", "en"];
let defaultLocale = "en";

function getLocale(request) {
  const acceptedLanguage = request.headers.get("accept-language") || "";
  let headers = { "accept-language": acceptedLanguage };
  let languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  const locale = getLocale(request);
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}`) && pathname !== `${locale}`
  );

  if (pathnameIsMissingLocale) {
    const searchQuery = searchParams.toString();
    const url = new URL(
      `/${locale}/${pathname}${searchQuery ? `?${searchQuery}` : ""}`,
      request.url
    );
    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(request.headers);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Set response header with extracted params
  response.headers.set(
    "x-params",
    JSON.stringify(extractParamsFromURL(pathname))
  );

  return response;
}

export const config = {
  matcher: ["/((?!api|assets|.*\\..*|_next).*)"],
};

function extractParamsFromURL(url) {
  const parts = url.split("/").filter(Boolean);
  return {
    lang: parts[0] || defaultLocale,
    id: parts.length > 1 ? parts[parts.length - 1] : null,
  };
}

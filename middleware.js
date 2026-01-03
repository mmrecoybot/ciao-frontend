// import { NextResponse } from "next/server";
// import { match } from "@formatjs/intl-localematcher";
// import Negotiator from "negotiator";
// // import { updateSession } from "./lib/lib.ts";

// let locales = ["it", "en"];
// let defaultLocale = "en";

// function getLocale(request) {
//   const acceptedLanguage = request.headers.get("accept-language") ?? undefined;
//   let headers = { "accept-language": acceptedLanguage };
//   let languages = new Negotiator({ headers }).languages();
//   return match(languages, locales, defaultLocale);
// }

// export function middleware(request) {
//   // updateSession(request);
//   const pathname = request.nextUrl.pathname;
//   const searchParams = request.nextUrl.searchParams;
//   const locale = getLocale(request);
//   const pathnameIsMissingLocale = locales.every(
//     (locale) => !pathname.startsWith(`/${locale}`) && pathname !== `${locale}`
//   );

//   if (pathnameIsMissingLocale) {
//     return NextResponse.redirect(
//       new URL(`/${locale}/${pathname}?${searchParams.toString()}`, request.url)
//     );
//   }
//   const requestHeaders = new Headers(request.headers);

//   const response = NextResponse.next({
//     request: {
//       headers: requestHeaders,
//     },
//   });

//   // Set a new response header `x-params`
//   response.headers.set(
//     "x-params",
//     JSON.stringify(extractParamsFromURL(pathname))
//   );
//   return response;
// }

// export const config = {
//   matcher: [
//     // Skip all internal paths (_next, assets, api)
//     "/((?!api|assets|.*\\..*|_next).*)",
//     // Optional: only run on root (/) URL
//     // '/'
//   ],
// };

// function extractParamsFromURL(url) {
//   const params = {};
//   const queryString = url.split("/");
//   if (queryString) {
//     params["lang"] = queryString[1];
//     params["id"] = queryString[queryString.length - 1];
//   }
//   return params;
// }

import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const locales = ["it", "en"];
const defaultLocale = "en";

function getLocale(request) {
  const acceptedLanguage = request.headers.get("accept-language") ?? undefined;
  if (!acceptedLanguage) {
    return defaultLocale;
  }
  const headers = { "accept-language": acceptedLanguage };
  const languages = new Negotiator({ headers }).languages();
  try {
    return match(languages, locales, defaultLocale);
  } catch (error) {
    return defaultLocale;
  }
}

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;
  const locale = getLocale(request);

  // Check if the pathname is missing a locale prefix
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}`)
  );

  if (pathnameIsMissingLocale) {
    // Redirect to the same path with the detected locale prefixed
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}?${searchParams.toString()}`, request.url)
    );
  }

  // Extract parameters from the URL
  const params = extractParamsFromURL(pathname);

  // Set custom header with extracted parameters
  const requestHeaders = new Headers(request.headers);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set("x-params", JSON.stringify(params));

  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, assets, api)
    "/((?!api|assets|.*\\..*|_next).*)",
  ],
};

function extractParamsFromURL(url) {
  const params = {};
  const segments = url.split("/").filter(Boolean); // Remove empty segments
  if (segments.length > 0) {
    params["lang"] = segments[0]; // First segment is the locale
    params["id"] = segments[segments.length - 1]; // Last segment is the ID
  }
  return params;
}

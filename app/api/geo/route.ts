import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 1. Check Vercel / Cloudflare / Proxy headers
    const vercelCountry = req.headers.get("x-vercel-ip-country");
    const vercelCity = req.headers.get("x-vercel-ip-city");
    const cfCountry = req.headers.get("cf-ipcountry");
    
    if (vercelCountry && vercelCountry.length === 2 && vercelCountry !== "XX") {
      return NextResponse.json({
        country_code: vercelCountry.toUpperCase(),
        city: vercelCity ? decodeURIComponent(vercelCity) : "",
        source: "header",
      });
    }

    if (cfCountry && cfCountry.length === 2 && cfCountry !== "XX") {
      return NextResponse.json({
        country_code: cfCountry.toUpperCase(),
        source: "cloudflare",
      });
    }

    // 2. Extract Client IP
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    let clientIp = "";
    if (forwardedFor) {
      clientIp = forwardedFor.split(",")[0].trim();
    } else if (realIp) {
      clientIp = realIp.trim();
    }

    // If client IP is valid external IP
    if (clientIp && !clientIp.startsWith("127.") && clientIp !== "::1" && !clientIp.startsWith("192.168.") && !clientIp.startsWith("10.")) {
      const res = await fetch(`https://ipwho.is/${clientIp}`, {
        cache: "no-store",
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          return NextResponse.json({
            country: data.country,
            country_code: data.country_code,
            city: data.city,
            currency: data.currency?.code || "USD",
            currency_symbol: data.currency?.symbol || "$",
            latitude: data.latitude,
            longitude: data.longitude,
            source: "ipwho",
          });
        }
      }
    }

    // 3. Fallback server-side lookup
    const fallbackRes = await fetch("https://api.country.is/", { cache: "no-store" });
    if (fallbackRes.ok) {
      const fallbackData = await fallbackRes.json();
      if (fallbackData && fallbackData.country) {
        return NextResponse.json({
          country_code: fallbackData.country.toUpperCase(),
          source: "country.is",
        });
      }
    }

    return NextResponse.json({ country_code: "US", source: "default" });
  } catch (err: any) {
    return NextResponse.json({ country_code: "US", error: err?.message }, { status: 200 });
  }
}

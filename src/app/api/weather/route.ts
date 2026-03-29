import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lng = req.nextUrl.searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({
      temp: 20, description: "날씨 정보 없음", icon: "01d", isOutdoorFriendly: true,
    });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      temp: 20, description: "날씨 정보 없음", icon: "01d", isOutdoorFriendly: true,
    });
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=kr`
    );
    if (!res.ok) throw new Error();

    const data = await res.json();
    const temp = data.main.temp;
    const weatherId = data.weather[0].id;

    return NextResponse.json({
      temp: Math.round(temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      isOutdoorFriendly: weatherId >= 800 && temp >= 5 && temp <= 33,
    });
  } catch {
    return NextResponse.json({
      temp: 20, description: "날씨 조회 실패", icon: "01d", isOutdoorFriendly: true,
    });
  }
}

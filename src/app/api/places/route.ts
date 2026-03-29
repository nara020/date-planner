import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get("keyword");
  const lat = req.nextUrl.searchParams.get("lat");
  const lng = req.nextUrl.searchParams.get("lng");

  if (!keyword) {
    return NextResponse.json({ error: "검색어를 입력해주세요" }, { status: 400 });
  }

  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "카카오맵 API 키가 없습니다" }, { status: 500 });
  }

  const params = new URLSearchParams({ query: keyword, size: "5", sort: "accuracy" });
  if (lat && lng) {
    params.set("y", lat);
    params.set("x", lng);
    params.set("sort", "distance");
  }

  const res = await fetch(
    `https://dapi.kakao.com/v2/local/search/keyword.json?${params}`,
    { headers: { Authorization: `KakaoAK ${apiKey}` } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "검색 실패" }, { status: res.status });
  }

  const data = await res.json();
  const places = data.documents.map((doc: Record<string, string>) => ({
    name: doc.place_name,
    address: doc.road_address_name || doc.address_name,
    lat: parseFloat(doc.y),
    lng: parseFloat(doc.x),
    categoryName: doc.category_group_name,
    phone: doc.phone,
    placeUrl: doc.place_url,
  }));

  return NextResponse.json({ places, keyword });
}

import { NextRequest, NextResponse } from "next/server";
import { redis, userKey } from "@/lib/redis";
import { AppData, UserProfile } from "@/lib/types";

// POST - 프로필 생성/업데이트
export async function POST(req: NextRequest) {
  const profile: UserProfile = await req.json();

  if (!profile.id || !profile.nickname || !profile.mbti) {
    return NextResponse.json({ error: "필수 정보가 부족합니다" }, { status: 400 });
  }

  const existing = await redis.get<string>(userKey(profile.id));
  let appData: AppData;

  if (existing) {
    appData = typeof existing === "string" ? JSON.parse(existing) : existing;
    appData.profile = profile;
  } else {
    appData = {
      profile: { ...profile, createdAt: new Date().toISOString() },
      plans: [],
      savedCourses: [],
    };
  }

  await redis.set(userKey(profile.id), JSON.stringify(appData));
  return NextResponse.json(appData);
}

// GET - 프로필 조회
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID가 필요합니다" }, { status: 400 });
  }

  const data = await redis.get<string>(userKey(id));
  if (!data) {
    return NextResponse.json({ error: "프로필이 없습니다" }, { status: 404 });
  }

  const appData: AppData = typeof data === "string" ? JSON.parse(data) : data;
  return NextResponse.json(appData);
}

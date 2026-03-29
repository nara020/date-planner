import { NextRequest, NextResponse } from "next/server";
import { curatedCourses } from "@/lib/curated";

// GET - 큐레이션 코스 목록 / 상세 조회
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const tag = req.nextUrl.searchParams.get("tag");
  const premium = req.nextUrl.searchParams.get("premium");

  // 개별 코스 조회
  if (id) {
    const course = curatedCourses.find((c) => c.id === id);
    if (!course) {
      return NextResponse.json({ error: "코스를 찾을 수 없습니다" }, { status: 404 });
    }
    return NextResponse.json(course);
  }

  // 필터링
  let filtered = [...curatedCourses];

  if (tag) {
    filtered = filtered.filter((c) => c.tags.includes(tag));
  }

  if (premium === "true") {
    filtered = filtered.filter((c) => c.isPremium);
  } else if (premium === "false") {
    filtered = filtered.filter((c) => !c.isPremium);
  }

  return NextResponse.json({
    courses: filtered,
    total: filtered.length,
  });
}

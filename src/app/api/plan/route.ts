import { NextRequest, NextResponse } from "next/server";
import { redis, userKey } from "@/lib/redis";
import { AppData, DatePlan } from "@/lib/types";
import OpenAI from "openai";
import { buildPlannerPrompt } from "@/lib/prompts";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// POST - AI 데이트 플랜 생성
export async function POST(req: NextRequest) {
  const { userId, request, weather, dateType, timeRange } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 400 });
  }

  const data = await redis.get<string>(userKey(userId));
  if (!data) {
    return NextResponse.json({ error: "프로필이 없습니다" }, { status: 404 });
  }

  const appData: AppData = typeof data === "string" ? JSON.parse(data) : data;
  const prompt = buildPlannerPrompt(appData.profile, weather, request);

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "당신은 한국 최고의 커플 데이트 플래너 AI입니다. 반드시 유효한 JSON만 출력하세요. 다른 텍스트는 절대 포함하지 마세요." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 2500,
    });

    const content = completion.choices[0].message.content || "{}";
    const cleaned = content.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const planData = JSON.parse(cleaned);

    const plan: DatePlan = {
      id: `plan-${Date.now()}`,
      title: planData.title || "오늘의 데이트",
      description: planData.description || "",
      weather: weather || undefined,
      timetable: planData.timetable || [],
      totalBudget: planData.totalBudget || "",
      tags: planData.tags || [],
      mood: planData.mood || "",
      dateType: dateType || undefined,
      timeRange: timeRange || undefined,
      createdAt: new Date().toISOString(),
      saved: false,
    };

    // 최근 플랜 저장 (최대 20개)
    appData.plans.unshift(plan);
    if (appData.plans.length > 20) appData.plans = appData.plans.slice(0, 20);
    await redis.set(userKey(userId), JSON.stringify(appData));

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Plan generation error:", error);
    return NextResponse.json(
      { error: "플랜 생성에 실패했어요" },
      { status: 500 }
    );
  }
}

// GET - 플랜 목록 조회
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 400 });
  }

  const data = await redis.get<string>(userKey(userId));
  if (!data) {
    return NextResponse.json({ plans: [] });
  }

  const appData: AppData = typeof data === "string" ? JSON.parse(data) : data;
  return NextResponse.json({ plans: appData.plans });
}

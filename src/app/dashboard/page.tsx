"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AppData, DatePlan, WeatherData, slotCategoryEmoji } from "@/lib/types";
import { curatedCourses } from "@/lib/curated";

type Tab = "plan" | "curated" | "history";

export default function DashboardPage() {
  const router = useRouter();
  const [appData, setAppData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("plan");
  const [generating, setGenerating] = useState(false);
  const [request, setRequest] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentPlan, setCurrentPlan] = useState<DatePlan | null>(null);

  const userId = typeof window !== "undefined" ? sessionStorage.getItem("userId") : null;

  const fetchData = useCallback(async () => {
    if (!userId) { router.push("/"); return; }
    try {
      const res = await fetch(`/api/auth?id=${userId}`);
      if (!res.ok) { router.push("/onboarding"); return; }
      setAppData(await res.json());
    } catch { router.push("/"); }
    finally { setLoading(false); }
  }, [userId, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`/api/weather?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`);
          setWeather(await res.json());
        } catch {}
      },
      () => {},
      { timeout: 5000 }
    );
  }, []);

  const generatePlan = async () => {
    if (!userId) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, request: request || undefined, weather }),
      });
      if (!res.ok) throw new Error();
      const plan = await res.json();
      setCurrentPlan(plan);
      fetchData(); // 히스토리 갱신
    } catch {
      alert("플랜 생성에 실패했어요 😢");
    } finally {
      setGenerating(false);
    }
  };

  if (loading || !appData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-4xl animate-bounce">💘</div>
          <p className="text-gray-400">불러오는 중...</p>
        </div>
      </div>
    );
  }

  const { profile } = appData;
  const isJ = profile.mbti?.slice(-1) === "J";

  const tabs: { key: Tab; emoji: string; label: string }[] = [
    { key: "plan", emoji: "✨", label: "플랜 생성" },
    { key: "curated", emoji: "🔥", label: "큐레이션" },
    { key: "history", emoji: "📋", label: "히스토리" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-50 max-w-lg mx-auto w-full">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 px-5 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-800">
              안녕 {profile.nickname}! 💘
            </h1>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
              <span className="px-2 py-0.5 bg-pink-50 text-pink-500 rounded-full">{profile.mbti}</span>
              {profile.partnerMbti && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-500 rounded-full">{profile.partnerMbti}</span>
              )}
              <span>{profile.location}</span>
              {weather && <span>{weather.temp}° {weather.description}</span>}
            </div>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem("userId"); router.push("/"); }}
            className="text-xs text-gray-300 hover:text-gray-500"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* 탭 */}
      <nav className="bg-white border-b border-gray-100 px-2 py-1 flex sticky top-[73px] z-10">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 text-center rounded-lg text-sm transition ${
              tab === t.key ? "bg-pink-50 text-pink-600 font-semibold" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* 플랜 생성 탭 */}
        {tab === "plan" && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-100 p-6 space-y-4">
              <h3 className="font-bold text-lg text-gray-800">
                {isJ ? "⏰ 완벽한 타임테이블 짜기" : "🎲 오늘의 데이트 코스"}
              </h3>
              <p className="text-sm text-gray-500">
                {isJ
                  ? "30분 단위로 정확한 일정을 짜드릴게요"
                  : "여유롭게 즐길 수 있는 코스를 추천해드릴게요"}
              </p>

              <textarea
                placeholder="원하는 데이트 스타일을 적어주세요 (선택)&#10;예: 성수동에서 카페 투어하고 저녁은 이태원"
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 resize-none"
              />

              <button
                onClick={generatePlan}
                disabled={generating}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition disabled:opacity-50 shadow-sm"
              >
                {generating ? "AI가 코스를 짜고 있어요..." : "✨ 데이트 코스 생성"}
              </button>
            </div>

            {/* 생성된 플랜 */}
            {currentPlan && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-pink-50 text-pink-500 rounded-full text-xs">{currentPlan.mood}</span>
                    <span className="text-xs text-gray-400">{currentPlan.totalBudget}</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">{currentPlan.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{currentPlan.description}</p>
                  <div className="flex gap-1.5 mt-2">
                    {currentPlan.tags?.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">#{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {currentPlan.timetable.map((slot, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="text-xs font-mono text-gray-500 mb-1">{slot.time}</div>
                        <div className="w-8 h-8 bg-pink-50 rounded-full flex items-center justify-center text-lg">
                          {slotCategoryEmoji[slot.category] || "📌"}
                        </div>
                        {i < currentPlan.timetable.length - 1 && (
                          <div className="w-px flex-1 bg-gray-200 mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="font-medium text-gray-800 text-sm">{slot.activity}</div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                          <span>{slot.duration}</span>
                          {slot.cost && <span>· {slot.cost}</span>}
                        </div>
                        {slot.tip && (
                          <div className="mt-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg inline-block">
                            💡 {slot.tip}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 큐레이션 탭 */}
        {tab === "curated" && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">🔥 인기 데이트 코스</h3>
            {curatedCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-800">{course.title}</h4>
                    {course.isPremium && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full text-xs font-medium">
                        👑 프리미엄
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{course.subtitle}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span>⭐ {course.rating}</span>
                    <span>리뷰 {course.reviewCount}</span>
                    <span>{course.price > 0 ? `₩${course.price.toLocaleString()}` : "무료"}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {course.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">#{tag}</span>
                    ))}
                  </div>
                </div>

                {/* 타임테이블 미리보기 */}
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                  <div className="space-y-2">
                    {course.timetable.slice(0, 3).map((slot, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-xs font-mono text-gray-400 w-10">{slot.time}</span>
                        <span>{slotCategoryEmoji[slot.category]}</span>
                        <span className="text-gray-600">{slot.activity}</span>
                      </div>
                    ))}
                    {course.timetable.length > 3 && (
                      <div className="text-xs text-gray-400">+{course.timetable.length - 3}개 더...</div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* 어필리에이트 배너 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-5 text-center">
              <p className="text-sm text-gray-500 mb-2">데이트 준비물이 필요하다면?</p>
              <p className="text-xs text-gray-400">파트너 제휴 쇼핑몰에서 특별 할인</p>
              <button className="mt-3 px-4 py-2 bg-purple-500 text-white rounded-xl text-sm font-medium hover:bg-purple-600 transition">
                🛍️ 제휴 혜택 보기
              </button>
            </div>
          </div>
        )}

        {/* 히스토리 탭 */}
        {tab === "history" && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">📋 내 데이트 플랜</h3>
            {appData.plans.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">📝</div>
                <p>아직 생성한 플랜이 없어요</p>
                <button
                  onClick={() => setTab("plan")}
                  className="mt-3 text-sm text-pink-500 hover:text-pink-600"
                >
                  첫 번째 플랜 만들기 →
                </button>
              </div>
            ) : (
              appData.plans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-pink-50 text-pink-500 rounded-full text-xs">{plan.mood}</span>
                    <span className="text-xs text-gray-400">{plan.totalBudget}</span>
                  </div>
                  <h4 className="font-bold text-gray-800">{plan.title}</h4>
                  <p className="text-sm text-gray-500 mt-0.5">{plan.description}</p>
                  <div className="mt-2 text-xs text-gray-300">
                    {new Date(plan.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {plan.timetable.slice(0, 3).map((slot, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-xs font-mono text-gray-400 w-10">{slot.time}</span>
                        <span>{slotCategoryEmoji[slot.category]}</span>
                        <span className="text-gray-600 text-xs">{slot.activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

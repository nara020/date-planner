"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AppData, WeatherData } from "@/lib/types";
import { curatedCourses } from "@/lib/curated";
import BottomNav from "@/components/BottomNav";
import WeatherWidget from "@/components/WeatherWidget";
import CourseCard from "@/components/CourseCard";
import LoadingSpinner from "@/components/LoadingSpinner";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "늦은 밤이에요";
  if (hour < 12) return "좋은 아침이에요";
  if (hour < 14) return "점심 시간이에요";
  if (hour < 18) return "좋은 오후예요";
  if (hour < 22) return "좋은 저녁이에요";
  return "늦은 밤이에요";
}

function getGreetingEmoji(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "🌙";
  if (hour < 12) return "🌅";
  if (hour < 14) return "☀️";
  if (hour < 18) return "🌤️";
  if (hour < 22) return "🌆";
  return "🌙";
}

export default function DashboardPage() {
  const router = useRouter();
  const [appData, setAppData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

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
        finally { setWeatherLoading(false); }
      },
      () => { setWeatherLoading(false); },
      { timeout: 5000 }
    );
  }, []);

  if (loading || !appData) {
    return <LoadingSpinner message="대시보드를 불러오는 중..." />;
  }

  const { profile, plans } = appData;
  const recentPlans = plans.slice(0, 5);
  const freeCourses = curatedCourses.filter((c) => !c.isPremium).slice(0, 4);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 max-w-lg mx-auto w-full">
      {/* Header */}
      <header className="bg-gradient-to-b from-pink-50 to-white px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">{getGreetingEmoji()} {getGreeting()}</p>
            <h1 className="text-xl font-bold text-gray-800">
              {profile.coupleName ? (
                <>{profile.coupleName}<span className="text-sm font-normal text-gray-400 ml-1">의 데이트</span></>
              ) : (
                <>{profile.nickname}님, 반가워요! 💘</>
              )}
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="px-2 py-0.5 bg-pink-50 text-pink-500 rounded-full text-xs font-medium">{profile.mbti}</span>
              {profile.partnerMbti && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-500 rounded-full text-xs font-medium">{profile.partnerMbti}</span>
              )}
              <span className="text-xs text-gray-400">{profile.location}</span>
            </div>
          </div>
          <button
            onClick={() => router.push("/mypage")}
            className="w-10 h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center text-lg shadow-sm tap-effect"
          >
            👤
          </button>
        </div>

        {/* Weather Widget */}
        <WeatherWidget weather={weather} loading={weatherLoading} />
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-6 pb-safe">
        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push("/generate")}
            className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-5 text-left text-white shadow-lg shadow-pink-200/50 hover:shadow-xl transition-all duration-200 tap-effect"
          >
            <div className="text-2xl mb-2">✨</div>
            <div className="font-bold text-sm">오늘 데이트 짜기</div>
            <div className="text-xs text-pink-100 mt-0.5">AI가 완벽하게</div>
          </button>
          <button
            onClick={() => router.push("/generate")}
            className="bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl p-5 text-left text-white shadow-lg shadow-violet-200/50 hover:shadow-xl transition-all duration-200 tap-effect"
          >
            <div className="text-2xl mb-2">📅</div>
            <div className="font-bold text-sm">이번 주말 계획</div>
            <div className="text-xs text-violet-100 mt-0.5">미리 준비해요</div>
          </button>
        </section>

        {/* Recent Plans */}
        {recentPlans.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-800">📋 최근 플랜</h2>
              <button onClick={() => router.push("/mypage")} className="text-xs text-pink-500 hover:text-pink-600">
                전체보기 →
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {recentPlans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => router.push(`/plan/${plan.id}`)}
                  className="min-w-[200px] bg-white rounded-2xl border border-gray-100 p-4 text-left shadow-sm hover:shadow-md transition-all tap-effect"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="px-1.5 py-0.5 bg-pink-50 text-pink-500 rounded text-[10px] font-medium">{plan.mood}</span>
                    <span className="text-[10px] text-gray-300">{plan.totalBudget}</span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{plan.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{plan.description}</p>
                  <div className="text-[10px] text-gray-300 mt-2">
                    {new Date(plan.createdAt).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Curated Courses */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800">🔥 인기 데이트 코스</h2>
            <button onClick={() => router.push("/courses")} className="text-xs text-pink-500 hover:text-pink-600">
              전체보기 →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {freeCourses.map((course) => (
              <CourseCard key={course.id} course={course} compact />
            ))}
          </div>
        </section>

        {/* Premium Banner */}
        <section
          onClick={() => router.push("/premium")}
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-5 cursor-pointer hover:shadow-md transition-all tap-effect"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">👑</span>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-sm">프리미엄으로 업그레이드</h3>
              <p className="text-xs text-gray-500 mt-0.5">특별한 오마카세, 제주 당일치기 코스 등</p>
            </div>
            <span className="text-gray-300">→</span>
          </div>
        </section>

        {/* Affiliate Banner */}
        <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-5 text-center">
          <p className="text-sm font-medium text-gray-600">데이트 준비물이 필요하다면? 🛍️</p>
          <p className="text-xs text-gray-400 mt-1">파트너 제휴 쇼핑몰에서 특별 할인</p>
          <button className="mt-3 px-4 py-2 bg-purple-500 text-white rounded-xl text-xs font-medium hover:bg-purple-600 transition tap-effect">
            제휴 혜택 보기
          </button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

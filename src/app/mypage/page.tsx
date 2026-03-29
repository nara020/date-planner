"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AppData, interestLabels, budgetLabels, Interest } from "@/lib/types";
import { curatedCourses } from "@/lib/curated";
import BottomNav from "@/components/BottomNav";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function MyPage() {
  const router = useRouter();
  const [appData, setAppData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"plans" | "courses">("plans");

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

  if (loading || !appData) return <LoadingSpinner message="프로필을 불러오는 중..." />;

  const { profile, plans } = appData;
  const savedPlans = plans.filter((p) => p.saved);
  const savedCourses = curatedCourses.filter((c) => appData.savedCourses.includes(c.id));

  return (
    <div className="flex-1 flex flex-col bg-gray-50 max-w-lg mx-auto w-full">
      {/* Profile Header */}
      <header className="bg-gradient-to-b from-pink-50 to-white px-5 pt-6 pb-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">👤 마이페이지</h1>
          <button
            onClick={() => { sessionStorage.removeItem("userId"); router.push("/"); }}
            className="text-xs text-gray-300 hover:text-gray-500 transition"
          >
            로그아웃
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-2xl text-white font-bold">
              {profile.nickname.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg text-gray-800">{profile.nickname}</h2>
              {profile.coupleName && (
                <p className="text-xs text-pink-500 font-medium">{profile.coupleName}</p>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2 py-0.5 bg-pink-50 text-pink-500 rounded-full text-xs font-medium">{profile.mbti}</span>
                {profile.partnerMbti && (
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-500 rounded-full text-xs font-medium">{profile.partnerMbti}</span>
                )}
                <span className="text-xs text-gray-400">{profile.location}</span>
              </div>
            </div>
          </div>

          {/* Profile details */}
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 w-16">관심사</span>
              <div className="flex gap-1 flex-wrap">
                {profile.interests.map((i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                    {interestLabels[i as Interest]?.split(" ")[0]}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 w-16">예산</span>
              <span className="text-xs text-gray-600">{budgetLabels[profile.budget]}</span>
            </div>
          </div>

          <button
            onClick={() => router.push("/onboarding")}
            className="w-full mt-4 py-2.5 bg-gray-100 text-gray-500 rounded-xl text-sm font-medium hover:bg-gray-200 transition tap-effect"
          >
            프로필 수정하기 ✏️
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-safe">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-pink-500">{plans.length}</div>
            <div className="text-xs text-gray-400 mt-0.5">생성 플랜</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-pink-500">{savedPlans.length}</div>
            <div className="text-xs text-gray-400 mt-0.5">저장 플랜</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-pink-500">{savedCourses.length}</div>
            <div className="text-xs text-gray-400 mt-0.5">저장 코스</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setTab("plans")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              tab === "plans" ? "bg-white text-pink-500 shadow-sm" : "text-gray-400"
            }`}
          >
            📋 내 플랜 ({plans.length})
          </button>
          <button
            onClick={() => setTab("courses")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              tab === "courses" ? "bg-white text-pink-500 shadow-sm" : "text-gray-400"
            }`}
          >
            🔥 저장 코스 ({savedCourses.length})
          </button>
        </div>

        {/* Plans List */}
        {tab === "plans" && (
          <div className="space-y-3">
            {plans.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">📝</div>
                <p className="text-sm">아직 생성한 플랜이 없어요</p>
                <button
                  onClick={() => router.push("/generate")}
                  className="mt-3 text-sm text-pink-500 hover:text-pink-600"
                >
                  첫 번째 플랜 만들기 →
                </button>
              </div>
            ) : (
              plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => router.push(`/plan/${plan.id}`)}
                  className="w-full bg-white rounded-2xl border border-gray-200 p-4 text-left shadow-sm hover:shadow-md transition tap-effect"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-pink-50 text-pink-500 rounded-full text-xs font-medium">{plan.mood}</span>
                    <span className="text-xs text-gray-400">{plan.totalBudget}</span>
                    {plan.saved && <span className="text-xs">💗</span>}
                    <span className="ml-auto text-xs text-gray-300">
                      {new Date(plan.createdAt).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-800">{plan.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{plan.description}</p>
                </button>
              ))
            )}
          </div>
        )}

        {/* Saved Courses */}
        {tab === "courses" && (
          <div className="space-y-3">
            {savedCourses.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">🔥</div>
                <p className="text-sm">아직 저장한 코스가 없어요</p>
                <button
                  onClick={() => router.push("/courses")}
                  className="mt-3 text-sm text-pink-500 hover:text-pink-600"
                >
                  큐레이션 코스 보기 →
                </button>
              </div>
            ) : (
              savedCourses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => router.push(`/courses/${course.id}`)}
                  className="w-full bg-white rounded-2xl border border-gray-200 p-4 text-left shadow-sm hover:shadow-md transition tap-effect"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${course.coverGradient} rounded-xl flex items-center justify-center text-xl`}>
                      {course.coverEmoji}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">{course.title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{course.area} · ★ {course.rating}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Premium CTA */}
        <div
          onClick={() => router.push("/premium")}
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-5 cursor-pointer hover:shadow-md transition tap-effect"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">👑</span>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-gray-800">프리미엄 업그레이드</h3>
              <p className="text-xs text-gray-500 mt-0.5">특별한 코스와 무제한 플랜 생성</p>
            </div>
            <span className="text-gray-300">→</span>
          </div>
        </div>

        {/* Affiliate Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-5 text-center">
          <p className="text-sm font-medium text-gray-600 mb-1">🛍️ 제휴 혜택</p>
          <p className="text-xs text-gray-400">데이트 아이템을 특별 할인가로!</p>
          <button className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-xl text-xs font-medium tap-effect">
            혜택 보기
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

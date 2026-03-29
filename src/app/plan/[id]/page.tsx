"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppData, DatePlan } from "@/lib/types";
import BottomNav from "@/components/BottomNav";
import TimelineView from "@/components/TimelineView";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function PlanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.id as string;
  const [plan, setPlan] = useState<DatePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const userId = typeof window !== "undefined" ? sessionStorage.getItem("userId") : null;

  const fetchPlan = useCallback(async () => {
    if (!userId) { router.push("/"); return; }
    try {
      const res = await fetch(`/api/auth?id=${userId}`);
      if (!res.ok) { router.push("/"); return; }
      const data: AppData = await res.json();
      const found = data.plans.find((p) => p.id === planId);
      if (found) {
        setPlan(found);
        setSaved(found.saved);
      }
    } catch {}
    finally { setLoading(false); }
  }, [userId, planId, router]);

  useEffect(() => { fetchPlan(); }, [fetchPlan]);

  const toggleSave = async () => {
    if (!userId || !plan) return;
    const newSaved = !saved;
    setSaved(newSaved);
    try {
      const res = await fetch(`/api/auth?id=${userId}`);
      if (!res.ok) return;
      const data: AppData = await res.json();
      const idx = data.plans.findIndex((p) => p.id === planId);
      if (idx >= 0) {
        data.plans[idx].saved = newSaved;
        await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data.profile),
        });
      }
    } catch {}
  };

  const sharePlan = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <LoadingSpinner message="플랜을 불러오는 중..." />;

  if (!plan) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto">
        <div className="text-center space-y-3">
          <div className="text-5xl">😢</div>
          <p className="text-gray-500">플랜을 찾을 수 없어요</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-pink-500 hover:text-pink-600"
          >
            대시보드로 돌아가기 →
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 max-w-lg mx-auto w-full">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-5 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 tap-effect">
            ← 뒤로
          </button>
          <div className="flex gap-2">
            <button
              onClick={toggleSave}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all tap-effect ${
                saved ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-500"
              }`}
            >
              {saved ? "💗 저장됨" : "🤍 저장"}
            </button>
            <button
              onClick={sharePlan}
              className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-full text-xs font-medium tap-effect"
            >
              {copied ? "✅ 복사됨!" : "🔗 공유"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-safe">
        {/* Plan Info */}
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-100 p-5 animate-scale-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full text-xs font-medium">{plan.mood}</span>
            <span className="text-xs text-gray-400">{plan.totalBudget}</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">{plan.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {plan.tags?.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 bg-white/80 text-gray-500 rounded-full text-xs">#{tag}</span>
            ))}
          </div>
          <div className="text-xs text-gray-300 mt-3">
            {new Date(plan.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>

        {/* Weather info if available */}
        {plan.weather && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3">
            <span className="text-2xl">
              {plan.weather.isOutdoorFriendly ? "☀️" : "☁️"}
            </span>
            <div>
              <p className="text-sm font-medium text-gray-700">{plan.weather.temp}° {plan.weather.description}</p>
              <p className="text-xs text-gray-400">
                {plan.weather.isOutdoorFriendly ? "야외 활동 적합" : "실내 활동 추천"}
              </p>
            </div>
          </div>
        )}

        {/* Full Timetable */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-800 mb-4">📋 전체 타임테이블</h2>
          <TimelineView timetable={plan.timetable} expandable />
        </div>

        {/* Action Button */}
        <button
          onClick={() => alert("데이트를 시작하세요! 즐거운 하루 보내세요 💕")}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-pink-200/50 hover:from-pink-600 hover:to-rose-600 transition-all tap-effect animate-pulse-glow"
        >
          💕 이 코스 시작하기
        </button>
      </main>

      <BottomNav />
    </div>
  );
}

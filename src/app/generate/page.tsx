"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DateType, dateTypeLabels, dateTypeEmoji, WeatherData, DatePlan } from "@/lib/types";
import BottomNav from "@/components/BottomNav";
import TimelineView from "@/components/TimelineView";
import LoadingSpinner from "@/components/LoadingSpinner";

type Step = "type" | "time" | "budget" | "request" | "loading" | "result";

const loadingMessages = [
  "취향을 분석하고 있어요... 🧠",
  "날씨를 확인하고 있어요... 🌤️",
  "맛집을 찾고 있어요... 🍽️",
  "최적의 동선을 짜고 있어요... 🗺️",
  "꿀팁을 정리하고 있어요... 💡",
  "거의 다 됐어요...! ✨",
];

const budgetOptions = [
  { label: "3만원 이하", value: "low", emoji: "💚" },
  { label: "3~5만원", value: "medium", emoji: "💛" },
  { label: "5~10만원", value: "high", emoji: "🧡" },
  { label: "10만원+", value: "premium", emoji: "💎" },
];

export default function GeneratePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("type");
  const [dateType, setDateType] = useState<DateType>("casual");
  const [startTime, setStartTime] = useState("11:00");
  const [endTime, setEndTime] = useState("20:00");
  const [budget, setBudget] = useState("medium");
  const [request, setRequest] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [plan, setPlan] = useState<DatePlan | null>(null);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [error, setError] = useState("");

  const userId = typeof window !== "undefined" ? sessionStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) { router.push("/"); return; }
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
  }, [userId, router]);

  useEffect(() => {
    if (step !== "loading") return;
    const interval = setInterval(() => {
      setLoadingMsg((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [step]);

  const generate = useCallback(async () => {
    if (!userId) return;
    setStep("loading");
    setError("");
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          request: `[데이트 타입: ${dateTypeLabels[dateType]}] [시간: ${startTime}~${endTime}] [예산: ${budget}] ${request}`.trim(),
          weather,
          dateType,
          timeRange: `${startTime}~${endTime}`,
        }),
      });
      if (!res.ok) throw new Error();
      const planData = await res.json();
      setPlan(planData);
      setStep("result");
    } catch {
      setError("플랜 생성에 실패했어요. 다시 시도해주세요.");
      setStep("request");
    }
  }, [userId, dateType, startTime, endTime, budget, request, weather]);

  if (!userId) return <LoadingSpinner />;

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const h = String(i).padStart(2, "0");
    return `${h}:00`;
  });

  return (
    <div className="flex-1 flex flex-col bg-white max-w-lg mx-auto w-full">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">✨ 데이트 코스 생성</h1>
        <p className="text-sm text-gray-400 mt-0.5">AI가 완벽한 데이트를 설계해드려요</p>
        {step !== "loading" && step !== "result" && (
          <div className="flex gap-1 mt-3">
            {(["type", "time", "budget", "request"] as Step[]).map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                  (["type", "time", "budget", "request"] as Step[]).indexOf(step) >= i
                    ? "bg-pink-400"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-6 pb-safe">
        {/* Step 1: Date Type */}
        {step === "type" && (
          <div className="space-y-4 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800">어떤 데이트를 할까요?</h2>
              <p className="text-sm text-gray-400 mt-0.5">오늘의 기분에 맞는 타입을 골라주세요</p>
            </div>
            <div className="space-y-3">
              {(Object.keys(dateTypeLabels) as DateType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setDateType(type)}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-200 tap-effect ${
                    dateType === type
                      ? "bg-pink-50 border-2 border-pink-400 scale-[1.01]"
                      : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                  }`}
                >
                  <span className="text-3xl">{dateTypeEmoji[type]}</span>
                  <div>
                    <div className={`font-bold ${dateType === type ? "text-pink-600" : "text-gray-700"}`}>
                      {dateTypeLabels[type]}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {type === "casual" && "카페, 맛집, 산책... 편하게 즐기는 하루"}
                      {type === "special" && "기념일, 100일, 생일... 특별하게 보내는 하루"}
                      {type === "adventure" && "새로운 장소, 액티비티... 설레는 하루"}
                      {type === "healing" && "스파, 피크닉, 자연... 힐링하는 하루"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep("time")}
              className="w-full py-3.5 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition tap-effect mt-4"
            >
              다음
            </button>
          </div>
        )}

        {/* Step 2: Time Range */}
        {step === "time" && (
          <div className="space-y-6 animate-fade-in">
            <div className="mb-2">
              <h2 className="text-lg font-bold text-gray-800">몇 시부터 몇 시까지?</h2>
              <p className="text-sm text-gray-400 mt-0.5">데이트 시간 범위를 설정해주세요</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">시작 시간</label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-pink-300"
                >
                  {timeOptions.map((t) => (
                    <option key={`s-${t}`} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">종료 시간</label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-pink-300"
                >
                  {timeOptions.map((t) => (
                    <option key={`e-${t}`} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick presets */}
            <div>
              <p className="text-xs text-gray-400 mb-2">빠른 설정</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "오전 반나절", start: "10:00", end: "14:00" },
                  { label: "오후 반나절", start: "14:00", end: "19:00" },
                  { label: "하루 종일", start: "10:00", end: "22:00" },
                  { label: "저녁 데이트", start: "18:00", end: "23:00" },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => { setStartTime(preset.start); setEndTime(preset.end); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition tap-effect ${
                      startTime === preset.start && endTime === preset.end
                        ? "bg-pink-100 text-pink-600 border border-pink-300"
                        : "bg-gray-100 text-gray-500 border border-transparent hover:bg-gray-200"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep("type")}
                className="px-6 py-3.5 bg-gray-100 text-gray-500 rounded-xl font-medium tap-effect"
              >
                이전
              </button>
              <button
                onClick={() => setStep("budget")}
                className="flex-1 py-3.5 bg-pink-500 text-white rounded-xl font-bold tap-effect"
              >
                다음
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Budget */}
        {step === "budget" && (
          <div className="space-y-4 animate-fade-in">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-800">예산은 얼마 정도?</h2>
              <p className="text-sm text-gray-400 mt-0.5">1인 기준으로 알려주세요</p>
            </div>
            <div className="space-y-3">
              {budgetOptions.map((b) => (
                <button
                  key={b.value}
                  onClick={() => setBudget(b.value)}
                  className={`w-full flex items-center gap-3 py-4 px-5 rounded-xl text-left font-medium transition-all duration-200 tap-effect ${
                    budget === b.value
                      ? "bg-pink-50 border-2 border-pink-400 text-pink-600"
                      : "bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-xl">{b.emoji}</span>
                  <span>{b.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep("time")}
                className="px-6 py-3.5 bg-gray-100 text-gray-500 rounded-xl font-medium tap-effect"
              >
                이전
              </button>
              <button
                onClick={() => setStep("request")}
                className="flex-1 py-3.5 bg-pink-500 text-white rounded-xl font-bold tap-effect"
              >
                다음
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Special Request */}
        {step === "request" && (
          <div className="space-y-4 animate-fade-in">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-800">특별한 요청이 있나요?</h2>
              <p className="text-sm text-gray-400 mt-0.5">원하는 스타일이나 장소를 적어주세요 (선택)</p>
            </div>
            <textarea
              placeholder="예: 성수동에서 카페 투어하고 저녁은 이태원에서&#10;또는: 사진 찍기 좋은 곳 위주로"
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              rows={4}
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-300 resize-none transition"
            />

            {error && (
              <div className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl animate-scale-in">
                😢 {error}
              </div>
            )}

            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-2">
              {[
                "사진 찍기 좋은 곳",
                "성수동 카페 투어",
                "한강 피크닉",
                "맛집 위주",
                "조용한 분위기",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setRequest(request ? `${request}, ${suggestion}` : suggestion)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-full text-xs hover:bg-gray-200 transition tap-effect"
                >
                  + {suggestion}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep("budget")}
                className="px-6 py-3.5 bg-gray-100 text-gray-500 rounded-xl font-medium tap-effect"
              >
                이전
              </button>
              <button
                onClick={generate}
                className="flex-1 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold shadow-lg shadow-pink-200/50 tap-effect"
              >
                ✨ 데이트 코스 생성
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {step === "loading" && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-200 to-rose-200 animate-pulse flex items-center justify-center">
                <span className="text-4xl animate-heart-beat">💘</span>
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce-gentle">✨</div>
              <div className="absolute -bottom-1 -left-2 text-xl animate-bounce-gentle" style={{ animationDelay: "0.5s" }}>🌟</div>
            </div>
            <p className="text-sm text-gray-500 font-medium animate-pulse transition-all">
              {loadingMessages[loadingMsg]}
            </p>
            <p className="text-xs text-gray-300 mt-2">보통 10~15초 정도 걸려요</p>
          </div>
        )}

        {/* Result */}
        {step === "result" && plan && (
          <div className="space-y-6 animate-slide-up">
            {/* Plan Header */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full text-xs font-medium">{plan.mood}</span>
                <span className="text-xs text-gray-400">{plan.totalBudget}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">{plan.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              <div className="flex gap-1.5 mt-3">
                {plan.tags?.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white/80 text-gray-500 rounded-full text-xs">#{tag}</span>
                ))}
              </div>
            </div>

            {/* Timetable */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-800 mb-4">📋 타임테이블</h3>
              <TimelineView timetable={plan.timetable} />
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/plan/${plan.id}`)}
                className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold shadow-lg shadow-pink-200/50 tap-effect"
              >
                상세 보기 →
              </button>
              <button
                onClick={() => { setPlan(null); setStep("type"); setRequest(""); }}
                className="w-full py-3.5 bg-gray-100 text-gray-500 rounded-xl font-medium tap-effect"
              >
                새로운 코스 만들기
              </button>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

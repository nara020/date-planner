"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Interest, BudgetLevel, PreferredTime, interestLabels, budgetLabels, preferredTimeLabels, preferredTimeEmoji } from "@/lib/types";

const mbtiOptions = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

const interestOptions: Interest[] = [
  "food", "cafe", "culture", "outdoor", "indoor",
  "activity", "shopping", "nightlife", "healing", "photo",
];

const budgetOptions: BudgetLevel[] = ["low", "medium", "high", "premium"];
const timeOptions: PreferredTime[] = ["morning", "afternoon", "evening", "night"];
const locations = ["서울", "경기/인천", "대전/충청", "대구/경북", "광주/전라", "제주"];

type Step = "nickname" | "coupleName" | "mbti" | "interests" | "budget" | "time" | "location";

const stepConfig: Record<Step, { title: string; subtitle: string; emoji: string }> = {
  nickname: { title: "안녕하세요!", emoji: "👋", subtitle: "이름이나 닉네임을 알려주세요" },
  coupleName: { title: "우리 커플 이름은?", emoji: "💑", subtitle: "둘만의 특별한 이름을 지어보세요" },
  mbti: { title: "MBTI는요?", emoji: "🧠", subtitle: "데이트 스타일을 맞춰드릴게요" },
  interests: { title: "관심사는요?", emoji: "✨", subtitle: "3개 이상 선택하면 더 정확해요" },
  budget: { title: "예산은요?", emoji: "💰", subtitle: "1인 기준 예산대를 골라주세요" },
  time: { title: "언제가 좋아요?", emoji: "🕐", subtitle: "선호하는 데이트 시간대를 골라주세요" },
  location: { title: "어디서 만나요?", emoji: "📍", subtitle: "주로 데이트하는 지역이요" },
};

const stepLabels: Record<Step, string> = {
  nickname: "닉네임",
  coupleName: "커플명",
  mbti: "MBTI",
  interests: "관심사",
  budget: "예산",
  time: "시간대",
  location: "지역",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("nickname");
  const [nickname, setNickname] = useState("");
  const [coupleName, setCoupleName] = useState("");
  const [mbti, setMbti] = useState("");
  const [partnerMbti, setPartnerMbti] = useState("");
  const [interests, setInterests] = useState<Interest[]>([]);
  const [budget, setBudget] = useState<BudgetLevel>("medium");
  const [preferredTime, setPreferredTime] = useState<PreferredTime>("afternoon");
  const [location, setLocation] = useState("서울");
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const toggleInterest = (i: Interest) => {
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const steps: Step[] = ["nickname", "coupleName", "mbti", "interests", "budget", "time", "location"];
  const currentIndex = steps.indexOf(step);
  const progress = ((currentIndex + 1) / steps.length) * 100;
  const config = stepConfig[step];

  const next = () => {
    setDirection("forward");
    const i = steps.indexOf(step);
    if (i < steps.length - 1) setStep(steps[i + 1]);
  };

  const prev = () => {
    setDirection("backward");
    const i = steps.indexOf(step);
    if (i > 0) setStep(steps[i - 1]);
  };

  const canProceed = () => {
    switch (step) {
      case "nickname": return nickname.trim().length > 0;
      case "coupleName": return true; // optional
      case "mbti": return mbti.length > 0;
      case "interests": return interests.length > 0;
      case "budget": return true;
      case "time": return true;
      case "location": return true;
      default: return true;
    }
  };

  const finish = async () => {
    setLoading(true);
    const id = `user-${Date.now()}`;
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          nickname,
          coupleName: coupleName || undefined,
          mbti,
          partnerMbti: partnerMbti || undefined,
          interests,
          budget,
          preferredTime,
          location,
        }),
      });
      sessionStorage.setItem("userId", id);
      router.push("/dashboard");
    } catch {
      alert("저장에 실패했어요. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col max-w-lg mx-auto w-full bg-white">
      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-pink-400 to-rose-400 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step labels */}
      <div className="flex px-4 pt-4 pb-2 gap-1 overflow-x-auto hide-scrollbar">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`text-[10px] font-medium px-2 py-1 rounded-full whitespace-nowrap transition-all duration-300 ${
              i === currentIndex
                ? "bg-pink-500 text-white"
                : i < currentIndex
                ? "bg-pink-100 text-pink-400"
                : "bg-gray-100 text-gray-300"
            }`}
          >
            {stepLabels[s]}
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col px-6 py-6">
        {/* Step header */}
        <div className={`mb-6 ${direction === "forward" ? "animate-slide-in-right" : "animate-fade-in"}`} key={step}>
          <div className="text-4xl mb-2">{config.emoji}</div>
          <h2 className="text-2xl font-bold text-gray-800">{config.title}</h2>
          <p className="text-gray-500 mt-1 text-sm">{config.subtitle}</p>
        </div>

        {/* Step content */}
        <div className={`flex-1 flex flex-col ${direction === "forward" ? "animate-slide-up" : "animate-fade-in"}`} key={`content-${step}`}>
          {step === "nickname" && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="닉네임을 입력해주세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canProceed() && next()}
                autoFocus
                maxLength={20}
                className="w-full px-5 py-4 text-xl border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-pink-300 transition-colors"
              />
              <p className="text-xs text-gray-300">최대 20자까지 입력할 수 있어요</p>
            </div>
          )}

          {step === "coupleName" && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="예: 콩콩커플, 달달이들"
                value={coupleName}
                onChange={(e) => setCoupleName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && next()}
                autoFocus
                maxLength={20}
                className="w-full px-5 py-4 text-xl border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-pink-300 transition-colors"
              />
              <p className="text-xs text-gray-300">건너뛰어도 괜찮아요! 나중에 설정할 수 있어요</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {["콩콩커플 🫘", "달달이들 🍯", "우리둘 💕", "럽럽 💘"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setCoupleName(suggestion)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      coupleName === suggestion
                        ? "bg-pink-100 text-pink-600 border border-pink-300"
                        : "bg-gray-100 text-gray-500 border border-transparent hover:bg-gray-200"
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "mbti" && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-3">내 MBTI</p>
                <div className="grid grid-cols-4 gap-2">
                  {mbtiOptions.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMbti(m)}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 tap-effect ${
                        mbti === m
                          ? "bg-pink-500 text-white shadow-md shadow-pink-200 scale-105"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">상대방 MBTI <span className="text-gray-300">(선택)</span></p>
                <div className="grid grid-cols-4 gap-2">
                  {mbtiOptions.map((m) => (
                    <button
                      key={`p-${m}`}
                      onClick={() => setPartnerMbti(partnerMbti === m ? "" : m)}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 tap-effect ${
                        partnerMbti === m
                          ? "bg-blue-500 text-white shadow-md shadow-blue-200 scale-105"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === "interests" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {interestOptions.map((i) => (
                  <button
                    key={i}
                    onClick={() => toggleInterest(i)}
                    className={`py-3.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 text-left tap-effect ${
                      interests.includes(i)
                        ? "bg-pink-50 border-2 border-pink-400 text-pink-600 shadow-sm shadow-pink-100 scale-[1.02]"
                        : "bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {interestLabels[i]}
                  </button>
                ))}
              </div>
              {interests.length > 0 && (
                <p className="text-xs text-pink-400 text-center animate-fade-in">
                  {interests.length}개 선택됨 {interests.length >= 3 ? "✨ 완벽해요!" : "— 3개 이상 추천"}
                </p>
              )}
            </div>
          )}

          {step === "budget" && (
            <div className="space-y-3">
              {budgetOptions.map((b) => (
                <button
                  key={b}
                  onClick={() => setBudget(b)}
                  className={`w-full py-4 px-5 rounded-xl text-left font-medium transition-all duration-200 tap-effect ${
                    budget === b
                      ? "bg-pink-50 border-2 border-pink-400 text-pink-600 shadow-sm shadow-pink-100 scale-[1.01]"
                      : "bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {budgetLabels[b]}
                </button>
              ))}
            </div>
          )}

          {step === "time" && (
            <div className="space-y-3">
              {timeOptions.map((t) => (
                <button
                  key={t}
                  onClick={() => setPreferredTime(t)}
                  className={`w-full py-4 px-5 rounded-xl text-left font-medium transition-all duration-200 flex items-center gap-3 tap-effect ${
                    preferredTime === t
                      ? "bg-pink-50 border-2 border-pink-400 text-pink-600 shadow-sm shadow-pink-100 scale-[1.01]"
                      : "bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-2xl">{preferredTimeEmoji[t]}</span>
                  <span>{preferredTimeLabels[t]}</span>
                </button>
              ))}
            </div>
          )}

          {step === "location" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocation(loc)}
                    className={`py-3.5 rounded-xl text-sm font-medium transition-all duration-200 tap-effect ${
                      location === loc
                        ? "bg-pink-500 text-white shadow-md shadow-pink-200 scale-105"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom buttons */}
        <div className="flex gap-3 pt-6">
          {currentIndex > 0 && (
            <button
              onClick={prev}
              className="px-6 py-3.5 bg-gray-100 text-gray-500 rounded-xl font-medium hover:bg-gray-200 transition tap-effect"
            >
              이전
            </button>
          )}
          {step === "location" ? (
            <button
              onClick={finish}
              disabled={loading}
              className="flex-1 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 shadow-lg shadow-pink-200/50 tap-effect"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin-slow">💘</span> 저장 중...
                </span>
              ) : (
                "시작하기! 🎉"
              )}
            </button>
          ) : (
            <button
              onClick={next}
              disabled={!canProceed()}
              className="flex-1 py-3.5 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed tap-effect"
            >
              {step === "coupleName" && !coupleName ? "건너뛰기" : "다음"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

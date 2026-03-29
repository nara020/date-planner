"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Interest, BudgetLevel, interestLabels, budgetLabels } from "@/lib/types";

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

const locations = ["서울", "경기/인천", "대전/충청", "대구/경북", "광주/전라", "제주"];

type Step = "nickname" | "mbti" | "interests" | "budget" | "location";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("nickname");
  const [nickname, setNickname] = useState("");
  const [mbti, setMbti] = useState("");
  const [partnerMbti, setPartnerMbti] = useState("");
  const [interests, setInterests] = useState<Interest[]>([]);
  const [budget, setBudget] = useState<BudgetLevel>("medium");
  const [location, setLocation] = useState("서울");
  const [loading, setLoading] = useState(false);

  const toggleInterest = (i: Interest) => {
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const steps: Step[] = ["nickname", "mbti", "interests", "budget", "location"];
  const currentIndex = steps.indexOf(step);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  const next = () => {
    const i = steps.indexOf(step);
    if (i < steps.length - 1) setStep(steps[i + 1]);
  };

  const prev = () => {
    const i = steps.indexOf(step);
    if (i > 0) setStep(steps[i - 1]);
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
          mbti,
          partnerMbti: partnerMbti || undefined,
          interests,
          budget,
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
      {/* 프로그레스 바 */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-pink-400 to-rose-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col px-6 py-8">
        {/* Step 1: 닉네임 */}
        {step === "nickname" && (
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">안녕하세요! 👋</h2>
              <p className="text-gray-500 mt-1">이름이나 닉네임을 알려주세요</p>
            </div>
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && nickname.trim() && next()}
              autoFocus
              className="w-full px-5 py-4 text-xl border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-pink-300 transition"
            />
          </div>
        )}

        {/* Step 2: MBTI */}
        {step === "mbti" && (
          <div className="flex-1 flex flex-col space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">MBTI는요? 🧠</h2>
              <p className="text-gray-500 mt-1">데이트 스타일을 맞춰드릴게요</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">내 MBTI</p>
              <div className="grid grid-cols-4 gap-2">
                {mbtiOptions.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMbti(m)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition ${
                      mbti === m
                        ? "bg-pink-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">상대방 MBTI (선택)</p>
              <div className="grid grid-cols-4 gap-2">
                {mbtiOptions.map((m) => (
                  <button
                    key={`p-${m}`}
                    onClick={() => setPartnerMbti(partnerMbti === m ? "" : m)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition ${
                      partnerMbti === m
                        ? "bg-blue-500 text-white"
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

        {/* Step 3: 관심사 */}
        {step === "interests" && (
          <div className="flex-1 flex flex-col space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">관심사는요? ✨</h2>
              <p className="text-gray-500 mt-1">여러 개 선택 가능해요</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {interestOptions.map((i) => (
                <button
                  key={i}
                  onClick={() => toggleInterest(i)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition text-left ${
                    interests.includes(i)
                      ? "bg-pink-50 border-2 border-pink-400 text-pink-600"
                      : "bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {interestLabels[i]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: 예산 */}
        {step === "budget" && (
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">예산은요? 💰</h2>
              <p className="text-gray-500 mt-1">1인 기준 예산대를 골라주세요</p>
            </div>
            <div className="space-y-3">
              {budgetOptions.map((b) => (
                <button
                  key={b}
                  onClick={() => setBudget(b)}
                  className={`w-full py-4 px-5 rounded-xl text-left font-medium transition ${
                    budget === b
                      ? "bg-pink-50 border-2 border-pink-400 text-pink-600"
                      : "bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {budgetLabels[b]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: 지역 */}
        {step === "location" && (
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">어디서 만나요? 📍</h2>
              <p className="text-gray-500 mt-1">주로 데이트하는 지역</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className={`py-3 rounded-xl text-sm font-medium transition ${
                    location === loc
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="flex gap-3 pt-6">
          {currentIndex > 0 && (
            <button
              onClick={prev}
              className="px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-medium hover:bg-gray-200 transition"
            >
              이전
            </button>
          )}
          {step === "location" ? (
            <button
              onClick={finish}
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition disabled:opacity-50"
            >
              {loading ? "저장 중..." : "시작하기! 🎉"}
            </button>
          ) : (
            <button
              onClick={next}
              disabled={
                (step === "nickname" && !nickname.trim()) ||
                (step === "mbti" && !mbti) ||
                (step === "interests" && interests.length === 0)
              }
              className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transition disabled:opacity-50"
            >
              다음
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

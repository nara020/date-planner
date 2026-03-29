"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

const features = [
  { feature: "AI 데이트 플랜 생성", free: "월 5회", premium: "무제한" },
  { feature: "큐레이션 코스 열람", free: "무료 코스만", premium: "전체 코스" },
  { feature: "프리미엄 오마카세 코스", free: "❌", premium: "✅" },
  { feature: "제주 당일치기 코스", free: "❌", premium: "✅" },
  { feature: "커플 맞춤 상세 분석", free: "기본", premium: "심층 분석" },
  { feature: "플랜 저장 & 히스토리", free: "최근 5개", premium: "무제한" },
  { feature: "광고 제거", free: "❌", premium: "✅" },
  { feature: "우선 응답", free: "❌", premium: "✅" },
];

const benefits = [
  { emoji: "✨", title: "무제한 AI 플랜 생성", desc: "매일 새로운 데이트 코스를 만들어보세요" },
  { emoji: "👑", title: "프리미엄 전용 코스", desc: "오마카세, 제주 당일치기 등 특별한 코스" },
  { emoji: "🧠", title: "심층 MBTI 분석", desc: "커플 궁합까지 고려한 맞춤 설계" },
  { emoji: "📋", title: "무제한 플랜 저장", desc: "모든 데이트 히스토리를 보관하세요" },
  { emoji: "🚀", title: "우선 응답", desc: "AI가 더 빠르고 상세하게 답변해요" },
  { emoji: "🚫", title: "광고 없는 경험", desc: "깨끗한 화면에서 집중하세요" },
];

export default function PremiumPage() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-white max-w-lg mx-auto w-full">
      {/* Header */}
      <header className="px-5 pt-6 pb-2">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 text-sm tap-effect">
          ← 뒤로
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-4 space-y-8 pb-safe">
        {/* Hero */}
        <div className="text-center">
          <div className="text-5xl mb-3 animate-bounce-gentle">👑</div>
          <h1 className="text-2xl font-bold text-gray-800">프리미엄으로 업그레이드</h1>
          <p className="text-sm text-gray-400 mt-1">
            특별한 데이트를 위한 특별한 서비스
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Free */}
          <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 p-5">
            <div className="text-sm font-bold text-gray-400 mb-1">무료</div>
            <div className="text-2xl font-bold text-gray-800 mb-1">₩0</div>
            <div className="text-xs text-gray-400 mb-4">영원히 무료</div>
            <div className="space-y-2 text-xs text-gray-500">
              <div>✓ 월 5회 AI 플랜</div>
              <div>✓ 무료 큐레이션 코스</div>
              <div>✓ 기본 MBTI 분석</div>
              <div className="text-gray-300">✗ 프리미엄 코스</div>
              <div className="text-gray-300">✗ 무제한 저장</div>
            </div>
            <div className="mt-4 py-2 bg-gray-200 text-gray-500 rounded-xl text-xs font-medium text-center">
              현재 플랜
            </div>
          </div>

          {/* Premium */}
          <div className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 p-5 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-400 text-white text-[10px] font-bold rounded-full">
              인기
            </div>
            <div className="text-sm font-bold text-amber-600 mb-1">프리미엄</div>
            <div className="text-2xl font-bold text-gray-800 mb-1">₩4,900</div>
            <div className="text-xs text-gray-400 mb-4">/ 월</div>
            <div className="space-y-2 text-xs text-gray-700">
              <div>✓ 무제한 AI 플랜</div>
              <div>✓ 모든 큐레이션 코스</div>
              <div>✓ 심층 MBTI 분석</div>
              <div>✓ 프리미엄 전용 코스</div>
              <div>✓ 무제한 저장</div>
            </div>
            <button
              onClick={() => setShowAlert(true)}
              className="w-full mt-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-xl text-xs font-bold tap-effect shadow-sm"
            >
              업그레이드
            </button>
          </div>
        </div>

        {/* Benefits */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">프리미엄 혜택</h2>
          <div className="space-y-3">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                <span className="text-2xl">{b.emoji}</span>
                <div>
                  <h3 className="font-semibold text-sm text-gray-800">{b.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">상세 비교</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="text-xs font-bold text-gray-500">기능</div>
              <div className="text-xs font-bold text-gray-400 text-center">무료</div>
              <div className="text-xs font-bold text-amber-500 text-center">프리미엄</div>
            </div>
            {features.map((f, i) => (
              <div key={i} className="grid grid-cols-3 px-4 py-3 border-b border-gray-100 last:border-0">
                <div className="text-xs text-gray-700">{f.feature}</div>
                <div className="text-xs text-gray-400 text-center">{f.free}</div>
                <div className="text-xs text-amber-600 text-center font-medium">{f.premium}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => setShowAlert(true)}
          className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-amber-200/50 tap-effect"
        >
          👑 프리미엄 시작하기 — ₩4,900/월
        </button>

        <p className="text-center text-xs text-gray-300 pb-4">
          언제든지 해지 가능 · 7일 무료 체험
        </p>
      </main>

      {/* Coming Soon Alert */}
      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAlert(false)}>
          <div className="bg-white rounded-2xl p-6 mx-6 max-w-sm w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <span className="text-5xl">🚀</span>
              <h3 className="text-lg font-bold text-gray-800 mt-3">곧 출시됩니다!</h3>
              <p className="text-sm text-gray-500 mt-1">
                프리미엄 서비스는 현재 준비 중이에요.<br />
                조금만 기다려주세요!
              </p>
              <button
                onClick={() => setShowAlert(false)}
                className="w-full mt-4 py-3 bg-pink-500 text-white rounded-xl font-bold tap-effect"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

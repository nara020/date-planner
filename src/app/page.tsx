"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const reviews = [
  { name: "민지 & 준혁", text: "MBTI 맞춤이라 진짜 딱 맞는 코스가 나왔어요!", rating: 5 },
  { name: "서현 & 지훈", text: "날씨까지 반영해줘서 비 올 때도 완벽한 데이트!", rating: 5 },
  { name: "채원 & 건우", text: "매주 새로운 코스 추천받는 게 너무 좋아요", rating: 4 },
];

const features = [
  { emoji: "🧠", title: "MBTI 맞춤 설계", desc: "J형은 정확한 타임테이블, P형은 여유로운 코스로 성향에 딱 맞게", gradient: "from-purple-50 to-pink-50" },
  { emoji: "🌤️", title: "실시간 날씨 반영", desc: "비 오면 실내, 맑으면 야외 — 더 이상 날씨 걱정 없이 데이트", gradient: "from-blue-50 to-cyan-50" },
  { emoji: "📍", title: "카카오맵 연동", desc: "실제 장소 기반 추천, 동선 최적화까지 한번에", gradient: "from-amber-50 to-orange-50" },
  { emoji: "⏰", title: "완벽한 타임테이블", desc: "시간별 일정, 예상 비용, 꿀팁까지 올인원 데이트 가이드", gradient: "from-green-50 to-emerald-50" },
  { emoji: "🔥", title: "큐레이션 코스", desc: "검증된 인기 코스부터 프리미엄 코스까지 한눈에", gradient: "from-rose-50 to-pink-50" },
];

const faqs = [
  { q: "무료인가요?", a: "기본 기능은 모두 무료예요! AI 플랜 생성, 큐레이션 코스 열람 등을 자유롭게 이용하세요. 프리미엄 코스는 소정의 금액이 있어요." },
  { q: "어떤 지역을 지원하나요?", a: "서울, 경기/인천, 대전/충청, 대구/경북, 광주/전라, 제주까지 전국 주요 지역을 지원해요." },
  { q: "MBTI를 모르면 어떡하죠?", a: "MBTI를 모르셔도 괜찮아요! 관심사와 예산만으로도 맞춤 코스를 만들어드려요." },
  { q: "커플이 아니어도 쓸 수 있나요?", a: "물론이죠! 친구와의 나들이, 혼자만의 힐링 코스도 생성할 수 있어요." },
];

export default function LandingPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="flex-1 flex flex-col bg-white">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50 via-white to-rose-50 animate-gradient-shift" />
        <div className="absolute top-10 left-10 text-6xl opacity-10 animate-float">💕</div>
        <div className="absolute top-20 right-10 text-4xl opacity-10 animate-float" style={{ animationDelay: "1s" }}>✨</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-10 animate-float" style={{ animationDelay: "2s" }}>🌸</div>

        <div className="relative z-10">
          <div className="text-7xl mb-6 animate-heart-beat">💘</div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
            데이트 플래너
          </h1>
          <p className="text-lg font-medium text-pink-500 mb-2">
            AI가 설계하는 완벽한 데이트
          </p>
          <p className="text-sm text-gray-400 max-w-xs mx-auto mb-10 leading-relaxed">
            MBTI, 날씨, 취향을 분석해서<br />
            세상에서 가장 완벽한 데이트 코스를 만들어드려요
          </p>

          <button
            onClick={() => router.push("/onboarding")}
            className="px-10 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-pink-200/50 hover:shadow-xl hover:shadow-pink-300/50 hover:from-pink-600 hover:to-rose-600 transition-all duration-300 animate-pulse-glow tap-effect"
          >
            무료로 시작하기
          </button>

          <button
            onClick={() => {
              const id = typeof window !== "undefined" ? sessionStorage.getItem("userId") : null;
              if (id) router.push("/dashboard");
              else router.push("/onboarding");
            }}
            className="mt-4 block mx-auto text-sm text-gray-400 hover:text-gray-600 transition"
          >
            이미 사용 중이에요 →
          </button>

          {/* Social proof */}
          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-700">12,847</div>
              <div className="text-xs">커플이 사용 중</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <div className="text-xl font-bold text-gray-700">4.8</div>
              <div className="text-xs">평균 만족도 ★</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <div className="text-xl font-bold text-gray-700">38,291</div>
              <div className="text-xs">생성된 플랜</div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Carousel */}
      <section className="px-6 py-10 bg-gray-50">
        <div className="max-w-lg mx-auto">
          <h2 className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
            커플들의 후기
          </h2>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {reviews.map((review, i) => (
              <div key={i} className="min-w-[260px] bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="text-amber-400 text-sm mb-2">
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </div>
                <p className="text-sm text-gray-600 mb-3">&ldquo;{review.text}&rdquo;</p>
                <p className="text-xs text-gray-400 font-medium">— {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-14 max-w-lg mx-auto w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          이런 것들을 해드려요
        </h2>
        <p className="text-center text-sm text-gray-400 mb-8">
          데이트 고민, 이제 AI에게 맡기세요
        </p>
        <div className="space-y-4 stagger-children">
          {features.map((f, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 bg-gradient-to-r ${f.gradient} rounded-2xl p-5 border border-gray-100/50 shadow-sm animate-slide-up hover:scale-[1.02] transition-transform duration-200`}
            >
              <span className="text-3xl shrink-0">{f.emoji}</span>
              <div>
                <h3 className="font-bold text-gray-800">{f.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Before / After */}
      <section className="px-6 py-14 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            데이트 플래너가 있으면?
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 rounded-2xl p-5 space-y-3">
              <div className="text-center text-sm font-bold text-gray-400 mb-3">😩 없을 때</div>
              {[
                "\"오늘 뭐하지...\" 매번 고민",
                "맛집 검색만 2시간",
                "비 오면 멘붕",
                "동선 엉망, 시간 낭비",
                "예산 초과 매번",
              ].map((t, i) => (
                <div key={i} className="text-xs text-gray-400 flex items-start gap-1">
                  <span>✗</span> {t}
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-5 border border-pink-100 space-y-3">
              <div className="text-center text-sm font-bold text-pink-500 mb-3">😍 있을 때</div>
              {[
                "AI가 5초 만에 코스 완성",
                "취향 맞춤 장소 추천",
                "날씨 자동 반영",
                "최적 동선 + 시간표",
                "예산 내 완벽 플랜",
              ].map((t, i) => (
                <div key={i} className="text-xs text-pink-600 flex items-start gap-1">
                  <span>✓</span> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-14 max-w-lg mx-auto w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          자주 묻는 질문
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-gray-800 text-sm">{faq.q}</span>
                <span className={`text-gray-400 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 animate-scale-in">
                  <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-16 bg-gradient-to-b from-white to-pink-50 text-center">
        <div className="max-w-lg mx-auto">
          <div className="text-5xl mb-4">💝</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            오늘의 데이트, 지금 시작하세요
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            30초면 시작할 수 있어요. 가입도 필요 없어요!
          </p>
          <button
            onClick={() => router.push("/onboarding")}
            className="px-10 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-pink-200/50 hover:from-pink-600 hover:to-rose-600 transition-all duration-300 tap-effect"
          >
            무료로 시작하기
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 px-6 py-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xl">💘</span>
            <span className="font-bold text-gray-700">데이트 플래너</span>
          </div>
          <div className="flex justify-center gap-6 text-xs text-gray-400 mb-4">
            <button onClick={() => router.push("/premium")} className="hover:text-gray-600 transition">프리미엄</button>
            <button onClick={() => router.push("/courses")} className="hover:text-gray-600 transition">큐레이션</button>
            <span>이용약관</span>
            <span>개인정보처리방침</span>
          </div>
          <p className="text-center text-xs text-gray-300">
            &copy; 2026 데이트 플래너 | 커플의 행복한 하루를 위해
          </p>
        </div>
      </footer>
    </main>
  );
}

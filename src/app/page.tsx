"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="flex-1 flex flex-col bg-gradient-to-b from-pink-50 via-white to-rose-50">
      {/* 히어로 */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="text-6xl mb-4">💘</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          데이트 플래너
        </h1>
        <p className="text-lg text-gray-500 mb-2">
          AI가 설계하는 완벽한 데이트
        </p>
        <p className="text-sm text-gray-400 max-w-xs mb-8">
          MBTI, 날씨, 취향을 분석해서<br />
          맞춤형 데이트 코스를 만들어드려요
        </p>

        <button
          onClick={() => router.push("/onboarding")}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-pink-200 hover:from-pink-600 hover:to-rose-600 transition"
        >
          무료로 시작하기
        </button>

        <button
          onClick={() => {
            const id = sessionStorage.getItem("userId");
            if (id) router.push("/dashboard");
            else router.push("/onboarding");
          }}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition"
        >
          이미 사용 중이에요
        </button>
      </section>

      {/* 기능 소개 */}
      <section className="px-6 py-12 max-w-lg mx-auto w-full space-y-6">
        {[
          { emoji: "🧠", title: "MBTI 맞춤 설계", desc: "J형은 30분 단위 타임테이블, P형은 여유로운 코스" },
          { emoji: "🌤️", title: "날씨 자동 반영", desc: "비 오면 실내, 맑으면 야외 — 날씨 걱정 끝" },
          { emoji: "📍", title: "장소 추천", desc: "카카오맵 연동으로 실제 장소와 동선까지" },
          { emoji: "⏰", title: "타임테이블", desc: "시간별 일정, 예상 비용, 이동 팁까지 한눈에" },
          { emoji: "🔥", title: "큐레이션 코스", desc: "검증된 인기 데이트 코스를 한눈에" },
        ].map((f, i) => (
          <div key={i} className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <span className="text-3xl">{f.emoji}</span>
            <div>
              <h3 className="font-semibold text-gray-800">{f.title}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <footer className="text-center py-6 text-xs text-gray-300">
        2026 데이트 플래너 | 커플의 행복한 하루를 위해
      </footer>
    </main>
  );
}

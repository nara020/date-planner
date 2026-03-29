"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { curatedCourses } from "@/lib/curated";
import BottomNav from "@/components/BottomNav";
import TimelineView from "@/components/TimelineView";
import CourseCard from "@/components/CourseCard";

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const [showPremiumLock, setShowPremiumLock] = useState(false);

  const course = curatedCourses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto">
        <div className="text-center space-y-3">
          <div className="text-5xl">😢</div>
          <p className="text-gray-500">코스를 찾을 수 없어요</p>
          <button
            onClick={() => router.push("/courses")}
            className="text-sm text-pink-500 hover:text-pink-600"
          >
            코스 목록으로 →
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const similarCourses = curatedCourses
    .filter((c) => c.id !== courseId && c.tags.some((t) => course.tags.includes(t)))
    .slice(0, 2);

  const handleStartCourse = () => {
    if (course.isPremium) {
      setShowPremiumLock(true);
    } else {
      alert("코스를 시작합니다! 즐거운 데이트 되세요 💕");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 max-w-lg mx-auto w-full">
      {/* Cover */}
      <div className={`relative bg-gradient-to-br ${course.coverGradient} h-48 flex items-center justify-center`}>
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-sm backdrop-blur-sm tap-effect"
        >
          ←
        </button>
        <span className="text-6xl animate-float">{course.coverEmoji}</span>
        {course.isPremium && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 rounded-full text-xs font-bold text-amber-600 flex items-center gap-1 backdrop-blur-sm">
            👑 프리미엄
          </div>
        )}
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-2xl font-bold drop-shadow-lg">{course.title}</h1>
          <p className="text-sm text-white/80 mt-0.5 drop-shadow">{course.subtitle}</p>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-safe">
        {/* Info bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <div className="text-amber-500 font-bold">★ {course.rating}</div>
              <div className="text-xs text-gray-400">{course.reviewCount}개 리뷰</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <div className="font-bold text-gray-700">{course.area}</div>
              <div className="text-xs text-gray-400">지역</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <div className="font-bold text-pink-500">
                {course.price > 0 ? `₩${course.price.toLocaleString()}` : "무료"}
              </div>
              <div className="text-xs text-gray-400">가격</div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap">
          {course.tags.map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-pink-50 text-pink-500 rounded-full text-xs font-medium">
              #{tag}
            </span>
          ))}
        </div>

        {/* Timetable */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-800 mb-4">📋 전체 타임테이블</h2>
          {course.isPremium ? (
            <div>
              {/* Show first 2 items, blur the rest */}
              <TimelineView timetable={course.timetable.slice(0, 2)} expandable={false} />
              <div className="relative mt-4">
                <div className="blur-sm pointer-events-none">
                  <TimelineView timetable={course.timetable.slice(2, 4)} expandable={false} />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 rounded-xl">
                  <span className="text-3xl mb-2">🔒</span>
                  <p className="text-sm font-bold text-gray-700">프리미엄 코스예요</p>
                  <p className="text-xs text-gray-400 mt-0.5">전체 일정을 보려면 프리미엄이 필요해요</p>
                  <button
                    onClick={() => router.push("/premium")}
                    className="mt-3 px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-medium tap-effect"
                  >
                    프리미엄 알아보기
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <TimelineView timetable={course.timetable} expandable />
          )}
        </div>

        {/* Reviews */}
        {course.reviews && course.reviews.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-800 mb-4">💬 리뷰</h2>
            <div className="space-y-4">
              {course.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">{review.nickname}</span>
                      <span className="text-amber-400 text-xs">{"★".repeat(review.rating)}</span>
                    </div>
                    <span className="text-xs text-gray-300">{review.date}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Courses */}
        {similarCourses.length > 0 && (
          <div>
            <h2 className="font-bold text-gray-800 mb-3">🔗 비슷한 코스</h2>
            <div className="space-y-3">
              {similarCourses.map((c) => (
                <CourseCard key={c.id} course={c} compact />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleStartCourse}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all tap-effect ${
            course.isPremium
              ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-amber-200/50"
              : "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-200/50"
          }`}
        >
          {course.isPremium ? "👑 프리미엄 구매하고 시작하기" : "💕 이 코스 시작하기"}
        </button>
      </main>

      {/* Premium Lock Modal */}
      {showPremiumLock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowPremiumLock(false)}>
          <div className="bg-white rounded-2xl p-6 mx-6 max-w-sm w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <span className="text-5xl">👑</span>
              <h3 className="text-lg font-bold text-gray-800 mt-3">프리미엄 전용 코스</h3>
              <p className="text-sm text-gray-500 mt-1">이 코스는 프리미엄 회원만 이용할 수 있어요</p>
              <button
                onClick={() => router.push("/premium")}
                className="w-full mt-4 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-xl font-bold tap-effect"
              >
                프리미엄 알아보기
              </button>
              <button
                onClick={() => setShowPremiumLock(false)}
                className="w-full mt-2 py-3 text-gray-400 text-sm"
              >
                다음에 할게요
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

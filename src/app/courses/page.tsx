"use client";

import { useState } from "react";
import { curatedCourses } from "@/lib/curated";
import CourseCard from "@/components/CourseCard";
import BottomNav from "@/components/BottomNav";

const allTags = ["전체", "감성", "카페", "사진", "레트로", "맛집", "밤", "야외", "피크닉", "힐링", "프리미엄", "트렌디", "전통", "야경", "제주"];
const filterTypes = ["전체", "무료만", "프리미엄"] as const;

export default function CoursesPage() {
  const [selectedTag, setSelectedTag] = useState("전체");
  const [selectedFilter, setSelectedFilter] = useState<typeof filterTypes[number]>("전체");

  const filteredCourses = curatedCourses.filter((course) => {
    const tagMatch = selectedTag === "전체" || course.tags.includes(selectedTag);
    const typeMatch =
      selectedFilter === "전체" ||
      (selectedFilter === "무료만" && !course.isPremium) ||
      (selectedFilter === "프리미엄" && course.isPremium);
    return tagMatch && typeMatch;
  });

  return (
    <div className="flex-1 flex flex-col bg-gray-50 max-w-lg mx-auto w-full">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-5 pt-6 pb-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">🔥 큐레이션 코스</h1>
        <p className="text-sm text-gray-400 mt-0.5">검증된 인기 데이트 코스를 한눈에</p>

        {/* Filter tabs */}
        <div className="flex gap-2 mt-4">
          {filterTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedFilter(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all tap-effect ${
                selectedFilter === type
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {type === "프리미엄" && "👑 "}{type}
            </button>
          ))}
        </div>

        {/* Tag scroll */}
        <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar pb-1">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all tap-effect ${
                selectedTag === tag
                  ? "bg-pink-100 text-pink-600 border border-pink-200"
                  : "bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {tag === "전체" ? tag : `#${tag}`}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-safe">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">해당 조건의 코스가 없어요</p>
            <button
              onClick={() => { setSelectedTag("전체"); setSelectedFilter("전체"); }}
              className="mt-3 text-xs text-pink-500"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <div className="space-y-4 stagger-children">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {/* Premium upsell */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-5 text-center mt-4">
          <span className="text-3xl">👑</span>
          <h3 className="font-bold text-gray-800 mt-2">프리미엄 코스가 궁금하다면?</h3>
          <p className="text-xs text-gray-500 mt-1">오마카세, 제주 당일치기 등 특별한 코스</p>
          <button
            onClick={() => window.location.href = "/premium"}
            className="mt-3 px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-medium hover:bg-amber-600 transition tap-effect"
          >
            프리미엄 알아보기
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

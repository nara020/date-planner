"use client";

import { useRouter } from "next/navigation";
import { CuratedCourse } from "@/lib/types";

interface CourseCardProps {
  course: CuratedCourse;
  compact?: boolean;
}

export default function CourseCard({ course, compact = false }: CourseCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/courses/${course.id}`)}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer tap-effect animate-scale-in"
    >
      {/* Cover gradient */}
      <div className={`relative bg-gradient-to-br ${course.coverGradient} ${compact ? "h-24" : "h-32"} flex items-center justify-center`}>
        <span className={`${compact ? "text-3xl" : "text-4xl"} animate-float`}>
          {course.coverEmoji}
        </span>
        {course.isPremium && (
          <div className="absolute top-3 right-3 px-2 py-0.5 bg-white/90 rounded-full text-xs font-semibold text-amber-600 flex items-center gap-1">
            👑 프리미엄
          </div>
        )}
        <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/20 rounded-full text-xs text-white backdrop-blur-sm">
          {course.area}
        </div>
      </div>

      {/* Content */}
      <div className={compact ? "p-3" : "p-4"}>
        <h4 className={`font-bold text-gray-800 ${compact ? "text-sm" : "text-base"}`}>
          {course.title}
        </h4>
        {!compact && (
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{course.subtitle}</p>
        )}

        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          <span className="text-amber-500">{"★".repeat(Math.round(course.rating))}</span>
          <span className="font-medium text-gray-600">{course.rating}</span>
          <span>({course.reviewCount})</span>
          <span className="ml-auto font-semibold text-pink-500">
            {course.price > 0 ? `₩${course.price.toLocaleString()}` : "무료"}
          </span>
        </div>

        {!compact && (
          <div className="flex gap-1.5 mt-2.5">
            {course.tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

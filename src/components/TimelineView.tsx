"use client";

import { useState } from "react";
import { TimeSlot, slotCategoryEmoji, slotCategoryLabel } from "@/lib/types";

interface TimelineViewProps {
  timetable: TimeSlot[];
  expandable?: boolean;
}

export default function TimelineView({ timetable, expandable = true }: TimelineViewProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="space-y-0">
      {timetable.map((slot, i) => {
        const isExpanded = expandedIndex === i;
        const isLast = i === timetable.length - 1;

        return (
          <div
            key={i}
            className={`flex gap-4 ${expandable ? "cursor-pointer" : ""}`}
            onClick={() => expandable && setExpandedIndex(isExpanded ? null : i)}
          >
            {/* Left: Time + Line */}
            <div className="flex flex-col items-center w-16 shrink-0">
              <div className="text-xs font-mono text-gray-500 font-medium mb-1.5">
                {slot.time}
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-200 ${
                isExpanded
                  ? "bg-pink-100 ring-2 ring-pink-300 scale-110"
                  : "bg-pink-50"
              }`}>
                {slotCategoryEmoji[slot.category] || "📌"}
              </div>
              {!isLast && (
                <div className="w-px flex-1 bg-gradient-to-b from-pink-200 to-gray-200 mt-1.5 min-h-[20px]" />
              )}
            </div>

            {/* Right: Content */}
            <div className={`flex-1 ${isLast ? "pb-2" : "pb-5"}`}>
              <div className="font-semibold text-gray-800 text-sm leading-snug">
                {slot.activity}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">
                  {slotCategoryLabel[slot.category]}
                </span>
                <span>{slot.duration}</span>
                {slot.cost && (
                  <span className="px-1.5 py-0.5 bg-pink-50 text-pink-500 rounded font-medium">
                    {slot.cost}
                  </span>
                )}
              </div>

              {/* Expanded details */}
              {isExpanded && expandable && (
                <div className="mt-3 animate-scale-in">
                  {slot.place && (
                    <div className="text-xs text-gray-500 mb-1">
                      📍 {slot.place.name} - {slot.place.address}
                    </div>
                  )}
                  {slot.tip && (
                    <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-xl">
                      💡 {slot.tip}
                    </div>
                  )}
                </div>
              )}

              {/* Show tip inline when not expandable */}
              {!expandable && slot.tip && (
                <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-xl">
                  💡 {slot.tip}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

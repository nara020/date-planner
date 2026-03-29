"use client";

import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { key: "home", label: "홈", emoji: "🏠", emojiActive: "🏠", path: "/dashboard" },
  { key: "generate", label: "생성", emoji: "✨", emojiActive: "✨", path: "/generate" },
  { key: "courses", label: "큐레이션", emoji: "🔥", emojiActive: "🔥", path: "/courses" },
  { key: "mypage", label: "마이", emoji: "👤", emojiActive: "👤", path: "/mypage" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-gray-200/50">
      <div className="max-w-lg mx-auto flex">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path || pathname?.startsWith(tab.path + "/");
          return (
            <button
              key={tab.key}
              onClick={() => router.push(tab.path)}
              className={`flex-1 flex flex-col items-center py-2 pt-3 transition-all duration-200 tap-effect ${
                isActive ? "text-pink-500" : "text-gray-400"
              }`}
              style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
            >
              <span className={`text-xl mb-0.5 transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                {isActive ? tab.emojiActive : tab.emoji}
              </span>
              <span className={`text-[10px] font-medium ${isActive ? "text-pink-500" : "text-gray-400"}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-pink-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

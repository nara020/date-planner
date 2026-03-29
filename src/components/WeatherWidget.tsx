"use client";

import { WeatherData } from "@/lib/types";

interface WeatherWidgetProps {
  weather: WeatherData | null;
  loading?: boolean;
}

const weatherEmoji: Record<string, string> = {
  "01d": "☀️", "01n": "🌙",
  "02d": "⛅", "02n": "☁️",
  "03d": "☁️", "03n": "☁️",
  "04d": "☁️", "04n": "☁️",
  "09d": "🌧️", "09n": "🌧️",
  "10d": "🌦️", "10n": "🌧️",
  "11d": "⛈️", "11n": "⛈️",
  "13d": "🌨️", "13n": "🌨️",
  "50d": "🌫️", "50n": "🌫️",
};

export default function WeatherWidget({ weather, loading }: WeatherWidgetProps) {
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100 animate-pulse">
        <div className="h-4 bg-blue-100 rounded w-24" />
        <div className="h-3 bg-blue-100 rounded w-32 mt-2" />
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌤️</span>
          <div>
            <p className="text-sm font-medium text-gray-600">날씨 정보를 불러오는 중...</p>
            <p className="text-xs text-gray-400">위치 권한을 허용해주세요</p>
          </div>
        </div>
      </div>
    );
  }

  const emoji = weatherEmoji[weather.icon] || "🌤️";

  return (
    <div className={`rounded-2xl p-4 border transition-all duration-300 ${
      weather.isOutdoorFriendly
        ? "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100"
        : "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-800">{weather.temp}°</span>
              <span className="text-sm text-gray-500">{weather.description}</span>
            </div>
            <div className={`text-xs mt-0.5 font-medium ${
              weather.isOutdoorFriendly ? "text-emerald-500" : "text-orange-500"
            }`}>
              {weather.isOutdoorFriendly
                ? "✅ 야외 활동하기 좋아요!"
                : "☔ 실내 데이트를 추천해요"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

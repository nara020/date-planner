// ─── 유저 프로필 ───
export type MBTI = string; // e.g. "ENFP", "ISTJ"
export type JudgingPerceiving = "J" | "P";

export interface UserProfile {
  id: string;
  nickname: string;
  mbti: MBTI;
  partnerMbti?: MBTI;
  budget: BudgetLevel;
  interests: Interest[];
  location: string; // 기본 지역 (서울, 대전 등)
  createdAt: string;
}

export type BudgetLevel = "low" | "medium" | "high" | "premium";
export type Interest =
  | "food"
  | "cafe"
  | "culture"
  | "outdoor"
  | "indoor"
  | "activity"
  | "shopping"
  | "nightlife"
  | "healing"
  | "photo";

export const interestLabels: Record<Interest, string> = {
  food: "맛집 탐방",
  cafe: "카페 투어",
  culture: "전시/공연",
  outdoor: "야외 활동",
  indoor: "실내 활동",
  activity: "액티비티",
  shopping: "쇼핑",
  nightlife: "야경/밤",
  healing: "힐링/스파",
  photo: "사진/포토",
};

export const budgetLabels: Record<BudgetLevel, string> = {
  low: "1~3만원",
  medium: "3~5만원",
  high: "5~10만원",
  premium: "10만원+",
};

// ─── 데이트 플랜 ───
export interface DatePlan {
  id: string;
  title: string;
  description: string;
  date?: string; // 날짜
  weather?: WeatherData;
  timetable: TimeSlot[];
  totalBudget: string;
  tags: string[];
  mood: string; // "로맨틱", "활동적", "힐링" 등
  createdAt: string;
  saved: boolean;
}

export interface TimeSlot {
  time: string; // "10:00"
  duration: string; // "1시간"
  activity: string;
  place?: PlaceInfo;
  cost?: string;
  tip?: string;
  category: SlotCategory;
}

export type SlotCategory =
  | "meal"
  | "cafe"
  | "activity"
  | "walk"
  | "culture"
  | "shopping"
  | "rest"
  | "photo"
  | "transport";

export const slotCategoryEmoji: Record<SlotCategory, string> = {
  meal: "🍽️",
  cafe: "☕",
  activity: "🎮",
  walk: "🚶",
  culture: "🎨",
  shopping: "🛍️",
  rest: "💆",
  photo: "📸",
  transport: "🚇",
};

// ─── 장소 ───
export interface PlaceInfo {
  name: string;
  address: string;
  lat: number;
  lng: number;
  categoryName?: string;
  phone?: string;
  placeUrl?: string;
}

// ─── 날씨 ───
export interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  isOutdoorFriendly: boolean;
}

// ─── 큐레이션 코스 (프리미엄) ───
export interface CuratedCourse {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  price: number; // 0이면 무료
  timetable: TimeSlot[];
  isPremium: boolean;
}

// ─── 앱 데이터 ───
export interface AppData {
  profile: UserProfile;
  plans: DatePlan[];
  savedCourses: string[]; // course ids
}

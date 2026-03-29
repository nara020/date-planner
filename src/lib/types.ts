// ─── 유저 프로필 ───
export type MBTI = string; // e.g. "ENFP", "ISTJ"
export type JudgingPerceiving = "J" | "P";

export interface UserProfile {
  id: string;
  nickname: string;
  coupleName?: string; // 커플 이름
  mbti: MBTI;
  partnerMbti?: MBTI;
  budget: BudgetLevel;
  interests: Interest[];
  location: string;
  preferredTime?: PreferredTime; // 선호 시간대
  createdAt: string;
}

export type PreferredTime = "morning" | "afternoon" | "evening" | "night";

export const preferredTimeLabels: Record<PreferredTime, string> = {
  morning: "오전 (10:00~12:00)",
  afternoon: "오후 (12:00~18:00)",
  evening: "저녁 (18:00~22:00)",
  night: "밤 (20:00~01:00)",
};

export const preferredTimeEmoji: Record<PreferredTime, string> = {
  morning: "🌅",
  afternoon: "☀️",
  evening: "🌆",
  night: "🌙",
};

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
  food: "🍽️ 맛집 탐방",
  cafe: "☕ 카페 투어",
  culture: "🎨 전시/공연",
  outdoor: "🌿 야외 활동",
  indoor: "🏠 실내 활동",
  activity: "🎮 액티비티",
  shopping: "🛍️ 쇼핑",
  nightlife: "🌙 야경/밤",
  healing: "💆 힐링/스파",
  photo: "📸 사진/포토",
};

export const budgetLabels: Record<BudgetLevel, string> = {
  low: "💚 1~3만원 — 알뜰 데이트",
  medium: "💛 3~5만원 — 적당히 즐기기",
  high: "🧡 5~10만원 — 제대로 즐기기",
  premium: "💎 10만원+ — 특별한 날",
};

// ─── 데이트 타입 ───
export type DateType = "casual" | "special" | "adventure" | "healing";

export const dateTypeLabels: Record<DateType, string> = {
  casual: "편안한 일상 데이트",
  special: "특별한 기념일",
  adventure: "새로운 모험",
  healing: "힐링 & 휴식",
};

export const dateTypeEmoji: Record<DateType, string> = {
  casual: "☕",
  special: "💝",
  adventure: "🗺️",
  healing: "🧘",
};

// ─── 데이트 플랜 ───
export interface DatePlan {
  id: string;
  title: string;
  description: string;
  date?: string;
  weather?: WeatherData;
  timetable: TimeSlot[];
  totalBudget: string;
  tags: string[];
  mood: string;
  dateType?: DateType;
  timeRange?: string;
  createdAt: string;
  saved: boolean;
}

export interface TimeSlot {
  time: string;
  duration: string;
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

export const slotCategoryLabel: Record<SlotCategory, string> = {
  meal: "식사",
  cafe: "카페",
  activity: "액티비티",
  walk: "산책",
  culture: "문화",
  shopping: "쇼핑",
  rest: "휴식",
  photo: "포토",
  transport: "이동",
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
  coverGradient: string; // gradient class
  coverEmoji: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  price: number;
  timetable: TimeSlot[];
  isPremium: boolean;
  reviews?: CourseReview[];
  area: string; // 지역
}

export interface CourseReview {
  id: string;
  nickname: string;
  rating: number;
  comment: string;
  date: string;
}

// ─── 앱 데이터 ───
export interface AppData {
  profile: UserProfile;
  plans: DatePlan[];
  savedCourses: string[];
  savedPlans: string[];
}

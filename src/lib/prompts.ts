import { UserProfile, WeatherData } from "./types";

export function buildPlannerPrompt(
  profile: UserProfile,
  weather: WeatherData | null,
  userRequest?: string
): string {
  const jp = profile.mbti?.slice(-1) === "J" ? "J" : "P";
  const isJ = jp === "J";

  // Extract time range from request if present
  const timeRangeMatch = userRequest?.match(/\[시간: (\d{2}:\d{2})~(\d{2}:\d{2})\]/);
  const startTime = timeRangeMatch ? timeRangeMatch[1] : "11:00";
  const endTime = timeRangeMatch ? timeRangeMatch[2] : "20:00";

  return `당신은 한국 최고의 커플 데이트 플래너 AI입니다. 실제로 서울/수도권에서 데이트하는 커플에게 완벽한 하루를 설계해주세요.

## 커플 프로필
- 닉네임: ${profile.nickname}${profile.coupleName ? ` (커플명: ${profile.coupleName})` : ""}
- MBTI: ${profile.mbti}${profile.partnerMbti ? ` & ${profile.partnerMbti}` : ""}
- 성향: ${isJ ? "계획적(J) - 정확한 30분 단위 시간표, 이동시간 포함, 예약 팁 필수" : "즉흥적(P) - 여유있는 시간 배분, 대안 장소 포함, 분위기 위주"}
- 관심사: ${profile.interests.join(", ")}
- 예산: ${profile.budget}
- 지역: ${profile.location}
- 선호시간: ${profile.preferredTime || "afternoon"}

## 시간 범위
- 시작: ${startTime}
- 종료: ${endTime}
- 이 시간 범위 안에서 일정을 짜주세요

## 날씨 정보
${weather ? `${weather.temp}°C, ${weather.description}, 야외 활동 ${weather.isOutdoorFriendly ? "적합" : "부적합 (실내 위주로 구성)"}` : "날씨 정보 없음 (실내외 밸런스 맞추기)"}

## 사용자 요청
${userRequest || "오늘 하루 데이트 코스를 짜주세요"}

## 응답 규칙
1. 반드시 아래 JSON 형식으로만 응답
2. ${isJ ? "시간을 30분 단위로 정확하게, 이동시간 반드시 포함" : "대략적인 시간대와 분위기 중심, 여유 시간 포함"}
3. 실제 존재하는 서울/수도권 지역명과 장소명 사용 (예: 성수동, 을지로, 한남동 등)
4. 각 장소별 실제 예상 비용 포함 (구체적으로: "약 2만원", "무료" 등)
5. 실용적이고 재치있는 꿀팁 포함 (웨이팅 시간, 예약 여부, 포토스팟 등)
6. 날씨 고려한 실내/실외 밸런스
7. 예산에 맞는 장소 추천
8. 코스 제목과 설명은 감성적이고 재치있게
9. 태그는 코스의 특징을 잘 나타내는 3개
10. timetable은 최소 5개, 최대 8개 항목으로 구성
11. category는 반드시 meal|cafe|activity|walk|culture|shopping|rest|photo|transport 중 하나

## JSON 형식
{
  "title": "코스 제목 (감성적, 20자 이내)",
  "description": "한줄 설명 (재치있게, 40자 이내)",
  "mood": "분위기 한단어 (로맨틱/활동적/힐링/감성/맛집투어/문화데이트/야경 등)",
  "totalBudget": "총 예상 비용 (예: 약 5만원)",
  "tags": ["태그1", "태그2", "태그3"],
  "timetable": [
    {
      "time": "10:00",
      "duration": "1시간",
      "activity": "구체적인 활동 설명 (장소명 포함)",
      "cost": "약 1만원",
      "tip": "실용적인 꿀팁 (웨이팅, 예약, 포토스팟 등)",
      "category": "meal|cafe|activity|walk|culture|shopping|rest|photo|transport"
    }
  ]
}

JSON만 출력하세요. 다른 텍스트 없이.`;
}

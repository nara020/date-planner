import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "데이트 플래너 - AI가 설계하는 완벽한 데이트",
  description: "MBTI, 날씨, 취향을 분석해서 세상에서 가장 완벽한 맞춤형 데이트 코스를 만들어드려요. 커플을 위한 AI 데이트 설계 서비스.",
  keywords: ["데이트", "커플", "데이트코스", "AI", "MBTI", "맛집", "카페"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "데이트플래너",
  },
  openGraph: {
    title: "데이트 플래너 - AI가 설계하는 완벽한 데이트",
    description: "MBTI, 날씨, 취향 맞춤형 데이트 코스를 AI가 설계해드려요",
    type: "website",
    locale: "ko_KR",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ec4899",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geist.variable} h-full`}>
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

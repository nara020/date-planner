"use client";

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ message = "불러오는 중...", fullScreen = true }: LoadingSpinnerProps) {
  const content = (
    <div className="text-center space-y-4">
      <div className="relative inline-block">
        <span className="text-5xl animate-heart-beat inline-block">💘</span>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-2 bg-pink-200/50 rounded-full blur-sm animate-pulse" />
      </div>
      <p className="text-gray-400 text-sm animate-pulse">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
}

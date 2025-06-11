import { useRouter } from "next/router";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
    >
      {/* Ícone de seta para esquerda */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
}

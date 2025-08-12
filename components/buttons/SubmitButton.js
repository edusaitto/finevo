export default function SubmitButton({ text, loading, loadingMessage }) {
  const _loadingMessage = loadingMessage || "Salvando...";

  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full bg-cyan-600 text-white py-2 rounded-xl transition flex items-center justify-center gap-2 ${
        loading ? "cursor-not-allowed opacity-70" : "hover:bg-cyan-700"
      }`}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {loading ? _loadingMessage : text}
    </button>
  );
}

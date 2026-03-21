import { useState } from "react";

interface ViewCountProps {
  slug: string;
  apiBase: string;
}

export default function ViewCount({ slug, apiBase }: ViewCountProps) {
  const [views, setViews] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (loading || views !== null) return;
    setLoading(true);

    const key = `viewed_${slug}`;
    const alreadyViewed = sessionStorage.getItem(key);
    const method = alreadyViewed ? "GET" : "POST";

    fetch(`${apiBase}/api/views/${encodeURIComponent(slug)}`, { method })
      .then((res) => res.json())
      .then((data) => {
        setViews(data.views);
        if (!alreadyViewed) sessionStorage.setItem(key, "1");
      })
      .catch(() => setViews(0))
      .finally(() => setLoading(false));
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
      aria-label="Show view count"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      {loading ? (
        <span className="w-6 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      ) : views !== null ? (
        `${views.toLocaleString()} ${views === 1 ? "view" : "views"}`
      ) : (
        "views"
      )}
    </button>
  );
}

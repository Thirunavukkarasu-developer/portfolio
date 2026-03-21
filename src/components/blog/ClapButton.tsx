import { useState, useRef, useCallback, useEffect } from "react";

interface ClapButtonProps {
  slug: string;
  apiBase: string;
}

const MAX_CLAPS_PER_USER = 50;

export default function ClapButton({ slug, apiBase }: ClapButtonProps) {
  const storageKey = `claps_${slug}`;

  const [totalClaps, setTotalClaps] = useState<number>(0);
  const [userClaps, setUserClaps] = useState(0);

  // Load saved claps from localStorage after mount (client-only)
  useEffect(() => {
    const saved = parseInt(localStorage.getItem(storageKey) || "0", 10);
    setUserClaps(saved);
    setTotalClaps(saved);
  }, [storageKey]);
  const [pendingClaps, setPendingClaps] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Batch send claps after user stops clicking
  const flushClaps = useCallback(
    (count: number) => {
      if (count <= 0) return;
      fetch(`${apiBase}/api/claps/${encodeURIComponent(slug)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count }),
      })
        .then((res) => res.json())
        .then((data) => setTotalClaps(data.claps))
        .catch(() => {});
    },
    [slug, apiBase]
  );

  const handleClap = () => {
    if (userClaps >= MAX_CLAPS_PER_USER) return;

    // Fetch server total on first click only
    if (!hasFetched) {
      setHasFetched(true);
      fetch(`${apiBase}/api/claps/${encodeURIComponent(slug)}`)
        .then((res) => res.json())
        .then((data) => setTotalClaps(data.claps + 1))
        .catch(() => {});
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    const newUserClaps = userClaps + 1;
    const newPending = pendingClaps + 1;
    setUserClaps(newUserClaps);
    setPendingClaps(newPending);
    setTotalClaps((prev) => prev + 1);
    localStorage.setItem(storageKey, String(newUserClaps));

    // Debounce: send after 400ms of no clicks
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      flushClaps(newPending);
      setPendingClaps(0);
    }, 400);
  };

  const clapsFull = userClaps >= MAX_CLAPS_PER_USER;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleClap}
        disabled={clapsFull}
        aria-label={clapsFull ? "Maximum claps reached" : "Clap for this article"}
        className={`
          group relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200
          ${
            clapsFull
              ? "border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-60"
              : "border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer active:scale-90"
          }
          ${isAnimating ? "scale-110 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20" : ""}
        `}
      >
        <svg
          className={`w-6 h-6 transition-all duration-200 ${
            userClaps > 0
              ? "text-blue-600 dark:text-blue-400 fill-current"
              : "text-gray-500 dark:text-gray-400"
          }`}
          viewBox="0 0 24 24"
          fill={userClaps > 0 ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={userClaps > 0 ? 0 : 1.5}
        >
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>

        {/* Burst animation */}
        {isAnimating && (
          <span className="absolute inset-0 rounded-full animate-ping bg-blue-400/30 dark:bg-blue-500/20" />
        )}
      </button>

      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {totalClaps.toLocaleString()}
        </span>
        {userClaps > 0 && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {userClaps}/{MAX_CLAPS_PER_USER} given
          </span>
        )}
      </div>
    </div>
  );
}

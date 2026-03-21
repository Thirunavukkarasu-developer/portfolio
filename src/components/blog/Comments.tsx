import { useEffect, useRef } from "react";

interface CommentsProps {
  repo: string;
  repoId: string;
  categoryId: string;
  term: string;
}

export default function Comments({
  repo,
  repoId,
  categoryId,
  term,
}: CommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Detect theme
    const isDark = document.documentElement.classList.contains("dark");

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", "Blog Comments");
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", term);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", isDark ? "dark" : "light");
    script.setAttribute("data-lang", "en");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(script);

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const newIsDark = document.documentElement.classList.contains("dark");
      const iframe = containerRef.current?.querySelector<HTMLIFrameElement>(
        "iframe.giscus-frame"
      );
      if (iframe) {
        iframe.contentWindow?.postMessage(
          {
            giscus: {
              setConfig: { theme: newIsDark ? "dark" : "light" },
            },
          },
          "https://giscus.app"
        );
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [repo, repoId, categoryId, term]);

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Comments
      </h2>
      <div ref={containerRef} />
    </section>
  );
}

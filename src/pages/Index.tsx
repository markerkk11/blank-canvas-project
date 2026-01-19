import { useCallback, useEffect, useRef } from "react";

const Index = () => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const normalizeWpHref = useCallback((href: string) => {
    // Leave external, anchors, and special schemes untouched
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      /^(https?:)?\/\//i.test(href)
    ) {
      return href;
    }

    // Ignore already-correct absolute asset paths
    if (href.startsWith("/assets/")) return href;

    // Root
    if (href === "/") return "/index.html";

    // Convert relative paths to absolute (within the static site)
    let p = href;
    if (!p.startsWith("/")) p = `/${p}`;

    // WordPress export pattern: /something/.html => /something.html
    p = p.replace(/\/\.html(?:\?.*)?$/i, "");

    // Trailing slash => .html
    if (p.endsWith("/")) p = p.slice(0, -1);

    // If it already looks like a file, keep it
    if (/\.(html|css|js|jpg|jpeg|png|webp|svg|gif|pdf|xml|json)(?:\?.*)?$/i.test(p)) {
      return p;
    }

    // Default: make it a flat html page
    return `${p}.html`;
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;

        // Rewrite existing anchor hrefs to prevent 404s (best-effort)
        doc.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((a) => {
          const original = a.getAttribute("href") || "";
          const normalized = normalizeWpHref(original);
          if (normalized && normalized !== original) a.setAttribute("href", normalized);
        });

        // Intercept clicks so even dynamically-created links get normalized
        const clickHandler = (e: MouseEvent) => {
          const target = e.target as HTMLElement | null;
          const a = target?.closest?.("a") as HTMLAnchorElement | null;
          if (!a) return;

          const href = a.getAttribute("href") || "";
          const normalized = normalizeWpHref(href);
          if (!normalized || normalized === href) return;

          e.preventDefault();
          iframe.src = normalized;
        };

        // Avoid stacking multiple listeners on re-load
        doc.removeEventListener("click", clickHandler, true);
        doc.addEventListener("click", clickHandler, true);
      } catch {
        // If cross-origin restrictions ever apply, silently skip.
      }
    };

    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [normalizeWpHref]);

  return (
    <main className="min-h-screen bg-background">
      <iframe
        ref={iframeRef}
        title="Website"
        src="/index.html"
        className="h-screen w-full border-0"
      />
    </main>
  );
};

export default Index;

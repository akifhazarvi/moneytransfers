"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Loads the Trustpilot bootstrap script only when the component
 * scrolls near the viewport (1 screen away). Avoids downloading
 * ~30KB of unused JS on initial page load.
 */
export default function LazyTrustpilot() {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const script = document.createElement("script");
          script.src =
            "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
          script.async = true;
          document.head.appendChild(script);
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100%" },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [loaded]);

  return <div ref={ref} />;
}

"use client";

import { useEffect } from "react";

type DeferredGtmProps = {
  gtmId: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function DeferredGtm({ gtmId }: DeferredGtmProps) {
  useEffect(() => {
    if (!gtmId || document.getElementById("gtm-script")) {
      return;
    }

    let timeoutId: number | null = null;
    let idleId: number | null = null;

    const injectGtm = () => {
      if (document.getElementById("gtm-script")) {
        return;
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        "gtm.start": Date.now(),
        event: "gtm.js",
      });

      const script = document.createElement("script");
      script.id = "gtm-script";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
      document.head.appendChild(script);
    };

    const scheduleIdleLoad = () => {
      timeoutId = window.setTimeout(() => {
        if ("requestIdleCallback" in window) {
          idleId = window.requestIdleCallback(injectGtm, { timeout: 8000 });
          return;
        }

        injectGtm();
      }, 4000);
    };

    if (document.readyState === "complete") {
      scheduleIdleLoad();
    } else {
      window.addEventListener("load", scheduleIdleLoad, { once: true });
    }

    return () => {
      window.removeEventListener("load", scheduleIdleLoad);

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      if (idleId !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [gtmId]);

  return null;
}

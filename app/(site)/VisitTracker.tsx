"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SESSION_KEY = "site_session_id";

function generateSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function getOrCreateSessionId() {
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const nextId = generateSessionId();
  localStorage.setItem(SESSION_KEY, nextId);
  return nextId;
}

export default function VisitTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedRef = useRef<string>("");

  useEffect(() => {
    if (!pathname) return;

    const queryString = searchParams?.toString() || "";
    const fullPath = queryString ? `${pathname}?${queryString}` : pathname;

    if (lastTrackedRef.current === fullPath) {
      return;
    }

    lastTrackedRef.current = fullPath;

    const sessionId = getOrCreateSessionId();

    const payload = {
      sessionId,
      path: fullPath,
      referer: document.referrer || null,
      utmSource: searchParams?.get("utm_source") || null,
      utmMedium: searchParams?.get("utm_medium") || null,
      utmCampaign: searchParams?.get("utm_campaign") || null,
    };

    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/visit", blob);
      return;
    }

    fetch("/api/visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      keepalive: true,
    }).catch((error) => {
      console.error("Track visit failed:", error);
    });
  }, [pathname, searchParams]);

  return null;
}

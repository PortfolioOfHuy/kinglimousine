"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const BROWSER_SESSION_KEY = "site_browser_session_id";
const TAB_ID_KEY = "site_tab_id";
const OPEN_TABS_KEY = "site_open_tabs";

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function getOrCreateBrowserSessionId() {
  const existing = localStorage.getItem(BROWSER_SESSION_KEY);
  if (existing) return existing;

  const nextId = generateId();
  localStorage.setItem(BROWSER_SESSION_KEY, nextId);
  return nextId;
}

function getOrCreateTabId() {
  const existing = sessionStorage.getItem(TAB_ID_KEY);
  if (existing) return existing;

  const nextId = generateId();
  sessionStorage.setItem(TAB_ID_KEY, nextId);
  return nextId;
}

function readOpenTabs() {
  try {
    const raw = localStorage.getItem(OPEN_TABS_KEY);
    if (!raw) return [] as string[];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item) => typeof item === "string");
  } catch {
    return [];
  }
}

function writeOpenTabs(tabIds: string[]) {
  localStorage.setItem(
    OPEN_TABS_KEY,
    JSON.stringify(Array.from(new Set(tabIds))),
  );
}

function registerCurrentTab() {
  const tabId = getOrCreateTabId();
  const current = readOpenTabs();

  if (!current.includes(tabId)) {
    current.push(tabId);
    writeOpenTabs(current);
  }

  return tabId;
}

function unregisterCurrentTab() {
  const tabId = getOrCreateTabId();
  const current = readOpenTabs().filter((item) => item !== tabId);
  writeOpenTabs(current);
  return current.length;
}

async function postJson(url: string, payload: Record<string, unknown>) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    keepalive: true,
    cache: "no-store",
  });
}

export default function SiteActivityTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const lastTrackedPathRef = useRef("");
  const currentPathRef = useRef("/");
  const leaveHandledRef = useRef(false);

  useEffect(() => {
    registerCurrentTab();
  }, []);

  useEffect(() => {
    if (!pathname) return;

    const queryString = searchParams?.toString() || "";
    const fullPath = queryString ? `${pathname}?${queryString}` : pathname;
    currentPathRef.current = fullPath;

    const sessionId = getOrCreateBrowserSessionId();

    if (lastTrackedPathRef.current !== fullPath) {
      lastTrackedPathRef.current = fullPath;

      postJson("/api/visit", {
        sessionId,
        path: fullPath,
        referer: document.referrer || null,
        utmSource: searchParams?.get("utm_source") || null,
        utmMedium: searchParams?.get("utm_medium") || null,
        utmCampaign: searchParams?.get("utm_campaign") || null,
      }).catch((error) => {
        console.error("Track visit failed:", error);
      });
    }

    postJson("/api/online/heartbeat", {
      sessionId,
      path: fullPath,
    }).catch((error) => {
      console.error("Heartbeat failed:", error);
    });
  }, [pathname, searchParams]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const sessionId = getOrCreateBrowserSessionId();

      postJson("/api/online/heartbeat", {
        sessionId,
        path: currentPathRef.current,
      }).catch((error) => {
        console.error("Heartbeat interval failed:", error);
      });
    }, 30000);

    const handleLeave = () => {
      if (leaveHandledRef.current) return;
      leaveHandledRef.current = true;

      const remainingTabs = unregisterCurrentTab();

      if (remainingTabs > 0) {
        return;
      }

      const sessionId = getOrCreateBrowserSessionId();
      const body = JSON.stringify({ sessionId });

      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon("/api/online/offline", blob);
        return;
      }

      fetch("/api/online/offline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
        keepalive: true,
      }).catch(() => {});
    };

    window.addEventListener("pagehide", handleLeave);
    window.addEventListener("beforeunload", handleLeave);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("pagehide", handleLeave);
      window.removeEventListener("beforeunload", handleLeave);
    };
  }, []);

  return null;
}

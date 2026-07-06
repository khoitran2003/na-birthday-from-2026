import { useEffect } from "react";

export interface PerformanceMetric {
  name: string;
  value: number; // in milliseconds
  status: "success" | "error";
  uid?: string | null;
  browser?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * Logs a performance metric entry to console.
 */
export async function logPerformanceMetric(
  name: string,
  value: number,
  status: "success" | "error" = "success",
  metadata: Record<string, any> = {}
) {
  if (typeof window === "undefined") return;

  try {
    const userAgent = navigator.userAgent;

    // Extract basic browser information
    let browser = "Other";
    if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";
    else if (userAgent.indexOf("SamsungBrowser") > -1) browser = "Samsung Browser";
    else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) browser = "Opera";
    else if (userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Edg") > -1) browser = "Edge";
    else if (userAgent.indexOf("Chrome") > -1) browser = "Chrome";
    else if (userAgent.indexOf("Safari") > -1) browser = "Safari";

    const metricData: PerformanceMetric = {
      name,
      value: Math.round(value),
      status,
      uid: null,
      browser,
      timestamp: Date.now(),
      metadata: {
        path: window.location.pathname,
        ...metadata
      }
    };

    console.log(`[Performance Metric] ${name}: ${metricData.value}ms (${status}) on ${browser}`, metricData.metadata);
  } catch (err) {
    console.warn("Performance logging failed:", err);
  }
}

/**
 * Custom React Hook that automatically calculates component/page mount duration.
 */
export function usePagePerformanceLogger(pageName: string) {
  useEffect(() => {
    const start = performance.now();

    const handleMeasurement = () => {
      const duration = performance.now() - start;
      logPerformanceMetric(`page_load_${pageName}`, duration);
    };

    if (document.readyState === "complete") {
      const timer = setTimeout(handleMeasurement, 100);
      return () => clearTimeout(timer);
    } else {
      window.addEventListener("load", handleMeasurement);
      return () => window.removeEventListener("load", handleMeasurement);
    }
  }, [pageName]);
}

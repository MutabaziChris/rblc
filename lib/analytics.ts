/**
 * Visitor Analytics - Client-side tracking
 *
 * trackVisitor() sends a non-blocking request to record page visits.
 * Uses sessionStorage to avoid duplicate tracking within 30 seconds.
 */

const TRACK_DEBOUNCE_MS = 30 * 1000; // 30 seconds
const STORAGE_KEY = 'rblc_last_track';

/**
 * Tracks a page visit. Call this when a page loads.
 * - Sends: page URL, user agent (IP is captured server-side)
 * - Skips if same page was tracked within last 30 seconds
 * - Non-blocking: uses sendBeacon or fetch, doesn't block page load
 *
 * @param pageUrl - Full URL or path of the visited page
 */
export function trackVisitor(pageUrl: string): void {
  // Skip in SSR or if window is undefined
  if (typeof window === 'undefined') return;

  // Check debounce: avoid duplicate within 30 seconds
  try {
    const last = sessionStorage.getItem(STORAGE_KEY);
    if (last) {
      const { url, ts } = JSON.parse(last) as { url: string; ts: number };
      const elapsed = Date.now() - ts;
      if (url === pageUrl && elapsed < TRACK_DEBOUNCE_MS) {
        return; // Skip duplicate
      }
    }
  } catch {
    // Ignore storage errors
  }

  const payload = {
    page_url: pageUrl,
    user_agent: navigator.userAgent,
  };

  // Use sendBeacon for non-blocking, fire-and-forget (best for analytics)
  const url = '/api/analytics/track';
  const blob = new Blob([JSON.stringify(payload)], {
    type: 'application/json',
  });

  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon(url, blob);
    if (sent) {
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ url: pageUrl, ts: Date.now() })
        );
      } catch {
        // Ignore
      }
      return;
    }
  }

  // Fallback: fetch with keepalive (non-blocking)
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // Silently ignore errors - analytics should never break the page
  });

  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ url: pageUrl, ts: Date.now() })
    );
  } catch {
    // Ignore
  }
}

/**
 * Cloudflare Turnstile script loader (explicit rendering).
 * @see https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
 *
 * Use ?render=explicit&onload=... with defer only.
 * Do NOT call turnstile.ready() when the script uses async/defer.
 */

const SCRIPT_ID = "cf-turnstile-script";
const ONLOAD_CALLBACK = "__sliceTurnstileSdkOnLoad";

export interface TurnstileApi {
  render: (
    container: HTMLElement | string,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
      theme?: "light" | "dark" | "auto";
    }
  ) => string;
  getResponse: (widgetId?: string) => string | undefined;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    [ONLOAD_CALLBACK]?: () => void;
    __sliceTurnstileWaiters?: Array<() => void>;
    turnstile?: TurnstileApi;
  }
}

let loadPromise: Promise<TurnstileApi> | null = null;

function flushWaiters() {
  const waiters = window.__sliceTurnstileWaiters;
  if (!waiters?.length) return;
  window.__sliceTurnstileWaiters = [];
  waiters.forEach((resolve) => resolve());
}

function registerOnloadCallback() {
  if (window[ONLOAD_CALLBACK]) return;
  window.__sliceTurnstileWaiters = window.__sliceTurnstileWaiters ?? [];
  window[ONLOAD_CALLBACK] = () => {
    flushWaiters();
  };
}

export function loadTurnstile(): Promise<TurnstileApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Turnstile is client-only"));
  }

  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }

  if (loadPromise) return loadPromise;

  registerOnloadCallback();

  loadPromise = new Promise<TurnstileApi>((resolve, reject) => {
    const finish = () => {
      if (!window.turnstile) {
        loadPromise = null;
        reject(new Error("Turnstile API unavailable"));
        return;
      }
      resolve(window.turnstile);
    };

    window.__sliceTurnstileWaiters!.push(finish);

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.turnstile) {
        flushWaiters();
      } else {
        existing.addEventListener("load", flushWaiters, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=${ONLOAD_CALLBACK}`;
    script.defer = true;
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Failed to load Turnstile script"));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

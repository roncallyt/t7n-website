interface RecaptchaApi {
  ready: (callback: () => void) => void;
  execute: (
    siteKey: string,
    options: { action: string },
  ) => Promise<string>;
}

declare global {
  interface Window {
    grecaptcha?: RecaptchaApi;
  }
}

const RECAPTCHA_SCRIPT_ID = "recaptcha-v3-script";
const RECAPTCHA_LOAD_TIMEOUT_MS = 10_000;

let loading: Promise<RecaptchaApi> | undefined;

function waitUntilReady(api: RecaptchaApi): Promise<RecaptchaApi> {
  return new Promise((resolve) => {
    api.ready(() => resolve(api));
  });
}

function loadRecaptcha(siteKey: string): Promise<RecaptchaApi> {
  if (!siteKey) {
    return Promise.reject(new Error("Missing reCAPTCHA site key."));
  }

  if (window.grecaptcha) {
    return waitUntilReady(window.grecaptcha);
  }

  if (loading) {
    return loading;
  }

  loading = new Promise<RecaptchaApi>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error("Timed out while loading reCAPTCHA."));
    }, RECAPTCHA_LOAD_TIMEOUT_MS);

    const finish = () => {
      if (!window.grecaptcha) {
        window.clearTimeout(timeout);
        reject(new Error("reCAPTCHA did not initialize."));
        return;
      }

      void waitUntilReady(window.grecaptcha).then((api) => {
        window.clearTimeout(timeout);
        resolve(api);
      }, (error) => {
        window.clearTimeout(timeout);
        reject(error);
      });
    };

    const fail = () => {
      window.clearTimeout(timeout);
      reject(new Error("Could not load reCAPTCHA."));
    };

    const existingScript = document.getElementById(
      RECAPTCHA_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", finish, { once: true });
      existingScript.addEventListener("error", fail, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = RECAPTCHA_SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}&trustedtypes=true`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", finish, { once: true });
    script.addEventListener("error", fail, { once: true });
    document.head.appendChild(script);
  });

  void loading.catch(() => {
    loading = undefined;
    document.getElementById(RECAPTCHA_SCRIPT_ID)?.remove();
  });

  return loading;
}

export function useRecaptcha() {
  const config = useRuntimeConfig();
  const siteKey = config.public.recaptchaSiteKey;

  async function execute(action: string): Promise<string> {
    const api = await loadRecaptcha(siteKey);
    const token = await api.execute(siteKey, { action });

    if (!token) {
      throw new Error("reCAPTCHA returned an empty token.");
    }

    return token;
  }

  return {
    execute,
    load: () => loadRecaptcha(siteKey),
  };
}

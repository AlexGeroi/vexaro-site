document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // COOKIE SYSTEM
  // =========================

  const COOKIE_KEY = "vexaro_cookie_preferences_v1";

  const cookieBanner = document.getElementById("cookie-banner");
  const cookieModal = document.getElementById("cookie-modal");

  const cookieAccept = document.getElementById("cookie-accept");
  const cookieReject = document.getElementById("cookie-reject");
  const cookieSettingsOpen = document.getElementById("cookie-settings-open");

  const cookieModalAccept = document.getElementById("cookie-modal-accept");
  const cookieModalReject = document.getElementById("cookie-modal-reject");
  const cookieModalSave = document.getElementById("cookie-modal-save");

  const cookieModalClose = document.getElementById("cookie-modal-close");
  const cookieModalBackdrop = document.getElementById("cookie-modal-backdrop");
  const cookieSettingsFooter = document.getElementById(
    "cookie-settings-footer",
  );

  const cookieAnalytics = document.getElementById("cookie-analytics");
  const cookieMarketing = document.getElementById("cookie-marketing");

  function readCookiePrefs() {
    try {
      return JSON.parse(localStorage.getItem(COOKIE_KEY));
    } catch {
      return null;
    }
  }

  function saveCookiePrefs(preferences) {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(preferences));
  }

  function applyCookiePrefs(preferences) {
    if (!preferences) return;

    if (cookieAnalytics) cookieAnalytics.checked = !!preferences.analytics;
    if (cookieMarketing) cookieMarketing.checked = !!preferences.marketing;
  }

  function showCookieBanner() {
    cookieBanner?.classList.add("is-visible");
  }

  function hideCookieBanner() {
    cookieBanner?.classList.remove("is-visible");
  }

  function openCookieModal() {
    cookieModal?.classList.add("is-open");
    document.body.classList.add("modal-open");
  }

  function closeCookieModal() {
    cookieModal?.classList.remove("is-open");
    document.body.classList.remove("modal-open");
  }

  function acceptAllCookies() {
    const prefs = {
      necessary: true,
      analytics: true,
      marketing: true,
    };

    saveCookiePrefs(prefs);
    applyCookiePrefs(prefs);
    hideCookieBanner();
    closeCookieModal();
  }

  function rejectNonEssentialCookies() {
    const prefs = {
      necessary: true,
      analytics: false,
      marketing: false,
    };

    saveCookiePrefs(prefs);
    applyCookiePrefs(prefs);
    hideCookieBanner();
    closeCookieModal();
  }

  function saveCookiePreferences() {
    const prefs = {
      necessary: true,
      analytics: cookieAnalytics?.checked,
      marketing: cookieMarketing?.checked,
    };

    saveCookiePrefs(prefs);
    applyCookiePrefs(prefs);
    hideCookieBanner();
    closeCookieModal();
  }

  const existingPrefs = readCookiePrefs();

  if (existingPrefs) {
    applyCookiePrefs(existingPrefs);
  } else {
    showCookieBanner();
  }

  cookieAccept?.addEventListener("click", acceptAllCookies);
  cookieReject?.addEventListener("click", rejectNonEssentialCookies);
  cookieSettingsOpen?.addEventListener("click", openCookieModal);

  cookieModalAccept?.addEventListener("click", acceptAllCookies);
  cookieModalReject?.addEventListener("click", rejectNonEssentialCookies);
  cookieModalSave?.addEventListener("click", saveCookiePreferences);

  cookieModalClose?.addEventListener("click", closeCookieModal);
  cookieModalBackdrop?.addEventListener("click", closeCookieModal);
  cookieSettingsFooter?.addEventListener("click", openCookieModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && cookieModal?.classList.contains("is-open")) {
      closeCookieModal();
    }
  });

  // =========================
  // DONATION + CRYPTO MODAL
  // =========================

  const consent = document.getElementById("donation-consent");
  const openBtn = document.getElementById("open-crypto-modal");

  const cryptoModal = document.getElementById("crypto-modal");
  const closeBackdrop = document.getElementById("crypto-modal-close");
  const closeX = document.getElementById("crypto-modal-x");
  const copyButtons = document.querySelectorAll("[data-copy-target]");

  if (openBtn && consent) {
    openBtn.classList.add("support-pill--disabled");

    consent.addEventListener("change", () => {
      openBtn.classList.toggle("support-pill--disabled", !consent.checked);
    });

    openBtn.addEventListener("click", (event) => {
      if (!consent.checked) {
        event.preventDefault();
        return;
      }

      cryptoModal?.classList.add("is-open");
      document.body.classList.add("modal-open");
    });
  }

  function closeCryptoModal() {
    cryptoModal?.classList.remove("is-open");
    document.body.classList.remove("modal-open");
  }

  closeBackdrop?.addEventListener("click", closeCryptoModal);
  closeX?.addEventListener("click", closeCryptoModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && cryptoModal?.classList.contains("is-open")) {
      closeCryptoModal();
    }
  });

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const targetId = button.getAttribute("data-copy-target");
      const el = document.getElementById(targetId);
      if (!el) return;

      const value = el.textContent.trim();

      try {
        await navigator.clipboard.writeText(value);

        const original = button.textContent;
        button.textContent = "Copied ✓";

        setTimeout(() => {
          button.textContent = original;
        }, 1400);
      } catch {
        button.textContent = "Error";

        setTimeout(() => {
          button.textContent = "Copy address";
        }, 1400);
      }
    });
  });
});
document.querySelectorAll(".lang-switch__link").forEach((link) => {
  link.addEventListener("click", (event) => {
    const lang = link.textContent.trim().toLowerCase();

    if (lang !== "en" && lang !== "ru") return;

    event.preventDefault();

    try {
      sessionStorage.setItem("vexaro_lang_override", lang);
    } catch (error) {}

    const href = link.getAttribute("href");
    if (!href) return;

    const separator = href.includes("?") ? "&" : "?";
    window.location.href = `${href}${separator}lang=${lang}`;
  });
});
const burger = document.getElementById("burger-toggle");
const mobileMenu = document.getElementById("mobile-menu");

if (burger && mobileMenu) {
  const closeMenu = () => {
    burger.classList.remove("is-active");
    mobileMenu.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  const openMenu = () => {
    burger.classList.add("is-active");
    mobileMenu.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  };

  closeMenu();

  burger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("is-open");
    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) {
      closeMenu();
    }
  });

  window.addEventListener("pageshow", () => {
    if (window.innerWidth > 1100) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

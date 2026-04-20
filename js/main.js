document.addEventListener("DOMContentLoaded", function () {
  var COOKIE_KEY = "vexaro_cookie_preferences_v1";

  var cookieBanner = document.getElementById("cookie-banner");
  var cookieModal = document.getElementById("cookie-modal");
  var cookieAccept = document.getElementById("cookie-accept");
  var cookieReject = document.getElementById("cookie-reject");
  var cookieSettingsOpen = document.getElementById("cookie-settings-open");
  var cookieModalAccept = document.getElementById("cookie-modal-accept");
  var cookieModalReject = document.getElementById("cookie-modal-reject");
  var cookieModalSave = document.getElementById("cookie-modal-save");
  var cookieModalClose = document.getElementById("cookie-modal-close");
  var cookieModalBackdrop = document.getElementById("cookie-modal-backdrop");
  var cookieSettingsFooter = document.getElementById("cookie-settings-footer");
  var cookieAnalytics = document.getElementById("cookie-analytics");
  var cookieMarketing = document.getElementById("cookie-marketing");

  var consent = document.getElementById("donation-consent");
  var openBtn = document.getElementById("open-crypto-modal");
  var cryptoModal = document.getElementById("crypto-modal");
  var closeBackdrop = document.getElementById("crypto-modal-close");
  var closeX = document.getElementById("crypto-modal-x");
  var copyButtons = document.querySelectorAll("[data-copy-target]");
  var burger = document.getElementById("burger-toggle");
  var mobileMenu = document.getElementById("mobile-menu");

  function safeAddClass(element, className) {
    if (element && element.classList) {
      element.classList.add(className);
    }
  }

  function safeRemoveClass(element, className) {
    if (element && element.classList) {
      element.classList.remove(className);
    }
  }

  function hasClass(element, className) {
    return !!(element && element.classList && element.classList.contains(className));
  }

  function readCookiePrefs() {
    try {
      var rawValue = window.localStorage.getItem(COOKIE_KEY);
      return rawValue ? JSON.parse(rawValue) : null;
    } catch (error) {
      return null;
    }
  }

  function saveCookiePrefs(preferences) {
    try {
      window.localStorage.setItem(COOKIE_KEY, JSON.stringify(preferences));
    } catch (error) {
      return false;
    }

    return true;
  }

  function applyCookiePrefs(preferences) {
    if (!preferences) {
      return;
    }

    if (cookieAnalytics) {
      cookieAnalytics.checked = !!preferences.analytics;
    }

    if (cookieMarketing) {
      cookieMarketing.checked = !!preferences.marketing;
    }
  }

  function showCookieBanner() {
    safeAddClass(cookieBanner, "is-visible");
  }

  function hideCookieBanner() {
    safeRemoveClass(cookieBanner, "is-visible");
  }

  function openCookieModal() {
    safeAddClass(cookieModal, "is-open");
    safeAddClass(document.body, "modal-open");
  }

  function closeCookieModal() {
    safeRemoveClass(cookieModal, "is-open");
    safeRemoveClass(document.body, "modal-open");
  }

  function acceptAllCookies() {
    var prefs = {
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
    var prefs = {
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
    var prefs = {
      necessary: true,
      analytics: cookieAnalytics ? cookieAnalytics.checked : false,
      marketing: cookieMarketing ? cookieMarketing.checked : false,
    };

    saveCookiePrefs(prefs);
    applyCookiePrefs(prefs);
    hideCookieBanner();
    closeCookieModal();
  }

  function closeCryptoModal() {
    safeRemoveClass(cryptoModal, "is-open");
    safeRemoveClass(document.body, "modal-open");
  }

  function selectTextForCopy(element) {
    if (!element) {
      return false;
    }

    if (document.body.createTextRange) {
      var legacyRange = document.body.createTextRange();
      legacyRange.moveToElementText(element);
      legacyRange.select();
      return true;
    }

    if (window.getSelection && document.createRange) {
      var selection = window.getSelection();
      var range = document.createRange();

      range.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(range);
      return true;
    }

    return false;
  }

  function clearTextSelection() {
    if (window.getSelection) {
      var selection = window.getSelection();
      if (selection && selection.removeAllRanges) {
        selection.removeAllRanges();
      }
    }
  }

  function copyText(value, element) {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      return navigator.clipboard.writeText(value);
    }

    return new Promise(function (resolve, reject) {
      try {
        var copied = false;

        if (element) {
          selectTextForCopy(element);
          copied = document.execCommand("copy");
          clearTextSelection();
        }

        if (!copied) {
          var helper = document.createElement("textarea");
          helper.value = value;
          helper.setAttribute("readonly", "readonly");
          helper.style.position = "fixed";
          helper.style.top = "-9999px";
          helper.style.opacity = "0";
          document.body.appendChild(helper);
          helper.focus();
          helper.select();
          copied = document.execCommand("copy");
          document.body.removeChild(helper);
        }

        if (copied) {
          resolve();
          return;
        }
      } catch (error) {
        clearTextSelection();
      }

      reject(new Error("Copy failed"));
    });
  }

  function setTemporaryButtonLabel(button, text, fallbackText) {
    if (!button) {
      return;
    }

    var original = button.textContent;
    button.textContent = text;

    window.setTimeout(function () {
      button.textContent = original || fallbackText;
    }, 1400);
  }

  function bindClick(element, handler) {
    if (element) {
      element.addEventListener("click", handler);
    }
  }

  var existingPrefs = readCookiePrefs();

  if (existingPrefs) {
    applyCookiePrefs(existingPrefs);
  } else {
    showCookieBanner();
  }

  bindClick(cookieAccept, acceptAllCookies);
  bindClick(cookieReject, rejectNonEssentialCookies);
  bindClick(cookieSettingsOpen, openCookieModal);
  bindClick(cookieModalAccept, acceptAllCookies);
  bindClick(cookieModalReject, rejectNonEssentialCookies);
  bindClick(cookieModalSave, saveCookiePreferences);
  bindClick(cookieModalClose, closeCookieModal);
  bindClick(cookieModalBackdrop, closeCookieModal);
  bindClick(cookieSettingsFooter, openCookieModal);
  bindClick(closeBackdrop, closeCryptoModal);
  bindClick(closeX, closeCryptoModal);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && hasClass(cookieModal, "is-open")) {
      closeCookieModal();
    }

    if (event.key === "Escape" && hasClass(cryptoModal, "is-open")) {
      closeCryptoModal();
    }

    if (event.key === "Escape" && burger && mobileMenu) {
      closeMenu();
    }
  });

  if (openBtn && consent) {
    safeAddClass(openBtn, "support-pill--disabled");

    consent.addEventListener("change", function () {
      if (!openBtn.classList) {
        return;
      }

      openBtn.classList.toggle("support-pill--disabled", !consent.checked);
    });

    openBtn.addEventListener("click", function (event) {
      if (!consent.checked) {
        event.preventDefault();
        return;
      }

      safeAddClass(cryptoModal, "is-open");
      safeAddClass(document.body, "modal-open");
    });
  }

  Array.prototype.forEach.call(copyButtons, function (button) {
    button.addEventListener("click", function () {
      var targetId = button.getAttribute("data-copy-target");
      var element = targetId ? document.getElementById(targetId) : null;
      var value;

      if (!element) {
        return;
      }

      value = element.textContent ? element.textContent.trim() : "";

      copyText(value, element)
        .then(function () {
          setTemporaryButtonLabel(button, "Copied", "Copy address");
        })
        .catch(function () {
          setTemporaryButtonLabel(button, "Error", "Copy address");
        });
    });
  });

  function closeMenu() {
    if (!burger || !mobileMenu) {
      return;
    }

    safeRemoveClass(burger, "is-active");
    safeRemoveClass(mobileMenu, "is-open");
    burger.setAttribute("aria-expanded", "false");
    safeRemoveClass(document.body, "menu-open");
  }

  function openMenu() {
    if (!burger || !mobileMenu) {
      return;
    }

    safeAddClass(burger, "is-active");
    safeAddClass(mobileMenu, "is-open");
    burger.setAttribute("aria-expanded", "true");
    safeAddClass(document.body, "menu-open");
  }

  if (burger && mobileMenu) {
    closeMenu();

    burger.addEventListener("click", function () {
      if (hasClass(mobileMenu, "is-open")) {
        closeMenu();
        return;
      }

      openMenu();
    });

    Array.prototype.forEach.call(
      mobileMenu.querySelectorAll("a"),
      function (link) {
        link.addEventListener("click", closeMenu);
      }
    );

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1100) {
        closeMenu();
      }
    });

    window.addEventListener("pageshow", function () {
      if (window.innerWidth > 1100) {
        closeMenu();
      }
    });
  }
});

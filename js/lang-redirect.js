(function () {
  try {
    var script = document.currentScript;
    if (!script) return;

    var currentLang = script.getAttribute("data-current-lang") || "";
    var redirectRu = script.getAttribute("data-redirect-ru") || "";
    var redirectEn = script.getAttribute("data-redirect-en") || "";
    var search = window.location.search || "";
    var explicitLangMatch = search.match(/[?&]lang=(ru|en)(?:&|$)/i);
    var explicitLang = explicitLangMatch ? explicitLangMatch[1].toLowerCase() : "";

    if (!currentLang || !redirectRu || !redirectEn) return;

    if (explicitLang) {
      try {
        if (window.sessionStorage) {
          window.sessionStorage.setItem("vexaro_lang_override", explicitLang);
        }
      } catch (e) {}

      if (explicitLang === currentLang) {
        return;
      }

      if (explicitLang === "ru") {
        window.location.replace(redirectRu + "?lang=ru");
        return;
      }

      if (explicitLang === "en") {
        window.location.replace(redirectEn + "?lang=en");
        return;
      }
    }

    var manualLang = "";
    try {
      if (window.sessionStorage) {
        manualLang = window.sessionStorage.getItem("vexaro_lang_override") || "";
      }
    } catch (e) {
      manualLang = "";
    }

    if (manualLang === "ru" && currentLang !== "ru") {
      window.location.replace(redirectRu);
      return;
    }

    if (manualLang === "en" && currentLang !== "en") {
      window.location.replace(redirectEn);
      return;
    }

    var localeCandidates = [];
    var nav = window.navigator || {};
    var i;

    if (nav.languages && typeof nav.languages.length === "number") {
      for (i = 0; i < nav.languages.length; i += 1) {
        if (nav.languages[i]) {
          localeCandidates.push(String(nav.languages[i]).toLowerCase());
        }
      }
    }

    if (nav.language) {
      localeCandidates.push(String(nav.language).toLowerCase());
    }

    if (nav.userLanguage) {
      localeCandidates.push(String(nav.userLanguage).toLowerCase());
    }

    try {
      var intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;
      if (intlLocale) {
        localeCandidates.push(String(intlLocale).toLowerCase());
      }
    } catch (e) {}

    var prefersRussian = false;

    for (i = 0; i < localeCandidates.length; i += 1) {
      if (
        localeCandidates[i] === "ru" ||
        localeCandidates[i].indexOf("ru-") === 0
      ) {
        prefersRussian = true;
        break;
      }
    }

    if (prefersRussian && currentLang === "en") {
      window.location.replace(redirectRu);
      return;
    }

    if (!prefersRussian && currentLang === "ru") {
      window.location.replace(redirectEn);
    }
  } catch (e) {}
})();

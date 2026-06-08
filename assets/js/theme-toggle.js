(function () {
  var storageKey = "site-theme";

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }

    callback();
  }

  function preferredTheme() {
    try {
      var storedTheme = window.localStorage.getItem(storageKey);
      if (storedTheme === "dark" || storedTheme === "light") {
        return storedTheme;
      }
    } catch (error) {
      // Ignore unavailable localStorage and fall back to the system setting.
    }

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return "light";
  }

  function applyTheme(theme) {
    var isDark = theme === "dark";
    var root = document.documentElement;
    var toggle = document.querySelector("[data-theme-toggle]");
    var label = document.querySelector("[data-theme-label]");
    var icon = document.querySelector("[data-theme-icon]");

    root.classList.toggle("theme-dark", isDark);
    root.classList.toggle("theme-light", !isDark);

    if (toggle) {
      toggle.setAttribute("aria-pressed", String(isDark));
    }

    if (label) {
      label.textContent = isDark ? "Night mode" : "Light mode";
    }

    if (icon) {
      icon.className = isDark ? "fa-regular fa-sun" : "fa-regular fa-moon";
    }
  }

  onReady(function () {
    var toggle = document.querySelector("[data-theme-toggle]");
    var theme = preferredTheme();

    applyTheme(theme);

    if (toggle) {
      toggle.addEventListener("click", function () {
        theme = document.documentElement.classList.contains("theme-dark") ? "light" : "dark";

        try {
          window.localStorage.setItem(storageKey, theme);
        } catch (error) {
          // Persisting the choice is optional.
        }

        applyTheme(theme);
      });
    }

    if (window.matchMedia) {
      var media = window.matchMedia("(prefers-color-scheme: dark)");
      var syncWithSystem = function () {
        try {
          if (window.localStorage.getItem(storageKey)) {
            return;
          }
        } catch (error) {
          return;
        }

        applyTheme(media.matches ? "dark" : "light");
      };

      if (media.addEventListener) {
        media.addEventListener("change", syncWithSystem);
      } else if (media.addListener) {
        media.addListener(syncWithSystem);
      }
    }
  });
})();

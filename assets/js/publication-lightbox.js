(function () {
  "use strict";

  function init() {
    var dialog = document.querySelector("[data-publication-lightbox]");
    if (!dialog || typeof dialog.showModal !== "function" || dialog.hasAttribute("data-lightbox-ready")) return;

    var image = dialog.querySelector("[data-lightbox-image]");
    var title = dialog.querySelector("[data-lightbox-title]");
    var closeButton = dialog.querySelector("[data-lightbox-close]");
    var opener = null;
    if (!image || !title || !closeButton) return;

    dialog.setAttribute("data-lightbox-ready", "true");

    document.addEventListener("click", function (event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      var target = event.target.closest ? event.target : event.target.parentElement;
      var link = target ? target.closest("a.publication-figure-link") : null;
      if (!link || dialog.open) return;

      var href = link.getAttribute("href");
      if (!href) return;

      var row = link.closest(".pub-row");
      var heading = row ? row.querySelector(".title") : null;
      var paperTitle = heading ? heading.textContent.trim() : "Publication";
      title.textContent = paperTitle;
      image.alt = "Figure for " + paperTitle;
      image.setAttribute("src", href);
      opener = link;

      try {
        dialog.showModal();
      } catch (error) {
        image.removeAttribute("src");
        image.alt = "";
        title.textContent = "";
        opener = null;
        return;
      }

      document.documentElement.classList.add("has-publication-lightbox");
      event.preventDefault();
    });

    closeButton.addEventListener("click", function (event) {
      event.preventDefault();
      dialog.close();
    });

    dialog.addEventListener("click", function (event) {
      if (event.target !== dialog) return;

      var bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
        dialog.close();
      }
    });

    // Escape uses the native dialog cancel behavior, which also emits close.
    dialog.addEventListener("close", function () {
      image.removeAttribute("src");
      image.alt = "";
      title.textContent = "";
      document.documentElement.classList.remove("has-publication-lightbox");

      var previousOpener = opener;
      opener = null;
      if (previousOpener && previousOpener.isConnected) {
        previousOpener.focus({ preventScroll: true });
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();

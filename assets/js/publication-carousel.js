(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }

    callback();
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function pageWindow(activeIndex, total) {
    var pages = [];
    var i;

    if (total <= 7) {
      for (i = 0; i < total; i += 1) {
        pages.push(i);
      }
      return pages;
    }

    if (activeIndex <= 2) {
      pages = [0, 1, 2, 3, 4, "ellipsis", total - 1];
    } else if (activeIndex >= total - 3) {
      pages = [0, "ellipsis"];
      for (i = total - 5; i < total; i += 1) {
        pages.push(i);
      }
    } else {
      pages = [0, "ellipsis", activeIndex - 1, activeIndex, activeIndex + 1, "ellipsis", total - 1];
    }

    return pages;
  }

  function setDisabled(button, disabled) {
    button.disabled = disabled;
    button.setAttribute("aria-disabled", disabled ? "true" : "false");
  }

  function initCarousel(root) {
    var items = Array.prototype.slice.call(root.querySelectorAll("ol.bibliography > li"));
    var pagesContainer = root.querySelector(".pub-carousel-pages");
    var activeIndex = 0;

    if (!items.length || !pagesContainer) {
      return;
    }

    root.classList.toggle("is-single-paper", items.length === 1);

    function goTo(index) {
      activeIndex = clamp(index, 0, items.length - 1);
      update();
    }

    function renderPages() {
      pagesContainer.innerHTML = "";

      pageWindow(activeIndex, items.length).forEach(function (page) {
        var element;

        if (page === "ellipsis") {
          element = document.createElement("span");
          element.className = "pub-carousel-ellipsis";
          element.textContent = "...";
        } else {
          element = document.createElement("button");
          element.className = "pub-carousel-page";
          element.type = "button";
          element.textContent = String(page + 1);
          element.setAttribute("data-carousel-page", String(page));
          element.setAttribute("aria-label", "Show paper " + String(page + 1));

          if (page === activeIndex) {
            element.classList.add("is-active");
            element.setAttribute("aria-current", "page");
          }
        }

        pagesContainer.appendChild(element);
      });
    }

    function updateButtons() {
      var atStart = activeIndex === 0;
      var atEnd = activeIndex === items.length - 1;

      root.querySelectorAll('[data-carousel-action="first"], [data-carousel-action="prev"]').forEach(function (button) {
        setDisabled(button, atStart);
      });

      root.querySelectorAll('[data-carousel-action="next"], [data-carousel-action="last"]').forEach(function (button) {
        setDisabled(button, atEnd);
      });
    }

    function update() {
      items.forEach(function (item, index) {
        var isActive = index === activeIndex;
        item.hidden = !isActive;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-hidden", isActive ? "false" : "true");
      });

      renderPages();
      updateButtons();
    }

    root.addEventListener("click", function (event) {
      var clicked = event.target.closest ? event.target : event.target.parentElement;
      var target = clicked ? clicked.closest("[data-carousel-action], [data-carousel-page]") : null;

      if (!target || !root.contains(target) || target.disabled) {
        return;
      }

      if (target.hasAttribute("data-carousel-page")) {
        goTo(Number(target.getAttribute("data-carousel-page")));
        return;
      }

      switch (target.getAttribute("data-carousel-action")) {
        case "first":
          goTo(0);
          break;
        case "prev":
          goTo(activeIndex - 1);
          break;
        case "next":
          goTo(activeIndex + 1);
          break;
        case "last":
          goTo(items.length - 1);
          break;
      }
    });

    update();
  }

  onReady(function () {
    document.querySelectorAll("[data-publication-carousel]").forEach(initCarousel);
  });
})();

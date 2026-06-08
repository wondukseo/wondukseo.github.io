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
    var activeFilter = "all";
    var filterControls = root.id
      ? Array.prototype.slice.call(document.querySelectorAll('[data-publication-filter="' + root.id + '"] [data-venue-filter]'))
      : [];

    if (!items.length || !pagesContainer) {
      return;
    }

    function filteredItems() {
      if (activeFilter === "all") {
        return items.slice();
      }

      return items.filter(function (item) {
        return item.getAttribute("data-venue-group") === activeFilter;
      });
    }

    function updateFilterControls() {
      filterControls.forEach(function (button) {
        var isActive = button.getAttribute("data-venue-filter") === activeFilter;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    }

    function goTo(index) {
      var visibleItems = filteredItems();
      activeIndex = clamp(index, 0, Math.max(visibleItems.length - 1, 0));
      update();
    }

    function renderPages(visibleItems) {
      pagesContainer.innerHTML = "";

      if (!visibleItems.length) {
        return;
      }

      pageWindow(activeIndex, visibleItems.length).forEach(function (page) {
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

    function updateButtons(visibleItems) {
      var atStart = activeIndex === 0;
      var atEnd = activeIndex >= visibleItems.length - 1;
      var isDisabled = visibleItems.length <= 1;

      root.querySelectorAll('[data-carousel-action="first"], [data-carousel-action="prev"]').forEach(function (button) {
        setDisabled(button, isDisabled || atStart);
      });

      root.querySelectorAll('[data-carousel-action="next"], [data-carousel-action="last"]').forEach(function (button) {
        setDisabled(button, isDisabled || atEnd);
      });
    }

    function update() {
      var visibleItems = filteredItems();

      if (activeIndex > visibleItems.length - 1) {
        activeIndex = 0;
      }

      items.forEach(function (item, index) {
        var isActive = visibleItems[activeIndex] === item;
        item.hidden = !isActive;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-hidden", isActive ? "false" : "true");
      });

      root.classList.toggle("is-empty", visibleItems.length === 0);
      root.classList.toggle("is-single-paper", visibleItems.length <= 1);
      updateFilterControls();
      renderPages(visibleItems);
      updateButtons(visibleItems);
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

    filterControls.forEach(function (button) {
      button.addEventListener("click", function () {
        activeFilter = button.getAttribute("data-venue-filter") || "all";
        activeIndex = 0;
        update();
      });
    });

    update();
  }

  onReady(function () {
    document.querySelectorAll("[data-publication-carousel]").forEach(initCarousel);
  });
})();

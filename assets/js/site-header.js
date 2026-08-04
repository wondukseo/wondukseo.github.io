(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }

    callback();
  }

  onReady(function () {
    var header = document.querySelector("[data-site-header]");
    var navigation = document.querySelector("[data-site-navigation]");
    var menuToggle = document.querySelector("[data-site-menu-toggle]");
    var menuIcon = document.querySelector("[data-site-menu-icon]");
    var navGroups = Array.prototype.slice.call(document.querySelectorAll(".site-nav-group"));

    if (!header || !navigation || !menuToggle) {
      return;
    }

    function focusDestination(link) {
      var hash = link.getAttribute("href");
      var destination = hash && hash.charAt(0) === "#" ? document.getElementById(hash.slice(1)) : null;

      if (!destination) {
        return;
      }

      var addedTabIndex = !destination.hasAttribute("tabindex");

      if (addedTabIndex) {
        destination.setAttribute("tabindex", "-1");
      }

      window.requestAnimationFrame(function () {
        destination.focus({ preventScroll: true });

        if (addedTabIndex) {
          destination.addEventListener("blur", function () {
            destination.removeAttribute("tabindex");
          }, { once: true });
        }
      });
    }

    function setMenu(open) {
      header.classList.toggle("is-menu-open", open);
      document.body.classList.toggle("is-site-menu-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));

      if (menuIcon) {
        menuIcon.className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
      }

      if (!open) {
        navGroups.forEach(function (group) {
          group.open = false;
        });
      }
    }

    menuToggle.addEventListener("click", function (event) {
      var open = menuToggle.getAttribute("aria-expanded") !== "true";
      setMenu(open);

      if (open && event.detail === 0) {
        window.requestAnimationFrame(function () {
          var firstNavigationItem = navigation.querySelector("a[href^='#'], summary");

          if (firstNavigationItem) {
            firstNavigationItem.focus();
          }
        });
      }
    });

    navigation.addEventListener("click", function (event) {
      var link = event.target.closest("a[href^='#']");

      if (link) {
        setMenu(false);
        focusDestination(link);
      }
    });

    navGroups.forEach(function (group) {
      group.addEventListener("toggle", function () {
        if (!group.open) {
          return;
        }

        navGroups.forEach(function (otherGroup) {
          if (otherGroup !== group) {
            otherGroup.open = false;
          }
        });
      });
    });

    document.addEventListener("click", function (event) {
      if (!header.contains(event.target)) {
        if (header.classList.contains("is-menu-open")) {
          setMenu(false);
        } else {
          navGroups.forEach(function (group) {
            group.open = false;
          });
        }
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") {
        return;
      }

      if (header.classList.contains("is-menu-open")) {
        event.preventDefault();
        setMenu(false);
        menuToggle.focus();
        return;
      }

      var openGroup = navGroups.find(function (group) {
        return group.open;
      });

      if (openGroup) {
        event.preventDefault();
        openGroup.open = false;
        openGroup.querySelector("summary").focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) {
        setMenu(false);
      }
    });
  });
})();

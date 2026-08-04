(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }

    callback();
  }

  onReady(function () {
    var disclosures = {};

    document.querySelectorAll("[data-profile-collapsible]").forEach(function (heading) {
      var panel = heading.nextElementSibling;

      if (!panel || panel.tagName !== "UL") {
        return;
      }

      var panelId = heading.id + "-content";
      panel.id = panelId;
      panel.classList.add("profile-subsection-panel");
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", heading.id);

      var button = document.createElement("button");
      button.type = "button";
      button.className = "profile-subsection-toggle";
      button.setAttribute("aria-controls", panelId);

      while (heading.firstChild) {
        button.appendChild(heading.firstChild);
      }

      var chevron = document.createElement("span");
      chevron.className = "profile-subsection-chevron";
      chevron.setAttribute("aria-hidden", "true");
      chevron.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
      button.appendChild(chevron);
      heading.appendChild(button);
      heading.classList.add("is-collapse-ready");

      function setOpen(open) {
        panel.hidden = !open;
        button.setAttribute("aria-expanded", String(open));
        heading.classList.toggle("is-expanded", open);
        window.dispatchEvent(new Event("resize"));
      }

      setOpen(false);
      button.addEventListener("click", function () {
        setOpen(button.getAttribute("aria-expanded") !== "true");
      });

      disclosures[heading.id] = {
        heading: heading,
        setOpen: setOpen
      };
    });

    function revealHash(shouldScroll) {
      var id = window.location.hash.slice(1);
      var disclosure = disclosures[id];
      var target = disclosure ? disclosure.heading : document.getElementById(id);

      if (!target) {
        return;
      }

      if (disclosure) {
        disclosure.setOpen(true);
      }

      if (shouldScroll) {
        window.requestAnimationFrame(function () {
          target.scrollIntoView({ block: "start" });
        });
      }
    }

    document.addEventListener("click", function (event) {
      var link = event.target.closest("a[href^='#']");

      if (!link) {
        return;
      }

      var disclosure = disclosures[link.getAttribute("href").slice(1)];

      if (disclosure) {
        disclosure.setOpen(true);
      }
    });

    window.addEventListener("hashchange", function () {
      revealHash(false);
    });

    revealHash(true);
  });
})();

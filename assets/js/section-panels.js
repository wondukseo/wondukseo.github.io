(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }

    callback();
  }

  function hasVisibleContent(nodes) {
    return nodes.some(function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }

      return node.nodeType === Node.ELEMENT_NODE;
    });
  }

  onReady(function () {
    document.querySelectorAll("section > h2").forEach(function (heading) {
      var nodes = [];
      var cursor = heading.nextSibling;

      if (cursor && cursor.nodeType === Node.ELEMENT_NODE && cursor.classList.contains("section-content-panel")) {
        return;
      }

      while (cursor) {
        if (cursor.nodeType === Node.ELEMENT_NODE && (cursor.tagName === "H2" || cursor.tagName === "HR")) {
          break;
        }

        nodes.push(cursor);
        cursor = cursor.nextSibling;
      }

      if (!hasVisibleContent(nodes)) {
        return;
      }

      var panel = document.createElement("div");
      panel.className = "section-content-panel";
      panel.setAttribute("data-section-panel", heading.id || "section");

      nodes.forEach(function (node) {
        panel.appendChild(node);
      });

      heading.insertAdjacentElement("afterend", panel);

      if (cursor && cursor.nodeType === Node.ELEMENT_NODE && cursor.tagName === "HR") {
        cursor.classList.add("section-boundary");
      }
    });

    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".profile-nav a[href^='#']"));
    var navIds = navLinks.map(function (link) {
      return link.getAttribute("href").slice(1);
    });
    var headings = Array.prototype.slice.call(document.querySelectorAll("section > h2[id]")).filter(function (heading) {
      return navIds.indexOf(heading.id) !== -1;
    });

    function updateActiveNav() {
      var activeId = headings.length ? headings[0].id : "";

      headings.forEach(function (heading) {
        if (heading.getBoundingClientRect().top <= 150) {
          activeId = heading.id;
        }
      });

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        activeId = headings[headings.length - 1].id;
      }

      navLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + activeId);
      });
    }

    if (navLinks.length && headings.length) {
      window.addEventListener("scroll", updateActiveNav, { passive: true });
      window.addEventListener("resize", updateActiveNav);
      updateActiveNav();
    }
  });
})();

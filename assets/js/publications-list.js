(function () {
  "use strict";

  function init() {
    document.querySelectorAll("[data-publication-list]").forEach(function (root) {
      var items = Array.prototype.slice.call(root.querySelectorAll(".bibliography > li"));
      var filter = root.querySelector("[data-publication-venue]");
      var more = root.querySelector("[data-publications-more]");
      var status = root.querySelector("[data-publications-status]");
      var summary = root.querySelector("[data-publication-summary]");
      var previewCount = Number(root.getAttribute("data-preview-count")) || items.length;
      var expanded = false;

      if (!items.length || !filter || !more) return;

      function update(announce) {
        var selected = filter.value;
        var matched = 0;
        var shown = 0;

        items.forEach(function (item) {
          var matches = selected === "all" || item.getAttribute("data-venue-group") === selected;
          if (matches) matched += 1;
          var visible = matches && (selected !== "all" || expanded || matched <= previewCount);
          item.hidden = !visible;
          if (visible) shown += 1;
        });

        more.hidden = selected !== "all" || matched <= previewCount;
        more.setAttribute("aria-expanded", String(expanded));
        more.textContent = expanded ? "Show fewer papers" : "Show all " + items.length + " papers";
        if (summary) {
          summary.hidden = false;
          summary.textContent = selected === "all"
            ? "Showing " + shown + " of " + matched
            : shown + (shown === 1 ? " matching paper" : " matching papers");
        }
        if (announce && status) status.textContent = shown + (shown === 1 ? " paper shown" : " papers shown");
      }

      filter.addEventListener("change", function () {
        expanded = false;
        update(true);
      });
      more.addEventListener("click", function (event) {
        expanded = !expanded;
        update(true);
        if (expanded && event.detail === 0) {
          var firstRevealedLink = items[previewCount].querySelector("a");
          if (firstRevealedLink) firstRevealedLink.focus();
        } else if (!expanded) {
          more.scrollIntoView({ block: "nearest" });
        }
      });
      root.classList.add("is-ready");
      update(false);
    });

    var closedDetails = [];
    window.addEventListener("beforeprint", function () {
      closedDetails = Array.prototype.slice.call(document.querySelectorAll("section details:not([open])"));
      closedDetails.forEach(function (details) { details.open = true; });
    });
    window.addEventListener("afterprint", function () {
      closedDetails.forEach(function (details) { details.open = false; });
      closedDetails = [];
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }

    callback();
  }

  onReady(function () {
    document.querySelectorAll(".news-scroll-wrap").forEach(function (wrapper) {
      var scroller = wrapper.querySelector(".news-scroll");
      var thumb = wrapper.querySelector(".news-scrollbar-thumb");

      if (!scroller || !thumb) {
        return;
      }

      function updateScrollbar() {
        var scrollHeight = scroller.scrollHeight;
        var viewportHeight = scroller.clientHeight;
        var isScrollable = scrollHeight > viewportHeight + 1;

        wrapper.classList.toggle("is-scrollable", isScrollable);

        if (!isScrollable) {
          return;
        }

        var thumbHeight = Math.max(
          44,
          Math.round((viewportHeight / scrollHeight) * viewportHeight)
        );
        var maxThumbTop = viewportHeight - thumbHeight;
        var maxScrollTop = scrollHeight - viewportHeight;
        var thumbTop = maxScrollTop
          ? Math.round((scroller.scrollTop / maxScrollTop) * maxThumbTop)
          : 0;

        wrapper.style.setProperty("--news-scroll-thumb-height", thumbHeight + "px");
        wrapper.style.setProperty("--news-scroll-thumb-top", thumbTop + "px");
      }

      scroller.addEventListener("scroll", updateScrollbar, { passive: true });
      window.addEventListener("resize", updateScrollbar);

      if ("ResizeObserver" in window) {
        new ResizeObserver(updateScrollbar).observe(scroller);
      }

      updateScrollbar();
      window.setTimeout(updateScrollbar, 100);
    });
  });
})();

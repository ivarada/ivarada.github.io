// Client-side fallback: adds target="_blank" and rel to external links at DOMContentLoaded.
// Put this file at assets/js/external-links.js and include it in your layout (see README).

document.addEventListener("DOMContentLoaded", function () {
  try {
    var anchors = document.querySelectorAll("a[href]");
    anchors.forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href) return;
      if (
        href.indexOf("#") === 0 ||
        href.indexOf("mailto:") === 0 ||
        href.indexOf("javascript:") === 0
      )
        return;
      // Determine if URL is absolute (has host) or protocol-relative
      var isAbsolute = href.indexOf("://") > -1 || href.indexOf("//") === 0;
      if (!isAbsolute) return;
      try {
        var linkUrl = new URL(href, location.href);
        var linkHost = linkUrl.host;
        var siteHost = location.host;
        // Treat same host (and subdomains of site host) as internal
        var isExternal =
          linkHost !== siteHost && !linkHost.endsWith("." + siteHost);
        if (isExternal) {
          if (!a.hasAttribute("target")) a.setAttribute("target", "_blank");
          var rel = (a.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
          if (rel.indexOf("noopener") === -1) rel.push("noopener");
          if (rel.indexOf("noreferrer") === -1) rel.push("noreferrer");
          a.setAttribute("rel", rel.join(" ").trim());
        }
      } catch (e) {
        // ignore invalid URLs
      }
    });
  } catch (e) {
    // defensive
    console.error("external-links script failed", e);
  }
});

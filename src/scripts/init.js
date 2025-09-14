// Initialize Raneto base URL and RTL support
// This variable is used by other scripts to construct proper URLs
// The actual value is set via a data attribute on the script tag
(function () {
  // Get the script element
  var scriptElement =
    document.currentScript || document.querySelector("script[data-base-url]");

  // Get base URL from data attribute
  if (scriptElement && scriptElement.dataset.baseUrl) {
    window.rn_base_url = scriptElement.dataset.baseUrl;
  } else {
    // Fallback to current origin if not set
    window.rn_base_url = window.location.origin;
  }

  // Handle RTL layout
  // Apply RTL if the data-rtl attribute is "true"
  if (scriptElement && scriptElement.dataset.rtl === "true") {
    document.documentElement.setAttribute("dir", "rtl");
  }

  // Handle collapsible menus after DOM is loaded
  document.addEventListener("DOMContentLoaded", function () {
    // Handle category titles
    var categoryTitles = document.querySelectorAll(
      "h5.category-title[data-collapsible]"
    );
    categoryTitles.forEach(function (titleElement) {
      var isCollapsible = titleElement.dataset.collapsible === "true";
      var categorySort = titleElement.dataset.categorySort;
      var title = titleElement.dataset.title;
      var titleTextSpan = titleElement.querySelector(".category-title-text");

      if (titleTextSpan && title) {
        if (isCollapsible && categorySort) {
          // Create collapsible link
          var link = document.createElement("a");
          link.href = "#category_" + categorySort;
          link.setAttribute("data-bs-toggle", "collapse");
          link.textContent = title;
          titleTextSpan.appendChild(link);
        } else {
          // Just show the title text
          titleTextSpan.textContent = title;
        }
      }
    });

    // Handle collapsible menu lists
    var collapsibleMenus = document.querySelectorAll(
      "ul.pages[data-collapsible]"
    );
    collapsibleMenus.forEach(function (menu) {
      var isCollapsible = menu.dataset.collapsible === "true";
      var categorySort = menu.dataset.categorySort;
      var isActive = menu.dataset.active === "true";

      if (isCollapsible) {
        menu.classList.add("collapse");
        if (isActive) {
          menu.classList.add("show");
        }
        if (categorySort) {
          menu.setAttribute("id", "category_" + categorySort);
        }
      }
    });
  });
})();

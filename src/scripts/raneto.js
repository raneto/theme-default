(function ($, hljs) {
  "use strict";

  var base_url = window.rn_base_url || "";

  var current_category;

  // Display a status message in the edit page alert bar
  function showEditStatus(message, alertClass) {
    var $status = $("#edit-status");
    $status.slideUp(function () {
      $status
        .text(message)
        .removeClass()
        .addClass("alert " + alertClass)
        .slideDown();
    });
  }

  // Extract the relative file path from the current URL
  function getRelativePath() {
    var pathname = window.location.pathname;
    var base_path = base_url.replace(window.location.origin, "");

    if (base_path && pathname.indexOf(base_path) === 0) {
      pathname = pathname.substring(base_path.length);
    }
    if (pathname.charAt(0) === "/") {
      pathname = pathname.substring(1);
    }
    return pathname;
  }

  // Reject paths containing traversal sequences
  function isValidPath(path) {
    var decoded = decodeURIComponent(path);
    return decoded.indexOf("..") === -1 && decoded.indexOf("\0") === -1;
  }

  function formatAjaxError(jqXHR) {
    return jqXHR.status
      ? "Error: " + jqXHR.status + " " + jqXHR.statusText
      : "Network error. Please check your connection.";
  }

  function handleAjaxError(jqXHR) {
    if (jqXHR.status === 403) {
      window.location = base_url + "/login";
      return;
    }
    Swal.fire({
      icon: "error",
      title: formatAjaxError(jqXHR),
      showConfirmButton: true,
    });
  }

  $(document).ready(function () {
    // Enable Highlighting and other
    // things when there is content
    if ($(".content").length) {
      // Syntax highlighting
      hljs.highlightAll();

      // Add Bootstrap styling to tables
      $(".content table").addClass("table");
    }

    // Modal: Add Page Confirm
    $("#add-page-confirm").click(function () {
      var name = $("#page-name").val().trim().replace(/\s+/g, "-");
      if (!name) return;
      $("#addModal").modal("hide");
      $.post(
        base_url + "/rn-add-page",
        {
          name: name,
          category: current_category,
        },
        function (data) {
          if (data.status === 0) {
            var redirect = [""];
            if (current_category !== "") {
              redirect.push(current_category);
            }
            redirect.push(name);
            redirect.push("edit");
            window.location = base_url + redirect.join("/");
          } else {
            Swal.fire({
              icon: "error",
              title: "Error adding page",
              showConfirmButton: true,
            });
          }
        }
      ).fail(handleAjaxError);
    });

    // Modal: Delete Page Confirm
    $("#delete-page-confirm").click(function () {
      var file_path = getRelativePath();

      if (!isValidPath(file_path)) return;

      $("#deleteModal").modal("hide");
      $.post(
        base_url + "/rn-delete",
        {
          file: decodeURI(file_path),
        },
        function (data) {
          if (data.status === 0) {
            window.location = base_url + "/";
          } else {
            Swal.fire({
              icon: "error",
              title: "Error deleting page",
              showConfirmButton: true,
            });
          }
        }
      ).fail(handleAjaxError);
    });

    // Add Page
    $(".add-page").click(function () {
      var $title = $(this).closest("h5");
      if ($title.data("isIndex")) {
        current_category = "";
      } else {
        current_category = $title
          .children()
          .eq(0)
          .text()
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-");
      }
    });

    // Make categories clickable to expand/collapse
    // Uses event delegation so collapse links created by init.js
    // don't need to exist at binding time
    $(document).on("click", "li.category", function (e) {
      // Don't trigger if clicking on a link, button, or input
      if (
        $(e.target).is("a, button, input, .add-page") ||
        $(e.target).closest("a, button, .add-page").length
      ) {
        return;
      }

      // Find the collapse toggle link in this category
      var collapseLink = $(this).find(
        ".category-title-text a[data-bs-toggle='collapse']"
      );
      if (collapseLink.length) {
        collapseLink[0].click();
      }
    });

    // New Category
    $("#newCategory").on("keydown", function (e) {
      if (e.key === "Enter") {
        var category = $(this).val().trim().toLowerCase().replace(/\s+/g, "-");
        if (!category) return;
        $.post(
          base_url + "/rn-add-category",
          {
            category: category,
          },
          function (_data) {
            location.reload();
          }
        ).fail(handleAjaxError);
      }
    });

    // Close Edit
    $(".close-edit").click(function () {
      // Remove the trailing "/edit"
      var the_arr = window.location.href.split("/");
      the_arr.pop();
      window.location = the_arr.join("/");
    });

    // Load translations (used for save status messages)
    var translations = null;
    $.getJSON(
      base_url + "/translations/" + $("html").prop("lang") + ".json",
      null,
      function (lang) {
        translations = lang;
      }
    ).fail(function () {
      // Translations are optional — fallback strings are used when null
    });

    // Save Page
    $(".save-page").click(function () {
      var pathname = getRelativePath();

      // Remove trailing /edit
      if (pathname.endsWith("/edit")) {
        pathname = pathname.substring(0, pathname.length - 5);
      }

      if (!isValidPath(pathname)) return;

      // Save CodeMirror content back to textarea
      var $textarea = $("#entry-markdown");
      var cmView = $textarea.data("cmView");
      if (cmView) {
        $textarea.val(cmView.state.doc.toString());
      }

      $.post(
        base_url + "/rn-edit",
        {
          file: decodeURI(pathname),
          content: $textarea.val(),
          meta_title: $("#entry-metainfo-title").val(),
          meta_description: $("#entry-metainfo-description").val(),
          meta_sort: $("#entry-metainfo-sort").val(),
        },
        function (data) {
          var savedMsg = translations
            ? translations.edit.pageSaved
            : "Page saved";
          var errorMsg = translations
            ? translations.edit.pageSaveError
            : "Error saving page";
          if (data.status === 0) {
            showEditStatus(savedMsg, "alert-success");
          } else {
            showEditStatus(errorMsg, "alert-warning");
          }
        }
      ).fail(function (jqXHR) {
        if (jqXHR.status === 403) {
          window.location = base_url + "/login";
          return;
        }
        showEditStatus(formatAjaxError(jqXHR), "alert-danger");
      });
    });
  });
})(jQuery, hljs);

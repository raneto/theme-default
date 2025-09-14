(function ($, hljs) {
  "use strict";

  var base_url = typeof rn_base_url === "undefined" ? "" : rn_base_url;

  var current_category;

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
      $("#addModal").modal("hide");
      var name = $("#page-name").val().replace(/\s+/g, "-");
      $.post(
        base_url + "/rn-add-page",
        {
          name: name,
          category: current_category,
        },
        function (data) {
          switch (data.status) {
            case 0:
              var redirect = [""];
              if (current_category !== "") {
                redirect.push(current_category);
              }
              redirect.push(name);
              redirect.push("edit");
              window.location = base_url + redirect.join("/");
              break;
          }
        }
      ).fail(function (data) {
        if (data.status === 403) {
          window.location = base_url + "/login";
        }
      });
    });

    // Modal: Delete Page Confirm
    $("#delete-page-confirm").click(function () {
      var pathname = window.location.pathname;
      var base_path = base_url.replace(window.location.origin, "");

      // Remove the base_path from the beginning of pathname if it exists
      var file_path = pathname;
      if (base_path && pathname.indexOf(base_path) === 0) {
        file_path = pathname.substring(base_path.length);
      }

      // Remove leading slash if present
      if (file_path.charAt(0) === "/") {
        file_path = file_path.substring(1);
      }

      $("#deleteModal").modal("hide");
      $.post(
        base_url + "/rn-delete",
        {
          file: decodeURI(file_path),
        },
        function (data) {
          switch (data.status) {
            case 0:
              window.location = base_url + "/";
              break;
          }
        }
      ).fail(function (data) {
        if (data.status === 403) {
          window.location = base_url + "/login";
        }
      });
    });

    // Add Page
    $(".add-page").click(function () {
      var text = $(this)
        .closest("h5")
        .children()
        .eq(0)
        .text()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
      current_category = text !== "main-articles" ? text : "";
    });

    // Make categories clickable to expand/collapse
    // Use setTimeout to ensure init.js has created the collapse links
    setTimeout(function () {
      $("li.category").on("click", function (e) {
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
    }, 100);

    // New Category
    $("#newCategory").keypress(function (e) {
      if (e.which === 13) {
        $.post(
          base_url + "/rn-add-category",
          {
            category: $(this).val().trim().toLowerCase().replace(/\s+/g, "-"),
          },
          function (_data) {
            location.reload();
          }
        ).fail(function (data) {
          if (data.status === 403) {
            window.location = base_url + "/login";
          }
        });
      }
    });

    // Close Edit
    $(".close-edit").click(function () {
      // Remove the trailing "/edit"
      var the_arr = window.location.href.split("/");
      the_arr.pop();
      window.location = the_arr.join("/");
    });

    // get translations first, then register save handlers
    $.getJSON(
      base_url + "/translations/" + $("html").prop("lang") + ".json",
      null,
      function (lang) {
        // Save Page
        $(".save-page").click(function () {
          // Get the current pathname and remove the base URL if present
          var pathname = window.location.pathname;
          var base_path = base_url.replace(window.location.origin, "");

          // Remove base path from pathname if it exists
          if (base_path && pathname.indexOf(base_path) === 0) {
            pathname = pathname.substring(base_path.length);
          }

          // Remove leading slash if present
          if (pathname.charAt(0) === "/") {
            pathname = pathname.substring(1);
          }

          // Remove trailing /edit
          if (pathname.endsWith("/edit")) {
            pathname = pathname.substring(0, pathname.length - 5);
          }

          // Save CodeMirror content back to textarea
          var $textarea = $("#entry-markdown");
          if ($textarea.next(".CodeMirror").length) {
            $textarea.next(".CodeMirror")[0].CodeMirror.save();
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
              switch (data.status) {
                case 0:
                  $("#edit-status").slideUp(function () {
                    $("#edit-status").text(lang.edit.pageSaved);
                    $("#edit-status").removeClass();
                    $("#edit-status").addClass("alert alert-success");
                    $("#edit-status").slideDown();
                  });
                  break;
                case 1:
                  $("#edit-status").slideUp(function () {
                    $("#edit-status").text(lang.edit.pageSaveError);
                    $("#edit-status").removeClass();
                    $("#edit-status").addClass("alert alert-warning");
                    $("#edit-status").slideDown();
                  });
                  break;
              }
            }
          ).fail(function (data) {
            if (data.status === 403) {
              window.location = base_url + "/login";
            }
          });
        });
      }
    );
  });
})(jQuery, hljs);

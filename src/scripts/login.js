jQuery(document).ready(function () {
  "use strict";

  var base_url = window.rn_base_url || "";

  // Focus on username field on load
  var usernameField = document.getElementById("form-username");
  if (usernameField) {
    usernameField.focus();
  }

  // Form validation
  $(
    '.login-form input[type="text"], .login-form input[type="password"], .login-form textarea'
  ).on("focus", function () {
    $(this).removeClass("input-error");
  });

  $(".login-form").on("submit", function (e) {
    e.preventDefault();

    $(this)
      .find('input[type="text"], input[type="password"], textarea')
      .each(function () {
        if ($(this).val() === "") {
          $(this).addClass("input-error");
        } else {
          $(this).removeClass("input-error");
        }
      });

    if ($(this).find(".input-error").length === 0) {
      $.post(base_url + "/rn-login", $(this).serialize(), function (data) {
        var success = data.status === 0;
        Swal.fire({
          icon: success ? "success" : "warning",
          title: data.message,
          timer: success ? 1000 : null,
          showConfirmButton: true,
        }).then(function () {
          if (success) {
            window.location = base_url + "/";
          }
        });
      }).fail(function (jqXHR) {
        var msg = jqXHR.status
          ? "Error: " + jqXHR.status + " " + jqXHR.statusText
          : "Network error. Please check your connection.";
        Swal.fire({
          icon: "error",
          title: msg,
          showConfirmButton: true,
        });
      });
    }
  });
});

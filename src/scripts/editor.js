(function ($, marked, CodeMirror) {
  "use strict";

  // Configure marked options for better markdown rendering
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // Initialize the markdown editor
  $(document).ready(function () {
    var $textarea = $("#entry-markdown");
    if (!$textarea.length) return;

    // Initialize CodeMirror with markdown mode
    var editor = CodeMirror.fromTextArea($textarea[0], {
      mode: "markdown",
      theme: "default",
      lineNumbers: true,
      lineWrapping: true,
      indentUnit: 2,
      tabSize: 2,
      indentWithTabs: false,
      autofocus: false,
      extraKeys: {
        Enter: "newlineAndIndentContinueMarkdownList",
        Tab: function (cm) {
          if (cm.somethingSelected()) {
            cm.indentSelection("add");
          } else {
            cm.replaceSelection("  ", "end");
          }
        },
        "Shift-Tab": function (cm) {
          cm.indentSelection("subtract");
        },
      },
    });

    // Update preview function
    function updatePreview() {
      var preview = $(".rendered-markdown");
      var markdown = editor.getValue();
      try {
        var html = marked.parse(markdown);
        preview.html(html);
      } catch (e) {
        preview.html(
          '<div class="alert alert-danger">Error parsing markdown: ' +
            e.message +
            "</div>"
        );
      }
      updateWordCount(markdown);
    }

    // Update word count
    function updateWordCount(text) {
      var wordCount = $(".entry-word-count");
      if (text && text.length) {
        var words = text.match(/\S+/g);
        wordCount.html((words ? words.length : 0) + " words");
      } else {
        wordCount.html("0 words");
      }
    }

    // Sync scroll between editor and preview
    function syncScroll() {
      var $source = $(".CodeMirror-scroll");
      var $target = $(".entry-preview-content");

      var sourceHeight = $source[0].scrollHeight - $source.outerHeight();
      var targetHeight = $target[0].scrollHeight - $target.outerHeight();

      if (sourceHeight > 0) {
        var ratio = targetHeight / sourceHeight;
        var position = $source.scrollTop() * ratio;
        $target.scrollTop(position);
      }
    }

    // Event handlers
    editor.on("change", function () {
      updatePreview();
    });

    $(".CodeMirror-scroll").on("scroll", function (e) {
      syncScroll();
      if ($(e.target).scrollTop() > 10) {
        $(".entry-markdown").addClass("scrolling");
      } else {
        $(".entry-markdown").removeClass("scrolling");
      }
    });

    $(".entry-preview-content").on("scroll", function (e) {
      if ($(e.target).scrollTop() > 10) {
        $(".entry-preview").addClass("scrolling");
      } else {
        $(".entry-preview").removeClass("scrolling");
      }
    });

    // Initial preview update
    updatePreview();

    // Store editor reference for save functionality
    // This maintains compatibility with existing save code
    $textarea.data("editor", editor);

    // Also store on the CodeMirror element for compatibility
    if ($textarea.next(".CodeMirror").length) {
      $textarea.next(".CodeMirror")[0].CodeMirror = editor;
    }
  });
})(jQuery, marked, CodeMirror);

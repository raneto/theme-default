import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
import { markdown, markdownKeymap } from "@codemirror/lang-markdown";

var $ = window.jQuery;
var marked = window.marked;

// Configure marked options for better markdown rendering
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
});

$(document).ready(function () {
  var $textarea = $("#entry-markdown");
  if (!$textarea.length) return;

  // Update preview function
  function updatePreview(doc) {
    var preview = $(".rendered-markdown");
    var text = doc.toString();
    try {
      var html = marked.parse(text);
      preview.html(html);
    } catch (e) {
      preview.html(
        '<div class="alert alert-danger">Error parsing markdown: ' +
          e.message +
          "</div>"
      );
    }
    updateWordCount(text);
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

  // Create CodeMirror 6 editor
  var view = new EditorView({
    doc: $textarea.val(),
    extensions: [
      basicSetup,
      markdown(),
      keymap.of([...markdownKeymap, indentWithTab]),
      EditorView.lineWrapping,
      EditorState.tabSize.of(2),
      EditorView.updateListener.of(function (update) {
        if (update.docChanged) {
          updatePreview(update.state.doc);
        }
      }),
    ],
    parent: $textarea[0].parentNode,
  });

  // Hide the original textarea
  $textarea.hide();

  // Store view instance for raneto.js save access
  $textarea.data("cmView", view);

  // Sync scroll between editor and preview
  function syncScroll() {
    var $source = $(".cm-scroller");
    var $target = $(".entry-preview-content");

    var sourceHeight = $source[0].scrollHeight - $source.outerHeight();
    var targetHeight = $target[0].scrollHeight - $target.outerHeight();

    if (sourceHeight > 0) {
      var ratio = targetHeight / sourceHeight;
      var position = $source.scrollTop() * ratio;
      $target.scrollTop(position);
    }
  }

  // Scroll event handlers
  $(document).on("scroll", ".cm-scroller", function (e) {
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
  updatePreview(view.state.doc);
});

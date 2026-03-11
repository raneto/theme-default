import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
import { markdown, markdownKeymap } from "@codemirror/lang-markdown";

var $ = window.jQuery;
var marked = window.marked;
var DOMPurify = window.DOMPurify;

// Configure marked for markdown rendering
marked.use({
  breaks: true,
  gfm: true,
});

$(document).ready(function () {
  var $textarea = $("#entry-markdown");
  if (!$textarea.length) return;

  // Cache selectors used in high-frequency event handlers
  var $preview = $(".rendered-markdown");
  var $wordCount = $(".entry-word-count");

  // Update preview function
  function updatePreview(doc) {
    var text = doc.toString();
    try {
      var html = DOMPurify.sanitize(marked.parse(text));
      $preview.html(html);
    } catch (e) {
      $preview
        .empty()
        .append(
          $('<div class="alert alert-danger"></div>').text(
            "Error parsing markdown: " + e.message
          )
        );
    }
    updateWordCount(text);
  }

  // Update word count
  function updateWordCount(text) {
    var words = text.match(/\S+/g);
    $wordCount.text((words ? words.length : 0) + " words");
  }

  // Build editor extensions
  var extensions = [
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
  ];

  // Pass CSP nonce so CodeMirror's injected <style> tags are allowed
  var cspNonce = window.rn_csp_nonce;
  if (cspNonce) {
    extensions.push(EditorView.cspNonce.of(cspNonce));
  }

  // Create CodeMirror 6 editor
  var view = new EditorView({
    doc: $textarea.val(),
    extensions: extensions,
    parent: $textarea[0].parentNode,
  });

  // Hide the original textarea
  $textarea.hide();

  // Store view instance for raneto.js save access
  $textarea.data("cmView", view);

  // Cache scroll-related selectors
  var $scroller = $(".cm-scroller");
  var $previewContent = $(".entry-preview-content");
  var $entryMarkdown = $(".entry-markdown");
  var $entryPreview = $(".entry-preview");

  // Sync scroll between editor and preview
  function syncScroll() {
    if (!$scroller.length || !$previewContent.length) return;

    var sourceHeight = $scroller[0].scrollHeight - $scroller.outerHeight();
    var targetHeight =
      $previewContent[0].scrollHeight - $previewContent.outerHeight();

    if (sourceHeight > 0) {
      var ratio = targetHeight / sourceHeight;
      var position = $scroller.scrollTop() * ratio;
      $previewContent.scrollTop(position);
    }
  }

  // Scroll event handlers
  $scroller.on("scroll", function () {
    syncScroll();
    $entryMarkdown.toggleClass("scrolling", $(this).scrollTop() > 10);
  });

  $previewContent.on("scroll", function (e) {
    $entryPreview.toggleClass("scrolling", $(e.target).scrollTop() > 10);
  });

  // Initial preview update
  updatePreview(view.state.doc);
});

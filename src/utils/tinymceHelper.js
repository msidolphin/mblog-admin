/**
 * Created by msidolphin on 2018/3/22.
 */
import tinymce from 'tinymce/tinymce'

export function getPreviewHtml(editor) {
  var previewHtml;
  var headHtml = '';
  var encode = editor.dom.encode;
  var contentStyle = $_988iewi6je5o2uiv.getContentStyle(editor);
  headHtml += '<base href="' + encode(editor.documentBaseURI.getURI()) + '">';
  if (contentStyle) {
    headHtml += '<style type="text/css">' + contentStyle + '</style>';
  }
  Tools.each(editor.contentCSS, function (url) {
    headHtml += '<link type="text/css" rel="stylesheet" href="' + encode(editor.documentBaseURI.toAbsolute(url)) + '">';
  });
  var bodyId = editor.settings.body_id || 'tinymce';
  if (bodyId.indexOf('=') !== -1) {
    bodyId = editor.getParam('body_id', '', 'hash');
    bodyId = bodyId[editor.id] || bodyId;
  }
  var bodyClass = editor.settings.body_class || '';
  if (bodyClass.indexOf('=') !== -1) {
    bodyClass = editor.getParam('body_class', '', 'hash');
    bodyClass = bodyClass[editor.id] || '';
  }
  var preventClicksOnLinksScript = '<script>' + 'document.addEventListener && document.addEventListener("click", function(e) {' + 'for (var elm = e.target; elm; elm = elm.parentNode) {' + 'if (elm.nodeName === "A") {' + 'e.preventDefault();' + '}' + '}' + '}, false);' + '</script> ';
  var dirAttr = editor.settings.directionality ? ' dir="' + editor.settings.directionality + '"' : '';
  previewHtml = '<!DOCTYPE html>' + '<html>' + '<head>' + headHtml + '</head>' + '<body id="' + encode(bodyId) + '" class="mce-content-body ' + encode(bodyClass) + '"' + encode(dirAttr) + '>' + editor.getContent() + preventClicksOnLinksScript + '</body>' + '</html>';
  return previewHtml;
};

export function injectIframeContent(editor, iframe, sandbox) {
  var previewHtml = getPreviewHtml(editor);
  if (!sandbox) {
    var doc = iframe.contentWindow.document;
    doc.open();
    doc.write(previewHtml);
    doc.close();
  } else {
    iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(previewHtml);
  }
};



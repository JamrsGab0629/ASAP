/**
 * The script that runs INSIDE the hidden web page. It loads pdf.js from two strings
 * (LIB_SOURCE and WORKER_SOURCE, defined by pdfPage.ts), receives the PDF in chunks,
 * and posts the text of each page back to the app.
 *
 * It is plain JavaScript in a string, so it must not contain backticks, "${" or "</script".
 */
export const PDF_GLUE = String.raw`
(function () {
  var engine = null;
  var parts = [];
  var received = 0;

  function post(message) {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  }

  function fail(error) {
    post({ type: 'error', message: String((error && error.message) || error) });
  }

  // pdf.js gives text pieces with positions. Rebuild lines from them.
  function pageText(items) {
    var out = '';
    var lastY = null;
    var lastEnd = null;
    items.forEach(function (item) {
      if (typeof item.str !== 'string') return;
      var x = item.transform[4];
      var y = item.transform[5];
      var height = Math.abs(item.transform[3]) || item.height || 10;
      if (lastY !== null && Math.abs(y - lastY) > height * 0.5) {
        out += '\n';
        lastEnd = null;
      } else if (lastEnd !== null && x - lastEnd > height * 0.15 && !/\s$/.test(out) && !/^\s/.test(item.str)) {
        out += ' ';
      }
      out += item.str;
      lastY = y;
      lastEnd = x + (item.width || 0);
      if (item.hasEOL) {
        out += '\n';
        lastY = null;
        lastEnd = null;
      }
    });
    return out;
  }

  function decode(base64) {
    var binary = atob(base64);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  async function extract(bytes) {
    var loading = engine.getDocument({ data: bytes, useWorkerFetch: false, isEvalSupported: false, verbosity: 0 });
    var pdf = await loading.promise;
    for (var number = 1; number <= pdf.numPages; number++) {
      var page = await pdf.getPage(number);
      var content = await page.getTextContent();
      post({ type: 'page', page: number, total: pdf.numPages, text: pageText(content.items) });
      page.cleanup();
    }
    post({ type: 'done' });
    await loading.destroy();
  }

  // The app sends the file as base64 pieces: window.__chunk(index, total, text).
  window.__chunk = function (index, total, data) {
    parts[index] = data;
    received++;
    if (received < total) return;
    var all = parts.join('');
    parts = [];
    received = 0;
    extract(decode(all)).catch(fail);
  };

  function asModule(source) {
    return import(URL.createObjectURL(new Blob([source], { type: 'text/javascript' })));
  }

  asModule(WORKER_SOURCE)
    .then(function (worker) {
      globalThis.pdfjsWorker = worker; // lets pdf.js run without a separate worker thread
      return asModule(LIB_SOURCE);
    })
    .then(function (lib) {
      engine = lib;
      post({ type: 'ready' });
    })
    .catch(fail);
})();
`;
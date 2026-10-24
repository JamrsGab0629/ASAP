import { PDF_GLUE } from './pdfGlue';

/** A string that is safe to place inside an inline <script>. */
const embed = (source: string) => JSON.stringify(source).replace(/</g, '\\u003c');

/** The whole hidden web page: the two pdf.js files as strings, then the glue script. */
export function buildPdfPage(libSource: string, workerSource: string): string {
  return (
    '<!doctype html><html><head><meta charset="utf-8"></head><body>' +
    `<script>var LIB_SOURCE=${embed(libSource)};var WORKER_SOURCE=${embed(workerSource)};</script>` +
    `<script>${PDF_GLUE}</script>` +
    '</body></html>'
  );
}
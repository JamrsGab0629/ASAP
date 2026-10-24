import { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import type { PdfPage } from './cleanPdfText';
import { PDF_LIB_SOURCE, PDF_WORKER_SOURCE } from './pdfAssets.generated';
import { registerPdfHost } from './pdfEngine';
import { buildPdfPage } from './pdfPage';

type WebMessage =
  | { type: 'ready' }
  | { type: 'page'; page: number; total: number; text: string }
  | { type: 'done' }
  | { type: 'error'; message: string };

type Job = { pages: PdfPage[]; finish: (error?: Error) => void };

type Ready = { promise: Promise<void>; resolve: () => void; reject: (error: Error) => void };

const CHUNK_CHARS = 262_144; // a multiple of 4, so base64 pieces join back together
const BOOT_TIMEOUT_MS = 30_000;
const JOB_TIMEOUT_MS = 120_000;
const BASE_URL = 'https://asap.local/';

function createReady(): Ready {
  let resolve: () => void = () => {};
  let reject: (error: Error) => void = () => {};
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  promise.catch(() => {}); // nobody may be waiting yet
  return { promise, resolve, reject };
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (error) => { clearTimeout(timer); reject(error); },
    );
  });
}

/** An invisible web page that reads PDFs. Mount it while importing; it removes itself when unmounted. */
export function PdfEngineHost() {
  const web = useRef<WebView>(null);
  const job = useRef<Job | null>(null);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const [ready] = useState(createReady);
  const html = useMemo(() => buildPdfPage(PDF_LIB_SOURCE, PDF_WORKER_SOURCE), []);

  useEffect(() => {
    const run = async (base64: string): Promise<PdfPage[]> => {
      await withTimeout(ready.promise, BOOT_TIMEOUT_MS, "The PDF reader didn't start.");
      const viewer = web.current;
      if (!viewer || base64.length === 0) throw new Error('The PDF could not be sent to the reader.');

      return new Promise<PdfPage[]>((resolve, reject) => {
        const pages: PdfPage[] = [];
        let timer: ReturnType<typeof setTimeout> | undefined;
        const finish = (error?: Error) => {
          clearTimeout(timer);
          job.current = null;
          if (error) reject(error);
          else resolve(pages);
        };
        timer = setTimeout(() => finish(new Error('Reading this PDF took too long.')), JOB_TIMEOUT_MS);
        job.current = { pages, finish };

        const total = Math.ceil(base64.length / CHUNK_CHARS);
        for (let i = 0; i < total; i++) {
          const part = base64.slice(i * CHUNK_CHARS, (i + 1) * CHUNK_CHARS);
          viewer.injectJavaScript(`window.__chunk(${i},${total},${JSON.stringify(part)});true;`);
        }
      });
    };

    // One PDF at a time.
    return registerPdfHost({
      extract: (base64) => {
        const next = queue.current.then(() => run(base64));
        queue.current = next.catch(() => undefined);
        return next;
      },
    });
  }, [ready]);

  const onMessage = (event: WebViewMessageEvent) => {
    let message: WebMessage;
    try {
      message = JSON.parse(event.nativeEvent.data) as WebMessage;
    } catch {
      return;
    }
    switch (message.type) {
      case 'ready':
        ready.resolve();
        break;
      case 'page':
        job.current?.pages.push({ page: message.page, text: message.text });
        break;
      case 'done':
        job.current?.finish();
        break;
      case 'error': {
        const error = new Error(message.message);
        if (job.current) job.current.finish(error);
        else ready.reject(error);
        break;
      }
    }
  };

  return (
    <View pointerEvents="none" style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}>
      <WebView
        ref={web}
        originWhitelist={['*']}
        source={{ html, baseUrl: BASE_URL }}
        javaScriptEnabled
        onMessage={onMessage}
        onError={() => {
          const error = new Error("The PDF reader couldn't load.");
          if (job.current) job.current.finish(error);
          else ready.reject(error);
        }}
        onRenderProcessGone={() => job.current?.finish(new Error('The PDF reader ran out of memory. Try a smaller file.'))}
        style={{ width: 1, height: 1 }}
      />
    </View>
  );
}
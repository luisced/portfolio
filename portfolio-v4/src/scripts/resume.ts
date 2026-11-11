import { boundedZoom, latestOnly, shareViewer } from '@/lib/resume-controls.mjs';
import workerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
const root = document.querySelector<HTMLElement>('[data-pdf-viewer]')!;
const pane = root.querySelector<HTMLElement>('[data-pdf-pane]')!;
const find = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
const es = root.dataset.locale === 'es';
const message = find('[data-message]');
const zoom = find('output[data-zoom]');
const pageLabel = find('output[data-page]');
const minus = find<HTMLButtonElement>('[data-zoom-out]');
const plus = find<HTMLButtonElement>('[data-zoom-in]');
const fit = find<HTMLButtonElement>('[data-fit]');
const prev = find<HTMLButtonElement>('[data-prev]');
const next = find<HTMLButtonElement>('[data-next]');
let pdf: PDFDocumentProxy;
let scale = 1;
let pageNumber = 1;
let fitting = true;
let task: RenderTask | undefined;
const revisions = latestOnly();
function failure() {
  root.dataset.pdfStatus = 'error';
  message.textContent = es ? 'No se pudo mostrar el PDF. Abre o descarga el archivo con los enlaces de arriba.' : 'Could not display the PDF. Open or download the file using the links above.';
}
async function render() {
  const revision = revisions.next();
  task?.cancel();
  root.dataset.pdfStatus = 'loading';
  message.textContent = es ? 'Cargando página…' : 'Loading page…';
  try {
    const page = await pdf.getPage(pageNumber);
    if (!revisions.current(revision)) return;
    const base = page.getViewport({ scale: 1 });
    if (fitting) scale = Math.min(3, (pane.clientWidth - 16) / base.width);
    const viewport = page.getViewport({ scale });
    // At most 4 million pixels and 4096 pixels on either axis per canvas.
    const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(4_000_000 / (viewport.width * viewport.height)), 4096 / viewport.width, 4096 / viewport.height);
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width * dpr);
    canvas.height = Math.floor(viewport.height * dpr);
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', `${es ? 'Página' : 'Page'} ${pageNumber}, ${es ? 'texto disponible debajo' : 'text available below'}`);
    task = page.render({ canvas, viewport, transform: [dpr, 0, 0, dpr, 0, 0] });
    await task.promise;
    if (!revisions.current(revision)) return;
    const content = await page.getTextContent();
    if (!revisions.current(revision)) return;
    find('[data-pdf-text]').textContent = content.items.map(item => 'str' in item ? item.str + (item.hasEOL ? '\n' : ' ') : '').join('');
    find('[data-text-panel]').hidden = false;
    pane.replaceChildren(canvas);
    root.dataset.pdfStatus = 'ready';
    root.dataset.pdfScale = String(scale);
    root.dataset.pdfPage = String(pageNumber);
    root.dataset.pdfPages = String(pdf.numPages);
    zoom.textContent = `${Math.round(scale * 100)}%`;
    pageLabel.textContent = `${es ? 'Página' : 'Page'} ${pageNumber} / ${pdf.numPages}`;
    minus.disabled = scale <= .25;
    plus.disabled = scale >= 3;
    fit.disabled = false;
    prev.disabled = pageNumber <= 1;
    next.disabled = pageNumber >= pdf.numPages;
    message.textContent = '';
  } catch (error) {
    if (revisions.current(revision) && (error as Error).name !== 'RenderingCancelledException') failure();
  }
}
minus.onclick = () => { fitting = false; scale = boundedZoom(scale / 1.25); void render(); };
plus.onclick = () => { fitting = false; scale = boundedZoom(scale * 1.25); void render(); };
fit.onclick = () => { fitting = true; pane.scrollLeft = 0; void render(); };
prev.onclick = () => { pageNumber = Math.max(1, pageNumber - 1); void render(); };
next.onclick = () => { pageNumber = Math.min(pdf.numPages, pageNumber + 1); void render(); };
find<HTMLButtonElement>('[data-share]').onclick = async () => {
  const result = await shareViewer(navigator, new URL(root.dataset.viewerPath!, location.origin).href);
  find('[data-share-message]').textContent = result === 'copied' ? (es ? 'Enlace copiado.' : 'Link copied.') : result === 'error' ? (es ? 'No se pudo copiar. Copia la dirección de esta página.' : 'Could not copy. Copy this page address.') : '';
};
let resizeTimer: ReturnType<typeof setTimeout>;
let previousWidth = pane.clientWidth;
new ResizeObserver(() => {
  if (pane.clientWidth === previousWidth) return;
  previousWidth = pane.clientWidth;
  clearTimeout(resizeTimer);
  if (pdf && fitting) resizeTimer = setTimeout(() => void render(), 100);
}).observe(pane);
async function start() {
  try {
    const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist/legacy/build/pdf.mjs');
    GlobalWorkerOptions.workerSrc = workerUrl;
    // Glyph paths use the actual embedded fonts without requiring blob: font CSP.
    const options = { url: '/resumee.pdf', isEvalSupported: false, useWasm: false, disableFontFace: true };
    pdf = await getDocument(options).promise;
    await render();
  } catch { failure(); }
}
void start();

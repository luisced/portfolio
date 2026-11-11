export const boundedZoom = value => Math.min(3, Math.max(0.25, value));
export function latestOnly() {
  let revision = 0;
  return { next: () => ++revision, current: value => value === revision };
}
export async function shareViewer(nav, url) {
  if (nav.share) {
    try { await nav.share({ title: 'Luis Cedillo | CV', url }); return 'shared'; }
    catch (error) { if (error?.name === 'AbortError') return 'cancelled'; }
  }
  try {
    if (!nav.clipboard?.writeText) return 'error';
    await nav.clipboard.writeText(url);
    return 'copied';
  } catch { return 'error'; }
}

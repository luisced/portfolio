// The contact form, a postcard (backend ported from V4): validates as you go, posts to /api/contact, gets postmarked when it goes out, and keeps the draft if sending fails.
const form = document.querySelector('[data-contact]');
if (form) {
  const submit = form.querySelector('[data-submit]'), text = form.querySelector('[data-submit-label]'), actions = form.querySelector('[data-actions]'), ok = form.querySelector('[data-ok]'), bad = form.querySelector('[data-bad]');
  const badDefault = bad.querySelector('[data-bad-default]'), badRate = bad.querySelector('[data-bad-rate]');
  const fields = [...form.querySelectorAll('[required]')], message = form.querySelector('textarea'), count = form.querySelector('[data-count]');
  const label = text.textContent, EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, touched = new WeakSet();

  const setError = (field, text) => {
    const el = document.getElementById(field.id + '-error');
    el.textContent = text; el.hidden = !text;
    if (text) field.setAttribute('aria-invalid', 'true'); else field.removeAttribute('aria-invalid');
  };
  const errorOf = (field) => {
    const v = field.value.trim();
    if (!v) return form.dataset.msgRequired;
    if (field.type === 'email' && !EMAIL.test(v)) return form.dataset.msgEmail;
    if (field.minLength > 0 && v.length < field.minLength) return form.dataset.msgMinlength;
    return '';
  };
  const check = (field) => { const e = errorOf(field); setError(field, e); return !e; };
  const tally = () => { count.textContent = message.value.length + ' / ' + message.maxLength; };
  for (const field of fields) {
    field.addEventListener('blur', () => { touched.add(field); check(field); });
    field.addEventListener('input', () => { if (touched.has(field)) check(field); if (field === message) tally(); });
  }
  tally();
  /* the postmark carries today's date, in the visitor's language */
  const stampDate = () => {
    const parts = new Intl.DateTimeFormat(form.dataset.locale || 'en', { day: '2-digit', month: 'short', year: 'numeric' }).formatToParts(new Date());
    const get = (type) => (parts.find((p) => p.type === type) || { value: '' }).value;
    form.querySelector('[data-mark-day]').textContent = (get('day') + ' ' + get('month').replace('.', '')).toUpperCase();
    form.querySelector('[data-mark-year]').textContent = get('year');
  };
  stampDate();
  let widget;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    ok.hidden = bad.hidden = true;
    let first = null;
    for (const field of fields) { touched.add(field); if (!check(field) && !first) first = field; }
    if (first) return first.focus();
    form.setAttribute('aria-busy', 'true'); submit.disabled = true; text.textContent = form.dataset.sending;
    let rate = false;
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const out = await res.json().catch(() => null);
      if (!res.ok || !out || !out.ok) { rate = res.status === 429 || (out && out.error === 'rate_limit'); throw new Error(); }
      /* sent: what was written stays on the card, the postmark lands on the stamp and the button gives way to the receipt */
      for (const el of form.querySelectorAll('input:not([type="hidden"]), textarea')) el.readOnly = true;
      stampDate(); actions.hidden = true; form.classList.add('sent'); ok.hidden = false; ok.focus({ preventScroll: true });
      form.scrollIntoView({ block: matchMedia('(max-width: 720px)').matches ? 'start' : 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    } catch {
      badDefault.hidden = rate; badRate.hidden = !rate; bad.hidden = false; bad.focus();
      if (widget !== undefined && window.turnstile) window.turnstile.reset(widget); /* a Turnstile token only works once */
    } finally {
      form.removeAttribute('aria-busy'); submit.disabled = false; text.textContent = label;
    }
  });

  /* Turnstile loads only when the form is first seen */
  const box = form.querySelector('.cf-turnstile');
  if (box && box.dataset.sitekey) {
    const render = () => { if (window.turnstile) widget = window.turnstile.render(box, { sitekey: box.dataset.sitekey, theme: 'light', size: 'flexible' }); };
    new IntersectionObserver((entries, io) => {
      if (!entries.some((x) => x.isIntersecting)) return;
      io.disconnect();
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; s.async = true;
      s.addEventListener('load', render, { once: true });
      document.head.append(s);
    }).observe(form);
  }
}

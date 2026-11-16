// The contact form (ported from V4): validates as you go, posts to /api/contact, and keeps the draft if sending fails.
const form = document.querySelector('[data-contact]');
if (form) {
  const submit = form.querySelector('[data-submit]'), ok = document.querySelector('[data-ok]'), bad = document.querySelector('[data-bad]');
  const badDefault = bad.querySelector('[data-bad-default]'), badRate = bad.querySelector('[data-bad-rate]');
  const fields = [...form.querySelectorAll('[required]')], message = form.querySelector('textarea'), count = form.querySelector('[data-count]');
  const label = submit.textContent, EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, touched = new WeakSet();

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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    ok.hidden = bad.hidden = true;
    let first = null;
    for (const field of fields) { touched.add(field); if (!check(field) && !first) first = field; }
    if (first) return first.focus();
    form.setAttribute('aria-busy', 'true'); submit.disabled = true; submit.textContent = form.dataset.sending;
    let rate = false;
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const out = await res.json().catch(() => null);
      if (!res.ok || !out || !out.ok) { rate = res.status === 429 || (out && out.error === 'rate_limit'); throw new Error(); }
      form.hidden = true; ok.hidden = false; ok.focus();
    } catch {
      badDefault.hidden = rate; badRate.hidden = !rate; bad.hidden = false; bad.focus();
    } finally {
      form.removeAttribute('aria-busy'); submit.disabled = false; submit.textContent = label;
    }
  });

  /* Turnstile loads only when the form is first seen */
  const box = form.querySelector('.cf-turnstile');
  if (box && box.dataset.sitekey) {
    const render = () => window.turnstile && window.turnstile.render(box, { sitekey: box.dataset.sitekey, theme: 'dark', size: 'flexible' });
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

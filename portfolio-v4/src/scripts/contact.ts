export {};

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: { sitekey: string; theme: 'auto'; size: 'flexible' },
  ) => unknown;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const form = document.querySelector<HTMLFormElement>('[data-contact]');
if (form) {
  const submit = form.querySelector<HTMLButtonElement>('[data-contact-submit]');
  const status = document.querySelector<HTMLElement>('[data-contact-status]');
  const success = document.querySelector<HTMLElement>('[data-contact-success]');
  const failure = document.querySelector<HTMLElement>('[data-contact-error]');
  const note = form.closest<HTMLElement>('.contact__note');
  const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]')];
  const initialLabel = submit?.textContent?.trim() ?? '';
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setError = (field: HTMLInputElement | HTMLTextAreaElement, message: string) => {
    const error = document.getElementById(`${field.id}-error`);
    if (error) {
      error.textContent = message;
      error.hidden = !message;
    }
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  };

  const validate = () => {
    let firstInvalid: HTMLInputElement | HTMLTextAreaElement | undefined;
    for (const field of fields) {
      const value = field.value.trim();
      const message = !value
        ? form.dataset.msgRequired ?? ''
        : field.type === 'email' && !emailPattern.test(value)
          ? form.dataset.msgEmail ?? ''
          : field.minLength > 0 && field.value.length < field.minLength
            ? form.dataset.msgMinlength ?? ''
            : '';
      setError(field, message);
      if (message && !firstInvalid) firstInvalid = field;
    }
    firstInvalid?.focus();
    return !firstInvalid;
  };

  fields.forEach((field) =>
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') setError(field, '');
    }),
  );

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    failure?.setAttribute('hidden', '');
    if (!validate() || !submit) return;
    submit.disabled = true;
    submit.textContent = form.dataset.sending ?? initialLabel;
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
      if (!response.ok || !result?.ok) throw new Error();
      form.hidden = true;
      success?.removeAttribute('hidden');
      note?.classList.add('is-pinned');
      if (status) status.textContent = success?.querySelector('h3')?.textContent ?? '';
    } catch {
      failure?.removeAttribute('hidden');
      if (status) {
        status.textContent = failure?.querySelector('h3')?.textContent ?? '';
        status.focus();
      }
      submit.disabled = false;
      submit.textContent = initialLabel;
    }
  });

  const turnstile = form.querySelector<HTMLElement>('.cf-turnstile');
  const sitekey = turnstile?.dataset.sitekey?.trim();
  if (turnstile && sitekey) {
    const render = () => window.turnstile?.render(turnstile, { sitekey, theme: 'auto', size: 'flexible' });
    const load = () => {
      if (window.turnstile) return render();
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.addEventListener('load', render, { once: true });
      document.head.append(script);
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          load();
        }
      });
      observer.observe(form);
    } else load();
  }
}

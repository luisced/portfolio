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
  const status = form.querySelector<HTMLElement>('[data-contact-status]');
  const success = document.querySelector<HTMLElement>('[data-contact-success]');
  const failure = document.querySelector<HTMLElement>('[data-contact-error]');
  const defaultError = failure?.querySelector<HTMLElement>('[data-contact-error-default]');
  const rateLimitError = failure?.querySelector<HTMLElement>('[data-contact-error-rate-limit]');
  const note = form.closest<HTMLElement>('.contact__note');
  const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]')];
  const messageField = form.querySelector<HTMLTextAreaElement>('#contact-message');
  const messageCount = form.querySelector<HTMLElement>('[data-message-count]');
  const initialMarkup = submit?.innerHTML ?? '';
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const touched = new WeakSet<HTMLInputElement | HTMLTextAreaElement>();

  const setError = (field: HTMLInputElement | HTMLTextAreaElement, message: string) => {
    const error = document.getElementById(`${field.id}-error`);
    if (error) {
      error.textContent = message;
      error.hidden = !message;
    }
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  };

  const getError = (field: HTMLInputElement | HTMLTextAreaElement) => {
    const value = field.value.trim();
    if (!value) return form.dataset.msgRequired ?? '';
    if (field.type === 'email' && !emailPattern.test(value)) return form.dataset.msgEmail ?? '';
    if (field.minLength > 0 && value.length < field.minLength) return form.dataset.msgMinlength ?? '';
    return '';
  };

  const validateField = (field: HTMLInputElement | HTMLTextAreaElement) => {
    const message = getError(field);
    setError(field, message);
    return !message;
  };

  const validate = () => {
    let firstInvalid: HTMLInputElement | HTMLTextAreaElement | undefined;
    for (const field of fields) {
      touched.add(field);
      if (!validateField(field) && !firstInvalid) firstInvalid = field;
    }
    firstInvalid?.focus();
    return !firstInvalid;
  };

  const updateMessageCount = () => {
    if (messageField && messageCount) messageCount.textContent = `${messageField.value.length} / ${messageField.maxLength}`;
  };

  fields.forEach((field) => {
    field.addEventListener('blur', () => {
      touched.add(field);
      validateField(field);
    });
    field.addEventListener('input', () => {
      if (touched.has(field)) validateField(field);
      if (field === messageField) updateMessageCount();
    });
  });
  updateMessageCount();

  const setStatus = (message: string) => {
    if (!status) return;
    status.textContent = message;
    status.hidden = !message;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    failure?.setAttribute('hidden', '');
    success?.setAttribute('hidden', '');
    setStatus('');
    if (!validate() || !submit) return;

    form.setAttribute('aria-busy', 'true');
    submit.disabled = true;
    submit.textContent = form.dataset.sending ?? '';
    setStatus(form.dataset.sending ?? '');
    let rateLimited = false;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !result?.ok) {
        rateLimited = response.status === 429 || result?.error === 'rate_limit';
        throw new Error();
      }

      form.hidden = true;
      setStatus('');
      success?.removeAttribute('hidden');
      note?.classList.add('is-pinned');
      success?.focus();
    } catch {
      defaultError?.toggleAttribute('hidden', rateLimited);
      rateLimitError?.toggleAttribute('hidden', !rateLimited);
      failure?.removeAttribute('hidden');
      setStatus('');
      failure?.focus();
    } finally {
      form.removeAttribute('aria-busy');
      submit.disabled = false;
      submit.innerHTML = initialMarkup;
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

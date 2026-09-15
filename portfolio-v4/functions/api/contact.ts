import { ui, type Locale } from '../../src/i18n/ui';

type PagesFunction<E> = (ctx: { request: Request; env: E }) => Promise<Response>;

type Env = {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET: string;
  CONTACT_TO: string;
  CONTACT_FROM: string;
};

type JsonResult = { ok: true } | { ok: false; error: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function text(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

function jsonResponse(result: JsonResult, status: number) {
  return new Response(JSON.stringify(result), {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => htmlEntities[character] ?? character);
}

function htmlResponse(locale: Locale, ok: boolean, contactTo: string, status: number) {
  const copy = ui[locale];
  const title = ok ? copy['contact.success.title'] : copy['contact.error.title'];
  const body = ok
    ? escapeHtml(copy['contact.success.body'])
    : `${escapeHtml(copy['contact.error.body'])} <a href="mailto:${escapeHtml(contactTo)}">${escapeHtml(contactTo)}</a>.`;
  const back = locale === 'es' ? '/es/#contact' : '/#contact';
  const markup = `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(title)}</title></head><body><main><h1>${escapeHtml(title)}</h1><p>${body}</p><a href="${back}">${escapeHtml(copy['notFound.home'])}</a></main></body></html>`;
  return new Response(markup, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}

function respond(request: Request, locale: Locale, ok: boolean, status: number, error: string, contactTo: string) {
  if (request.headers.get('Accept')?.includes('application/json')) {
    return jsonResponse(ok ? { ok: true } : { ok: false, error }, status);
  }
  return htmlResponse(locale, ok, contactTo, status);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let fields: FormData;
  try {
    fields = await request.formData();
  } catch {
    return respond(request, 'en', false, 400, 'invalid_form', env.CONTACT_TO ?? '');
  }

  const locale: Locale = text(fields.get('locale')) === 'es' ? 'es' : 'en';
  const contactTo = env.CONTACT_TO?.trim() ?? '';

  // Workers isolates do not share module state, so Turnstile + the honeypot are the spam controls here.
  if (text(fields.get('company'))) return respond(request, locale, true, 200, '', contactTo);

  const name = text(fields.get('name'));
  const email = text(fields.get('email'));
  const message = text(fields.get('message'));
  if (!name || !email || !message || message.length < 20 || !emailPattern.test(email)) {
    return respond(request, locale, false, 400, 'invalid_form', contactTo);
  }

  const turnstileToken = text(fields.get('cf-turnstile-response'));
  const turnstileSecret = env.TURNSTILE_SECRET?.trim() ?? '';
  if (turnstileToken || turnstileSecret) {
    if (!turnstileSecret || !turnstileToken) {
      return respond(request, locale, false, 400, 'turnstile', contactTo);
    }
    try {
      const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret: turnstileSecret, response: turnstileToken }),
      });
      if (!verification.ok || !(await verification.json() as { success?: boolean }).success) {
        return respond(request, locale, false, 400, 'turnstile', contactTo);
      }
    } catch {
      return respond(request, locale, false, 400, 'turnstile', contactTo);
    }
  }

  const apiKey = env.RESEND_API_KEY?.trim() ?? '';
  const contactFrom = env.CONTACT_FROM?.trim() ?? '';
  if (!apiKey || !contactTo || !contactFrom) {
    return respond(request, locale, false, 500, 'delivery', contactTo);
  }

  try {
    const delivery = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: contactFrom,
        to: [contactTo],
        reply_to: email,
        subject: `Note from ${name.replace(/[\r\n]/g, ' ')} — luiscedillo.com`,
        text: `${name}\n${email}\n\n${message}`,
      }),
    });
    if (!delivery.ok) return respond(request, locale, false, 502, 'delivery', contactTo);
  } catch {
    return respond(request, locale, false, 502, 'delivery', contactTo);
  }

  return respond(request, locale, true, 200, '', contactTo);
};

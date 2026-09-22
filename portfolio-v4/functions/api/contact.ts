import { ui, type Locale } from '../../src/i18n/ui';

type PagesFunction<E> = (ctx: { request: Request; env: E }) => Promise<Response>;

type ContactRateLimiter = {
  limit: (options: { key: string }) => Promise<{ success: boolean }>;
};

type Env = {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET: string;
  CONTACT_TO: string;
  CONTACT_FROM: string;
  CONTACT_RATE_LIMITER?: ContactRateLimiter;
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

function contactEmailHtml(name: string, email: string, message: string) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>New portfolio message</title>
  </head>
  <body style="margin:0;padding:0;background:#e9e8df;color:#171717;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${safeName} sent a new message through luiscedillo.com.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#e9e8df;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#f7f7f2;border:1px solid #171717;">
            <tr>
              <td style="padding:18px 24px;background:#171717;color:#f7f7f2;font:700 11px/1.4 'Courier New',monospace;letter-spacing:1.4px;text-transform:uppercase;">
                LUIS CEDILLO&nbsp;&nbsp;/&nbsp;&nbsp;PORTFOLIO CONTACT
              </td>
            </tr>
            <tr><td style="height:8px;background:#f5a6c2;font-size:0;line-height:0;">&nbsp;</td></tr>
            <tr>
              <td style="padding:48px 40px 16px;">
                <p style="margin:0 0 14px;color:#66665f;font:700 11px/1.4 'Courier New',monospace;letter-spacing:1.3px;text-transform:uppercase;">INCOMING / NEW NOTE</p>
                <h1 style="margin:0;font:700 48px/.96 Arial,Helvetica,sans-serif;letter-spacing:-2.4px;">A new idea<br>just landed.</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 40px 12px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="padding:0 0 8px;color:#66665f;font:700 10px/1.4 'Courier New',monospace;letter-spacing:1.2px;text-transform:uppercase;">FROM</td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 4px;font:700 24px/1.2 Arial,Helvetica,sans-serif;">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 24px;"><a href="mailto:${safeEmail}" style="color:#171717;font:15px/1.5 'Courier New',monospace;text-decoration:underline;">${safeEmail}</a></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 36px;">
                <div style="padding:28px;border-left:6px solid #f5a6c2;background:#ffffff;font:17px/1.65 Arial,Helvetica,sans-serif;">${safeMessage}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 48px;">
                <a href="mailto:${safeEmail}" style="display:inline-block;padding:15px 22px;background:#171717;color:#f7f7f2;font:700 12px/1 'Courier New',monospace;letter-spacing:1px;text-decoration:none;text-transform:uppercase;">REPLY TO ${safeName}&nbsp;&nbsp;→</a>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 24px;border-top:1px solid #aaa9a0;color:#66665f;font:10px/1.5 'Courier New',monospace;letter-spacing:.8px;text-transform:uppercase;">
                Sent securely via luiscedillo.com / Resend
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
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

  const forwardedFor = request.headers.get('CF-Connecting-IP')
    ?? request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim()
    ?? 'unknown';
  if (env.CONTACT_RATE_LIMITER) {
    try {
      const { success } = await env.CONTACT_RATE_LIMITER.limit({ key: `contact:${forwardedFor}` });
      if (!success) return respond(request, locale, false, 429, 'rate_limit', contactTo);
    } catch {
      return respond(request, locale, false, 503, 'delivery', contactTo);
    }
  }

  const name = text(fields.get('name'));
  const email = text(fields.get('email'));
  const message = text(fields.get('message'));
  if (
    !name
    || name.length > 100
    || !email
    || email.length > 254
    || !message
    || message.length < 20
    || message.length > 5000
    || !emailPattern.test(email)
  ) {
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
        subject: `New note from ${name.replace(/[\r\n]/g, ' ')} / luiscedillo.com`,
        text: `NEW PORTFOLIO MESSAGE\n\nFrom: ${name}\nEmail: ${email}\n\n${message}\n\nReply directly to this email to continue the conversation.`,
        html: contactEmailHtml(name, email, message),
      }),
    });
    if (!delivery.ok) return respond(request, locale, false, 502, 'delivery', contactTo);
  } catch {
    return respond(request, locale, false, 502, 'delivery', contactTo);
  }

  return respond(request, locale, true, 200, '', contactTo);
};

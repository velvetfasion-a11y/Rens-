import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createTransport } from "nodemailer";

const FROM = "RENSÉ <hello@rense.se>";
const SHOP = "hello@rense.se";

type MailCreds = { host?: string; user?: string; pass?: string };

function creds(): { host: string; user: string; pass: string } {
  const fromEnv = process.env.ZOHO_APP_PASSWORD?.trim();
  if (fromEnv) {
    return {
      host: process.env.ZOHO_SMTP_HOST?.trim() || "smtp.zoho.eu",
      user: process.env.ZOHO_SMTP_USER?.trim() || SHOP,
      pass: fromEnv,
    };
  }
  const parsed = JSON.parse(
    readFileSync(join(process.cwd(), ".secrets", "zoho-mail.json"), "utf8"),
  ) as MailCreds;
  if (!parsed.pass || !parsed.user) throw new Error("The receipt could not be sent. Try again.");
  return {
    host: parsed.host?.trim() || "smtp.zoho.eu",
    user: parsed.user.trim(),
    pass: parsed.pass,
  };
}

export async function sendOrderMail(input: {
  customerEmail: string;
  customerName: string;
  address: string;
  postal: string;
  city: string;
  country: string;
  qty: number;
  goods: number;
  delivery: number;
  total: number;
  method: string;
  days: string | null;
  receipt: string;
  shopText: string;
}) {
  const { host, user, pass } = creds();
  const transport = createTransport({
    host,
    port: 465,
    secure: true,
    auth: { user, pass },
  });
  const journal = {
    filename: "journal-cover-clear.jpg",
    path: join(process.cwd(), "public", "images", "journal-cover-clear.jpg"),
    cid: "journal",
  };
  await transport.sendMail({
    from: FROM,
    to: input.customerEmail,
    replyTo: SHOP,
    subject: "Your RENSÉ order",
    text: input.receipt,
    html: orderHtml(input),
    attachments: [journal],
  });
  await transport.sendMail({
    from: FROM,
    to: SHOP,
    replyTo: input.customerEmail,
    subject: `New order — ${input.customerName}, ${input.city}`,
    text: input.shopText,
    html: shopHtml(input),
    attachments: [journal],
  });
}

export function shopHtml(input: {
  customerEmail: string;
  customerName: string;
  address: string;
  postal: string;
  city: string;
  country: string;
  qty: number;
  goods: number;
  delivery: number;
  total: number;
  method: string;
  days: string | null;
}) {
  const name = escapeHtml(input.customerName);
  const email = escapeHtml(input.customerEmail);
  const address = escapeHtml(input.address);
  const place = escapeHtml(`${input.postal} ${input.city}`.trim());
  const country = escapeHtml(input.country);
  const method = escapeHtml(input.method);
  const sans = "Helvetica,Arial,sans-serif";
  const mark = "Didot,'Bodoni MT',Palatino,'Times New Roman',serif";
  const delivery = input.delivery === 0 ? "Complimentary" : `${input.delivery} kr`;
  const when = input.days ? escapeHtml(input.days) : "";
  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#ffffff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;">
          <tr>
            <td align="center" style="padding:48px 32px 36px;">
              <p style="margin:0;font-family:${mark};font-size:14px;letter-spacing:0.46em;color:#000000;">RENSÉ</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px;font-family:${sans};font-size:14px;line-height:22px;color:#000000;">
              <p style="margin:0;">A new order has been placed.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e6e6e6;border-bottom:1px solid #e6e6e6;">
                <tr>
                  <td width="88" valign="middle" style="padding:18px 16px 18px 0;">
                    <img src="cid:journal" width="72" alt="" style="display:block;width:72px;height:auto;border:0;" />
                  </td>
                  <td valign="middle" style="padding:18px 0;font-family:${sans};font-size:14px;line-height:20px;color:#000000;">
                    Guided Healing Journal<br />Quantity ${input.qty}
                  </td>
                  <td valign="middle" align="right" style="padding:18px 0;font-family:${sans};font-size:14px;color:#000000;">${input.goods} kr</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 40px 0;font-family:${sans};font-size:14px;line-height:22px;color:#000000;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.16em;">CLIENT</p>
              <p style="margin:0;">${name}<br />${email}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 40px 0;font-family:${sans};font-size:14px;line-height:22px;color:#000000;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.16em;">SHIPPING ADDRESS</p>
              <p style="margin:0;">${name}<br />${address}<br />${place}<br />${country}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 40px 0;font-family:${sans};font-size:14px;line-height:22px;color:#000000;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.16em;">DELIVERY</p>
              <p style="margin:0;">${delivery}${when ? `<br />${when}` : ""}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 40px 0;font-family:${sans};font-size:14px;line-height:22px;color:#000000;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.16em;">PAYMENT</p>
              <p style="margin:0;">${method}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 40px 56px;font-family:${sans};font-size:14px;line-height:22px;color:#000000;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.16em;">TOTAL</p>
              <p style="margin:0;">${input.total} kr</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function orderHtml(input: {
  customerName: string;
  address: string;
  postal: string;
  city: string;
  country: string;
  qty: number;
  goods: number;
  delivery: number;
  total: number;
  method: string;
  days: string | null;
}) {
  const name = escapeHtml(input.customerName);
  const first = escapeHtml(input.customerName.trim().split(/\s+/)[0] || input.customerName);
  const address = escapeHtml(input.address);
  const place = escapeHtml(`${input.postal} ${input.city}`.trim());
  const country = escapeHtml(input.country);
  const method = escapeHtml(input.method);
  const sans = "Helvetica,Arial,sans-serif";
  const mark = "Didot,'Bodoni MT',Palatino,'Times New Roman',serif";
  const delivery = input.delivery === 0 ? "Complimentary" : `${input.delivery} kr`;
  const when = input.days ? escapeHtml(input.days) : "";
  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#ffffff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;">
          <tr>
            <td align="center" style="padding:48px 32px 36px;">
              <p style="margin:0;font-family:${mark};font-size:14px;letter-spacing:0.46em;color:#000000;">RENSÉ</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px;font-family:${sans};font-size:14px;line-height:22px;color:#000000;">
              <p style="margin:0 0 16px;">Dear ${first},</p>
              <p style="margin:0;">We are pleased to confirm your order.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e6e6e6;border-bottom:1px solid #e6e6e6;">
                <tr>
                  <td width="88" valign="middle" style="padding:18px 16px 18px 0;">
                    <img src="cid:journal" width="72" alt="" style="display:block;width:72px;height:auto;border:0;" />
                  </td>
                  <td valign="middle" style="padding:18px 0;font-family:${sans};font-size:14px;line-height:20px;color:#000000;">
                    Guided Healing Journal<br />Quantity ${input.qty}
                  </td>
                  <td valign="middle" align="right" style="padding:18px 0;font-family:${sans};font-size:14px;color:#000000;">${input.goods} kr</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 40px 0;font-family:${sans};font-size:14px;line-height:22px;color:#000000;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.16em;">DELIVERY</p>
              <p style="margin:0;">${delivery}${when ? `<br />${when}` : ""}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 40px 0;font-family:${sans};font-size:14px;line-height:22px;color:#000000;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.16em;">TOTAL</p>
              <p style="margin:0;">${input.total} kr</p>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 40px 0;font-family:${sans};font-size:14px;line-height:22px;color:#000000;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.16em;">PAYMENT</p>
              <p style="margin:0;">${method}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 40px 0;font-family:${sans};font-size:14px;line-height:22px;color:#000000;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.16em;">SHIPPING ADDRESS</p>
              <p style="margin:0;">${name}<br />${address}<br />${place}<br />${country}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 40px 56px;font-family:${sans};font-size:14px;line-height:22px;color:#000000;">
              <p style="margin:0;">Should you require anything further, please write to hello@rense.se.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(value: string) {
  const amp = String.fromCharCode(38);
  return value
    .replaceAll(amp, amp + "amp;")
    .replaceAll("<", amp + "lt;")
    .replaceAll(">", amp + "gt;");
}

export function onTheWayHtml(input: {
  name: string;
  address: string;
  postal: string;
  city: string;
  country: string;
  days: string | null;
  qty?: number;
}) {
  const name = escapeHtml(input.name);
  const first = escapeHtml(input.name.trim().split(/\s+/)[0] || input.name);
  const address = escapeHtml(input.address);
  const place = escapeHtml(`${input.postal} ${input.city}`.trim());
  const country = escapeHtml(input.country);
  const when = input.days ? escapeHtml(input.days) : "To be confirmed";
  const qty = input.qty && input.qty > 0 ? input.qty : 1;
  const sans = "Helvetica,Arial,sans-serif";
  const mark = "Didot,'Bodoni MT',Palatino,'Times New Roman',serif";
  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#ffffff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;">
          <tr>
            <td align="center" style="padding:48px 32px 36px;">
              <p style="margin:0;font-family:${mark};font-size:14px;letter-spacing:0.46em;color:#000000;">RENSÉ</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px;font-family:${sans};font-size:14px;line-height:22px;color:#000000;">
              <p style="margin:0 0 16px;">Dear ${first},</p>
              <p style="margin:0;">We are pleased to inform you that your order has been shipped.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e6e6e6;border-bottom:1px solid #e6e6e6;">
                <tr>
                  <td width="88" valign="middle" style="padding:18px 16px 18px 0;">
                    <img src="cid:journal" width="72" alt="" style="display:block;width:72px;height:auto;border:0;" />
                  </td>
                  <td valign="middle" style="padding:18px 0;font-family:${sans};font-size:14px;line-height:20px;color:#000000;">
                    Guided Healing Journal<br />Quantity ${qty}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 0;font-family:${sans};font-size:14px;line-height:22px;color:#000000;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.16em;">SHIPPING ADDRESS</p>
              <p style="margin:0;">${name}<br />${address}<br />${place}<br />${country}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 40px 0;font-family:${sans};font-size:14px;line-height:22px;color:#000000;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.16em;">DELIVERY</p>
              <p style="margin:0;">${when}<br />Tracked</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 40px 56px;font-family:${sans};font-size:14px;line-height:22px;color:#000000;">
              <p style="margin:0;">Should you require anything further, please write to hello@rense.se.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOnTheWay(input: {
  customerEmail: string;
  name: string;
  address: string;
  postal: string;
  city: string;
  country: string;
  days: string | null;
  qty?: number;
}) {
  const { host, user, pass } = creds();
  const transport = createTransport({
    host,
    port: 465,
    secure: true,
    auth: { user, pass },
  });
  const first = input.name.trim().split(/\s+/)[0] || input.name;
  const when = input.days ?? "To be confirmed";
  const text = [
    "RENSÉ",
    "",
    `Dear ${first},`,
    "",
    "We are pleased to inform you that your order has been shipped.",
    "",
    "Guided Healing Journal",
    `Quantity ${input.qty && input.qty > 0 ? input.qty : 1}`,
    "",
    "SHIPPING ADDRESS",
    input.name,
    input.address,
    `${input.postal} ${input.city}`.trim(),
    input.country,
    "",
    "DELIVERY",
    when,
    "Tracked",
    "",
    "Should you require anything further, please write to hello@rense.se.",
  ].join("\n");
  await transport.sendMail({
    from: FROM,
    to: input.customerEmail,
    replyTo: SHOP,
    subject: "Your RENSÉ order has been shipped",
    text,
    html: onTheWayHtml(input),
    attachments: [
      {
        filename: "journal-cover-clear.jpg",
        path: join(process.cwd(), "public", "images", "journal-cover-clear.jpg"),
        cid: "journal",
      },
    ],
  });
}

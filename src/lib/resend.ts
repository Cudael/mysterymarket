import { Resend } from "resend";
import { env } from "@/lib/env";

let _resend: Resend | null = null;

export function getResend(): Resend | null {
  if (!env.RESEND_API_KEY) return null;
  if (!_resend) {
    _resend = new Resend(env.RESEND_API_KEY);
  }
  return _resend;
}

export const resend = {
  emails: {
    send: (params: Parameters<Resend["emails"]["send"]>[0]) => {
      const client = getResend();
      if (!client) return Promise.resolve({ data: null, error: null });
      return client.emails.send(params);
    },
  },
};

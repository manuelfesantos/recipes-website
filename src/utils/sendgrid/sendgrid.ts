import sgMail from "@sendgrid/mail";
import { text } from "@fortawesome/fontawesome-svg-core";
import process from "process";

sgMail.setApiKey(String(process.env.SENDGRID_API_KEY));

export const sendMail = async (text: string, to: string, subject: string) => {
  const msg = {
    from: String(process.env.SENDGRID_FROM_EMAIL),
    html: `<strong>${text}</strong>`,
    subject: subject,
    text: text,
    to: to,
  };

  console.log(msg);

  return await sgMail.send(msg);
};

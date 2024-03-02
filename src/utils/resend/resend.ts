import { Resend } from "resend";
import process from "process";
export const resend = new Resend(process.env.RESEND_API_KEY);

import { config } from "dotenv";
import nodemailer from "nodemailer";
config();
export const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: { rejectUnauthorized: false },
});

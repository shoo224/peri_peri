let transporter = null;
let EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@periperi.local';

try {
  const nodemailer = require('nodemailer');
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;

  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
  }
} catch (err) {
  // nodemailer not installed — emails will be skipped but server remains functional
  transporter = null;
}

exports.sendMail = async ({ to, subject, text, html }) => {
  if (!transporter) {
    console.warn('SMTP not configured or nodemailer missing, skipping email to', to);
    return false;
  }
  try {
    const info = await transporter.sendMail({ from: EMAIL_FROM, to, subject, text, html });
    return info;
  } catch (err) {
    console.error('Failed to send email', err);
    return false;
  }
};

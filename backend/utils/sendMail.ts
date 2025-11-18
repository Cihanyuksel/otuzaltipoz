import { globalTransporter } from "../utils/globalTransporter";
import { config } from "../config/config";
import nodemailer from "nodemailer";

/**
 * Şifre sıfırlama emaili gönderir
 * @param {string} email - Kullanıcının emaili
 * @param {string} token - Reset token
 * @param {string} username - Kullanıcı adı
 */
export const sendResetEmail = async (
  email: string,
  token: string,
  username: string
): Promise<void> => {
  const resetLink = `${config.client.url}/reset-password?token=${token}`;

  const mailOptions = {
    from:
      config.email.from || `"otuzaltıpoz" <${config.email.smtp.auth.username}>`,
    to: email,
    subject: "Şifre Sıfırlama - otuzaltıpoz",
    html: `
    <!DOCTYPE html>
      <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Şifre Yenileme Talebi - Otuzaltıpoz</title>
          <style>
              body { margin: 0; padding: 0; background-color: #f4f7f6; font-family: Arial, sans-serif; }
              table, td { border-collapse: collapse; }
              a { text-decoration: none; color: #007bff; }
              @media only screen and (max-width: 600px) {
                  .full-width { width: 100% !important; }
                  .content-padding { padding: 20px !important; }
              }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f7f6;">
          <center>
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f7f6;">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 4px;">
                        <tr>
                            <td align="left" style="padding: 20px 30px; border-bottom: 1px solid #eeeeee;">
                                <h1 style="color: #333333; margin: 0; font-size: 24px; font-weight: bold;">
                                    Şifre Yenileme Talebi
                                </h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 30px; color: #333333;">
                                <p style="color: #555; line-height: 1.6; font-size: 16px; margin-bottom: 20px;">
                                    Sevgili ${username},
                                </p>
                                <p style="color: #555; line-height: 1.6; font-size: 16px; margin-bottom: 20px;">
                                    Otuzaltıpoz şifre hatırlatma servisini kullandığınız için bu e-postayı aldınız. Eğer bu kaydı gerçekleştirmiş olan sizseniz, lütfen aşağıdaki linke tıklayınız.
                                </p>
                                <p style="color: #555; line-height: 1.6; font-size: 16px; margin-bottom: 10px;">
                                    Tıklamanız gereken link şudur:
                                </p>
                                <p style="font-size: 16px; word-break: break-all; margin-top: 0; margin-bottom: 30px;">
                                    <a href="${resetLink}" target="_blank" style="color: #007bff;">
                                        ${resetLink}
                                    </a>
                                </p>
                                <p style="color: #555; line-height: 1.6; font-size: 16px; margin-bottom: 0;">
                                    Saygılarımızla,<br>Otuzaltıpoz Ekibi
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
          </table>
          </center>
        </body>
      </html>
    `,
  };

  console.log("Reset link:", resetLink);

  if (!globalTransporter) {
    throw new Error("Email service is not available (Transporter failed)");
  }

  try {
    const info = await globalTransporter.sendMail(mailOptions);
    console.log("Reset password email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw error;
  }
};

/**
 * Hesabı aktifleştirme emaili gönderir
 * @param {string} email - Kullanıcının emaili
 * @param {string} newUser - Kullanıcı adı
 * @param {string} token - Aktivasyon tokeni
 */
export const sendVerifyEmail = async (
  email: string,
  newUser: string,
  token: string
): Promise<void> => {
  const verifyLink = `${config.client.url}/verify-email?token=${token}`;

  const mailOptions = {
    from:
      config.email.from || `"otuzaltıpoz" <${config.email.smtp.auth.username}>`,
    to: email,
    subject: "Hesabını aktifleştir - otuzaltıpoz",
    html: `
        <!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hesap Aktivasyonu - otuzaltıpoz</title>
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff; color: #333333; }
        table, td { border-collapse: collapse; }
        a { text-decoration: none; color: #108c40; }
        @media only screen and (max-width: 600px) {
            .full-width { width: 100% !important; }
            .content-padding { padding: 15px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff;">
    <center>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff;">
            <tr>
                <td style="padding: 20px;" class="content-padding">
                    <h1 style="color: #333; margin: 0 0 10px 0; font-size: 24px; font-weight: bold;">
                        Otuzaltıpoz Hesap Aktivasyonu
                    </h1>
                    <p style="color: #555; line-height: 1.6; font-size: 16px; margin-bottom: 20px;">
                        Merhaba ${newUser},
                    </p>
                    <p style="color: #555; line-height: 1.6; font-size: 16px; margin-bottom: 20px;">
                        Otuzaltıpoz'a hoş geldin! Hesabını aktifleştirmek için aşağıdaki butona tıklaman yeterli.
                    </p>
                    <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                        <tr>
                            <td align="center" style="border-radius: 4px;" bgcolor="#108c40">
                                <a href="${verifyLink}" target="_blank" style="padding: 12px 25px; border: 1px solid #108c40; color: #ffffff; text-align: center; font-weight: bold; display: inline-block; font-size: 16px; border-radius: 4px;">
                                    Hesabımı Aktifleştir
                                </a>
                            </td>
                        </tr>
                    </table>
                    <p style="color: #777; font-size: 14px; line-height: 1.6; margin-bottom: 5px;">
                        Eğer buton çalışmazsa, aşağıdaki linki kopyalayıp tarayıcına yapıştır:
                    </p>
                    <p style="color: #108c40; font-size: 14px; word-break: break-all; margin-top: 0; margin-bottom: 30px;">
                        <a href="${verifyLink}" target="_blank" style="color: #108c40;">
                            ${verifyLink}
                        </a>
                    </p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
    `,
  };

  console.log("Verify Link:", verifyLink);

  if (!globalTransporter) {
    throw new Error("Email service is not available");
  }

  try {
    const info = await globalTransporter.sendMail(mailOptions);
    console.log("Verify email sent:", info.messageId);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("Preview URL:", previewUrl);
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

export const sendContactEmail = async (
  fullName: string,
  email: string,
  phone: string | undefined,
  message: string
): Promise<void> => {
  const mailOptions = {
    from:
      config.email.from || `"otuzaltıpoz" <${config.email.smtp.auth.username}>`,
    to: "cihanyyuksel@gmail.com",
    replyTo: email,
    subject: `Yeni İletişim Formu Mesajı - ${fullName}`,
    html: `
    <!DOCTYPE html>
    <html lang="tr">
      <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: Arial, sans-serif;">
        <center>
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f7f6;">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 4px;">
                  <tr>
                    <td align="left" style="padding: 20px 30px; border-bottom: 1px solid #eeeeee; background-color: #108c40;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Yeni Mesaj</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px; color: #333333;">
                      <p><strong>Gönderen:</strong> ${fullName}</p>
                      <p><strong>Email:</strong> ${email}</p>
                      ${
                        phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ""
                      }
                      <hr>
                      <p>${message}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </center>
      </body>
    </html>
    `,
  };

  console.log(`Sending contact form message from: ${email}`);

  if (!globalTransporter) {
    throw new Error("Email service is not available");
  }

  try {
    const info = await globalTransporter.sendMail(mailOptions);
    console.log("Contact email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending contact email:", error);
    throw error;
  }
};

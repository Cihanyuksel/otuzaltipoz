import { config } from "../config/config";
import { sendEmail } from "../utils/globalTransporter";

/**
 * Şifre sıfırlama
 */
export const sendResetEmail = async (
  email: string,
  token: string,
  username: string
) => {
  const resetLink = `${config.client.url}/reset-password?token=${token}`;

  const htmlContent = `
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
                                <p style="font-size: 16px; word-break: break-all; margin-top: 0; margin-bottom: 30px;">
                                    <a href="${resetLink}" target="_blank" style="color: #007bff;">
                                        ${resetLink}
                                    </a>
                                </p>
                                <p style="color: #555; line-height: 1.6; font-size: 16px; margin-top: 5px;">
                                    Otuzaltıpoz Ekibi
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
    `;

  console.log("Reset link:", resetLink);

  try {
    await sendEmail({
      to: email,
      subject: "Şifre Sıfırlama - otuzaltıpoz",
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending reset password email:", error);
  }
};

/**
 * Hesap doğrulama
 */
export const sendVerifyEmail = async (
  email: string,
  newUser: string,
  token: string
) => {
  const verifyLink = `${config.client.url}/verify-email?token=${token}`;

  const htmlContent = `
        <!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hesap aktivasyonu - otuzaltıpoz</title>
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
                    <p style="color: #999; font-size: 12px; margin: 0;">
                        **Not:** Bu aktivasyon linki **24 saat** geçerlidir.
                    </p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
    `;

  console.log(verifyLink);

  try {
    await sendEmail({
      to: email,
      subject: "hesabını aktifleştir - otuzaltıpoz",
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

/**
 * İletişim formu mesajını admin e-postasına gönderir
 */
export const sendContactEmail = async (
  fullName: string,
  email: string,
  phone: string | undefined,
  message: string
): Promise<void> => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Yeni İletişim Formu Mesajı</title>
        <style>
          body { margin: 0; padding: 0; background-color: #f4f7f6; font-family: Arial, sans-serif; }
          table, td { border-collapse: collapse; }
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
                    <td align="left" style="padding: 20px 30px; border-bottom: 1px solid #eeeeee; background-color: #108c40;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">
                        Yeni İletişim Formu Mesajı
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px; color: #333333;">
                      <h2 style="color: #108c40; margin: 0 0 20px 0; font-size: 18px;">
                        Gönderen Bilgileri
                      </h2>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                        <tr>
                          <td style="padding: 8px 0; color: #666; font-weight: bold; width: 120px;">Ad Soyad:</td>
                          <td style="padding: 8px 0; color: #333;">${fullName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #666; font-weight: bold;">E-posta:</td>
                          <td style="padding: 8px 0;">
                            <a href="mailto:${email}" style="color: #108c40; text-decoration: none;">
                              ${email}
                            </a>
                          </td>
                        </tr>
                        ${
                          phone
                            ? `<tr>
                          <td style="padding: 8px 0; color: #666; font-weight: bold;">Telefon:</td>
                          <td style="padding: 8px 0; color: #333;">
                            <a href="tel:${phone}" style="color: #108c40; text-decoration: none;">
                              ${phone}
                            </a>
                          </td>
                        </tr>`
                            : ""
                        }
                      </table>
                      <h2 style="color: #108c40; margin: 0 0 15px 0; font-size: 18px;">
                        Mesaj İçeriği
                      </h2>
                      <div style="background-color: #f9f9f9; border-left: 4px solid #108c40; padding: 15px 20px; margin-bottom: 25px; border-radius: 4px;">
                        <p style="color: #333; line-height: 1.6; font-size: 15px; margin: 0; white-space: pre-wrap;">${message}</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </center>
      </body>
    </html>
    `;

  console.log(`Sending contact form message from: ${email}`);

  try {
    await sendEmail({
      to: "cihanyyuksel@gmail.com",
      subject: `Yeni İletişim Formu Mesajı - ${fullName}`,
      html: htmlContent,
      replyTo: email,
    });
    console.log("Contact email sent successfully");
  } catch (error) {
    console.error("Error sending contact email:", error);
    throw error;
  }
};

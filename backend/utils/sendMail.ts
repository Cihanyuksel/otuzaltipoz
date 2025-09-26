import { globalTransporter } from '../utils/globalTransporter';
import { config } from "../config/config";
import nodemailer from "nodemailer";

/**
 * This function sends an email to the given email with the reset password link
 *
 * @param {string} email - The email of the user
 * @param {string} token - The reset password token
 */
export const sendResetEmail = (email: string, token: string) => {
  const resetLink = `${config.client.url}/reset-password/${token}`;
  const mailOptions = {
    from: config.email.from,
    to: email,
    subject: "Password reset",
    html: `
      <p>Please reset your password by clicking the button below:</p>
      <form action="${resetLink}" method="POST">
        <button type="submit">Reset Password</button>
      </form>
    `,
  };
  console.log(resetLink);
  globalTransporter?.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending reset password email:", error);
    } else {
      console.log("Reset password email sent:", info.response);
    }
  });
};

/**
 * This function sends an email to the given email with the email verification link
 *
 * @param {string} email - The email of the user
 * @param {string} token - The email verification token
 */

export const sendVerifyEmail = (
  email: string,
  newUser: string,
  token: string
) => {
  const verifyLink = `${config.client.url}/verify-email?token=${token}`;

  const mailOptions = {
    from:
      config.email.from || `"otuzaltıpoz" <${config.email.smtp.auth.username}>`,
    to: email,
    subject: "Hesabını Aktifleştir - otuzaltıpoz",
    html: `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Hesap Aktivasyonu - Otuzaltıpoz</title>
            <style>
                body { margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
                a { text-decoration: none; color: #667eea; }

                @media only screen and (max-width: 600px) {
                    .full-width { width: 100% !important; }
                    .content-padding { padding: 20px !important; }
                    .header-padding { padding: 30px 20px !important; }
                    .button-cell { padding: 25px 0 !important; }
                    .button-link { padding: 12px 25px !important; font-size: 16px !important; }
                }
            </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f7f6;">
            <center>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f4f7f6;">
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);" class="full-width">
                                <tr>
                                    <td align="center" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; border-top-left-radius: 8px; border-top-right-radius: 8px;" class="header-padding">
                                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;">
                                            Otuzaltıpoz
                                        </h1>
                                        <p style="color: #e0e0e0; margin: 8px 0 0 0; font-size: 16px;">
                                            Fotoğraf Paylaşım Platformu
                                        </p>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td style="padding: 30px; color: #333333;" class="content-padding">
                                        <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                                            Merhaba ${newUser}! 👋
                                        </h2>
                                        
                                        <p style="color: #555; line-height: 1.7; font-size: 16px; margin-bottom: 25px;">
                                            Otuzaltıpoz ailesine hoş geldin! Seni aramızda görmekten mutluluk duyuyoruz.
                                        </p>

                                        <p style="color: #555; line-height: 1.7; font-size: 16px; margin-bottom: 30px;">
                                            Hesabını hemen aktifleştirip fotoğraf paylaşmaya başlamak için aşağıdaki butona tıklayabilirsin.
                                        </p>
                                        
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td align="center" style="padding: 30px 0;" class="button-cell">
                                                    <a href="${verifyLink}" target="_blank" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; font-size: 18px; box-shadow: 0 4px 10px rgba(102, 126, 234, 0.4);">
                                                        ✅ Hesabımı Aktifleştir
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <p style="color: #777; font-size: 14px; line-height: 1.6; text-align: center;">
                                            Buton çalışmıyorsa, bu linki kopyalayıp tarayıcına yapıştır:
                                        </p>
                                        <p style="color: #667eea; font-size: 14px; word-break: break-all; text-align: center; margin-top: 5px;">
                                            ${verifyLink}
                                        </p>
                                        
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td style="border-top: 1px solid #eeeeee; padding: 20px 30px; background-color: #fcfcfc; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                                        <p style="color: #999; font-size: 12px; margin: 0; text-align: center;">
                                            Bu link **24 saat** geçerlidir. Lütfen süreyi dikkate al.
                                        </p>
                                        <p style="color: #999; font-size: 12px; margin: 5px 0 0 0; text-align: center;">
                                            Eğer bu hesabı sen oluşturmadıysan bu e-postayı güvenle görmezden gelebilirsin.
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
  console.log(verifyLink);
  globalTransporter?.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending verification email:", error);
    } else {
      console.log("Verify email sent:", info.response);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log("Preview URL:", previewUrl);
      }
    }
  });
};

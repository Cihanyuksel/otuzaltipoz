import { globalTransporter } from "../utils/globalTransporter";
import { config } from "../config/config";
import nodemailer from "nodemailer";

/**
 * Şifre sıfırlama emaili gönderir
 * @param {string} email - Kullanıcının emaili
 * @param {string} token - Reset token
 */
export const sendResetEmail = (
  email: string,
  token: string,
  username: string
) => {
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
              a { text-decoration: none; color: #007bff; } /* Link rengini belirginleştirdik */
        
              /* Mobil */
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
                                    Otuzaltıpoz şifre hatırlatma servisini kullandığınız için bu e-postayı aldınız. Eğer bu kaydı gerçekleştirmiş olan sizseniz, lütfen aşağıdaki linke tıklayınız. Linke tıkladıktan sonra şifrenizi değiştirebileceğiniz bir ekrana yönlendirileceksiniz.
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
                                    Saygılarımızla,
                                </p>
                                <p style="color: #555; line-height: 1.6; font-size: 16px; margin-top: 5px;">
                                    Otuzaltıpoz Ekibi
                                </p>
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="border-top: 1px solid #eeeeee; padding: 20px 30px; background-color: #fcfcfc;">
                                <p style="color: #999; font-size: 12px; margin: 0; text-align: center;">
                                    Eğer bu şifre sıfırlama talebini siz yapmadıysanız, bu e-postayı güvenle görmezden gelebilirsiniz.
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

  globalTransporter?.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending reset password email:", error);
    } else {
      console.log("Reset password email sent:", info.response);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log("Preview URL:", previewUrl);
      }
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
    subject: "hesabını aktifleştir - otuzaltıpoz",
    html: `
        <!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hesap aktivasyonu - otuzaltıpoz</title>
    <style>
        /* Temel Stiller */
        body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, sans-serif; 
            background-color: #ffffff; /* Mail gövdesine direkt yerleştiği için arka planı beyaz yaptık */
            color: #333333;
        }
        table, td { border-collapse: collapse; }
        a { text-decoration: none; color: #108c40; } /* Link ve buton rengi için sade bir yeşil tonu */
        
        /* Mobil Uyumluluk */
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

                    <p style="color: #999; font-size: 12px; margin: 0;">
                        **Not:** Bu aktivasyon linki **24 saat** geçerlidir.
                    </p>
                    <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
                        Bu hesabı sen oluşturmadıysan bu e-postayı dikkate almana gerek yoktur.
                    </p>
                    
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

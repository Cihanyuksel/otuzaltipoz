import { z } from 'zod';

// PHOTO FORM
const photoEditSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Başlık en az 3 karakter olmalıdır.' })
    .max(25, { message: 'Başlık en fazla 25 karakter olabilir.' }),

  description: z
    .string()
    .min(10, { message: 'Açıklama en az 10 karakter olmalıdır.' })
    .max(300, { message: 'Açıklama en fazla 300 karakter olabilir.' }),

  tags: z.string().optional(),
});

type PhotoEditFormValues = z.infer<typeof photoEditSchema>;

const photoUploadSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Başlık en az 3 karakter olmalıdır.' })
    .max(25, { message: 'Başlık en fazla 25 karakter olabilir.' }),

  description: z
    .string()
    .min(10, { message: 'Açıklama en az 10 karakter olmalıdır.' })
    .max(300, { message: 'Açıklama en fazla 300 karakter olabilir.' }),

  tags: z.string().optional(),

  photo: z.any().refine((files) => files?.length === 1, 'Bir fotoğraf yüklemeniz gerekmektedir.'),
});

type PhotoUploadFormValues = z.infer<typeof photoUploadSchema>;

// AUTH FORM
const loginSchema = z.object({
  email: z
    .string()
    .email('Geçerli bir e-posta giriniz')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'en az 3 karakter olmalı')
      .regex(
        /^[a-z][a-z0-9]*$/,
        'Kullanıcı adı küçük harf ile başlamalı ve sadece küçük harfler ve rakamlar içerebilir'
      ),

    full_name: z
      .string()
      .min(3, 'En az 3 karakter olmalı')
      .regex(
        /^[A-Za-zÇçĞğİıÖöŞşÜü]+(?: [A-Za-zÇçĞğİıÖöŞşÜü]+){0,2}$/,
        'Kullanıcı adı sadece harflerden oluşabilir ve en fazla iki boşluk içerebilir'
      ),

    email: z
      .string()
      .email('Geçerli bir e-posta gir')
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Geçerli bir e-posta adresi girin'),

    password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),

    passwordCheck: z.string(),

    profile_img: z.any().optional(),

    bio: z.string().max(250, 'Biyografi en fazla 250 karakter olmalı').optional(),
  })
  .refine((data) => data.password === data.passwordCheck, {
    path: ['passwordCheck'],
    message: 'Şifreler uyuşmuyor',
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const contactSchema = z.object({
  fullName: z.string().min(2, 'Ad Soyad en az 2 karakter olmalı.').max(50, 'Ad Soyad en fazla 50 karakter olabilir.'),
  email: z.string().email('Geçerli bir e-posta adresi girin.'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalı.').max(500, 'Mesaj en fazla 500 karakter olabilir.'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export { photoEditSchema, photoUploadSchema, loginSchema, registerSchema, contactSchema };
export type { PhotoEditFormValues, PhotoUploadFormValues, LoginFormValues, RegisterFormValues, ContactFormValues };

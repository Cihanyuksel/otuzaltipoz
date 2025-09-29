import { z } from 'zod';

// PHOTO FORM
const photoEditSchema = z.object({
  title: z.string().min(1, { message: 'Başlık alanı boş bırakılamaz.' }),
  description: z.string().optional(),
  tags: z.string().optional(),
});

type PhotoEditFormValues = z.infer<typeof photoEditSchema>;

const photoUploadSchema = z.object({
  title: z.string().min(3, 'Başlık en az 3 karakter olmalıdır.'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır.'),
  tags: z.string().optional(),
  photo: z.any().refine((files) => files?.length === 1, 'Bir fotoğraf yüklemeniz gerekmektedir.'),
});

type PhotoUploadFormValues = z.infer<typeof photoUploadSchema>;

// AUTH FORM
const loginSchema = z.object({
  email: z.string().email('Geçerli bir email giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username en az 3 karakter olmalı')
      .regex(/^[a-zA-Z]+$/, 'Kullanıcı adı sadece harflerden oluşabilir'),
    full_name: z
      .string()
      .min(3, 'Full_name en az 3 karakter olmalı')
      .regex(/^[a-zA-Z]+$/, 'Kullanıcı adı sadece harflerden oluşabilir'),
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

export { photoEditSchema, photoUploadSchema, loginSchema, registerSchema };
export type { PhotoEditFormValues, PhotoUploadFormValues, LoginFormValues, RegisterFormValues };

'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../common/input';
import Button from '../common/button';
import { ContactFormValues, contactSchema } from 'lib/schemas';
import { authService } from 'services/authService';

const ContactForm = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const result = await authService.contactMail(data);
      setSuccessMessage(result.message || 'Mesajınız başarıyla gönderildi!');
      reset();
    } catch (err: any) {
      console.error('Mesaj gönderim hatası:', err);
      setErrorMessage(err.message || 'Bir hata oluştu, lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="mt-12 rounded-lg bg-[#d3deda] p-8 text-left shadow-md">
      <h2 className="text-2xl font-semibold text-[#1b140e] text-center">Öneri ve Şikayetleriniz İçin</h2>
      <p className="mt-4 text-lg text-gray-700 text-center">
        Görüşleriniz bizim için değerli. Bize aşağıdaki formu doldurarak veya e-posta adresinden ulaşabilirsiniz.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        {successMessage && (
          <div className="p-4 rounded-md bg-green-100 text-green-700 font-medium">{successMessage}</div>
        )}
        {errorMessage && <div className="p-4 rounded-md bg-red-100 text-red-700 font-medium">{errorMessage}</div>}

        <Input
          id="fullName"
          name="fullName"
          label="Ad Soyad"
          register={register}
          placeholder="Ad Soyad"
          error={errors.fullName?.message}
          disabled={isSubmitting}
          bgColor="bg-[#f5f1ea]"
        />

        <Input
          id="phone"
          name="phone"
          label="Telefon Numarası (isteğe bağlı)"
          register={register}
          placeholder="Telefon numarası"
          disabled={isSubmitting}
          bgColor="bg-[#f5f1ea]"
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="E-posta Adresi"
          register={register}
          placeholder="E-posta adresiniz"
          error={errors.email?.message}
          disabled={isSubmitting}
          bgColor="bg-[#f5f1ea]"
        />

        {/* Mesaj Alanı */}
        <div className="flex flex-col w-full mt-2 mb-2">
          <label htmlFor="message" className="mb-1 text-sm font-medium text-gray-700">
            Mesajınız
          </label>
          <textarea
            id="message"
            rows={4}
            {...register('message')}
            disabled={isSubmitting}
            className={`w-full px-3 py-2 border bg-[#f5f1ea] rounded-md shadow-sm focus:ring-2 focus:ring-[#e6994c] focus:border-[#e6994c] resize-none ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Mesajınızı yazın..."
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
        </div>
        {/*Action*/}
        <Button type="submit" variant="primary" size="medium" className="font-bold" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Gönderiliyor...
            </div>
          ) : (
            'Gönder'
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;

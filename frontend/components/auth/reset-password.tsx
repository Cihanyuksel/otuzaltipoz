'use client'; // Bu bileşen client tarafında çalışacağı için zorunludur.

import React, { useState, FormEvent } from 'react';
import Button from '../common/button';

/**
 * Kullanıcının şifre sıfırlama bağlantısı almak için e-posta adresini girdiği bileşen.
 */
export default function PasswordResetEmail() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string | null }>({ type: null, text: null });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage({ type: null, text: null }); // Önceki mesajı temizle
    setIsLoading(true);

    // Basit e-posta doğrulama kontrolü
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setMessage({ type: 'error', text: 'Lütfen geçerli bir e-posta adresi girin.' });
      setIsLoading(false);
      return;
    }

    try {
      // **GERÇEK UYGULAMADA BURAYA SUNUCU İSTEĞİ (API Call) GELİR**
      // Örneğin: /api/auth/reset-password endpoint'ine e-posta gönderme
      
      /*
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        // Hata durumlarını yönet
        throw new Error('Şifre sıfırlama talebi başarısız oldu. Lütfen tekrar deneyin.');
      }
      */
      
      // Simülasyon: 2 saniye beklet
      await new Promise(resolve => setTimeout(resolve, 2000));


      // Başarılı yanıt
      setMessage({
        type: 'success',
        text: `Şifrenizi sıfırlamak için ${email} adresine bir bağlantı gönderildi. Lütfen gelen kutunuzu kontrol edin.`,
      });
      setEmail(''); // Formu temizle

    } catch (error) {
      // Hata mesajını yakala ve göster
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Tailwind CSS ile dinamik mesaj stilleri
  const messageClasses = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-xl border border-gray-200">
        
        <h2 className="text-3xl font-bold text-center text-gray-900">Şifremi Sıfırla</h2>
        
        <p className="text-center text-sm text-gray-600">
          Hesabınızla ilişkili e-posta adresinizi girin. Size bir sıfırlama bağlantısı göndereceğiz.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-posta Adresi
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out disabled:opacity-50"
              placeholder="ornek@eposta.com"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            variant='primary'
          >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
              'Gönder'
            )}
          </Button>
        </form>

        {/* Mesaj Alanı */}
        {message.text && (
          <div 
            className={`p-3 border-l-4 rounded-md mt-4 text-sm ${message.type ? messageClasses[message.type] : ''}`} 
            role="alert"
          >
            {message.text}
          </div>
        )}

      </div>
    </div>
  );
}
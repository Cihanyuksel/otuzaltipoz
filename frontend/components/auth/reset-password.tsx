'use client';
import { useState, FormEvent, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Button from '@/components/common/button';
import { authService } from 'services/authService';

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (!token) {
      setError('Şifre sıfırlama bağlantısı eksik veya geçersiz. Lütfen e-postanızı kontrol edin.');
      setLoading(false);
      return;
    }

    if (!newPassword) {
      setError('Lütfen yeni şifrenizi girin.');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.resetPassword({
        token,
        newPassword,
      });

      if (response.success) {
        setMessage(response.message || 'Şifreniz başarıyla sıfırlandı. Artık yeni şifrenizle giriş yapabilirsiniz.');
        setNewPassword('');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Şifre sıfırlanırken beklenmedik bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="absolute top-0 left-0 p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-700 opacity-70">Otuzaltıpoz</h1>
        <p className="text-sm text-gray-500 opacity-60">Şifre Yenileme</p>
      </div>

      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 sm:p-8 border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Yeni Şifre Oluştur</h2>
          <p className="text-gray-500 text-sm">Hesabın için güçlü bir şifre belirle.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Yeni Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="En az 6 karakter"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
                aria-label="Şifreyi Göster/Gizle"
              >
                {showPassword ? 'Gizle' : 'Göster'}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Şifreyi Onayla
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Şifreni tekrar gir"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {message && (
            <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
              <p className="text-sm font-medium">{message}</p>
              <p className="text-xs mt-1">Giriş sayfasına yönlendiriliyorsun...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full font-bold" variant="primary">
            {loading ? 'Kaydediliyor...' : 'Şifremi Değiştir'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a href="/login" className="text-[#ef7464] hover:text-[#ef7464ba] text-sm font-medium">
            ← Giriş sayfasına dön
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

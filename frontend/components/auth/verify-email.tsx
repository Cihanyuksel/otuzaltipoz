'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  BsCheckCircleFill as SuccessIcon,
  BsXCircleFill as ErrorIcon,
  BsArrowRepeat as LoadingIcon,
  BsBoxArrowInRight as LoginIcon,
} from 'react-icons/bs';
import { authService } from 'services/authService';
import Button from '@/components/common/button';

const VerifyEmail = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [hasFetched, setHasFetched] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token || hasFetched) return;
    setHasFetched(true);
    const verify = async () => {
      try {
        const data = await authService.verifyToken(token);

        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'E-posta adresiniz başarıyla doğrulandı!');
        } else {
          setStatus('error');
          setMessage(data.message || 'Doğrulama başarısız.');
        }
      } catch (error: any) {
        console.error('Doğrulama hatası:', error);
        setStatus('error');
        setMessage(error.message || 'Doğrulama sırasında bir ağ veya sunucu hatası oluştu.');
      }
    };

    verify();
  }, [token, hasFetched]);

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 space-y-6 text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center space-y-4">
            <LoadingIcon className="w-10 h-10 text-blue-500 animate-spin" />
            <h1 className="text-xl font-semibold text-gray-800">E-posta Doğrulanıyor...</h1>
            <p className="text-gray-500">Lütfen bekleyin, bağlantınız kontrol ediliyor.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center space-y-4">
            <SuccessIcon className="w-12 h-12 text-green-500" />
            <h1 className="text-2xl font-bold text-green-600">Başarılı!</h1>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-400">Artık hesabınıza giriş yapabilirsiniz.</p>
            <Button onClick={handleLoginRedirect} variant="primary" size="medium" className="mt-6 w-full ">
              <LoginIcon className="w-5 h-5 mr-2" />
              Giriş Yap
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center space-y-4">
            <ErrorIcon className="w-12 h-12 text-red-500" />
            <h1 className="text-2xl font-bold text-red-600">Hata!</h1>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-400">Lütfen tekrar deneyin veya destek ile iletişime geçin.</p>
            <Button onClick={handleLoginRedirect} variant="primary" size="medium" className="mt-6 w-full">
              <LoginIcon className="w-5 h-5 mr-2" />
              Giriş Sayfasına Git
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

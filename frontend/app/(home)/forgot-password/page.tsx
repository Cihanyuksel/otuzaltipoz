import ForgotPassword from '@/components/auth/forgot-passwordd';
import { createPageMetadata } from 'lib/metadata';

export const metadata = createPageMetadata({
  title: 'Şifremi Unuttum | otuzaltıpoz',
  description: 'Hesabınızın şifresini sıfırlamak için gerekli adımları buradan başlatabilirsiniz.',
  path: '/forgot-password',
  image: '/og-forgot-password.jpg',
});

function ForgotPasswordPage() {
  return <ForgotPassword />;
}

export default ForgotPasswordPage;

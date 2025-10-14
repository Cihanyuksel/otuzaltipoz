import ResetPassword from '@/components/auth/reset-password';
import { createPageMetadata } from 'lib/metadata';

export const metadata = createPageMetadata({
  title: 'Şifremi Sıfırla | otuzaltıpoz',
  description: 'Hesabınızın şifresini sıfırlamak için gerekli adımları buradan başlatabilirsiniz.',
  path: '/reset-password',
  image: '/og-reset-password.jpg',
});

function ResetPasswordPage() {
  return <ResetPassword />;
}

export default ResetPasswordPage;

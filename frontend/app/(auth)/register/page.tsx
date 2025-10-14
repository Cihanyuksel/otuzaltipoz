import Image from 'next/image';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SignupForm from '@/components/auth/signup';
import { createPageMetadata } from 'lib/metadata';

export const metadata = createPageMetadata({
  title: 'Kayıt Ol | otuzaltıpoz',
  description: 'Otuzaltıpoz’a üye ol ve fotoğrafçılık topluluğunda yerini al.',
  path: '/register',
  image: '/og-register.jpg',
});

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
  if (refreshToken) {
    redirect('/');
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <Image src="/images/register-bg.jpg" alt="Background" fill className="object-cover" priority />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[rgba(245,240,233,0.9)] to-[rgba(245,240,233,0.4)]"></div>
      <div className="relative z-10 bg-[#f5f0e9] p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-[#ef7464] mb-6 text-center">Kayıt Ol</h1>
        <SignupForm />
      </div>
    </div>
  );
}

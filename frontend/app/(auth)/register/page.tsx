import Image from 'next/image';
import SignupForm from '../../../component/signup';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
  if (refreshToken) {
    redirect('/');
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80"
        alt="Background"
        fill // full parent alanını kaplar
        style={{ objectFit: 'cover' }}
        priority // sayfa açılışında öncelikli yükleme
      />
      <div className="relative z-10 bg-[#f5f0e9] p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-[#ef7464] mb-6 text-center">Kayıt Ol</h1>
        <SignupForm />
      </div>
    </div>
  );
}

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginForm from '../../../component/login';

export default async function LoginPage() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get('refreshToken')?.value;
  if (refreshToken) {
    redirect('/');
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1593606497976-50723c6e9573?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <div className="bg-[#f5f0e9] p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-[#ef7464] mb-6 text-center">Giriş Yap</h1>
        <LoginForm />
      </div>
    </div>
  );
}

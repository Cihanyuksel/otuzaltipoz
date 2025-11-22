import React from 'react';
import Button from '@/common/button';

interface ILogin {
  onRedirect: (e: React.MouseEvent) => void;
}

export default function Login({ onRedirect }: ILogin) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center space-y-4 animate-in fade-in duration-300">
      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2">
        <span className="text-2xl">🔒</span>
      </div>
      <h4 className="font-bold text-gray-100">Giriş Yapmalısın</h4>
      <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
        AI destekli fotoğraf analizi özelliğini kullanabilmek için lütfen hesabına giriş yap.
      </p>
      <Button
        onClick={onRedirect}
        className="w-full max-w-[200px] py-2 bg-[#ef7464] hover:bg-[#ef7464ca] text-white text-xs font-semibold rounded-lg transition-colors"
      >
        Giriş Yap
      </Button>
    </div>
  );
}

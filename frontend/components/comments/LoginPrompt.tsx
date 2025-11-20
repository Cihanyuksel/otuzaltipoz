import Button from '../common/button';
import { PiDotsThreeCircle as ThreeDot } from 'react-icons/pi';

interface ILoginPrompt {
  onLogin: () => void;
}

export default function LoginPrompt({ onLogin }: ILoginPrompt) {
  return (
    <div className="z-10 flex flex-col items-center justify-center bg-opacity-80 rounded-lg text-center p-8 bg-white border border-gray-100 shadow-sm">
      <ThreeDot size={80} className="mb-5 text-gray-400" />
      <p className="text-xl text-gray-700 font-semibold mb-2">Yorumları görmek ister misin?</p>
      <p className="text-sm text-gray-500 mb-6">
        Yorumları görüntülemek ve kendi yorumunu bırakmak için giriş yapmalısın.
      </p>
      <Button onClick={onLogin} variant="primary" size="medium">
        Giriş Yap
      </Button>
    </div>
  );
}

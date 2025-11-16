'use client';

interface ILoader {
  text?: string;
  className?: string;
}

const Loader = ({ text = 'Yükleniyor...', className = 'min-h-screen' }: ILoader) => {
  return (
    <div className={`flex flex-col items-center justify-center text-gray-800 ${className}`}>
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#ef7464]"></div>
      <p className="mt-4 text-lg font-semibold">{text}</p>
    </div>
  );
};

export default Loader;

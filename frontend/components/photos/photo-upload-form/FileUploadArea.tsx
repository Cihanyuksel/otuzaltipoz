import { useState, useEffect } from 'react';
import { CiCloudOn as CloudIcon } from 'react-icons/ci';
import { FaCheckCircle as CheckIcon } from 'react-icons/fa';
import { UseFormRegisterReturn } from 'react-hook-form';

interface IFileUploadAreaP {
  fileName: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegisterReturn;
  error?: string;
}

function FileUploadArea({ fileName, onFileChange, register, error }: IFileUploadAreaP) {
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    if (fileName !== 'Dosya Seçilmedi') {
      setShowCheckmark(true);
      const timer = setTimeout(() => setShowCheckmark(false), 2500);
      return () => clearTimeout(timer);
    } else {
      setShowCheckmark(false);
    }
  }, [fileName]);

  return (
    <div
      className={`
        flex flex-col items-center justify-center bg-[#f5f1ea] rounded-lg border-2 border-dashed px-6 py-10 text-center 
        ${fileName !== 'Dosya Seçilmedi' ? 'border-green-700' : 'border-[#a6b8b1]'}
      `}
    >
      <CloudIcon className={`text-5xl ${fileName !== 'Dosya Seçilmedi' ? 'text-green-700' : 'text-gray-400'}`} />
      <p className="mt-4 text-lg font-semibold text-gray-500">
        Sürükleyip bırakın veya yüklemek için tıklayın
      </p>
      <p className={`mt-1 text-sm ${fileName !== 'Dosya Seçilmedi' ? 'text-[#1b140e]' : 'text-gray-500'}`}>
        <span className="font-bold">{fileName}</span>
      </p>

      <label
        className="mt-6 flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#ef7464] h-10 px-6 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#ef7464df]"
        htmlFor="file-upload"
      >
        {showCheckmark ? (
          <div className="flex items-center space-x-2 transition-transform duration-300 transform scale-110">
            <CheckIcon className="h-5 w-5" />
            <span className="truncate">Seçildi</span>
          </div>
        ) : (
          <span className="truncate">Fotoğraf seç</span>
        )}
      </label>

      <input
        id="file-upload"
        type="file"
        className="hidden"
        {...register}
        onChange={(e) => {
          register.onChange(e); // react-hook-form’a bildir
          onFileChange(e);      // local state’i güncelle
        }}
      />

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default FileUploadArea;

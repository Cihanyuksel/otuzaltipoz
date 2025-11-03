import { IoClose as CloseIcon } from 'react-icons/io5';

interface IHeader {
  handleCloseAndReset: () => void;
  isPending: boolean;
}

function Header({ handleCloseAndReset, isPending }: IHeader) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-[#ef7464]">
      <h3 className="text-lg font-medium text-gray-100">Profili Düzenle</h3>

      <button
        type="button"
        onClick={handleCloseAndReset}
        disabled={isPending}
        className="rounded-md p-2 cursor-pointer text-white hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <CloseIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

export default Header;

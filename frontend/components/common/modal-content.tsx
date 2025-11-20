interface IModalContent {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
}

const ModalContent = ({ children, isOpen, className = 'bg-white rounded-lg' }: IModalContent) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`relative w-full max-w-lg shadow-xl transform transition-all duration-300 ease-in-out
                ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'} 
                ${className}`}
    >
      {children}
    </div>
  );
};

export default ModalContent;

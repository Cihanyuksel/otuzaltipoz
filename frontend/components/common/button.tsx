interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

const Button = ({ variant = 'primary', size = 'medium', children, className, ...props }: ButtonProps) => {
  const baseStyle = 'flex justify-center items-center gap-2 rounded-md transition-colors duration-200 cursor-pointer shadow-sm';

  const variantStyles = {
    primary: 'bg-[#ef7464] text-white hover:bg-[#ef7464]/80',
    secondary: 'bg-[#d3deda] text-gray-800 hover:bg-gray-300 ',
    danger: 'bg-red-500 text-white hover:bg-red-600 ',
    tertiary: 'text-black hover:text-black/60 border border-gray-300',
  };

  const sizeStyles = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-7 py-2 text-md',
  };

  const combinedClasses = `${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`;

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;

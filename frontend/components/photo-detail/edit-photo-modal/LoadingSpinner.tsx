interface LoadingSpinnerProps {
  text?: string;
}

export const LoadingSpinner = ({ text = 'Yükleniyor...' }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
      {text}
    </div>
  );
};

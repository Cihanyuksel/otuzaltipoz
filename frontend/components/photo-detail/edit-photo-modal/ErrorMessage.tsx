interface ErrorMessageProps {
  error: Error | null;
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  if (!error) return null;

  return (
    <div className="mb-4 text-red-600 text-sm p-3 bg-red-50 rounded-md border border-red-200">
      {error instanceof Error ? error.message : 'Güncelleme sırasında bir hata oluştu. Lütfen tekrar deneyin.'}
    </div>
  );
};

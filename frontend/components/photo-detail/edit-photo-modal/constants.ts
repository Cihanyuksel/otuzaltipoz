export const MODAL_STYLES = {
  OVERLAY: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#f5f1ea]/50',
  HEADER: 'flex items-center justify-between p-6 border-b border-gray-200 bg-[#ef7464]',
  CLOSE_BUTTON: 'rounded-md p-2 cursor-pointer text-white hover:text-gray-600 hover:bg-gray-100 transition-colors',
} as const;

export const FORM_PLACEHOLDERS = {
  TITLE: 'Fotoğraf başlığı',
  DESCRIPTION: 'Fotoğraf açıklaması (isteğe bağlı)',
  TAGS: 'doğa, manzara, güneş (virgülle ayırın)',
} as const;

import React, { ReactNode } from 'react';

interface AboutUsLayoutProps {
  children: ReactNode;
}

const AboutUsLayout: React.FC<AboutUsLayoutProps> = ({ children }) => {
  return (
    <div>
      {children}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-gray-900">Bize Ulaşın</h3>
              <p className="text-gray-600 mt-1">Soru, geri bildirim veya işbirliği talepleriniz için bize ulaşın.</p>
              <a className="text-[#e6a84c] hover:underline mt-2 inline-block" href="mailto:cihanyyuksel@gmail.com">
                cihanyyuksel@gmail.com
              </a>
            </div>
            <div className="flex justify-center space-x-6 mb-4 md:mb-0">{/* Sosyal medya ikonları buraya */}</div>
            <p className="text-sm text-gray-500 mt-4 md:mt-0">© {new Date().getFullYear()} OTUZALTIPOZ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUsLayout;

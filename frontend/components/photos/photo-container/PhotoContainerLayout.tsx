'use client';
import { ReactNode } from 'react';

interface IPhotoContainerLayout {
  mobileHeader: ReactNode;
  mobileMenu: ReactNode;
  sidebar: ReactNode;
  content: ReactNode;
}

const PhotoContainerLayout = ({ mobileHeader, mobileMenu, sidebar, content }: IPhotoContainerLayout) => {
  return (
    <div className="flex flex-col min-h-screen">
      {mobileHeader}
      {mobileMenu}
      <div className="flex flex-1 relative">
        {sidebar}
        <main className='flex-1 overflow-y-auto p-4 bg-gray-100" id="scroll-container" aria-label="Fotoğraf Listesi'>
          {content}
        </main>
      </div>
    </div>
  );
};

export default PhotoContainerLayout;

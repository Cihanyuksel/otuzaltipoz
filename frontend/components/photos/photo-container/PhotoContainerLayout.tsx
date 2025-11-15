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
        {content}
      </div>
    </div>
  );
};

export default PhotoContainerLayout;

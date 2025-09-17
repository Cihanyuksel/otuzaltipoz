import React, { ReactNode } from 'react';
import Footer from '@/components/common/footer';

interface PhotosLayoutProps {
  children: ReactNode;
}

const PhotosLayout: React.FC<PhotosLayoutProps> = ({ children }) => {
  return (
    <div>
      {children}
      <Footer />
    </div>
  );
};

export default PhotosLayout;

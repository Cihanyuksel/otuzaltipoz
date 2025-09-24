import React, { ReactNode } from 'react';
import Footer from '@/components/common/footer';

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div className='h-full flex flex-col'>
      {children}
      <Footer />
    </div>
  );
};

export default UserLayout;

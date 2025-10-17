import { ReactNode } from 'react';
import Footer from '@/components/common/footer';

interface ProfileLayoutProps {
  children: ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

export default ProfileLayout;

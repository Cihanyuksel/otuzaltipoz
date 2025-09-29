import { ReactNode } from 'react';
import Footer from '@/components/common/footer';

interface IHomeLayout {
  children: ReactNode;
}

const HomeLayout: React.FC<IHomeLayout> = ({ children }) => {
  return (
    <div>
      {children}
      <Footer />
    </div>
  );
};

export default HomeLayout;

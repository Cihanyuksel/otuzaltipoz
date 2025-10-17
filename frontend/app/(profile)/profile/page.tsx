import { Metadata } from 'next';
import UserProfileContainer from '@/components/user-profile/UserProfileContainer';
import { createPageMetadata } from 'lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Profil | otuzaltıpoz',
  description: 'Kendi profilinizi görüntüleyin, fotoğraflarınızı yönetin ve toplulukla etkileşime geçin.',
  path: '/profile',
  image: '/og-user-profile.jpg',
});

export default async function UserProfilePage() {
  
  return <UserProfileContainer />;
}

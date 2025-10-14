import UserProfileContainer from '@/components/user-profile/UserProfileContainer';
import { createPageMetadata } from 'lib/metadata';
import { userService } from 'services/userService';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await userService.getUser(id).catch(() => null);
  const username = user?.username || 'Kullanıcı';

  return createPageMetadata({
    title: `kullanıcı: ${username} | otuzaltıpoz`,
    description: `${username} kullanıcısının profilini inceleyin. Fotoğraflarını, paylaşımlarını ve topluluk etkileşimlerini keşfedin.`,
    path: `/biri/${id}`,
    image: '/og-user-profile.jpg',
  });
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UserProfileContainer userId={id} />;
}

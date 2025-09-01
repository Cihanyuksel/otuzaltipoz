'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

interface IProtectedRoute {
  children: React.ReactNode;
  requireAuth?: boolean;
  guestOnly?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAuth,
  guestOnly,
}: IProtectedRoute) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      setReady(true);

      if (guestOnly && user) {
        router.replace('/');
      }

      if (requireAuth && !user) {
        router.replace('/');
      }
    }
  }, [loading, user, guestOnly, requireAuth, router]);

  if (!ready) return null;
  if (guestOnly && user) return null;
  if (requireAuth && !user) return null;

  return <>{children}</>;
}

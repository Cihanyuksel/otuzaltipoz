export const canManagePhoto = (userRole: string | null | undefined, isOwnerPhoto: boolean): boolean => {
  return userRole === 'admin' || isOwnerPhoto;
};

export const isAdmin = (user?: { role?: string | null }): boolean => {
  return user?.role === 'admin';
};

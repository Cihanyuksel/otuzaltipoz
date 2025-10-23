export const canManage = (userRole: string | null | undefined, isOwnerPhoto: boolean): boolean => {
  return userRole === 'admin' || userRole === 'moderator' || isOwnerPhoto;
};

export const isAdmin = (user?: { role?: string | null }): boolean => {
  return user?.role === 'admin';
};

export const isAdminOrModerator = (user?: { role?: string | null }): boolean => {
  return user?.role === 'admin' || user?.role === 'moderator';
};

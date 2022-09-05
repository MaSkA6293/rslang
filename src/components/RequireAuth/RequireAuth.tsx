import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectUserId } from '../../features/auth/authSlice';

export default function RequireAuth({
  children,
}: {
  children: React.ReactElement;
}) {
  const userId = useAppSelector(selectUserId);

  if (!userId) return <Navigate to="/" replace />;
  return children;
}

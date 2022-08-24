import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../features/auth/authSlice';

export default function RequireAuth({
  children,
}: {
  children: React.ReactElement;
}) {
  const { token } = useAppSelector(selectCurrentUser);

  if (!token) return <Navigate to="/" replace />;
  return children;
}

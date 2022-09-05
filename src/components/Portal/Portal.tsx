import React from 'react';
import { createPortal } from 'react-dom';

type props = {
  open: boolean;
  children: React.ReactNode;
};

export default function Portal({ open, children }: props) {
  if (!open) return null;

  return createPortal(
    <div>{children}</div>,
    document.getElementById('portal') as Element,
  );
}

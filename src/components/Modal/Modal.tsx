import React from 'react'
import styles from './modal.module.scss'

type props = {
  open: boolean,
  children: React.ReactNode
}

export default function Modal({open, children}: props) {
  if (!open) return null;
  return (
    <div>
      {children}    
    </div>
  )
}
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import styles from './Auth.module.scss';
import Authorization from './Authorization/Authorization';
import Registration from './Registation/Registration';

export interface AuthModal {
  close: () => void;
}


export default function Auth({ close }: AuthModal) {
  const [view, setView] = useState<'reg' | 'log'>('log')
  const handleMouse = (e: React.MouseEvent) => {
    if (e.button === 0) close()
  }

  return (
    <Modal open>
      <div onMouseDown={handleMouse} className={styles.formWrapper}>
        <div onMouseDown={(e) => e.stopPropagation()} className={styles.formInner}>
        <button className={styles.closeBtn} onClick={close}>x</button>
          {
            view === 'reg'
            ? <Registration />
            : <Authorization />
          }
          <div>
            {
              view === 'reg'
              ? <button onClick={() => setView('log')}>Уже есть аккаунт</button>
              : <button onClick={() => setView('reg')}>Зарегистрироваться</button>
            }
          </div>
        </div>
      </div>
    </Modal>
  );
}

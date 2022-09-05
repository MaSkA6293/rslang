import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Portal from '../Portal/Portal';
import Authorization from './Authorization/Authorization';
import Registration from './Registation/Registration';
import styles from './Auth.module.scss';
import './index.scss'

type props = {
  show: boolean;
  handleClose: () => void;
};

export default function Auth({ show, handleClose }: props) {
  const [isLog, setIsLog] = useState(true);

  return (
    <Portal open>
      <Modal centered show={show} onHide={handleClose}>
        <div className={styles.wrapper}>
          {isLog ? <Authorization /> : <Registration />}
          <Button size="sm" onClick={() => setIsLog((prev) => !prev)}>
            {isLog
              ? 'У вас еще нет аккаунта? Зарегистрируйтесь.'
              : 'У вас уже есть аккаут? Авторизуйтесь.'}
          </Button>
        </div>
      </Modal>
    </Portal>
  );
}

import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDeleteUserMutation, useGetUserQuery } from '../../API/userApi';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logOut, selectCurrentUser } from '../../features/auth/authSlice';
import DelayLoader from '../games/components/DelayLoader/DelayLoader';
import ChangeProfile from './components/ChangeProfile';
import styles from './index.module.scss';

export default function Profile() {
  const dispatch = useAppDispatch();
  const { userId } = useAppSelector(selectCurrentUser);
  const { data, isLoading } = useGetUserQuery({ userId: userId! });
  const [deleteUser] = useDeleteUserMutation();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className={styles.wraper}>
      <DelayLoader {...{ isLoading }}>
        <>
          <div>
            <h3>{data?.email}</h3>
            <h2>{data?.name}</h2>
          </div>

          <div className={styles.btnWrap}>
            <Button size="sm" onClick={() => dispatch(logOut())}>
              Выйти с аккаунта
            </Button>
            <Button
              size="sm"
              onClick={async () => {
                await deleteUser({ userId: userId! });
                dispatch(logOut());
              }}
            >
              {' '}
              Удалить аккаунт
            </Button>
            {data && (
              <>
                <Button size="sm" onClick={handleShow}>
                  Изменить данные
                </Button>
                <Modal centered show={show} onHide={handleClose}>
                  <div className={styles.modalWrap}>
                    <ChangeProfile
                      {...{ nameInitial: data.name, emailInitial: data.email, handleClose }}
                    />
                  </div>
                </Modal>
              </>
            )}
          </div>
        </>
      </DelayLoader>
    </div>
  );
}

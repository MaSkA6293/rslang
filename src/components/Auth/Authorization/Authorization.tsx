/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../../../API/userApi';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  selectCurrentUser,
  setCredential,
} from '../../../features/auth/authSlice';
import styles from './authorization.module.scss';

export interface loginRequest {
  email: string;
  password: string;
}
export default function Authorization() {
  const dispatch = useAppDispatch();
  const [userLogin, { isLoading }] = useLoginMutation();
  const [error, setError] = useState('');
  const user = useAppSelector(selectCurrentUser);

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    setFocus,
    watch,
  } = useForm<loginRequest>({
    mode: 'onChange',
  });

  const onSubmit = async (request: loginRequest) => {
    userLogin(request)
      .unwrap()
      .then((userData) => {
        dispatch(setCredential({ ...userData }));
        dispatch(setCredential({ ...userData, ...{token: null} }));
      })
      .catch((e) => {
        if (e.originalStatus === 404) {
          setError('Пользователь не существует');
        } else if (e.originalStatus === 403) {
          setError('Неправильный пароль');
        } else {
          setError('Произошла непредвиденная ошибка');
        }
      });
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setFocus('email');
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1>Авторизация</h1>
      <label>
        Email:
        <input
          className={styles.input}
          type="email"
          {...register('email', {
            required: 'Поле обязательно к заполнению',
            pattern: {
              value:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: 'Почта некорректна',
            },
            onChange: () => setError(''),
          })}
        />
      </label>
      <div className={styles.errorWrap}>
        {errors?.email && (
          <p className={styles.errorText}>
            {(errors?.email?.message as String) || 'Error!'}
          </p>
        )}
      </div>
      <label>
        Password:
        <input
          className={styles.input}
          type="password"
          {...register('password', {
            required: 'Поле обязательно к заполнению',
            onChange: () => setError(''),
          })}
        />
      </label>
      <div className={styles.errorWrap}>
        {errors?.password && (
          <p className={styles.errorText}>
            {(errors?.password?.message as String) || 'Error!'}
          </p>
        )}
      </div>
      <input
        disabled={!isValid || isLoading}
        className={styles.btn}
        type="submit"
        value={isLoading ? 'Загрузка' : 'Отправить'}
      />
      <p>{error}</p>
    </form>
  );
}

/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginMutation, useRegisterMutation } from '../../../API/userApi';
import { useAppDispatch } from '../../../app/hooks';
import { setCredential } from '../../../features/auth/authSlice';
import styles from './Registration.module.scss';

export interface registerRequest {
  name: string;
  email: string;
  password: string;
}

export default function Registration() {
  const [userRegister, { isLoading }] = useRegisterMutation();
  const [error, setError] = useState('');

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    resetField,
  } = useForm<registerRequest>({
    mode: 'onChange',
  });

  const onSubmit = async (request: registerRequest) => {
    userRegister(request)
      .unwrap()
      .then(() => {
        setError('Аккаунт создан');
        resetField('email');
        resetField('name');
        resetField('password');
  
      })
      .catch((e) => {
        if (e.originalStatus === 417) {
          setError('Пользователь с таким email уже существует');
        } else {
          setError('Произошла непредвиденная ошибка');
        }
      });
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1>Регистрация</h1>
      <label>
        Name:
        <input
          className={styles.input}
          type="text"
          {...register('name', {
            required: 'Поле обязательно к заполнению',
          })}
        />
      </label>
      <div className={styles.errorWrap}>
        {errors?.name && (
          <p className={styles.errorText}>
            {(errors?.name?.message as String) || 'Error!'}
          </p>
        )}
      </div>
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
            minLength: {
              value: 6,
              message: 'Минимум 6 символов',
            },
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

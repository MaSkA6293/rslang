/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useUpdateUserMutation } from '../../../API/userApi';
import { useAppSelector } from '../../../app/hooks';
import { selectCurrentUser } from '../../../features/auth/authSlice';

export interface registerRequest {
  name: string;
  email: string;
  password: string;
}

type props = {
  nameInitial: string;
  emailInitial: string;
  handleClose: () => void;
};

export default function ChangeProfile({
  nameInitial,
  emailInitial,
  handleClose,
}: props) {
  const [error, setError] = useState('');
  const { userId } = useAppSelector(selectCurrentUser);
  const [updateUser, { isLoading }] = useUpdateUserMutation();


  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    resetField,
    setFocus,
    setValue
  } = useForm<registerRequest>({
    mode: 'onChange',
  });

  useEffect(() => {
    setFocus('name');
    setValue('name', nameInitial)
    setValue('email', emailInitial)
  }, []);

  const onSubmit = async (request: registerRequest) => {
    updateUser({ userId, body: request })
      .unwrap()
      .then(() => {
        setError('Данные обновлены');
        setTimeout(() => {
          handleClose();
        }, 1500);
        resetField('email');
        resetField('name');
        resetField('password');
      })
      .catch(() => {
        setError('Произошла непредвиденная ошибка');
      });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flexColumn">
      <Form.Group>
        <Form.Label>Имя</Form.Label>
        <Form.Control
          type="text"
          placeholder="Введите ваше имя"
          {...register('name', {
            minLength: {
              value: 3,
              message: 'Минимум 3 символов',
            },
            required: 'Поле обязательно к заполнению',
          })}
        />
        {errors?.name && (
          <Form.Text className="text-muted">
            {errors?.name?.message || 'Error!'}
          </Form.Text>
        )}
      </Form.Group>
      <Form.Group>
        <Form.Label>Адрес электронной почты</Form.Label>
        <Form.Control
          type="email"
          placeholder="Введите адрес почты"
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
        {errors?.email && (
          <Form.Text className="text-muted">
            {errors?.email?.message || 'Error!'}
          </Form.Text>
        )}
      </Form.Group>
      <Form.Group>
        <Form.Label>Пароль</Form.Label>
        <Form.Control
          type="password"
          placeholder="Введите пароль"
          {...register('password', {
            required: 'Поле обязательно к заполнению',
            minLength: {
              value: 8,
              message: 'Минимум 8 символов',
            },
            onChange: () => setError(''),
          })}
        />
        {errors?.password && (
          <Form.Text className="text-muted">
            {errors?.password?.message || 'Error!'}
          </Form.Text>
        )}
        <Form.Text className="text-muted">{error}</Form.Text>
      </Form.Group>
      <Button
        style={{ marginTop: '1em' }}
        type="submit"
        variant="primary"
        disabled={!isValid || isLoading}
      >
        {isLoading ? (
          <Spinner
            as="span"
            animation="border"
            variant="warning"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        ) : (
          'Обновить данные'
        )}
      </Button>
    </Form>
  );
}

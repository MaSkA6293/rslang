/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../../../API/userApi';
import { useAppDispatch } from '../../../app/hooks';
import { setCredential } from '../../../features/auth/authSlice';

export interface loginRequest {
  email: string;
  password: string;
}
export default function Authorization() {
  const dispatch = useAppDispatch();
  const [userLogin, { isLoading }] = useLoginMutation();
  const [error, setError] = useState('');

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    setFocus,
  } = useForm<loginRequest>({
    mode: 'onChange',
  });

  const onSubmit = async (request: loginRequest) => {
    userLogin(request)
      .unwrap()
      .then((userData) => {
        dispatch(setCredential({ ...userData }));
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
    setFocus('email');
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className='flexColumn'>
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
            {(errors?.email?.message) || 'Error!'}
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
            {(errors?.password?.message) || 'Error!'}
          </Form.Text>
        )}
      </Form.Group>
      <Form.Text className="text-muted">{error}</Form.Text>
      <Button className='auth__btn' type="submit" variant="primary" disabled={!isValid || isLoading}>
       {isLoading
       ?(
        <Spinner
        as="span"
        animation="border"
        variant='warning'
        size="sm"
        role="status"
        aria-hidden="true"
      />
       )
       : (
        'Авторизоваться'
       )
       }
      </Button>
    </Form>
  );
}

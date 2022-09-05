/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useLoginMutation, useRegisterMutation } from '../../../API/userApi';
import { useAppDispatch } from '../../../app/hooks';
import { setCredential } from '../../../features/auth/authSlice';

export interface registerRequest {
  name: string;
  email: string;
  password: string;
}



export default function Registration() {
  const dispatch = useAppDispatch()
  const [userRegister, { isLoading }] = useRegisterMutation();
  const [userLogin] = useLoginMutation()
  const [error, setError] = useState('');

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    resetField,
    setFocus
  } = useForm<registerRequest>({
    mode: 'onChange',
  });

  useEffect(() => {
    setFocus('name')
  }, [])
  

  const onSubmit = async (request: registerRequest) => {
    userRegister(request)
      .unwrap()
      .then(() => {
        setError('Аккаунт создан, заходим в аккаунт');
        resetField('email');
        resetField('name');
        resetField('password');
        setTimeout(() => {
          userLogin(request)
          .unwrap()
          .then((userData) => {
            dispatch(setCredential({...userData}));
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
        }, 500);
      })
      .catch((e) => {
        if (e.originalStatus === 417) {
          setError('Пользователь с таким email уже существует');
        } else {
          setError('Произошла непредвиденная ошибка');
        }
      });
  };


  return (
    <Form onSubmit={handleSubmit(onSubmit)} className='flexColumn'>
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
            {(errors?.name?.message) || 'Error!'}
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
        <Form.Text className="text-muted">{error}</Form.Text>
      </Form.Group>
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
        'Зарегистрироваться'
       )
       }
      </Button>
      
    </Form>
  );
}

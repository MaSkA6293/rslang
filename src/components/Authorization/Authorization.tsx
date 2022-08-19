/* eslint-disable no-console */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { IUser, useCreateUserMutation } from '../../API/userApi';
import { useAppDispatch } from '../../app/hooks';
import { toggleShow } from '../../features/auth/authSlice';
import styles from './authorization.module.scss';

export default function Authorization() {
  // const [user, setstate] = useState('')
  const [addUser, {
    data
  }] = useCreateUserMutation()
  const dispatch = useAppDispatch();

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IUser>({
    mode: 'onBlur',
  });
  const onSubmit = async (request: IUser) => {
    console.log(JSON.stringify(request))
    addUser(request)
    console.log(data)
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBounders = () => {
    dispatch(toggleShow());
  };

  return createPortal(
    <div  className={styles.formWrapper} onClick={handleBounders}>
      
      <div className={styles.fromInner} onClick={(e) => e.stopPropagation()}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
          <input disabled={!isValid} className={styles.btn} type="submit" />
        </form>
      </div>
    </div>,
    document.getElementById('portal') as Element,
  );
}

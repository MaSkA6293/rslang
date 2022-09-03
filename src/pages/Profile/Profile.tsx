/* eslint-disable no-console */
import { useState } from 'react';
import { useDeleteUserMutation, useGetUserQuery, useUpdateUserMutation } from '../../API/userApi';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logOut, selectCurrentUser } from '../../features/auth/authSlice';

export default function Profile() {
  const dispatch = useAppDispatch();
  const { userId } = useAppSelector(selectCurrentUser);
  const { data, isLoading } = useGetUserQuery({ userId: userId! });
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div>
      <button onClick={() => dispatch(logOut())}>Выйти с аккаунта</button>
      <button
        onClick={async () => {
          await deleteUser({ userId: userId! });
          dispatch(logOut());
        }}
      >
        Удалить аккаунт
      </button>
      {isLoading && <p>Loading...</p>}
      <h2>{data?.email}</h2>
      <h2>{data?.name}</h2>
      <div>
        <input placeholder='Email' type="text" onChange={(e) => setEmail(e.target.value)} />
        <input placeholder='Name' type="text" onChange={(e) => setName(e.target.value)} />
        <input placeholder='Password' type="text" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={() => {
        updateUser({userId, body: {
          email,
          name,
          password
        }})
      }}>Обновить пользователя</button>
    </div>
  );
}

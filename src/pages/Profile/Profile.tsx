/* eslint-disable no-console */
import { useDeleteUserMutation, useGetUserQuery } from '../../API/userApi';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Header from '../../components/Header/Header';
import { logOut, selectCurrentUser } from '../../features/auth/authSlice';

export default function Profile() {
  const dispatch = useAppDispatch();
  const { userId } = useAppSelector(selectCurrentUser);
const { data, isLoading } = useGetUserQuery({userId: userId!});
  const [deleteUser] = useDeleteUserMutation();

  return (
    <div>
      <Header />
      <button onClick={() => dispatch(logOut())}>Выйти с аккаунта</button>
      <button
        onClick={async () => {
          await deleteUser({userId: userId!});
          dispatch(logOut());
        }}
      >
        Удалить аккаунт
      </button>
      {isLoading && <p>Loading...</p>}
      <h2>{data?.email}</h2>
      <h2>{data?.name}</h2>
    </div>
  );
}

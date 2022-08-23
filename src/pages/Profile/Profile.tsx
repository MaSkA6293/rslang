import { useGetUserQuery } from "../../API/userApi"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import Header from "../../components/Header/Header"
import { logOut, selectCurrentUser } from "../../features/auth/authSlice"


export default function Profile() {
  const dispatch = useAppDispatch()
  const {userId} = useAppSelector(selectCurrentUser)
  const {data, isLoading } = useGetUserQuery(userId)

  

  return (
    <div>
      <Header />
      <button onClick={() => dispatch(logOut())}>Выйти с аккаунта</button>
      {isLoading && <p>Loading...</p>}
      <h2>{data?.email}</h2>
    </div>
  )
}
import { useAppDispatch } from '../../../../app/hooks';
import { toggleShow } from '../../../../features/auth/authSlice';
import './index.scss';

export default function SignInBtn() {
  const dispatch = useAppDispatch();
  const handleBtn = () => {
    dispatch(toggleShow());
  };
  
  return (
    <button onClick={handleBtn} type="button" className="signIn">
      Войти
    </button>
  );
}

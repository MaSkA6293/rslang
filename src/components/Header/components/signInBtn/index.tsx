import { useState } from 'react';
import Auth from '../../../Auth/Auth';
import './index.scss';

export default function SignInBtn() {
  const [show, setShow ] = useState(false)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button
        onClick={handleShow}
        type="button"
        className="signIn"
      >
        Войти
      </button>
      <Auth {...{show, handleClose}}/>
    </>
  );
}

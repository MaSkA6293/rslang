import { useState } from 'react';
import Auth from '../../../Auth/Auth';
import './index.scss';


export default function SignInBtn() {
  const [iSAuthOpen, setISAuthOpen] = useState(false)

  
  return (
    <>
      <button onClick={() => setISAuthOpen(true)} type="button" className="signIn">
        Войти
      </button>
          {iSAuthOpen && <Auth close={() => setISAuthOpen(false)} />}
    </>

  );
}

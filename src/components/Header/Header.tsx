import { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectToken } from '../../features/auth/authSlice';
import { useAppDispatch } from '../../app/hooks';
import Nav from '../Nav';
import Burger from './components/burger';
import MobileMenu from './components/mobileMenu';
import ProfileBtn from './components/ProfileBtn/ProfileBtn';
import SignInBtn from './components/signInBtn';
import './index.scss';
import { setPath } from '../../features/app/app';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const token = useAppSelector(selectToken);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const currentPath = window.location.pathname;
    dispatch(setPath(currentPath));
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  return (
    <div className="header">
      <div className="header__container">
        <Nav />
        <Burger isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        <MobileMenu isOpen={isOpen} closeMenu={() => setIsOpen(false)} />
        {token ? <ProfileBtn /> : <SignInBtn />}
      </div>
    </div>
  );
}

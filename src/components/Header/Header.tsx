import './index.scss';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import Nav from '../Nav';
import Burger from './components/burger';
import MobileMenu from './components/mobileMenu';
import SignInBtn from './components/signInBtn';
import { setPath } from '../../features/app/app';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

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
        <SignInBtn />
      </div>
    </div>
  );
}

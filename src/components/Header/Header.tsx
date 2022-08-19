import './index.scss';
import { useState } from 'react';
import Nav from '../Nav';
import Burger from './components/burger';
import MobileMenu from './components/mobileMenu';
import SignInBtn from './components/signInBtn';
import Authorization from '../Authorization/Authorization';
import { useAppSelector } from '../../app/hooks';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthShow = useAppSelector((state) => state.auth.isShow);

  return (
    <div className="header">
      <div className="header__container">
        <Nav />
        <Burger isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        <MobileMenu isOpen={isOpen} closeMenu={() => setIsOpen(false)} />
        <SignInBtn />
        {isAuthShow && <Authorization />}
      </div>
    </div>
  );
}

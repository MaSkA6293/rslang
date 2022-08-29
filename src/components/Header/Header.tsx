import { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectToken } from '../../features/auth/authSlice';
import Nav from '../Nav';
import Burger from './components/burger';
import MobileMenu from './components/mobileMenu';
import ProfileBtn from './components/ProfileBtn/ProfileBtn';
import SignInBtn from './components/signInBtn';
import './index.scss';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const token = useAppSelector(selectToken);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  return (
    <div className="header">
      <div className="header__container">
        <Nav closeMobileMenu={() => undefined} />
        <Burger isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        <MobileMenu isOpen={isOpen} closeMenu={() => setIsOpen(false)} />
        {token ? <ProfileBtn /> : <SignInBtn />}
      </div>
    </div>
  );
}

import './index.scss';
import classNames from 'classnames';
import Nav from '../../../Nav';

interface IMobileMenuProps {
  isOpen: boolean;
  closeMenu: () => void;
}

export default function MobileMenu({ isOpen, closeMenu }: IMobileMenuProps) {
  return (
    <>
      {isOpen && (
        <div
          className="mobile-menu-back"
          onClick={() => closeMenu()}
          onKeyDown={() => closeMenu()}
          role="button"
          aria-label="close-mobile-menu"
          tabIndex={0}
        />
      )}
      <div
        className={classNames('mobile-menu', isOpen ? 'mobile-menu-open' : '')}
      >
        <Nav />
      </div>
    </>
  );
}

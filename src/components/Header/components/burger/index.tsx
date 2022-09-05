import './index.scss';
import classNames from 'classnames';

interface IBurgerProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function Burger({ isOpen, onClick }: IBurgerProps) {
  return (
    <button
      className={classNames(
        'header__menu-burger',
        'burger',
        isOpen ? 'header__menu-burger-close' : '',
      )}
      onClick={onClick}
    >
      <span className="burger__line" />
      <span className="burger__line" />
      <span className="burger__line" />
    </button>
  );
}

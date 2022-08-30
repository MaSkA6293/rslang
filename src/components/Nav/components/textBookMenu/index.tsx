import './index.scss';
import classNames from 'classnames';
import GamesLinks from '../GamesLinks/indes';

interface ITextBookMenu {
  handlerClick: (path: string) => void;
  disabled: boolean;
}

function TextBookMenu({ handlerClick, disabled }: ITextBookMenu) {
  return (
    <ul
      className={classNames(
        'navigation__list',
        'list',
        'navigation__list-text-book',
      )}
    >
      <GamesLinks handlerClick={handlerClick} disabled={disabled} />
    </ul>
  );
}

export default TextBookMenu;

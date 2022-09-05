import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

interface IMasterMenu {
  userId: string | null;
  handlerClick: (path: string) => void;
}

function MasterMenu({ handlerClick, userId }: IMasterMenu) {
  return (
    <ul className={classNames('navigation__list', 'list')}>
      <li className="list__item">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'list__item-active' : '')}
          onClick={() => handlerClick('/')}
        >
          Главная
        </NavLink>
      </li>
      <li className="list__item">
        <NavLink
          to="/textbook"
          className={({ isActive }) => (isActive ? 'list__item-active' : '')}
          onClick={() => handlerClick('/textbook')}
        >
          Учебник
        </NavLink>
      </li>
      <li className={classNames('list__item')}>
        <NavLink
          to="/audioCall"
          className={({ isActive }) => (isActive ? 'list__item-active' : '')}
          onClick={() => handlerClick('/')}
        >
          Аудиовызов
        </NavLink>
      </li>
      <li className={classNames('list__item')}>
        <NavLink
          to="/sprint"
          className={({ isActive }) => (isActive ? 'list__item-active' : '')}
          onClick={() => handlerClick('/')}
        >
          Спринт
        </NavLink>
      </li>{' '}
      {userId !== null ? (
        <li className="list__item">
          <NavLink
            to="/statistics"
            className={({ isActive }) => (isActive ? 'list__item-active' : '')}
            onClick={() => handlerClick('/')}
          >
            Статистика
          </NavLink>
        </li>
      ) : (
        ''
      )}
    </ul>
  );
}

export default MasterMenu;

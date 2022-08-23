import './index.scss';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';

function Nav() {
  return (
    <div className="nav">
      <ul className={classnames('nav__list', 'list')}>
        <li className="list__item">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'list__item-active' : '')}
          >
            Главная
          </NavLink>
        </li>
        <li className="list__item">
          <NavLink
            to="/textbook"
            className={({ isActive }) => (isActive ? 'list__item-active' : '')}
          >
            Учебник
          </NavLink>
        </li>
        <li className="list__item">
          <NavLink
            to="/audioCall"
            className={({ isActive }) => (isActive ? 'list__item-active' : '')}
          >
            Аудиовызов
          </NavLink>
        </li>
        <li className="list__item">
          <NavLink
            to="/sprint"
            className={({ isActive }) => (isActive ? 'list__item-active' : '')}
          >
            Спринт
          </NavLink>
        </li>
        <li className="list__item">
          <NavLink
            to="/statistics"
            className={({ isActive }) => (isActive ? 'list__item-active' : '')}
          >
            Статистика
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Nav;

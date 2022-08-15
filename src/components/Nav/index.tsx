import './index.scss';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <div className="nav">
      <ul className={classnames('nav__list', 'list')}>
        <li className="list__item">
          <Link to="/">Главная</Link>
        </li>
        <li className="list__item">
          <Link to="/dictionary">Учебник</Link>
        </li>
        <li className="list__item">
          <Link to="/audioCall">Аудиовызов</Link>
        </li>
        <li className="list__item">
          <Link to="/sprint">Спринт</Link>
        </li>
        <li className="list__item">
          <Link to="/statistics">Статистика</Link>
        </li>
      </ul>
    </div>
  );
}

export default Nav;

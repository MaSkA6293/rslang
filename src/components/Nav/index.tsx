import './index.scss';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

function Nav() {
  return (
    <div className="nav">
      <ul className={classNames('nav-list', 'list')}>
        <li className="list__item">
          <Link to="/">MainPage</Link>
        </li>
        <li className="list__item">
          <Link to="/dictionary">Dictionart</Link>
        </li>
        <li className="list__item">
          <Link to="/audioCall">AudioCall</Link>
        </li>
        <li className="list__item">
          <Link to="/sprint">SprintGame</Link>
        </li>
      </ul>
    </div>
  );
}

export default Nav;

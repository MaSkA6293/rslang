import Dropdown from 'react-bootstrap/Dropdown';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

interface IGamesLinks {
  handlerClick: (rout: string) => void;
  disabled: boolean;
}

function GamesLinks({ handlerClick, disabled }: IGamesLinks) {
  return (
    <>
      <li className={classNames('list__item', 'list__item-main')}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'list__item-active' : '')}
          onClick={() => handlerClick('/')}
        >
          Главная
        </NavLink>
      </li>

      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Тренировка
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <NavLink
            to="/audioCall"
            className={({ isActive }) =>
              classNames(
                isActive ? 'list__item-active' : '',
                'data-rr-ui-dropdown-item',
                'dropdown-item',
                disabled ? 'list__item-disabled' : '',
              )
            }
            onClick={() => handlerClick('/audioCall')}
          >
            Аудиовызов
          </NavLink>
          <NavLink
            to="/sprint"
            className={({ isActive }) =>
              classNames(
                isActive ? 'list__item-active' : '',
                'data-rr-ui-dropdown-item',
                'dropdown-item',
                disabled ? 'list__item-disabled' : '',
              )
            }
            onClick={() => handlerClick('/sprint')}
          >
            {' '}
            Спринт
          </NavLink>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

export default GamesLinks;

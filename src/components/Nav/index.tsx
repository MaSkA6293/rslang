import './index.scss';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  selectTextBook,
  selectLearnedPages,
} from '../../features/textBook/textBook';
import { selectView, setView } from '../../features/app/app';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { View } from '../../types';

function Nav() {
  const { group, page } = useAppSelector(selectTextBook);
  const learnedPages = useAppSelector(selectLearnedPages);
  const { userId } = useAppSelector(selectCurrentUser);
  const view = useAppSelector(selectView);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useAppDispatch();

  const updateLearnedPages = () => {
    const learned = learnedPages[group];
    if (learned.includes(page)) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  useEffect(() => {
    if (userId) {
      updateLearnedPages();
    }
    const path = window.location.href;
    const split = path.split('/');
    switch (split[split.length - 1]) {
      case 'textbook': {
        dispatch(setView(View.dictionary));
        break;
      }
      case View.sprint: {
        dispatch(setView(View.sprint));
        break;
      }
      case View.audioCall: {
        dispatch(setView(View.audioCall));
        break;
      }
      case View.statistics: {
        dispatch(setView(View.statistics));
        break;
      }
      default:
        dispatch(setView(View.main));
    }
  }, [page, group, view, learnedPages, userId]);

  return (
    <div className="navigation">
      <ul className={classNames('navigation__list', 'list')}>
        <li className="list__item">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'list__item-active' : '')}
            onClick={() => dispatch(setView(View.main))}
          >
            Главная
          </NavLink>
        </li>
        <li className="list__item">
          <NavLink
            to="/textbook"
            className={({ isActive }) => (isActive ? 'list__item-active' : '')}
            onClick={() => dispatch(setView(View.dictionary))}
          >
            Учебник
          </NavLink>
        </li>
        <li
          className={classNames(
            'list__item',
            disabled && view === View.dictionary ? 'list__item-disabled' : '',
          )}
        >
          <NavLink
            to="/audioCall"
            className={({ isActive }) => (isActive ? 'list__item-active' : '')}
            onClick={() => dispatch(setView(View.audioCall))}
          >
            Аудиовызов
          </NavLink>
        </li>
        <li
          className={classNames(
            'list__item',
            disabled && view === View.dictionary ? 'list__item-disabled' : '',
          )}
        >
          <NavLink
            to="/sprint"
            className={({ isActive }) => (isActive ? 'list__item-active' : '')}
            onClick={() => dispatch(setView(View.sprint))}
          >
            Спринт
          </NavLink>
        </li>
        <li className="list__item">
          <NavLink
            to="/statistics"
            className={({ isActive }) => (isActive ? 'list__item-active' : '')}
            onClick={() => dispatch(setView(View.statistics))}
          >
            Статистика
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Nav;

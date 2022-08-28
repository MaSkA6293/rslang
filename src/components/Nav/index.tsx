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

interface INav {
  closeMobileMenu: () => void;
}

function Nav({ closeMobileMenu }: INav) {
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

  const setCurrentView = () => {
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
  };

  const handlerClick = (path: string) => {
    switch (path) {
      case '/': {
        closeMobileMenu();
        dispatch(setView(View.main));
        break;
      }
      case '/textbook': {
        closeMobileMenu();
        dispatch(setView(View.dictionary));
        break;
      }
      case '/audioCall': {
        closeMobileMenu();
        dispatch(setView(View.audioCall));
        break;
      }
      case '/sprint': {
        closeMobileMenu();
        dispatch(setView(View.sprint));
        break;
      }
      case '/statistics': {
        closeMobileMenu();
        dispatch(setView(View.statistics));
        break;
      }
      default:
    }
  };

  useEffect(() => {
    if (userId) {
      updateLearnedPages();
    }
    setCurrentView();
  }, [page, group, view, learnedPages, userId]);

  return (
    <div className="navigation">
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
        <li
          className={classNames(
            'list__item',
            disabled && view === View.dictionary ? 'list__item-disabled' : '',
          )}
        >
          <NavLink
            to="/audioCall"
            className={({ isActive }) => (isActive ? 'list__item-active' : '')}
            onClick={() => handlerClick('/audioCall')}
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
            onClick={() => handlerClick('/sprint')}
          >
            Спринт
          </NavLink>
        </li>
        <li className="list__item">
          <NavLink
            to="/statistics"
            className={({ isActive }) => (isActive ? 'list__item-active' : '')}
            onClick={() => handlerClick('/statistics')}
          >
            Статистика
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Nav;

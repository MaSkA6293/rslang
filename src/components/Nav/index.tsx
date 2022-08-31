import './index.scss';
import { useEffect, useState } from 'react';
import {
  selectTextBook,
  selectLearnedPages,
} from '../../features/textBook/textBook';
import { selectView, setView, setPath } from '../../features/app/app';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { View } from '../../types';
import MasterMenu from './components/masterMenu';
import TextBookMenu from './components/textBookMenu';

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
    const currentPath = window.location.pathname;
    dispatch(setPath(currentPath));

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
    } else {
      setDisabled(false);
    }
    setCurrentView();
  }, [page, group, view, learnedPages, userId]);

  return (
    <div className="navigation">
      {view !== View.dictionary ? (
        <MasterMenu handlerClick={handlerClick} userId={userId} />
      ) : (
        <TextBookMenu handlerClick={handlerClick} disabled={disabled} />
      )}
    </div>
  );
}

export default Nav;

import React from 'react';
import './index.scss';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';
import ControlPanel from '../ControlPanel';
import TextBookContent from '../TextBookContent';
import DifficultWords from '../DifficultWords';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { selectCurrentUser } from '../../../../features/auth/authSlice';
import {
  selectTextBookView,
  setTextBookView,
} from '../../../../features/textBook/textBook';
import { textBookView } from '../../../../types';

function TextBook() {
  const view = useAppSelector(selectTextBookView);
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  const handleChange = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;

    if (user.userId === null) {
      dispatch(setTextBookView(textBookView.textBook));
    }

    if (target.classList.contains('text-book__dictionary-title')) {
      dispatch(setTextBookView(textBookView.dictionary));
    } else {
      dispatch(setTextBookView(textBookView.textBook));
    }
  };

  return (
    <div className="text-book">
      <div className="text-book__container">
        <div className="text-book__view-control-container">
          <Button
            className={classNames(
              'text-book__title',
              view === textBookView.textBook ? 'active' : '',
            )}
            onClick={handleChange}
          >
            Учебник
          </Button>
          {user.userId ? (
            <>
              <div className="text-book__separator" />
              <Button
                className={classNames(
                  'text-book__dictionary-title',
                  view === textBookView.dictionary ? 'active' : '',
                )}
                onClick={handleChange}
              >
                Сложные слова
              </Button>{' '}
            </>
          ) : (
            ''
          )}
        </div>

        {view === textBookView.dictionary && user.userId ? (
          <DifficultWords user={user} />
        ) : (
          <>
            <ControlPanel />
            <TextBookContent userId={user.userId} />
          </>
        )}
      </div>
    </div>
  );
}

export default TextBook;

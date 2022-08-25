import React from 'react';
import './index.scss';
import classNames from 'classnames';
import ControlPanel from '../ControlPanel';
import TextBookContent from '../TextBookContent';
import DifficultWords from '../DifficultWords';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import {
  selectTextBookView,
  setTextBookView,
} from '../../../../features/textBook/textBook';
import { textBookView } from '../../../../types';

function TextBook() {
  const view = useAppSelector(selectTextBookView);

  const dispatch = useAppDispatch();

  const handleChange = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('text-book__dictionary-title')) {
      dispatch(setTextBookView(textBookView.dictionary));
    } else {
      dispatch(setTextBookView(textBookView.textBook));
    }
  };

  const user = false;

  return (
    <div className="text-book">
      <div className="text-book__container">
        <div className="text-book__view-control-container">
          <button
            className={classNames(
              'text-book__title',
              view === textBookView.textBook ? 'active' : '',
            )}
            onClick={handleChange}
          >
            Учебник
          </button>
          {user ? (
            <>
              <div className="text-book__separator" />
              <button
                className={classNames(
                  'text-book__dictionary-title',
                  view === textBookView.dictionary ? 'active' : '',
                )}
                onClick={handleChange}
              >
                Сложные слова
              </button>{' '}
            </>
          ) : (
            ''
          )}
        </div>

        {view === textBookView.textBook ? (
          <>
            <ControlPanel />
            <TextBookContent />
          </>
        ) : (
          <DifficultWords />
        )}
      </div>
    </div>
  );
}

export default TextBook;

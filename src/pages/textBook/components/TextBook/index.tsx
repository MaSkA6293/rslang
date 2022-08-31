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
import {
  updateUserWord,
  createUserWord,
  getUserWords,
} from '../../../../API/wordsApiCRU';
import { IUserWords } from '../../../../API/types';
import {
  getNewWordDifficult,
  getNewWordLearned,
  modifyDifficulty,
  modifyLearned,
} from '../../utilites';

function TextBook() {
  const view = useAppSelector(selectTextBookView);
  const user = useAppSelector(selectCurrentUser);

  const dispatch = useAppDispatch();

  const handleChange = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('text-book__dictionary-title')) {
      dispatch(setTextBookView(textBookView.dictionary));
    } else {
      dispatch(setTextBookView(textBookView.textBook));
    }
  };

  const handlerActions = async (
    wordId: string,
    action: 'difficult' | 'learned',
  ) => {
    const userId = user.userId ? user.userId : '';
    const token = user.token ? user.token : '';
    const userWords: IUserWords[] | [] = await getUserWords(userId, token);
    const checkWord = userWords.find((el) => el.wordId === wordId);

    if (checkWord === undefined) {
      const newWord =
        action === 'difficult' ? getNewWordDifficult() : getNewWordLearned();

      const answer = await createUserWord(wordId, userId, token, newWord);
      if (answer !== undefined) {
        return true;
      }
      return false;
    }

    const modifyWordExample =
      action === 'difficult'
        ? modifyDifficulty(checkWord)
        : modifyLearned(checkWord);

    const modifyWordResponce = await updateUserWord(
      wordId,
      userId,
      token,
      modifyWordExample,
    );

    if (modifyWordResponce !== undefined) {
      return true;
    }
    return false;
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

        {view === textBookView.textBook ? (
          <>
            <ControlPanel />
            <TextBookContent
              userId={user.userId}
              handlerActions={handlerActions}
            />
          </>
        ) : (
          <DifficultWords user={user} handlerActions={handlerActions} />
        )}
      </div>
    </div>
  );
}

export default TextBook;

import classNames from 'classnames';
import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import {
  useGetUserStatisticQuery,
  useUpsertUserStatisticMutation
} from '../../../../API/userApi';
import {
  useGetAggregatedWordsQuery,
  useGetUserWordsQuery,
  useGetWordsQuery
} from '../../../../API/wordsApi';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectCurrentUser } from '../../../../features/auth/authSlice';
import {
  selectTextBook,
  selectTextBookView,
  setTextBookView
} from '../../../../features/textBook/textBook';
import { getTimeToday, makeDefaultDayStat, makeStartedDefaultStat } from '../../../../hooks/statHelper';
import { textBookView } from '../../../../types';
import DelayLoader from '../../../games/components/DelayLoader/DelayLoader';
import ControlPanel from '../ControlPanel';
import DifficultWords from '../DifficultWords';
import TextBookContent from '../TextBookContent';
import './index.scss';

function TextBook() {
  const view = useAppSelector(selectTextBookView);
  const user = useAppSelector(selectCurrentUser);
  const userId = user.userId ? user.userId : '';

  const dispatch = useAppDispatch();

  const { group, page } = useAppSelector(selectTextBook);

  const { data: words = [], isLoading: isWordsLoading } = useGetWordsQuery({
    page,
    group,
  });

  const { data: userWords = [], isLoading: isUserWordsLoading } =
    useGetUserWordsQuery(user, { skip: !user.userId });

  const {
    data: aggWords = [],
    isLoading: isAggWordsLoading,
    isError,
  } = useGetAggregatedWordsQuery(
    {
      userId,
      filter: JSON.stringify({ $and: [{ 'userWord.difficulty': 'yes' }] }),
    },
    { skip: !userId },
  );

  const [updateStat] = useUpsertUserStatisticMutation();
  const {
    data: stat,
    error: statError,
    isLoading: isStatLoading,
  } = useGetUserStatisticQuery({ userId }, { skip: !userId });

  useEffect(() => {
    const date = getTimeToday()
    if (!isStatLoading && (statError || !stat)) {
      if (statError) updateStat({userId, body: makeStartedDefaultStat()})
      if (stat && !Object.keys(stat.optional).includes(date)) {
        const body = makeDefaultDayStat({stat})
        updateStat({userId, body})
      }
    }
   }, [isStatLoading])

  const isLoading =
    isAggWordsLoading || isUserWordsLoading || isWordsLoading || isStatLoading;

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

  React.useEffect(() => {
    if (!user.userId) dispatch(setTextBookView(textBookView.textBook));
  }, []);

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
        <DelayLoader
          {...{ isLoading }}
          error={isError ? 'Произошла ошибка' : ''}
        >
          {view === textBookView.dictionary && user.userId ? (
            <DifficultWords
              {...{ userWords }}
              user={user}
              dataWordsRender={aggWords}
            />
          ) : (
            <>
              <ControlPanel />
              <TextBookContent {...{ userWords, words }} userId={user.userId} />
            </>
          )}
        </DelayLoader>
      </div>
    </div>
  );
}

export default TextBook;

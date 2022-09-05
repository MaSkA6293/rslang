import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { IGetWordRes, IUserWords } from '../../../../API/types';
import {
  useGetUserStatisticQuery,
  useUpsertUserStatisticMutation,
} from '../../../../API/userApi';
import {
  useCreateUserWordMutation,
  useUpdateUserWordMutation,
} from '../../../../API/wordsApi';
import { useAppSelector } from '../../../../app/hooks';
import { BACKEND_URL } from '../../../../constants';
import { selectTextBookView } from '../../../../features/textBook/textBook';
import { changeStatByLearnedWord } from '../../../../hooks/statHelper';
import {
  getNewWordLearned,
  modifyDifficulty,
  modifyLearned,
} from '../../utilites';
import ButtonDifficult from '../buttonDifficult';
import ButtonLearned from '../buttonLearned';
import Progress from '../Progress';
import './index.scss';

interface ICardInterface {
  card: IGetWordRes;
  color: string;
  playAudio: any;
  stopAudio: any;
  userId: string | null;
  userWords: IUserWords[];
  difficult: 'yes' | 'no';
  learned: boolean;
  statistics: { right: number; wrong: number; series: number };
}

function Card({
  card,
  color,
  playAudio,
  stopAudio,
  userId,
  difficult,
  learned,
  statistics,
  userWords,
}: ICardInterface) {
  const [loading, setLoading] = useState(false);
  const path = `${BACKEND_URL}/${card.image}`;
  const meaning = card.textMeaning.split(/<i>|<\/i>/gi);
  const textExample = card.textExample.split(/<b>|<\/b>/gi);

  const view = useAppSelector(selectTextBookView);

  const [wordUpdate] = useUpdateUserWordMutation();
  const [wordCreate] = useCreateUserWordMutation();

  useEffect(() => () => stopAudio(), []);

  const [updateStat] = useUpsertUserStatisticMutation();
  const { data: stat } = useGetUserStatisticQuery(
    { userId },
    { skip: !userId },
  );

  const statHandleLearnedWords = useCallback(
    ({
      isToDelete,
      learnedWordId,
    }: {
      isToDelete: boolean;
      learnedWordId: string;
    }) => {
      if (userId && stat) {
        updateStat({
          userId,
          body: changeStatByLearnedWord({ stat, learnedWordId, isToDelete }),
        });
      }
    },
    [stat, userId],
  );

  const handlerClick = async (
    wordId: string,
    action: 'difficult' | 'learned',
  ) => {
    setLoading(true);
    const check = userWords.find((el) => el.wordId === wordId);
    if (check !== undefined) {
      if (action === 'learned') {
        statHandleLearnedWords({
          isToDelete: check.optional.learned,
          learnedWordId: check.wordId !== null ? check.wordId : '',
        });
        await wordUpdate({
          userId: userId !== null ? userId : '',
          wordId,
          body: modifyLearned(check),
        });
        setLoading(false);
        return;
      }
      if (action === 'difficult') {
        await wordUpdate({
          userId: userId !== null ? userId : '',
          wordId,
          body: modifyDifficulty(check),
        });
        setLoading(false);
        return;
      }
    }

    if (check === undefined) {
      if (action === 'learned') {
        const word = getNewWordLearned();
        word.optional.learned = true;
        await wordCreate({
          userId: userId !== null ? userId : '',
          wordId,
          body: word,
        });
        statHandleLearnedWords({ isToDelete: false, learnedWordId: wordId });
        setLoading(false);
        return;
      }
      if (action === 'difficult') {
        const word = getNewWordLearned();
        word.difficulty = 'yes';
        await wordCreate({
          userId: userId !== null ? userId : '',
          wordId,
          body: word,
        });
        setLoading(false);
        return;
      }
    }
    setLoading(false);
  };

  return (
    <div
      className={classNames('card', !userId ? 'card-short' : '')}
      style={{ backgroundColor: color }}
    >
      <div
        className="card__image"
        style={{
          background: `no-repeat center url(${path})`,
          backgroundSize: 'cover',
        }}
      />
      <div className={classNames('card__content', 'content')}>
        <p className="content__title">
          {card.word} - {card.transcription} - {card.wordTranslate}
        </p>
        <ul className={classNames('content__meaning', 'meaning')}>
          <li>
            {meaning[0]} <i className="meaning__word">{meaning[1]}</i>
            {meaning[2]}{' '}
          </li>
          <li>{card.textMeaningTranslate} </li>
        </ul>

        <ul className={classNames('content__example', 'example-content')}>
          <li>
            {' '}
            {textExample[0]}
            <b className="example-content__word">{textExample[1]}</b>
            {textExample[2]}
          </li>
          <li>{card.textExampleTranslate}</li>
        </ul>
      </div>
      <div className={classNames('card__action', 'action')}>
        <div className="action__play">
          <button
            className="action__play-btn"
            aria-label="play"
            onClick={() =>
              playAudio(
                [card.audio, card.audioMeaning, card.audioExample],
                card.id,
              )
            }
          />
        </div>
        {userId ? (
          <>
            <div className="action__wrapper-buttons">
              <div className={classNames('action__contaner', 'contaner')}>
                <ButtonDifficult
                  handlerClick={handlerClick}
                  difficulty={difficult}
                  wordId={card.id}
                  loading={loading}
                />
              </div>
              {view === 'textbook' ? (
                <div className={classNames('action__contaner', 'contaner')}>
                  <ButtonLearned
                    handlerClick={handlerClick}
                    learned={learned}
                    wordId={card.id}
                    loading={loading}
                  />
                </div>
              ) : (
                ''
              )}
            </div>
            {statistics.right !== 0 || statistics.wrong !== 0 ? (
              <Progress
                right={statistics.right}
                wrong={statistics.wrong}
                series={statistics.series}
              />
            ) : (
              ''
            )}
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default Card;

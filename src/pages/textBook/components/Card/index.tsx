import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../app/hooks';
import { selectTextBookView } from '../../../../features/textBook/textBook';
import './index.scss';
import { BACKEND_URL } from '../../../../constants';
import { IGetWordRes, IUserWords } from '../../../../API/types';
import ButtonDifficult from '../buttonDifficult';
import ButtonLearned from '../buttonLearned';
import Progress from '../Progress';
import {
  useUpdateUserWordMutation,
  useCreateUserWordMutation,
} from '../../../../API/wordsApi';
import {
  modifyLearned,
  modifyDifficulty,
  getNewWordLearned,
} from '../../utilites';

interface ICardInterface {
  card: IGetWordRes;
  color: string;
  playAudio: any;
  stopAudio: any;
  userId: string | null;
  userWords: IUserWords[];
  difficult: 'yes' | 'no';
  learned: boolean;
  statistics: { right: number; wrong: number };
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

  const handlerClick = async (
    wordId: string,
    action: 'difficult' | 'learned',
  ) => {
    setLoading(true);
    const check = userWords.find((el) => el.wordId === wordId);
    if (check !== undefined) {
      if (action === 'learned') {
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
              <Progress right={statistics.right} wrong={statistics.wrong} />
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

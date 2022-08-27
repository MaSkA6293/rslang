import { useEffect, useState } from 'react';
import './index.scss';
import classNames from 'classnames';
import { BACKEND_URL } from '../../../../constants';
import { IGetWordRes } from '../../../../API/types';
import ButtonDifficult from '../buttonDifficult';
import ButtonLearned from '../buttonLearned';

interface ICardInterface {
  card: IGetWordRes;
  color: string;
  playAudio: any;
  stopAudio: any;
  userId: string | null;
  handlerActions: (
    wordId: string,
    action: 'difficult' | 'learned',
  ) => Promise<boolean>;
  difficult: 'yes' | 'no';
  learned: boolean;
}

function Card({
  card,
  color,
  playAudio,
  stopAudio,
  userId,
  handlerActions,
  difficult,
  learned,
}: ICardInterface) {
  const [isDifficult, setIsDifficult] = useState<'yes' | 'no'>(difficult);
  const [isLearned, setIsLearned] = useState<boolean>(learned);
  const [loading, setLoading] = useState(false);

  const path = `${BACKEND_URL}/${card.image}`;
  const meaning = card.textMeaning.split(/<i>|<\/i>/gi);
  const textExample = card.textExample.split(/<b>|<\/b>/gi);

  useEffect(() => () => stopAudio(), []);

  const handlerClick = async (
    wordId: string,
    action: 'difficult' | 'learned',
  ) => {
    setLoading(true);
    const setDiffResult = await handlerActions(wordId, action);
    if (setDiffResult) {
      if (action === 'difficult') {
        setIsDifficult(isDifficult === 'yes' ? 'no' : 'yes');
      }
      if (action === 'learned') {
        setIsLearned((learned) => !learned);
      }
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ backgroundColor: color }}>
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
        <div className="action__contaner">
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
            <div className={classNames('action__contaner', 'contaner')}>
              <ButtonDifficult
                handlerClick={handlerClick}
                difficulty={isDifficult}
                wordId={card.id}
                loading={loading}
              />
            </div>
            <div className={classNames('action__contaner', 'contaner')}>
              <ButtonLearned
                handlerClick={handlerClick}
                learned={isLearned}
                wordId={card.id}
                loading={loading}
              />
            </div>
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default Card;

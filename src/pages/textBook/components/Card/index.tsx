import { useEffect } from 'react';
import './index.scss';
import classNames from 'classnames';
import { BACKEND_URL } from '../../../../constants';
import { ICard } from '../../types';

function Card(props: {
  card: ICard;
  color: string;
  playAudio: any;
  stopAudio: any;
  user: any;
}) {
  const { card, color, playAudio, stopAudio, user } = props;

  const path = `${BACKEND_URL}/${card.image}`;
  const meaning = card.textMeaning.split(/<i>|<\/i>/gi);
  const textExample = card.textExample.split(/<b>|<\/b>/gi);

  useEffect(() => () => stopAudio(), []);

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
        {user ? (
          <>
            <div className={classNames('action__contaner', 'contaner')}>
              <button
                className="action__difficult-word"
                aria-label="add-difficult-words"
              >
                Сложное
              </button>
            </div>
            <div className={classNames('action__contaner', 'contaner')}>
              <button
                className="action__learned-word"
                aria-label="add-learned-words"
              >
                Изученное
              </button>
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

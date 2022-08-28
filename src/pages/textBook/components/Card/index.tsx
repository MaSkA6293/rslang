import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../app/hooks';
import { selectTextBookView } from '../../../../features/textBook/textBook';
import './index.scss';
import { BACKEND_URL } from '../../../../constants';
import { IGetWordRes } from '../../../../API/types';
import ButtonDifficult from '../buttonDifficult';
import ButtonLearned from '../buttonLearned';
import Progress from '../Progress';

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
  statistics: { right: number; wrong: number };
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
  statistics,
}: ICardInterface) {
  const [isDifficult, setIsDifficult] = useState<'yes' | 'no'>(difficult);
  const [isLearned, setIsLearned] = useState<boolean>(learned);
  const [loading, setLoading] = useState(false);

  const path = `${BACKEND_URL}/${card.image}`;
  const meaning = card.textMeaning.split(/<i>|<\/i>/gi);
  const textExample = card.textExample.split(/<b>|<\/b>/gi);

  const view = useAppSelector(selectTextBookView);

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
                  difficulty={isDifficult}
                  wordId={card.id}
                  loading={loading}
                />
              </div>
              {view === 'textbook' ? (
                <div className={classNames('action__contaner', 'contaner')}>
                  <ButtonLearned
                    handlerClick={handlerClick}
                    learned={isLearned}
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

import { Link } from 'react-router-dom';
import GameButton from '../GameButton';

import './index.scss';
import SpeakerIcon from '../../assets/icons/speaker.svg';

import { Word } from '../../data';
import { numWord } from '../../utils';
import { BACKEND_URL } from '../../../../constants';

interface WordWithResult extends Word {
  result: boolean;
}

interface GameFinishProps {
  words: WordWithResult[];
  onRestart: () => void;
}

function GameFinish({ words, onRestart }: GameFinishProps) {
  const guessedWords = words.filter((word) => word.result);
  const failedWords = words.filter((word) => !word.result);
  const correctCount = guessedWords.length;
  const mistakesCount = failedWords.length;
  return (
    <div className="game-finish">
      <h2 className="game-finish__title">
        {correctCount >= mistakesCount
          ? 'Отличный результат!'
          : 'В этот раз не получилось, но продолжай тренироваться!'}
      </h2>
      <div className="game-finish__words">
        {`${correctCount} ${numWord(correctCount, [
          'слово',
          'слова',
          'слов',
        ])} угдадано верно, ${mistakesCount} не угадано`}

        <div className="list-title">
          Знаю: <span className="badge badge--success">{correctCount}</span>
        </div>
        <ul className="word-list">
          {guessedWords.map((word) => (
            <li key={word.id} className="word-list__item">
              <GameButton
                onClick={() => new Audio(`${BACKEND_URL}/${word.audio}`).play()}
                icon={SpeakerIcon}
                shape="round"
                size="small"
              />
              <Link to={`/dictionary/${word.id}`} className="word-list__word">
                {word.word}
              </Link>
              —
              <span className="word-list__translation">
                {word.wordTranslate}
              </span>
            </li>
          ))}
        </ul>

        <div className="list-title">
          Не знаю: <span className="badge badge--fail">{mistakesCount}</span>
        </div>
        <ul className="word-list">
          {failedWords.map((word) => (
            <li key={word.id} className="word-list__item">
              <GameButton
                onClick={() => new Audio(`${BACKEND_URL}/${word.audio}`).play()}
                icon={SpeakerIcon}
                shape="round"
                size="small"
              />
              <span className="word-list__word">{word.word}</span>—
              <span className="word-list__translation">
                {word.wordTranslate}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <GameButton onClick={onRestart} variant="outlined">
        Повторить игру
      </GameButton>
    </div>
  );
}

export default GameFinish;

import GameButton from '../GameButton';

import './index.scss';

import { Word } from '../../data';
import { numWord } from '../../utils';
import WordsList from '../WordsList/index';

interface WordWithResult extends Word {
  result: boolean;
}

interface GameFinishProps {
  words: WordWithResult[];
  onRestart: () => void;
  onClose: () => void;
}

function GameFinish({ words, onRestart, onClose }: GameFinishProps) {
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
        <WordsList words={guessedWords} />

        <div className="list-title">
          Не знаю: <span className="badge badge--fail">{mistakesCount}</span>
        </div>
        <WordsList words={failedWords} />
      </div>

      <div className="game-finish__buttons">
        <GameButton onClick={onRestart} variant="colored">
          Повторить
        </GameButton>
        <GameButton onClick={onClose} variant="outlined">
          Выйти
        </GameButton>
      </div>
    </div>
  );
}

export default GameFinish;

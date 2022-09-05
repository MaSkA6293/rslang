import { IGetWordRes } from '../../../../API/types';
import GameButton from '../../../audioCallGame/components/GameButton';
import WordsList from '../../../audioCallGame/components/WordsList';
import { numWord } from '../../../audioCallGame/utils';
import './GameResults.scss';

type props = {
  rightAnswers: IGetWordRes[];
  wrongAnswers: IGetWordRes[];
  startGameAgain: () => void;
  toHome: () => void,
};

export default function GameResults({
  rightAnswers,
  wrongAnswers,
  startGameAgain,
  toHome,
}: props) {
  const correctCount = rightAnswers.length;
  const mistakesCount = wrongAnswers.length;

  return (
    <div className="game-finish">
      <h2 className="game-finish__title">
        {correctCount >= mistakesCount
          ? 'Отличный результат!'
          : 'В этот раз не получилось, но продолжай тренироваться!'}
      </h2>
      <div className="game-finish__words">
        {`${correctCount} ${numWord(rightAnswers.length, [
          'слово',
          'слова',
          'слов',
        ])} угдадано верно, ${mistakesCount} не угадано`}

        <div className="list-title">
          Знаю: <span className="badge badge--success">{correctCount}</span>
        </div>
        <WordsList words={rightAnswers} />

        <div className="list-title">
          Ошибок: <span className="badge badge--fail">{mistakesCount}</span>
        </div>
        <WordsList words={wrongAnswers} />
      </div>

      <div className="game-finish__buttons">
        <GameButton onClick={startGameAgain} variant="colored" >
          Повторить
        </GameButton>
        <GameButton onClick={toHome} variant="outlined">
          Выйти
        </GameButton>
      </div>
    </div>
  );
}

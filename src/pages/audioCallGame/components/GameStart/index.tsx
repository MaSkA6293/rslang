import { groupType } from '../../../../types';
import GameButton from '../GameButton';
import './index.scss';

interface GameStartProps {
  level: groupType;
  setLevel: (level: groupType) => void;
  onStart: () => void;
}

const LEVELS: groupType[] = [0, 1, 2, 3, 4, 5];

function GameStart({ onStart, level, setLevel }: GameStartProps) {
  return (
    <>
      <h1 className="audio-call-game__title game-title">Аудиовызов</h1>
      <p className="audio-call-game__text">
        Тренировка улучшает восприятие речи на слух.
      </p>
      <p className="audio-call-game__text">
        Для управления используйте мышь или клавиши клавиатуры:
      </p>
      <ul className="audio-call-game__list">
        <li>
          <span className="key-code">1-5</span> - выбрать ответ
        </li>
        <li>
          <span className="key-code">пробел</span> - повторить аудио
        </li>
        <li>
          <span className="key-code">enter</span> - пропустить вопрос или
          перейти к следующему вопросу
        </li>
      </ul>

      <div className="level-select">
        <select
          value={level}
          onChange={(e) => setLevel(Number(e.target.value) as groupType)}
        >
          {LEVELS.map((level) => (
            <option key={level} value={level}>{`Уровень ${level + 1}`}</option>
          ))}
        </select>
      </div>

      <GameButton onClick={onStart} variant="colored">
        Начать
      </GameButton>
    </>
  );
}

export default GameStart;

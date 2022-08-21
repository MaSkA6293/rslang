import GameButton from '../GameButton';
import './index.scss';

interface StartScreenProps {
  onStart: () => void;
}

function StartScreen({ onStart }: StartScreenProps) {
  return (
    <>
      <h1 className="audio-call-game__title game-title">Аудиовызов</h1>
      <p className="audio-call-game__description">
        Тренировка улучшает восприятие речи на слух.
      </p>
      <GameButton onClick={onStart} variant="outlined">
        Начать
      </GameButton>
    </>
  );
}

export default StartScreen;

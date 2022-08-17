import './index.scss';

interface StartScreenProps {
  onStart: () => void;
}

function StartScreen({ onStart }: StartScreenProps) {
  return (
    <>
      <h1 className="game__title">Аудиовызов</h1>
      <p className="game__description">
        Тренировка улучшает восприятие речи на слух.
      </p>
      <button onClick={onStart} className="game__btn">
        Начать
      </button>
    </>
  );
}

export default StartScreen;

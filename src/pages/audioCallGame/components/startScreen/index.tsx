import './index.scss';

function StartScreen() {
  return (
    <>
      <h1 className="game__title">Аудиовызов</h1>
      <p className="game__description">
        Тренировка улучшает восприятие речи на слух.
      </p>
      <button className="game__btn">Начать</button>
    </>
  );
}

export default StartScreen;

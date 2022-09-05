export default function AudioCallDescription() {
  return (
    <>
      <h1 className="audio-call-game__title game-title">Спринт</h1>
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
    </>
  );
}

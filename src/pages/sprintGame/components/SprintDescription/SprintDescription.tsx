export default function SprintDescription() {
  return (
    <>
      <h1 className="audio-call-game__title game-title">Спринт</h1>
      <p className="audio-call-game__text">
        Вам нужно выбрать соответствует ли перевод предложенному слову.
      </p>
      <p className="audio-call-game__text">
        Для управления используйте мышь или клавиши клавиатуры:
      </p>
      <ul className="audio-call-game__list">
        <li>
          <span className="key-code">&#8592;</span> - неверно
        </li>
        <li>
          <span className="key-code">&#8594;</span> - верно
        </li>
        <li>
          <span className="key-code">пробел</span> - проиграть аудио
        </li>
      </ul>
    </>
  );
}

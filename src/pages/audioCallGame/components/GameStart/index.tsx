/* eslint-disable react/require-default-props */
import React from 'react';
import GameButton from '../GameButton';
import './index.scss';

interface GameStartProps {
  onStart: () => void;
  children?: React.ReactNode;
}

function GameStart({ onStart, children }: GameStartProps) {
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

      {children}

      <GameButton onClick={onStart} variant="colored">
        Начать
      </GameButton>
    </>
  );
}

export default GameStart;

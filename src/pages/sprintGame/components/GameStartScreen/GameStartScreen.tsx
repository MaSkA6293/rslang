import React from 'react';
import Difficult from '../Difficult/Difficult';

interface props {
  name: string;
  description: string;
  isFromTextBook: boolean;
  difficult: number;
  setDifficult: (e: number) => void
  startGame: () => void
}

export default function GameStartScreen({ name, description, isFromTextBook, difficult, setDifficult, startGame }: props) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{description}</p>
      {!isFromTextBook && <Difficult {...{difficult, setDifficult}} />}
      <button onClick={startGame}>Click to start</button>
    </div>
  );
}

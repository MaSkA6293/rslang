import React from 'react'
import GameButton from '../../../audioCallGame/components/GameButton';
import Difficult from '../Difficult/Difficult';

interface props {
  description: React.ReactNode;
  isFromTextBook: boolean;
  setDifficult: (e: number) => void
  startGame: () => void
}

export default function GameStartScreen({ description, isFromTextBook, setDifficult, startGame }: props) {
  return (
    <>
      {description}
      {!isFromTextBook && <Difficult {...{setDifficult}} />}
      <GameButton onClick={startGame} variant="colored">
        Начать
      </GameButton>
    </>
  );
}

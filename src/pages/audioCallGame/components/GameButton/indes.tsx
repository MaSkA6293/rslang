import React from 'react';
import './index.scss';

interface StartScreenProps {
  onClick: () => void;
  children: React.ReactNode;
}

function GameButton({ onClick, children }: StartScreenProps) {
  return (
    <button onClick={onClick} className="game-button">
      {children}
    </button>
  );
}

export default GameButton;

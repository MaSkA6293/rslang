import React from 'react';
import './index.scss';

export interface StartScreenProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const defaultProps = { disabled: false };

function GameButton({ onClick, children, disabled = false }: StartScreenProps) {
  return (
    <button onClick={onClick} className="game-button" disabled={disabled}>
      {children}
    </button>
  );
}

GameButton.defaultProps = defaultProps;

export default GameButton;

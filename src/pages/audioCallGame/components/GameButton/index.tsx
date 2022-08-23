import React from 'react';
import './index.scss';
import classNames from 'classnames';

type ButtonVariant = 'outlined';
type ButtonShape = 'round';
type ButtonSize = 'small';

interface StartScreenProps {
  onClick: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  icon?: string;
  variant?: ButtonVariant;
  shape?: ButtonShape;
  size?: ButtonSize;
}

const defaultProps = {
  disabled: false,
  icon: undefined,
  variant: undefined,
  children: undefined,
  shape: undefined,
  size: undefined,
};

function GameButton({
  onClick,
  children,
  disabled = false,
  icon,
  variant,
  shape,
  size,
}: StartScreenProps) {
  return (
    <button
      onClick={onClick}
      className={classNames('game-button', {
        'game-button--outlined': variant === 'outlined',
        'game-button--round': shape === 'round',
        'game-button--small': size === 'small',
      })}
      disabled={disabled}
    >
      {icon ? <img className="game-button__icon" src={icon} alt="" /> : null}
      {children}
    </button>
  );
}

GameButton.defaultProps = defaultProps;

export default GameButton;

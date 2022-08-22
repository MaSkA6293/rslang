import React from 'react';
import './index.scss';
import classNames from 'classnames';

type ButtonVariant = 'outlined';
type ButtonShape = 'round' | 'square';
type ButtonSize = 'small';

interface GameButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: string;
  variant?: ButtonVariant;
  shape?: ButtonShape;
  size?: ButtonSize;
}

const defaultProps = {
  children: undefined,
  className: undefined,
  disabled: false,
  icon: undefined,
  variant: undefined,
  shape: undefined,
  size: undefined,
};

function GameButton({
  onClick,
  className,
  children,
  disabled = false,
  icon,
  variant,
  shape,
  size,
}: GameButtonProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(className, 'game-button', {
        'game-button--outlined': variant === 'outlined',
        'game-button--round': shape === 'round',
        'game-button--square': shape === 'square',
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

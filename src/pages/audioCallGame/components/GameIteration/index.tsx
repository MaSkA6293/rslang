import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import GameButton from '../GameButton';

import './index.scss';
import SpeakerIcon from '../../assets/speaker.svg';
import CorrectIcon from '../../assets/correct.svg';
import WrongIcon from '../../assets/wrong.svg';

import { BACKEND_URL } from '../../../../constants';

const CorrectSound = require(`../../assets/audio/correct-choice.mp3`);
const WrongSound = require(`../../assets/audio/wrong-choice.mp3`);

type Word = any;

interface GameIteraionProps {
  word: Word;
  options: Word[];
  onNextWord: (isCorrect: boolean) => void;
}

const getIcon = (isSelected: boolean, isCorrect: boolean): string => {
  if (isSelected && isCorrect) {
    return CorrectIcon;
  }
  if (isSelected && !isCorrect) {
    return WrongIcon;
  }
  return '';
};

function GameIteraion({ word, options, onNextWord }: GameIteraionProps) {
  const wordAudioUrl = new URL(word.audio, BACKEND_URL).toString();
  const wordImgUrl = new URL(word.image, BACKEND_URL).toString();

  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const audioRef = useRef(new Audio(wordAudioUrl));

  const handleAnswer = (index: number) => {
    setSelectedIndex(index);
    setHasAnswered(true);
  };

  const playAudio = () => {
    if (audioRef.current.paused) {
      return audioRef.current.play().catch(() => {});
    }
    return Promise.resolve();
  };

  useEffect(() => {
    if (audioRef.current.src !== wordAudioUrl) {
      audioRef.current = new Audio(wordAudioUrl);
    }
    playAudio();
    return () => {
      audioRef.current.pause();
    };
  }, [word]);

  useEffect(() => {
    if (hasAnswered) {
      const audioPath =
        word.word === options[selectedIndex]?.word ? CorrectSound : WrongSound;
      const audio = new Audio(audioPath);
      audio.play();
    }
  }, [hasAnswered]);

  const handleNextWord = () => {
    if (!hasAnswered) {
      setHasAnswered(true);
      setSelectedIndex(-1);
      return;
    }
    setHasAnswered(false);
    onNextWord(options[selectedIndex]?.word === word.word);
  };

  const handleKeyboard = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'Digit1':
        handleAnswer(0);
        break;
      case 'Digit2':
        handleAnswer(1);
        break;
      case 'Digit3':
        handleAnswer(2);
        break;
      case 'Digit4':
        handleAnswer(3);
        break;
      case 'Digit5':
        handleAnswer(4);
        break;
      case 'Space':
        playAudio();
        break;
      case 'Enter':
      case 'ArrowRight':
        handleNextWord();
        break;
      default:
    }
  };

  useEffect(() => {
    window.addEventListener('keyup', handleKeyboard);
    return () => {
      window.removeEventListener('keyup', handleKeyboard);
    };
  });

  return (
    <div className="game-iteration">
      <div className="word-card">
        {hasAnswered ? (
          <>
            <img className="word-card__img" src={wordImgUrl} alt={word.word} />
            <div className="word-card__word">{word.word}</div>
          </>
        ) : null}
        <GameButton onClick={playAudio} icon={SpeakerIcon} shape="round" />
      </div>

      <div className="game-iteration__answers">
        {options.map((option, i) => {
          const isCorrect = option.word === word.word;
          const isSelected = i === selectedIndex;

          const index = i;
          return (
            <GameButton
              key={index}
              onClick={() => handleAnswer(i)}
              disabled={hasAnswered}
              icon={hasAnswered ? getIcon(isSelected, isCorrect) : ''}
            >
              <span
                className={classNames({
                  'answer--not-selected': hasAnswered && !isSelected,
                  'answer--wrong': hasAnswered && isSelected && !isCorrect,
                  'answer--correct': hasAnswered && isCorrect,
                })}
              >
                {`${i + 1} ${option.wordTranslate}`}
              </span>
            </GameButton>
          );
        })}
      </div>

      <GameButton onClick={handleNextWord} variant="outlined">
        {hasAnswered ? '→' : 'Не знаю'}
      </GameButton>
    </div>
  );
}

export default GameIteraion;

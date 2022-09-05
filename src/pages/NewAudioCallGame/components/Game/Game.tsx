/* eslint-disable no-unused-expressions */
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { IGetWordRes } from '../../../../API/types';
import { BACKEND_URL } from '../../../../constants';
import { getRandomIntInclusive } from '../../../games/Utils/getRandomIntInclusive';
import { shuffleArray } from '../../../games/Utils/suffleArray';
import CorrectIcon from '../../assets/icons/correct.svg';
import SpeakerIcon from '../../assets/icons/speaker.svg';
import WrongIcon from '../../assets/icons/wrong.svg';
import GameButton from '../../../games/components/GameButton';
import './index.scss';

const WrongSound = require(`../../assets/audio/wrong-choice.mp3`);
const getIcon = (isSelected: boolean, isCorrect: boolean): string => {
  if (isSelected && isCorrect) {
    return CorrectIcon;
  }
  if (isSelected && !isCorrect) {
    return WrongIcon;
  }
  return '';
};

interface props {
  handleRightAnswer: (answer: IGetWordRes) => void;
  handleWrongAnswer: (answer: IGetWordRes) => void;
  endGame: () => void;
  words: IGetWordRes[];
}
function NewAudioCallGame({
  endGame,
  words,
  handleRightAnswer,
  handleWrongAnswer,
}: props) {
  const [startPoint, setStartPoint] = useState(0);
  const rightIndex = useMemo(() => getRandomIntInclusive(0, 4), [startPoint]);
  const shuffleWords: IGetWordRes[] = useMemo(
    () => shuffleArray(words.slice(startPoint, startPoint + 5)),
    [startPoint],
  );
  const wordAudioUrl = new URL(
    shuffleWords[rightIndex].audio,
    BACKEND_URL,
  ).toString();
  const audio = new Audio(wordAudioUrl);
  const wordImgUrl = new URL(
    shuffleWords[rightIndex].image,
    BACKEND_URL,
  ).toString();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hasAnswered, setHasAnswered] = useState(false);

  const playAudio = () => {
    audio.play();
  };

  useEffect(() => {
    playAudio();
  }, [startPoint]);

  const handleNextWord = () => {
    setHasAnswered(false);
    setSelectedIndex(-1);
    setStartPoint((prev) => prev + 5);
    if (startPoint + 5 >= words.length - 1) endGame();
  };

  const handlePass = () => {
    if (!hasAnswered) {
      const audio = new Audio(WrongSound);
      audio.play();

      setHasAnswered(true);
    } else {
      handleNextWord();
    }
  };

  const handleAnswer = (index: number) => {
    if (!hasAnswered) {
      const isWasTrue = rightIndex === index;
      isWasTrue
        ? handleRightAnswer(shuffleWords[rightIndex])
        : handleWrongAnswer(shuffleWords[rightIndex]);
      setHasAnswered(true);
      setSelectedIndex(index);
    } else {
      handleNextWord();
    }
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
        handlePass();
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
            <img
              className="word-card__img"
              src={wordImgUrl}
              alt={shuffleWords[rightIndex].word}
            />
            <div className="word-card__word">
              {shuffleWords[rightIndex].word}
            </div>
          </>
        ) : null}
        <GameButton onClick={playAudio} icon={SpeakerIcon} shape="round" />
      </div>

      <div className="game-iteration__answers">
        {shuffleWords.map((word, i) => {
          const isCorrect = word.id === shuffleWords[rightIndex].id;
          const isSelected = i === selectedIndex;

          return (
            <GameButton
              key={word.id}
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
                {`${i + 1} ${word.wordTranslate}`}
              </span>
            </GameButton>
          );
        })}
      </div>

      <GameButton onClick={handlePass} variant="outlined">
        {hasAnswered ? '→' : 'Не знаю'}
      </GameButton>
    </div>
  );
}

export default NewAudioCallGame;

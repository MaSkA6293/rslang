import { useEffect, useState } from 'react';
import classNames from 'classnames';
import GameButton from '../GameButton';

import './index.scss';
import SpeakerIcon from '../../assets/speaker.svg';
import CorrectIcon from '../../assets/correct.svg';
import WrongIcon from '../../assets/wrong.svg';

import { BACKEND_URL } from '../../../../constants';

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
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [pickedOptIndex, setPickedOptIndex] = useState(-1);

  const wordAudioUrl = new URL(word.audio, BACKEND_URL).toString();
  const wordImgUrl = new URL(word.image, BACKEND_URL).toString();

  const playAudio = () => {
    new Audio(wordAudioUrl).play();
  };

  useEffect(() => {
    playAudio();
  }, [word]);

  const handleNextWord = () => {
    if (!hasAnswered) {
      setIsCorrectAnswer(false);
      setHasAnswered(true);
      return;
    }
    setHasAnswered(false);
    onNextWord(isCorrectAnswer);
  };

  return (
    <div className="game-iteration">
      <div className="word-card">
        {hasAnswered ? (
          <>
            <img className="word-card__img" src={wordImgUrl} alt={word} />
            <div className="word-card__word">{word.word}</div>
          </>
        ) : null}
        <GameButton onClick={playAudio} icon={SpeakerIcon} shape="round" />
      </div>

      <div className="game-iteration__answers">
        {options.map((option, i) => {
          const isCorrect = option.word === word.word;
          const isSelected = i === pickedOptIndex;
          const handleAnswer = () => {
            setPickedOptIndex(i);
            setIsCorrectAnswer(isCorrect);
            setHasAnswered(true);
          };
          const index = i;
          return (
            <GameButton
              key={index}
              onClick={handleAnswer}
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
                {option.wordTranslate}
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

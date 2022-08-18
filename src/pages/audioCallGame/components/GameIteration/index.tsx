import { useEffect, useState } from 'react';
import GameButton from '../GameButton';
import WordCard from '../WordCard';

import './index.scss';

import { BACKEND_URL } from '../../../../constants';

type Word = any;

interface GameIteraionProps {
  word: Word;
  options: Word[];
  onNextWord: (isCorrect: boolean) => void;
}

function GameIteraion({ word, options, onNextWord }: GameIteraionProps) {
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

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
      {hasAnswered ? (
        <WordCard img={wordImgUrl} word={word.word} onPlay={playAudio} />
      ) : (
        <GameButton onClick={playAudio}>Прослушать</GameButton>
      )}

      <div className="game-iteration__answers">
        {options.map((option, i) => {
          const isCorrect = option.word === word.word;
          const handleAnswer = () => {
            setIsCorrectAnswer(isCorrect);
            setHasAnswered(true);
          };
          const index = i;
          return (
            <GameButton
              key={index}
              onClick={handleAnswer}
              disabled={hasAnswered}
            >
              {option.wordTranslate}
            </GameButton>
          );
        })}
      </div>

      <GameButton onClick={handleNextWord}>
        {hasAnswered ? '→' : 'Не знаю'}
      </GameButton>
    </div>
  );
}

export default GameIteraion;

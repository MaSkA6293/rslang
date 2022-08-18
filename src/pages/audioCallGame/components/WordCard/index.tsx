import './index.scss';
import GameButton from '../GameButton/indes';

interface WordCardProps {
  img: string;
  word: string;
  onPlay: () => void;
}

function WordCard({ img, word, onPlay }: WordCardProps) {
  return (
    <div className="word-card">
      <img className="word-card__img" src={img} alt={word} />
      <div className="word-card__word">{word}</div>
      <GameButton onClick={onPlay}>Прослушать</GameButton>
    </div>
  );
}

export default WordCard;

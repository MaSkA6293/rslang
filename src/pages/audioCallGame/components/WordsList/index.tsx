import classNames from 'classnames';
import { Word } from '../../data';
import GameButton from '../GameButton';
import './index.scss';
import SpeakerIcon from '../../assets/icons/speaker.svg';
import { BACKEND_URL } from '../../../../constants';

interface WordsListProps {
  words: Word[];
}

function WordsList({ words }: WordsListProps) {
  return (
    <ul className="word-list">
      {words.map((word) => (
        <li
          key={word.id}
          className={classNames('word-list__item', 'word-item')}
        >
          <GameButton
            onClick={() => new Audio(`${BACKEND_URL}/${word.audio}`).play()}
            icon={SpeakerIcon}
            shape="round"
            size="small"
          />
          <span className="word-item__word">{word.word}</span>
          <span className="word-item__separator">—</span>
          <span className="word-item__translation">{word.wordTranslate}</span>
        </li>
      ))}
    </ul>
  );
}

export default WordsList;

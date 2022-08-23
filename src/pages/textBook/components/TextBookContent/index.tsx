import { useEffect, useState, useRef } from 'react';
import './index.scss';
import classNames from 'classnames';
import { selectTextBook } from '../../../../features/textBook/textBook';
import { useAppSelector } from '../../../../app/hooks';
import { useGetWordsQuery } from '../../../../API/wordsApi';
import Card from '../Card';
import { ICard, colorsOfLevels } from '../../types';

import { BACKEND_URL } from '../../../../constants';

function TextBookContent() {
  const { group, page } = useAppSelector(selectTextBook);
  const { data = [], isLoading } = useGetWordsQuery({ page, group });

  const [isPlaying, setIsPlaying] = useState(false);

  const [paths, setPaths] = useState<[] | string[]>([]);
  const audio = useRef(new Audio());

  const path = `${BACKEND_URL}/`;

  const playAudioWord = (audioPath: string[]) => {
    let i = 0;
    audio.current.src = path + audioPath[i];
    setIsPlaying((isPlaying) => !isPlaying);
    audio.current.play();

    audio.current.onended = () => {
      if (i + 1 < audioPath.length) {
        i += 1;
        audio.current.src = path + audioPath[i];
        audio.current.play();
      } else setIsPlaying((isPlaying) => !isPlaying);
    };
  };

  const handlerClick = (paths: string[]) => setPaths(paths);

  useEffect(() => {
    if (paths.length !== 0) {
      if (isPlaying) {
        audio.current.pause();
        audio.current.currentTime = 0;
        playAudioWord(paths);
      } else {
        playAudioWord(paths);
      }
    }
  }, [paths]);

  if (isLoading) return <h1>Loading</h1>;
  const color: string = colorsOfLevels[group][1];

  const stopAudio = () => {
    audio.current.pause();
    audio.current.currentTime = 0;
  };

  useEffect(
    () => () => {
      stopAudio();
    },
    [],
  );

  return (
    <div className="page">
      <div className={classNames('page__container')}>
        {data.map((item: ICard) => (
          <Card
            color={color}
            card={item}
            key={item.id.toString()}
            playAudio={handlerClick}
            stopAudio={stopAudio}
            user={false}
          />
        ))}
      </div>
    </div>
  );
}

export default TextBookContent;

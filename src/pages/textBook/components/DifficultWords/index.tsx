import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import {
  IGetAggregatedWordsResponce,
  IGetWordRes,
  IGetWordResAgregate,
  IUserWords,
} from '../../../../API/types';
import { useAppSelector } from '../../../../app/hooks';
import { BACKEND_URL } from '../../../../constants';
import { User } from '../../../../features/auth/authSlice';
import { selectTextBook } from '../../../../features/textBook/textBook';
import { colorsOfLevels } from '../../types';
import { getDefaultWord } from '../../utilites';
import Card from '../Card';
import './index.scss';

interface IDifficultWords {
  user: User;
  userWords: IUserWords[];
  dataWordsRender: IGetAggregatedWordsResponce[];
}

function DifficultWords({ user, userWords, dataWordsRender }: IDifficultWords) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [paths, setPaths] = useState<[] | string[]>([]);

  const userId = user.userId ? user.userId : '';

  const audio = useRef(new Audio());
  const path = `${BACKEND_URL}/`;

  const { group } = useAppSelector(selectTextBook);

  const color: string = colorsOfLevels[group][1];

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

  const handlerAudio = (paths: string[]) => setPaths(paths);

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
      <div className={classNames('page__container', 'difficult-words')}>
        {dataWordsRender[0].paginatedResults.length !== 0 ? (
          dataWordsRender[0].paginatedResults.map(
            (word: IGetWordResAgregate, i: number) => {
              const userWord = userWords.find(
                // eslint-disable-next-line no-underscore-dangle
                (el: IUserWords) => el.wordId === word._id,
              );

              const statistics = { right: 0, wrong: 0, series: 0 };
              if (userWord) {
                statistics.right = userWord.optional.success;
                statistics.wrong = userWord.optional.fail;
                statistics.series = userWord.optional.series;
              }

              const key = i;
              const wordRender: IGetWordRes = {
                // eslint-disable-next-line no-underscore-dangle
                id: word._id,
                group: word.group,
                page: word.page,
                word: word.word,
                image: word.image,
                audio: word.audio,
                audioMeaning: word.audioMeaning,
                audioExample: word.audioExample,
                textMeaning: word.textMeaning,
                textExample: word.textExample,
                transcription: word.transcription,
                wordTranslate: word.wordTranslate,
                textMeaningTranslate: word.textMeaningTranslate,
                textExampleTranslate: word.textExampleTranslate,
              };

              return (
                <Card
                  color={color}
                  card={
                    wordRender !== undefined ? wordRender : getDefaultWord()
                  }
                  key={
                    wordRender !== undefined ? wordRender.id.toString() : key
                  }
                  playAudio={handlerAudio}
                  stopAudio={stopAudio}
                  userId={userId}
                  userWords={userWords}
                  difficult={userWord ? userWord.difficulty : 'no'}
                  learned={
                    userWord?.optional.learned !== undefined
                      ? userWord.optional.learned
                      : false
                  }
                  statistics={statistics}
                />
              );
            },
          )
        ) : (
          <div className="difficult-words__no-words">
            <h3 className="difficult-words__title">
              Добавьте в этот раздел сложные слова
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default DifficultWords;

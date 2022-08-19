import './index.scss';

type Word = any;

interface GameFinishProps {
  words: Word[];
  results: boolean[];
}

function GameFinish({ words, results }: GameFinishProps) {
  const correctCount = results.filter((r) => r).length;
  const mistakesCount = results.length - correctCount;
  return (
    <div>
      <h2>Игра закончена</h2>
      <div>
        {`${correctCount} слов угдадано верно, ${mistakesCount} не угадано`}
        <ul>
          {words.map((word) => <li key={word.id}>{word.word}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default GameFinish;

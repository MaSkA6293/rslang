import './index.scss';
import GameButton from '../GameButton/indes';

const playAudio = () => {};

function GameIteraion() {
  return (
    <>
      <GameButton onClick={playAudio}>Прослушать</GameButton>
      <p>options</p>
      <GameButton onClick={playAudio}>→</GameButton>
    </>
  );
}

export default GameIteraion;

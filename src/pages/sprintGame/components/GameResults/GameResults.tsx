import { IGetWordRes } from "../../../../API/types"


type props = {
  rightAnswers: IGetWordRes[],
  wrongAnswers: IGetWordRes[],
  startGameAgain: () => void
}

export default function GameResults({rightAnswers, wrongAnswers, startGameAgain}: props) {
  return (
    <div>
      <div>
        <h3>Верно</h3>
        {rightAnswers.map(word =>
          <p key={word.word}>{word.wordTranslate}</p> 
        )}
      </div>
      <div>
        <h3>Неверно</h3>
        {wrongAnswers.map(word =>
          <p key={word.word}>{word.wordTranslate}</p>
        )}
      </div>
      <button onClick={startGameAgain}>Начать заново</button>
    </div>
  )
}
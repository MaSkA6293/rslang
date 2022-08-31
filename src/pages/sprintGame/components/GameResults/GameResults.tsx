import { IGetWordRes } from "../../../../API/types"


type props = {
  rightAnswers: IGetWordRes[],
  wrongAnswers: IGetWordRes[]
}

export default function GameResults({rightAnswers, wrongAnswers}: props) {
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
    </div>
  )
}
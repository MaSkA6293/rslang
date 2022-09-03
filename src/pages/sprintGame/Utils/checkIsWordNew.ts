import { IResultGame, IUserStatisticsRes } from "../../../API/types"

type prms = {
  stat: IUserStatisticsRes,
  wordId: string
}

export default function checkIsWordNew ({stat, wordId}: prms) {
  const { optional } = stat;

  let newWords: string[] = []

  Object.values(optional).forEach(game => {
    const results: IResultGame[] = JSON.parse(game)
    results.forEach(result => {
      newWords = [...newWords, ...result.newWords]
    })
  }) 
 
  return !newWords.includes(wordId)

}
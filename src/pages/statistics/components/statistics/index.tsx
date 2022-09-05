import { Col, Container, Row } from 'react-bootstrap';

import GameStatsCard from '../GameStatsCard';
import StatsCard from '../StatsCard';

import { ItestDayStat } from '../../../../API/newtypes';
import { getTimeToday } from '../../../../hooks/statHelper';
import {
  getPrcntStr
} from '../../utils';

interface StatisticsProps {
  stat: ItestDayStat
}

function Statistics({ stat }: StatisticsProps) {
  const date = getTimeToday()
  const {optional} = stat
  const { learnedWords } = optional[date]
  const results = Object.values(optional[date].games)
  const newWords = results.map(i => i.newWords.length).reduce((acc, item) => acc + item)
  const rightAnswers = results.map(i => i.rightAnswers).reduce((acc, item) => acc + item)
  const wrongAnswers = results.map(i => i.wrongAnswers).reduce((acc, item) => acc + item)
  const totalAnswers = rightAnswers + wrongAnswers
  const gameNames = ['Аудиовызов', 'Спринт'] 



  return (
    <Container>
        <>
          <section>
            <h2 className="fw-bold my-5">Статистика за сегодня</h2>
            <Row
              xs={1}
              md={2}
              lg={3}
              className="mx-auto g-4 mb-5 justify-content-center"
              style={{ maxWidth: '62rem' }}
            >
              <Col>
                <StatsCard title="Новых слов">{newWords}</StatsCard>
              </Col>

              <Col>
                <StatsCard title="Изучено слов">{learnedWords.length}</StatsCard>
              </Col>

              <Col>
                <StatsCard title="Правильных ответов">
                  {getPrcntStr(
                    rightAnswers,
                    totalAnswers,
                  )}
                </StatsCard>
              </Col>
            </Row>

            <Row
              xs={1}
              md={2}
              className="mx-auto mb-5 g-4"
              style={{ maxWidth: '40rem' }}
            >
              {results.map((result, index) => (
                <Col key={gameNames[index]}>
                  <GameStatsCard
                    title={gameNames[index]}
                    {...{result}}
                  />
                </Col>
              ))}
            </Row>
          </section>

          <section>
            <h2 className="fw-bold my-5">Статистика за все время</h2>
            {/* <Row
              className="justify-content-center px-3 mx-auto"
              style={{ maxWidth: '40rem' }}
            >
             <LTStatsChart
                metric="newWords"
                title="Новых слов"
                data={stats.wordsStatsByDay}
              />
            </Row> */}
          </section>
        </>
    </Container>
  );
}

export default Statistics;

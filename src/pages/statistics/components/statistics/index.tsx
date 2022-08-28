import { Row, Col, Container } from 'react-bootstrap';
import { IWordsStatistics } from '../../../../API/types';
import { useGetUserStatisticQuery } from '../../../../API/userApi';
import GameStatsCard from '../GameStatsCard';
import StatsCard from '../StatsCard';

interface StatisticsProps {
  userId: string;
}

enum Games {
  audioCall = 'audioCall',
  sprint = 'sprint',
}

const gamesData = [
  { id: Games.audioCall, title: 'Аудиовызов' },
  { id: Games.sprint, title: 'Спринт' },
];

const today = new Date().toISOString().slice(0, 10);

const defaultWordsStats: IWordsStatistics = {
  newWords: [],
  learnedWords: 0,
  correctAnswers: 0,
  totalAnswers: 0,
};

function Statistics({ userId }: StatisticsProps) {
  const { data, isLoading } = useGetUserStatisticQuery({ userId });

  const wordsStats =
    data?.optional.wordsStatsByDate[today] || defaultWordsStats;

  const correctAnwersPcnt =
    Math.round((wordsStats.correctAnswers / wordsStats.totalAnswers) * 100) ||
    0;

  return (
    <Container>
      <h2 className="fw-bold my-5">Статистика за сегодня</h2>

      {isLoading || !data ? (
        'Loading...'
      ) : (
        <>
          <Row
            xs={1}
            md={2}
            lg={3}
            className="mx-auto g-4 mb-5 justify-content-center"
            style={{ maxWidth: '62rem' }}
          >
            <Col>
              <StatsCard title="Новых слов">
                {wordsStats.newWords.length}
              </StatsCard>
            </Col>

            <Col>
              <StatsCard title="Изучено слов">
                {wordsStats.learnedWords}
              </StatsCard>
            </Col>

            <Col>
              <StatsCard title="Правильных ответов">
                {`${correctAnwersPcnt}%`}
              </StatsCard>
            </Col>
          </Row>

          <Row
            xs={1}
            md={2}
            className="mx-auto g-4"
            style={{ maxWidth: '40rem' }}
          >
            {gamesData.map((game) => {
              const gameStats = data.optional.games[game.id];
              return (
                <Col key={`${game.id}-col`}>
                  <GameStatsCard
                    key={game.id}
                    gameTitle={game.title}
                    statistics={gameStats}
                  />
                </Col>
              );
            })}
          </Row>
        </>
      )}
    </Container>
  );
}

export default Statistics;

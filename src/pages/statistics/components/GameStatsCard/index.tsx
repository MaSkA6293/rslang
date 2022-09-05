import { Card, ListGroup } from 'react-bootstrap';
import { ItestGameResultStat } from '../../../../API/newtypes';
import { getPrcntStr } from '../../utils';

type GameStatsCardProps = {
  title: string;
  result: ItestGameResultStat;
};

enum Metrics {
  newWords = 'newWords',
  rightAnswers = 'rightAnswers',
  bestSeries = 'bestSeries',
}

const METRIC_KEYS = Object.values(Metrics);

const METRIC_TITLES = {
  newWords: 'Новых слов',
  rightAnswers: 'Правильных ответов',
  bestSeries: 'Самая длинная серия правильных ответов',
};

function GameStatsCard({ title, result }: GameStatsCardProps) {
  const { bestSeries, newWords, rightAnswers, wrongAnswers } = result;
  const totalAnswers = rightAnswers + wrongAnswers;

  const statsValues = {
    newWords: newWords.length,
    bestSeries,
    rightAnswers: getPrcntStr(rightAnswers, totalAnswers),
  };

  return (
    <Card className="h-100 my-0" style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title className="fw-bold">{title}</Card.Title>
        <ListGroup variant="flush">
          {METRIC_KEYS.map((metric) => (
            <ListGroup.Item
              key={metric}
              className="d-flex justify-content-between align-items-center"
            >
              <div className="text-muted text-start">
                {METRIC_TITLES[metric]}:
              </div>
              <span className="fw-bold text-muted">{statsValues[metric]}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default GameStatsCard;

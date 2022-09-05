import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  ComposedChart,
  ResponsiveContainer,
  Area,
} from 'recharts';
import { IdateStatObj } from '../../../../API/newtypes';
import {
  convertDateToString,
  convertStringToDate,
  getDateRange,
} from '../../utils';

type IMetric = 'newWords' | 'learnedWords';

interface LTStatsChartProps {
  data: IdateStatObj;
  metric: IMetric;
  title: string;
}

const dateSorter = (d1: string, d2: string) =>
  convertStringToDate(d1).valueOf() - convertStringToDate(d2).valueOf();

const getDailyStats = (metric: IMetric, data: IdateStatObj[string]) => {
  if (metric === 'newWords') {
    const words = new Set([
      ...data.games.audioCall.newWords,
      ...data.games.sprint.newWords,
    ]);
    return words.size;
  }
  if (metric === 'learnedWords') {
    return data.learnedWords.length;
  }
  return 0;
};

const getAccData = (data: IdateStatObj, metric: IMetric) => {
  let total = 0;
  const dates = Object.keys(data).sort(dateSorter);
  const today = new Date();
  const startDate = convertStringToDate(dates[0]);

  return getDateRange(startDate, today).map((date) => {
    const dateKey = convertDateToString(date);
    const day = dateKey in data ? getDailyStats(metric, data[dateKey]) : 0;
    total += day;
    return { date: dateKey, day, total };
  });
};

function LTStatsChart({ data, metric, title }: LTStatsChartProps) {
  const dataByDate = getAccData(data, metric);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        width={500}
        height={300}
        data={dataByDate}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
        barCategoryGap="10%"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" scale="auto" />
        <YAxis />
        <Tooltip
          formatter={(val: number, name: string) => {
            switch (name) {
              case 'total':
                return [val, `${title} всего`];
              case 'day':
                return [val, `${title} за день`];
              default:
                return val;
            }
          }}
          itemSorter={(payload) => -Number(payload.value) ?? 0}
          offset={0}
        />

        <Legend
          align="center"
          formatter={(val: string) => {
            switch (val) {
              case 'total':
                return `${title} всего`;
              case 'day':
                return `${title} за день`;
              default:
                return val;
            }
          }}
        />

        <Area
          type="monotone"
          dataKey="total"
          stroke="#82ca9d"
          fill="#82ca9d"
          strokeWidth={2}
        />
        <Bar dataKey="day" fill="#8884d8" stackId={0} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default LTStatsChart;

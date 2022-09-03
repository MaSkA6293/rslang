import {
  // AreaChart,
  // Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Legend,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  ResponsiveContainer,
  Area,
} from 'recharts';
import { IWordsStats } from '../../types';

interface LTStatsChartProps {
  data: IWordsStats[];
  metric: keyof IWordsStats;
  title: string;
}

const accumulateData = (statsArr: IWordsStats[]) => {
  let learnedWordsTotal = 0;
  let newWordsTotal = 0;
  return statsArr.map((stats) => {
    learnedWordsTotal += stats.learnedWords;
    newWordsTotal += stats.newWords;
    return {
      ...stats,
      learnedWords: stats.learnedWords,
      newWords: stats.newWords,
      learnedWordsTotal,
      newWordsTotal,
    };
  });
};

function LTStatsChart({ data }: LTStatsChartProps) {
  const accData = accumulateData(data);
  console.log(accData);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        width={500}
        height={300}
        data={accData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" scale="band" />
        <YAxis />
        <Tooltip
          formatter={(val: number, name: string) => {
            switch (name) {
              case 'newWordsTotal':
                return [val, 'Новых слов всего'];
              case 'newWords':
                return [val, 'Новых слов за день'];
              default:
                return val;
            }
          }}
          itemSorter={(payload) => -Number(payload.value) ?? 0}
        />

        <Legend
          align="center"
          formatter={(val: string) => {
            switch (val) {
              case 'newWordsTotal':
                return 'Новых слов всего';
              case 'newWords':
                return 'Новых слов за день';
              default:
                return val;
            }
          }}
        />
        {/* <Bar dataKey="newWords" fill="#8884d8" stackId={0} />
        <Bar dataKey="newWordsTotal" fill="#82ca9d" stackId={0} /> */}
        {/* <Area
        type="monotone"
        dataKey='newWordsTotal'
        stroke="#8884d8"
        fill="#8884d8"
      /> */}
        {/* <Area
        type="monotone"
        dataKey='newWords'
        stroke="#82ca9d"
        fill="#82ca9d"
      /> */}
        {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
        <Line type="monotoneX" dataKey="newWordsTotal" stroke="#8884d8" />
        <Line type="monotoneX" dataKey="newWords" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LTStatsChart;

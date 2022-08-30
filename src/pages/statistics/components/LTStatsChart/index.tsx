import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface ChartWordsStats {
  date: string;
  learnedWords: number;
  newWords: number;
}

interface LTStatsChartProps {
  data: ChartWordsStats[];
}

function LTStatsChart({ data }: LTStatsChartProps) {
  console.log(data);
  return (
    <AreaChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Area
        type="monotone"
        dataKey="newWords"
        stroke="#8884d8"
        fill="#8884d8"
      />
    </AreaChart>
  );
}

export default LTStatsChart;

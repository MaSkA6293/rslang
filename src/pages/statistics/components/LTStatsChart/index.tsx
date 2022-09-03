import { useEffect, useState } from 'react';
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
import { IWordsStats } from '../../types';

interface LTStatsChartProps {
  data: IWordsStats[];
  metric: keyof IWordsStats;
  title: string;
}

const accumulateData = (
  statsArr: IWordsStats[],
  metric: keyof IWordsStats,
  totalKey: string,
) => {
  let metricTotal = 0;
  return statsArr.map((stats) => {
    if (typeof stats[metric] === 'number') {
      metricTotal += stats[metric] as number;
    }
    return {
      ...stats,
      [metric]: stats[metric],
      [totalKey]: metricTotal,
    };
  });
};

function LTStatsChart({ data, metric, title }: LTStatsChartProps) {
  const metricTotal = `${metric}Total`;

  const [accData, setAccData] = useState<IWordsStats[]>([]);

  useEffect(() => {
    setAccData(accumulateData(data, metric, metricTotal));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        width={500}
        height={300}
        data={accData}
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
              case metricTotal:
                return [val, `${title} всего`];
              case metric:
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
              case metricTotal:
                return `${title} всего`;
              case metric:
                return `${title} за день`;
              default:
                return val;
            }
          }}
        />

        <Area
          type="monotone"
          dataKey={metricTotal}
          stroke="#82ca9d"
          fill="#82ca9d"
          strokeWidth={2}
        />
        <Bar dataKey={metric} fill="#8884d8" stackId={0} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default LTStatsChart;

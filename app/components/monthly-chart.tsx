import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MIN = 1000;
const MAX = 300000;
const data = MONTHS.map((month) => ({
  key: month,
  income: Math.random() * (MAX - MIN) + MIN,
  expenses: Math.random() * (MAX - MIN) + MIN,
}));

export default function MonthlyChart() {
  return (
    <div className="w-full h-full border-2 border-gray-100 rounded-lg text-sm">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="key" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function ProgressChart({ data }) {
  return (
    <div className="glass rounded-xl p-6 h-96">

      <h2 className="text-2xl font-bold mb-5">
        Interview Progress
      </h2>

      <ResponsiveContainer width="100%" height="85%">

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#06b6d4"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}
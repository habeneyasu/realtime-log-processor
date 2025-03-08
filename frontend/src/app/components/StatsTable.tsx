import { LogStat } from "@/types/types";

interface StatsTableProps {
  stats: LogStat[];
}

export default function StatsTable({ stats }: StatsTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Level</th>
          <th>Message</th>
          <th>Payload</th>
        </tr>
      </thead>
      <tbody>
        {stats.map((stat) => (
          <tr key={stat.id}>
            <td>{stat.timestamp}</td>
            <td>{stat.level}</td>
            <td>{stat.message}</td>
            <td>{JSON.stringify(stat.payload)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
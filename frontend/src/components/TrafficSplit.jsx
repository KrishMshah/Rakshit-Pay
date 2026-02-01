export default function TrafficSplit({ primary = 95, backup = 5 }) {
  return (
    <p>
      Primary: <b>{primary}%</b> | Backup: <b>{backup}%</b>
    </p>
  );
}

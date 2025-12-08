import type { KingdomWithLords } from '../types/models';

interface KingdomLordsProps {
  kingdoms: KingdomWithLords[];
}

export function KingdomLords({ kingdoms }: KingdomLordsProps) {
  const sortedKingdoms = [...kingdoms].sort((a, b) => b.Lords - a.Lords);

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Kingdom Lords</h5>
      </div>
      <div className="card-body">
        <table className="table table-sm table-hover">
          <thead>
            <tr>
              <th>Kingdom</th>
              <th className="text-end">Lords</th>
            </tr>
          </thead>
          <tbody>
            {sortedKingdoms.map((kingdom) => (
              <tr key={kingdom.Name}>
                <td>
                  <span
                    className="badge me-2"
                    style={{ backgroundColor: kingdom.PrimaryColor }}
                  >
                    ●
                  </span>
                  {kingdom.Name}
                </td>
                <td className="text-end">
                  <strong>{kingdom.Lords}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

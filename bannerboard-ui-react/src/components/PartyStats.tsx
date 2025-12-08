import type { PartyStatsModel } from '../types/models';

interface PartyStatsProps {
  data: PartyStatsModel;
}

export function PartyStats({ data }: PartyStatsProps) {
  const { Food, Members } = data;
  const partyUtilization = (Members.TotalCount / Members.MaxCount) * 100;

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Party Stats</h5>
      </div>
      <div className="card-body">
        {/* Party Size */}
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <span>Party Size</span>
            <span className="fw-bold">{Members.TotalCount} / {Members.MaxCount}</span>
          </div>
          <div className="progress">
            <div
              className="progress-bar bg-primary"
              style={{ width: `${partyUtilization}%` }}
            >
              {Math.round(partyUtilization)}%
            </div>
          </div>
          <small className="text-muted">
            Heroes: {Members.TotalHeroes} | Regulars: {Members.TotalRegulars} | Wounded: {Members.TotalWounded}
          </small>
        </div>

        {/* Food Inventory */}
        <div className="mb-3">
          <h6>Food Inventory</h6>
          <div className="row g-2">
            {Food.Items.map((item) => (
              <div key={item.Name} className="col-6">
                <div className="d-flex justify-content-between small">
                  <span>{item.Name}</span>
                  <span className="badge bg-success">{item.Count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Troop Composition */}
        <div>
          <h6>Troop Composition</h6>
          <table className="table table-sm">
            <tbody>
              {Members.Items.filter(m => !m.IsPrisoner).map((member) => (
                <tr key={member.Description}>
                  <td>{member.Description}</td>
                  <td className="text-end">
                    <span className="badge bg-info">{member.Count}</span>
                    {member.WoundedCount > 0 && (
                      <span className="badge bg-warning ms-1">
                        {member.WoundedCount} wounded
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {Members.Items.filter(m => m.IsPrisoner).map((member) => (
                <tr key={member.Description}>
                  <td>{member.Description}</td>
                  <td className="text-end">
                    <span className="badge bg-secondary">{member.Count}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

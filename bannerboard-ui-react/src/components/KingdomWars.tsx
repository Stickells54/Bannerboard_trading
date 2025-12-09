import type { KingdomWithWars } from '../types/models';

interface KingdomWarsProps {
  kingdoms: KingdomWithWars[];
}

export function KingdomWars({ kingdoms }: KingdomWarsProps) {
  if (!kingdoms || kingdoms.length === 0) {
    return (
      <div className="card h-100">
        <div className="card-header">
          <h5 className="mb-0">Kingdom Wars</h5>
        </div>
        <div className="card-body text-center text-muted">
          <p className="mb-0">No kingdom data available</p>
        </div>
      </div>
    );
  }

  const kingdomsAtWar = kingdoms.filter(k => k.Wars && k.Wars.length > 0);
  const kingdomsAtPeace = kingdoms.filter(k => !k.Wars || k.Wars.length === 0);

  return (
    <div className="card h-100">
      <div className="card-header">
        <h5 className="mb-0">Kingdom Wars</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive" style={{ maxHeight: '500px' }}>
          <table className="table table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th>Kingdom</th>
                <th>Active Wars</th>
              </tr>
            </thead>
            <tbody>
              {kingdomsAtWar.map((kingdom) => (
                <tr key={kingdom.Name}>
                  <td style={{ width: '30%' }}>
                    <div className="d-flex align-items-center">
                      <span
                        className="me-2"
                        style={{ 
                          backgroundColor: kingdom.PrimaryColor, 
                          width: '12px', 
                          height: '12px', 
                          display: 'inline-block',
                          borderRadius: '50%'
                        }}
                      >
                      </span>
                      <span className="fw-bold">{kingdom.Name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      {kingdom.Wars.map((war, idx) => (
                        <span key={idx} className="badge bg-danger d-flex align-items-center">
                          <span className="me-1">⚔</span>
                          {war.Name}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {kingdomsAtWar.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center text-muted py-4">
                    All kingdoms are at peace
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {kingdomsAtPeace.length > 0 && (
        <div className="card-footer small">
          <strong>At peace:</strong> {kingdomsAtPeace.map(k => k.Name).join(', ')}
        </div>
      )}
    </div>
  );
}

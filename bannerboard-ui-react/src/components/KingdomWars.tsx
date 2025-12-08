import type { KingdomWithWars } from '../types/models';

interface KingdomWarsProps {
  kingdoms: KingdomWithWars[];
}

export function KingdomWars({ kingdoms }: KingdomWarsProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Kingdom Wars</h5>
      </div>
      <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {kingdoms.map((kingdom) => (
          <div key={kingdom.Name} className="mb-3">
            <h6>
              <span
                className="badge me-2"
                style={{ backgroundColor: kingdom.PrimaryColor }}
              >
                ●
              </span>
              {kingdom.Name}
            </h6>
            {kingdom.Wars.length === 0 ? (
              <p className="text-muted small mb-0">At peace</p>
            ) : (
              <ul className="list-unstyled mb-0">
                {kingdom.Wars.map((war, idx) => (
                  <li key={idx} className="small">
                    <span className="badge bg-danger me-1">⚔</span>
                    {war.Name}
                    {war.IsMinorFaction && (
                      <span className="badge bg-secondary ms-1">Minor Faction</span>
                    )}
                    {war.IsKingdomFaction && (
                      <span className="badge bg-primary ms-1">Kingdom</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

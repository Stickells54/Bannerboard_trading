import type { Kingdom } from '../types/models';

interface KingdomStrengthProps {
  kingdoms: Kingdom[];
}

export function KingdomStrength({ kingdoms }: KingdomStrengthProps) {
  const sortedKingdoms = [...kingdoms].sort((a, b) => b.Strength - a.Strength);
  const maxStrength = sortedKingdoms[0]?.Strength || 1;

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Kingdom Strength</h5>
      </div>
      <div className="card-body">
        {sortedKingdoms.map((kingdom) => (
          <div key={kingdom.Name} className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="fw-bold">{kingdom.Name}</span>
              <span className="text-muted">{Math.round(kingdom.Strength).toLocaleString()}</span>
            </div>
            <div className="progress" style={{ height: '25px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${(kingdom.Strength / maxStrength) * 100}%`,
                  backgroundColor: kingdom.PrimaryColor,
                }}
                aria-valuenow={kingdom.Strength}
                aria-valuemin={0}
                aria-valuemax={maxStrength}
              >
                {Math.round((kingdom.Strength / maxStrength) * 100)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

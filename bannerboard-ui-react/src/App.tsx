import { useEffect, useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { MarketTable } from './components/MarketTable';
import { KingdomStrength } from './components/KingdomStrength';
import { KingdomLords } from './components/KingdomLords';
import { KingdomWars } from './components/KingdomWars';
import { PartyStats } from './components/PartyStats';
import { ClanInfo } from './components/ClanInfo';
import { TownProsperity } from './components/TownProsperity';
import { TradePrices } from './components/TradePrices';
import { TradeRoutes } from './components/TradeRoutes';
import { HeroTracker } from './components/HeroTracker';
import type {
  CityMarketModel,
  KingdomStrengthModel,
  KingdomLordsModel,
  KingdomWarsModel,
  PartyStatsModel,
  ClanInfoModel,
  TownProsperityModel,
  TradePricesModel,
  TradeRoutesModel,
  HeroTrackerModel,
} from './types/models';
import './App.css';

function App() {
  const { isConnected, lastMessage, error } = useWebSocket();
  const [activeTab, setActiveTab] = useState<string>('party');
  const [marketData, setMarketData] = useState<CityMarketModel | null>(null);
  const [kingdomStrength, setKingdomStrength] = useState<KingdomStrengthModel | null>(null);
  const [kingdomLords, setKingdomLords] = useState<KingdomLordsModel | null>(null);
  const [kingdomWars, setKingdomWars] = useState<KingdomWarsModel | null>(null);
  const [partyStats, setPartyStats] = useState<PartyStatsModel | null>(null);
  const [clanInfo, setClanInfo] = useState<ClanInfoModel | null>(null);
  const [townProsperity, setTownProsperity] = useState<TownProsperityModel | null>(null);
  const [tradePrices, setTradePrices] = useState<TradePricesModel | null>(null);
  const [tradeRoutes, setTradeRoutes] = useState<TradeRoutesModel | null>(null);
  const [heroTracker, setHeroTracker] = useState<HeroTrackerModel | null>(null);

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.Type) {
        case 'CityMarketModel':
          setMarketData(lastMessage as CityMarketModel);
          break;
        case 'KingdomStrengthModel':
          setKingdomStrength(lastMessage as KingdomStrengthModel);
          break;
        case 'KingdomLordsModel':
          setKingdomLords(lastMessage as KingdomLordsModel);
          break;
        case 'KingdomWarsModel':
          setKingdomWars(lastMessage as KingdomWarsModel);
          break;
        case 'PartyStatsModel':
          setPartyStats(lastMessage as PartyStatsModel);
          break;
        case 'ClanInfoModel':
          setClanInfo(lastMessage as ClanInfoModel);
          break;
        case 'TownProsperityModel':
          setTownProsperity(lastMessage as TownProsperityModel);
          break;
        case 'TradePricesModel':
          setTradePrices(lastMessage as TradePricesModel);
          break;
        case 'TradeRoutesModel':
          setTradeRoutes(lastMessage as TradeRoutesModel);
          break;
        case 'HeroTrackerModel':
          setHeroTracker(lastMessage as HeroTrackerModel);
          break;
      }
    }
  }, [lastMessage]);

  return (
    <div className="container-fluid py-4">
      <header className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="display-4 mb-0">Bannerboard Dashboard</h1>
          <div className="d-flex align-items-center gap-2">
            <div className={`badge ${isConnected ? 'bg-success' : 'bg-danger'}`}>
              {isConnected ? '● Connected' : '● Disconnected'}
            </div>
            {error && <div className="badge bg-warning">⚠ {error}</div>}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <ul className="nav nav-tabs mb-4" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'party' ? 'active' : ''}`}
            onClick={() => setActiveTab('party')}
            type="button"
          >
            Party & Clan
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'kingdoms' ? 'active' : ''}`}
            onClick={() => setActiveTab('kingdoms')}
            type="button"
          >
            Kingdoms
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'trading' ? 'active' : ''}`}
            onClick={() => setActiveTab('trading')}
            type="button"
          >
            Trading
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'settlements' ? 'active' : ''}`}
            onClick={() => setActiveTab('settlements')}
            type="button"
          >
            Settlements
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'heroes' ? 'active' : ''}`}
            onClick={() => setActiveTab('heroes')}
            type="button"
          >
            Heroes
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Party & Clan Tab */}
        <div className={`tab-pane fade ${activeTab === 'party' ? 'show active' : ''}`}>
          <div className="row g-3">
            {partyStats && (
              <div className="col-12 col-lg-6">
                <PartyStats data={partyStats} />
              </div>
            )}
            {clanInfo && (
              <div className="col-12 col-lg-6">
                <ClanInfo data={clanInfo} />
              </div>
            )}
            {!partyStats && !clanInfo && (
              <div className="col-12">
                <div className="card">
                  <div className="card-body text-center text-muted">
                    <p className="mb-0">
                      {isConnected
                        ? 'Waiting for party and clan data from Bannerlord...'
                        : 'Connecting to Bannerlord... Make sure the game is running with Bannerboard mod enabled.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kingdoms Tab */}
        <div className={`tab-pane fade ${activeTab === 'kingdoms' ? 'show active' : ''}`}>
          <div className="row g-3">
            {kingdomStrength && (
              <div className="col-12 col-lg-6">
                <KingdomStrength kingdoms={kingdomStrength.Kingdoms} />
              </div>
            )}
            {kingdomLords && (
              <div className="col-12 col-lg-6">
                <KingdomLords kingdoms={kingdomLords.Kingdoms} />
              </div>
            )}
            {kingdomWars && (
              <div className="col-12">
                <KingdomWars kingdoms={kingdomWars.Kingdoms} />
              </div>
            )}
            {!kingdomStrength && !kingdomLords && !kingdomWars && (
              <div className="col-12">
                <div className="card">
                  <div className="card-body text-center text-muted">
                    <p className="mb-0">
                      {isConnected
                        ? 'Waiting for kingdom data from Bannerlord...'
                        : 'Connecting to Bannerlord... Make sure the game is running with Bannerboard mod enabled.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trading Tab */}
        <div className={`tab-pane fade ${activeTab === 'trading' ? 'show active' : ''}`}>
          <div className="row g-3">
            {marketData && (
              <div className="col-12">
                <MarketTable
                  availableCities={marketData.AvailableCities}
                  initialCity={marketData.SelectedCity}
                />
              </div>
            )}
            {tradePrices && (
              <div className="col-12 col-lg-6">
                <TradePrices goods={tradePrices.Goods} />
              </div>
            )}
            {tradeRoutes && (
              <div className="col-12 col-lg-6">
                <TradeRoutes routes={tradeRoutes.Routes} />
              </div>
            )}
            {!marketData && !tradePrices && !tradeRoutes && (
              <div className="col-12">
                <div className="card">
                  <div className="card-body text-center text-muted">
                    <p className="mb-0">
                      {isConnected
                        ? 'Waiting for trading data from Bannerlord...'
                        : 'Connecting to Bannerlord... Make sure the game is running with Bannerboard mod enabled.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settlements Tab */}
        <div className={`tab-pane fade ${activeTab === 'settlements' ? 'show active' : ''}`}>
          <div className="row g-3">
            {townProsperity ? (
              <div className="col-12">
                <TownProsperity towns={townProsperity.Towns} />
              </div>
            ) : (
              <div className="col-12">
                <div className="card">
                  <div className="card-body text-center text-muted">
                    <p className="mb-0">
                      {isConnected
                        ? 'Waiting for settlement data from Bannerlord...'
                        : 'Connecting to Bannerlord... Make sure the game is running with Bannerboard mod enabled.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Heroes Tab */}
        <div className={`tab-pane fade ${activeTab === 'heroes' ? 'show active' : ''}`}>
          <div className="row g-3">
            {heroTracker ? (
              <div className="col-12">
                <HeroTracker data={heroTracker.Heroes} />
              </div>
            ) : (
              <div className="col-12">
                <div className="card">
                  <div className="card-body text-center text-muted">
                    <p className="mb-0">
                      {isConnected
                        ? 'Waiting for hero data from Bannerlord...'
                        : 'Connecting to Bannerlord... Make sure the game is running with Bannerboard mod enabled.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

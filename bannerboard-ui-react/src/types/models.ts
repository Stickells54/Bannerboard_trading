// Type definitions matching the C# models

export interface IMessageModel {
  Type: string;
  Version: string;
}

export interface MarketItem {
  Name: string;
  Price: number;
  Category: string;
}

export interface CityMarketModel extends IMessageModel {
  SelectedCity: string;
  AvailableCities: string[];
  Items: MarketItem[];
}

export interface Kingdom {
  Name: string;
  Strength: number;
  PrimaryColor: string;
  SecondaryColor: string;
}

export interface KingdomStrengthModel extends IMessageModel {
  Kingdoms: Kingdom[];
}

export interface KingdomWithLords {
  Name: string;
  Lords: number;
  PrimaryColor: string;
  SecondaryColor: string;
}

export interface KingdomLordsModel extends IMessageModel {
  Kingdoms: KingdomWithLords[];
}

export interface War {
  Name: string;
  IsMinorFaction: boolean;
  IsKingdomFaction: boolean;
}

export interface KingdomWithWars {
  Name: string;
  Wars: War[];
  PrimaryColor: string;
  SecondaryColor: string;
}

export interface KingdomWarsModel extends IMessageModel {
  Kingdoms: KingdomWithWars[];
}

export interface FoodItem {
  Name: string;
  Count: number;
}

export interface MemberItem {
  Description: string;
  Count: number;
  WoundedCount: number;
  IsInfantry: boolean;
  IsCavalry: boolean;
  IsArcher: boolean;
  IsMountedArcher: boolean;
  IsPrisoner: boolean;
}

export interface PartyStatsModel extends IMessageModel {
  Food: {
    Items: FoodItem[];
  };
  Members: {
    TotalHeroes: number;
    TotalRegulars: number;
    WoundedHeroes: number;
    WoundedRegulars: number;
    TotalCount: number;
    TotalWounded: number;
    MaxCount: number;
    Items: MemberItem[];
  };
}

export interface TownProsperityItem {
  Name: string;
  Prosperity: number;
  Militia: number;
  Garrison: number;
  FactionName: string;
  PrimaryColor: string;
  SecondaryColor: string;
}

export interface TownProsperityModel extends IMessageModel {
  Towns: TownProsperityItem[];
}

export interface HeroTrackerItem {
  Id: string;
  Name: string;
  Location: string;
  IsDead: boolean;
  IsDisabled: boolean;
  IsShownOnMap: boolean;
}

export interface HeroTrackerModel extends IMessageModel {
  Heroes: HeroTrackerItem[];
}

export interface TradePriceItem {
  Name: string;
  HighestPrice: number;
  HighestPriceTown: string;
  LowestPrice: number;
  LowestPriceTown: string;
  ProfitMargin: number;
}

export interface TradePricesModel extends IMessageModel {
  Goods: TradePriceItem[];
}

export interface TradeRoute {
  GoodName: string;
  BuyTown: string;
  AvgBuyPrice: number;
  SellTown: string;
  AvgSellPrice: number;
  AvgProfit: number;
  StabilityScore: number;
  RiskLevel: string;
}

export interface TradeRoutesModel extends IMessageModel {
  Routes: TradeRoute[];
}

export interface WorkshopInfo {
  Name: string;
  Type: string;
  Settlement: string;
  DailyProfit: number;
}

export interface FiefInfo {
  Name: string;
  Type: string; // Town, Castle, Village
  Prosperity: number;
  Garrison: number;
  Militia: number;
  FoodStocks: number;
  Loyalty: number;
  Security: number;
}

export interface ClanInfoModel extends IMessageModel {
  ClanName: string;
  Renown: number;
  Tier: number;
  Gold: number;
  Influence: number;
  Workshops: WorkshopInfo[];
  Fiefs: FiefInfo[];
  TotalIncome: number;
  TotalExpenses: number;
  NetIncome: number;
}

export type WidgetModel =
  | CityMarketModel
  | KingdomStrengthModel
  | KingdomLordsModel
  | KingdomWarsModel
  | PartyStatsModel
  | TownProsperityModel
  | HeroTrackerModel
  | TradePricesModel
  | TradeRoutesModel
  | ClanInfoModel;

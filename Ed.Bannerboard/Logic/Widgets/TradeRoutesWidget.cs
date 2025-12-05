using Ed.Bannerboard.Models.Widgets;
using SuperSocket.WebSocket;
using System;
using System.Collections.Generic;
using System.Linq;
using TaleWorlds.CampaignSystem;
using TaleWorlds.CampaignSystem.Settlements;
using TaleWorlds.Core;
using TaleWorlds.Library;

namespace Ed.Bannerboard.Logic.Widgets
{
	/// <summary>
	/// A widget for displaying suggested trade routes based on price history.
	/// </summary>
	public class TradeRoutesWidget : WidgetBase
	{
		// Store price history: Item -> Town -> List of (Day, Price)
		private Dictionary<string, Dictionary<string, List<(int day, int price)>>> _priceHistory 
			= new Dictionary<string, Dictionary<string, List<(int, int)>>>();
		
		private const int HISTORY_DAYS = 10;
		private int _currentDay = 0;

		/// <summary>
		/// A widget for displaying trade routes.
		/// </summary>
		/// <param name="server">WebSocket server to send data to.</param>
		/// <param name="version">Mod version.</param>
		public TradeRoutesWidget(WebSocketServer server, Version version)
			: base(server, version)
		{
		}

		protected override bool IsWidgetEnabled()
		{
			if (!base.IsWidgetEnabled()) return false;
			return Ed.Bannerboard.Settings.BannerboardSettings.Instance?.EnableTradeRoutes ?? true;
		}

		public override void RegisterEvents()
		{
			CampaignEvents.DailyTickEvent.AddNonSerializedListener(this, new Action(() =>
			{
				RecordPrices();
				_currentDay++;

				if (!IsWidgetEnabled()) return;

				// Send updates every day
				foreach (var session in Server.GetAllSessions())
				{
					SendUpdate(session);
				}
			}));
		}

		public override void Init(WebSocketSession session)
		{
			// Initialize with current prices
			RecordPrices();
			
			if (!IsWidgetEnabled()) return;
			SendUpdate(session);
		}

		public override bool CanHandleMessage(string message)
		{
			return false;
		}

		public override void HandleMessage(WebSocketSession session, string message)
		{
			// This widget doesn't accept messages
		}

		private void RecordPrices()
		{
			try
			{
				var towns = Campaign.Current.Settlements
					.Where(s => s.IsTown && s.Town != null && s.Town.MarketData != null)
					.ToList();

				if (towns.Count == 0) return;

				// Get tradeable items from first town
				var sampleTown = towns.First().Town;
				var tradeableItems = new List<ItemObject>();

				if (sampleTown.Owner?.ItemRoster != null)
				{
					foreach (var rosterElement in sampleTown.Owner.ItemRoster)
					{
						var item = rosterElement.EquipmentElement.Item;
						if (item != null && item.ItemCategory != null && item.ItemCategory.IsTradeGood)
						{
							if (!tradeableItems.Contains(item))
							{
								tradeableItems.Add(item);
							}
						}
					}
				}

				// Record prices for each item in each town
				foreach (var item in tradeableItems)
				{
					var itemName = item.Name.ToString();

					if (!_priceHistory.ContainsKey(itemName))
					{
						_priceHistory[itemName] = new Dictionary<string, List<(int, int)>>();
					}

					foreach (var settlement in towns)
					{
						var townName = settlement.Name.ToString();
						var price = settlement.Town.MarketData.GetPrice(item, null, false);

						if (price <= 0) continue;

						if (!_priceHistory[itemName].ContainsKey(townName))
						{
							_priceHistory[itemName][townName] = new List<(int, int)>();
						}

						var townHistory = _priceHistory[itemName][townName];
						townHistory.Add((_currentDay, price));

						// Keep only last HISTORY_DAYS
						if (townHistory.Count > HISTORY_DAYS)
						{
							townHistory.RemoveAt(0);
						}
					}
				}
			}
			catch (Exception ex)
			{
				InformationManager.DisplayMessage(
					new InformationMessage($"Trade Routes Recording Error: {ex.Message}", Colors.Red)
				);
			}
		}

		private void SendUpdate(WebSocketSession session)
		{
			try
			{
				var routes = new List<TradeRouteItem>();

				// Analyze price history to find stable routes
				foreach (var itemKvp in _priceHistory)
				{
					var itemName = itemKvp.Key;
					var townPrices = itemKvp.Value;

					// Need at least 2 towns with history
					var townsWithHistory = townPrices.Where(t => t.Value.Count >= 3).ToList();
					if (townsWithHistory.Count < 2) continue;

					// Find BEST SINGLE route for this item (not all combinations)
					TradeRouteItem bestRoute = null;
					int bestScore = 0;

					foreach (var buyTown in townsWithHistory)
					{
						foreach (var sellTown in townsWithHistory)
						{
							if (buyTown.Key == sellTown.Key) continue;

							var buyPrices = buyTown.Value.Select(p => p.price).ToList();
							var sellPrices = sellTown.Value.Select(p => p.price).ToList();

							var avgBuyPrice = (int)buyPrices.Average();
							var avgSellPrice = (int)sellPrices.Average();
							var avgProfit = avgSellPrice - avgBuyPrice;

							// Only consider profitable routes
							if (avgProfit <= 0) continue;

							// Calculate price stability (lower variance = more stable)
							var buyVariance = CalculateVariance(buyPrices);
							var sellVariance = CalculateVariance(sellPrices);
							
							// Stability score: 100 - (normalized variance)
							var totalVariance = buyVariance + sellVariance;
							var stabilityScore = Math.Max(0, 100 - (int)(totalVariance / avgProfit * 50));

							// Determine risk level
							string riskLevel;
							if (stabilityScore >= 70)
								riskLevel = "Low";
							else if (stabilityScore >= 40)
								riskLevel = "Medium";
							else
								riskLevel = "High";

							// Skip high risk routes
							if (riskLevel == "High") continue;

							// Combined score: stability matters more than raw profit
							var combinedScore = (stabilityScore * 2) + (avgProfit / 10);

							if (bestRoute == null || combinedScore > bestScore)
							{
								bestScore = combinedScore;
								bestRoute = new TradeRouteItem
								{
									GoodName = itemName,
									BuyTown = buyTown.Key,
									AvgBuyPrice = avgBuyPrice,
									SellTown = sellTown.Key,
									AvgSellPrice = avgSellPrice,
									AvgProfit = avgProfit,
									StabilityScore = stabilityScore,
									RiskLevel = riskLevel
								};
							}
						}
					}

					// Add the best route for this item (if one exists)
					if (bestRoute != null)
					{
						routes.Add(bestRoute);
					}
				}

				// Sort by combined score (stability weighted more than profit)
				var sortedRoutes = routes
					.OrderByDescending(r => (r.StabilityScore * 2) + (r.AvgProfit / 10))
					.Take(20) // Top 20 routes
					.ToList();

				var model = new TradeRoutesModel
				{
					Routes = sortedRoutes,
					Version = Version,
				};

				session.Send(model.ToJsonArraySegment());
			}
			catch (Exception ex)
			{
				InformationManager.DisplayMessage(
					new InformationMessage($"Trade Routes Error: {ex.Message}", Colors.Red)
				);
			}
		}

		private double CalculateVariance(List<int> values)
		{
			if (values.Count == 0) return 0;

			var avg = values.Average();
			var sumOfSquares = values.Sum(v => Math.Pow(v - avg, 2));
			return sumOfSquares / values.Count;
		}
	}
}

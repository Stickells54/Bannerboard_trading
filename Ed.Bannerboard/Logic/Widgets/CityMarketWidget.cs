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
	/// A widget for displaying all market prices in a selected city.
	/// </summary>
	public class CityMarketWidget : WidgetBase
	{
		private string _selectedCity = null;

		/// <summary>
		/// A widget for displaying city market prices.
		/// </summary>
		/// <param name="server">WebSocket server to send data to.</param>
		/// <param name="version">Mod version.</param>
		public CityMarketWidget(WebSocketServer server, Version version)
			: base(server, version)
		{
		}

		protected override bool IsWidgetEnabled()
		{
			if (!base.IsWidgetEnabled()) return false;
			return Ed.Bannerboard.Settings.BannerboardSettings.Instance?.EnableCityMarket ?? true;
		}

		public override void RegisterEvents()
		{
			CampaignEvents.HourlyTickEvent.AddNonSerializedListener(this, new Action(() =>
			{
				if (!IsWidgetEnabled()) return;
				
				foreach (var session in Server.GetAllSessions())
				{
					SendUpdate(session);
				}
			}));
		}

		public override void Init(WebSocketSession session)
		{
			if (!IsWidgetEnabled()) return;
			SendUpdate(session);
		}

		public override bool CanHandleMessage(string message)
		{
			return System.Text.RegularExpressions.Regex.IsMatch(message, $"\"Type\":.*\"{nameof(CityMarketFilterModel)}\"");
		}

		public override void HandleMessage(WebSocketSession session, string message)
		{
			if (!IsWidgetEnabled()) return;
			
			var model = Newtonsoft.Json.JsonConvert.DeserializeObject<CityMarketFilterModel>(message, new Newtonsoft.Json.Converters.VersionConverter());
			if (model == null)
			{
				return;
			}

			// Update selected city filter
			_selectedCity = string.IsNullOrEmpty(model.SelectedCity) ? null : model.SelectedCity;

			// Send updated data
			SendUpdate(session);
		}

		private void SendUpdate(WebSocketSession session)
		{
			try
			{
				// Get all towns with markets
				var towns = Campaign.Current.Settlements
					.Where(s => s.IsTown && s.Town != null && s.Town.MarketData != null)
					.OrderBy(s => s.Name.ToString())
					.ToList();

				if (towns.Count == 0)
				{
					return;
				}

				// Build list of available cities
				var availableCities = towns.Select(t => t.Name.ToString()).ToList();

				// If no city selected, default to first one
				if (string.IsNullOrEmpty(_selectedCity) && availableCities.Count > 0)
				{
					_selectedCity = availableCities[0];
				}

				// Find the selected settlement
				var selectedSettlement = towns.FirstOrDefault(t => t.Name.ToString() == _selectedCity);
				var marketItems = new List<MarketItem>();

				if (selectedSettlement != null)
				{
					// Collect all tradeable items from all towns to get complete item list
					var allTradeableItems = new List<ItemObject>();

					foreach (var settlement in towns)
					{
						if (settlement.Town?.Owner?.ItemRoster != null)
						{
							foreach (var rosterElement in settlement.Town.Owner.ItemRoster)
							{
								var item = rosterElement.EquipmentElement.Item;
								if (item != null && item.ItemCategory != null && item.ItemCategory.IsTradeGood)
								{
									if (!allTradeableItems.Contains(item))
									{
										allTradeableItems.Add(item);
									}
								}
							}
						}
					}

					// Get prices for all items in the selected city
					foreach (var item in allTradeableItems.OrderBy(i => i.Name.ToString()))
					{
						var price = selectedSettlement.Town.MarketData.GetPrice(item, null, false);
						
						// Include items even if price is 0 (city might not have it in stock)
						marketItems.Add(new MarketItem
						{
							Name = item.Name.ToString(),
							Price = price,
							Category = item.ItemCategory?.ToString() ?? "Unknown"
						});
					}
				}

				var model = new CityMarketModel
				{
					AvailableCities = availableCities,
					SelectedCity = _selectedCity,
					Items = marketItems,
					Version = Version,
				};

				session.Send(model.ToJsonArraySegment());
			}
			catch (Exception ex)
			{
				// Log the error
				InformationManager.DisplayMessage(
					new InformationMessage($"City Market Error: {ex.Message}", Colors.Red)
				);
			}
		}
	}
}

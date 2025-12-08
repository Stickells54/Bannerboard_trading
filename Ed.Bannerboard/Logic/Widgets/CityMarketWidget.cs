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
				
                // We no longer broadcast the full item list via WebSocket
                // The frontend will fetch data from /api/market/{city}
				var marketItems = new List<MarketItem>(); 

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

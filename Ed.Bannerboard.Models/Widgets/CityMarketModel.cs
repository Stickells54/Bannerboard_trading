using System;
using System.Collections.Generic;

namespace Ed.Bannerboard.Models.Widgets
{
	/// <summary>
	/// Model for displaying all market prices in a selected city.
	/// </summary>
	[Serializable]
	public class CityMarketModel : IMessageModel
	{
		/// <summary>
		/// Type identifier for JSON serialization.
		/// </summary>
		public string Type => nameof(CityMarketModel);

		/// <summary>
		/// Mod version that sent this data.
		/// </summary>
		public Version Version { get; set; }

		/// <summary>
		/// List of available cities.
		/// </summary>
		public List<string> AvailableCities { get; set; }

		/// <summary>
		/// Currently selected city name.
		/// </summary>
		public string SelectedCity { get; set; }

		/// <summary>
		/// List of market items in the selected city.
		/// </summary>
		public List<MarketItem> Items { get; set; }
	}

	/// <summary>
	/// Represents a tradeable item in a city's market.
	/// </summary>
	public class MarketItem
	{
		/// <summary>
		/// Name of the trade good.
		/// </summary>
		public string Name { get; set; } = string.Empty;

		/// <summary>
		/// Current price in the market.
		/// </summary>
		public int Price { get; set; }

		/// <summary>
		/// Category of the item.
		/// </summary>
		public string Category { get; set; } = string.Empty;
	}
}

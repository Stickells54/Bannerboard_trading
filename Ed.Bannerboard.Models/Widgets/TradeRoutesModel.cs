using System;
using System.Collections.Generic;

namespace Ed.Bannerboard.Models.Widgets
{
	/// <summary>
	/// Model for the trade routes widget data.
	/// </summary>
	[Serializable]
	public class TradeRoutesModel : IMessageModel
	{
		/// <summary>
		/// List of suggested trade routes.
		/// </summary>
		public List<TradeRouteItem> Routes { get; set; }

		/// <summary>
		/// Model type.
		/// </summary>
		public string Type => nameof(TradeRoutesModel);

		/// <summary>
		/// Model version.
		/// </summary>
		public Version Version { get; set; }
	}

	/// <summary>
	/// Single trade route suggestion.
	/// </summary>
	[Serializable]
	public class TradeRouteItem
	{
		/// <summary>
		/// Name of the trade good.
		/// </summary>
		public string GoodName { get; set; }

		/// <summary>
		/// Town to buy from.
		/// </summary>
		public string BuyTown { get; set; }

		/// <summary>
		/// Average buy price over the period.
		/// </summary>
		public int AvgBuyPrice { get; set; }

		/// <summary>
		/// Town to sell to.
		/// </summary>
		public string SellTown { get; set; }

		/// <summary>
		/// Average sell price over the period.
		/// </summary>
		public int AvgSellPrice { get; set; }

		/// <summary>
		/// Average profit margin.
		/// </summary>
		public int AvgProfit { get; set; }

		/// <summary>
		/// Price stability score (0-100, higher is more stable).
		/// </summary>
		public int StabilityScore { get; set; }

		/// <summary>
		/// Risk level (Low, Medium, High).
		/// </summary>
		public string RiskLevel { get; set; }
	}
}

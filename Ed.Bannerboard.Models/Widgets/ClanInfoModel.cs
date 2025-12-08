using System;
using System.Collections.Generic;

namespace Ed.Bannerboard.Models.Widgets
{
	public class ClanInfoModel : IMessageModel
	{
		public string Type { get; set; } = "ClanInfoModel";
		public Version Version { get; set; }

		public string ClanName { get; set; }
		public int Renown { get; set; }
		public int Tier { get; set; }
		public int Gold { get; set; }
		public int Influence { get; set; }
		public List<WorkshopInfo> Workshops { get; set; } = new List<WorkshopInfo>();
		public List<FiefInfo> Fiefs { get; set; } = new List<FiefInfo>();
		public int TotalIncome { get; set; }
		public int TotalExpenses { get; set; }
		public int NetIncome { get; set; }
	}

	public class WorkshopInfo
	{
		public string Name { get; set; }
		public string Type { get; set; }
		public string Settlement { get; set; }
		public int DailyProfit { get; set; }
	}

	public class FiefInfo
	{
		public string Name { get; set; }
		public string Type { get; set; } // Town, Castle, Village
		public int Prosperity { get; set; }
		public int Garrison { get; set; }
		public int Militia { get; set; }
		public int FoodStocks { get; set; }
		public int Loyalty { get; set; }
		public int Security { get; set; }
	}
}

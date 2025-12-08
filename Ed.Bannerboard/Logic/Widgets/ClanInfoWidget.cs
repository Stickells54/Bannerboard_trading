using Ed.Bannerboard.Models.Widgets;
using SuperSocket.WebSocket;
using System;
using System.Linq;
using TaleWorlds.CampaignSystem;
using TaleWorlds.CampaignSystem.Settlements;
using TaleWorlds.CampaignSystem.Settlements.Workshops;

namespace Ed.Bannerboard.Logic.Widgets
{
	/// <summary>
	/// A widget for displaying clan information including renown, workshops, and fiefs.
	/// </summary>
	public class ClanInfoWidget : WidgetBase
	{
		/// <summary>
		/// A widget for displaying clan information.
		/// </summary>
		/// <param name="server">WebSocket server to send data to.</param>
		/// <param name="version">Mod version.</param>
		public ClanInfoWidget(WebSocketServer server, Version version)
			: base(server, version)
		{
		}

		public override void RegisterEvents()
		{
			CampaignEvents.DailyTickEvent.AddNonSerializedListener(this, new Action(() =>
			{
				foreach (var session in Server.GetAllSessions())
				{
					SendUpdate(session);
				}
			}));
		}

		public override void Init(WebSocketSession session)
		{
			SendUpdate(session);
		}

		public override bool CanHandleMessage(string message)
		{
			return false;
		}

		public override void HandleMessage(WebSocketSession session, string message)
		{
			throw new NotImplementedException();
		}

			private void SendUpdate(WebSocketSession session)
		{
			try
			{
				var clan = Clan.PlayerClan;
				if (clan == null)
					return;

				float totalIncome = 0;
				float totalExpenses = 0;
				float netIncome = 0;

				try
				{
					// Use the game's finance model to calculate daily gold change
					var explainedNumber = Campaign.Current.Models.ClanFinanceModel.CalculateClanGoldChange(clan, true, true, true);
					netIncome = explainedNumber.ResultNumber;

					// Note: explainedNumber.GetLines() returns tuples which requires System.ValueTuple reference 
					// which might be missing in some mod environments. We skip detailed breakdown to ensure stability.
					
					// Simple heuristic for totals since we can't easily break it down without GetLines
					if (netIncome >= 0)
					{
						totalIncome = netIncome;
						totalExpenses = 0;
					}
					else
					{
						totalIncome = 0;
						totalExpenses = Math.Abs(netIncome);
					}

                    // Try to improve Income estimate if we have workshop data
                    var workshopIncome = Hero.MainHero.OwnedWorkshops.Sum(w => w.ProfitMade);
                    if (workshopIncome > 0 && totalIncome < workshopIncome)
                    {
                        // If known workshop income > net income (meaning high expenses), adjust totals
                        // Net = Income - Expenses => Expenses = Income - Net
                        totalIncome = workshopIncome;
                        totalExpenses = totalIncome - netIncome;
                    }
				}
				catch (Exception)
				{
					// Fallback if detailed calculation fails (e.g. API change)
					// Try to sum known sources
					totalIncome = Hero.MainHero.OwnedWorkshops.Sum(w => w.ProfitMade);
					// Expenses are harder to guess without the model (garrisons, parties)
				}
                
                // If net income is set but totals are 0 (e.g. GetLines failed to return anything but ResultNumber works), 
                // we can at least show net.
                if (totalIncome == 0 && totalExpenses == 0 && netIncome != 0)
                {
                    if (netIncome > 0) totalIncome = netIncome;
                    else totalExpenses = Math.Abs(netIncome);
                }

				var model = new ClanInfoModel
				{
					ClanName = clan.Name?.ToString() ?? "Unknown",
					Renown = (int)clan.Renown,
					Tier = clan.Tier,
					Gold = Hero.MainHero.Gold,
					Influence = (int)clan.Influence,
					Workshops = Hero.MainHero.OwnedWorkshops
						.Select(w => new WorkshopInfo
						{
							Name = w.Name?.ToString() ?? "Unknown",
							Type = w.WorkshopType?.Name?.ToString() ?? "Unknown",
							Settlement = w.Settlement?.Name?.ToString() ?? "Unknown",
							DailyProfit = w.ProfitMade
						})
						.ToList(),
					Fiefs = clan.Settlements
						.Where(s => s.IsTown || s.IsCastle)
						.Select(s => new FiefInfo
						{
							Name = s.Name?.ToString() ?? "Unknown",
							Type = s.IsTown ? "Town" : s.IsCastle ? "Castle" : "Unknown",
							Prosperity = s.Town != null ? (int)s.Town.Prosperity : 0,
							Garrison = s.Town != null ? s.Town.GarrisonParty?.MemberRoster.TotalManCount ?? 0 : 0,
							Militia = s.Town != null ? (int)s.Town.Militia : 0,
							FoodStocks = s.Town != null ? (int)s.Town.FoodStocks : 0,
							Loyalty = s.Town != null ? (int)s.Town.Loyalty : 0,
							Security = s.Town != null ? (int)s.Town.Security : 0
						})
						.ToList(),
					TotalIncome = (int)totalIncome,
					TotalExpenses = (int)totalExpenses,
					NetIncome = (int)netIncome,
					Version = Version
				};

				session.Send(model.ToJsonArraySegment());
			}
			catch
			{
				// Ignore
			}
		}
	}
}

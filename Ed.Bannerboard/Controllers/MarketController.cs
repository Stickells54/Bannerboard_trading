using EmbedIO;
using EmbedIO.Routing;
using EmbedIO.WebApi;
using System;
using System.Collections.Generic;
using System.Linq;
using TaleWorlds.CampaignSystem;
using TaleWorlds.CampaignSystem.Settlements;

namespace Ed.Bannerboard.Controllers
{
    public class MarketController : WebApiController
    {
        [Route(HttpVerbs.Get, "/market/{city?}")]
        public IEnumerable<object> GetMarket(string city = null)
        {
            if (Campaign.Current == null)
            {
                throw new HttpException(503, "Campaign not loaded");
            }

            var settlements = Settlement.All.Where(s => s.IsTown).ToList();

            if (string.IsNullOrEmpty(city))
            {
                // Return list of available cities
                return settlements.Select(s => new { Name = s.Name.ToString() });
            }

            var settlement = settlements.FirstOrDefault(s => s.Name.ToString().Equals(city, StringComparison.OrdinalIgnoreCase));
            
            if (settlement == null)
            {
                throw HttpException.NotFound($"City '{city}' not found");
            }

            // Return market data for the specific city
            // Note: This logic mirrors what was likely in CityMarketWidget but simplified for on-demand
            var marketData = new List<object>();
            
            if (settlement.Town != null && settlement.Town.MarketData != null)
            {
                 foreach (var item in TaleWorlds.CampaignSystem.Extensions.Items.All)
                 {
                     // Simple filter to show only relevant items (can be expanded)
                     if (item.IsTradeGood || item.IsFood)
                     {
                         var price = settlement.Town.MarketData.GetPrice(item);
                         var category = item.Type;
                         
                         marketData.Add(new 
                         {
                             Name = item.Name.ToString(),
                             Price = price,
                             Category = category.ToString(),
                             ItemId = item.StringId
                         });
                    }
                 }
            }

            return marketData;
        }
    }
}

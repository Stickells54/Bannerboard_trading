using Ed.Bannerboard.Models.Widgets;
using Microsoft.AspNetCore.Components;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Text.RegularExpressions;

namespace Ed.Bannerboard.UI.Widgets
{
	public partial class CityMarket
	{
		private readonly Version _minimumSupportedVersion = new("0.3.0");
		private CityMarketModel? _cityMarketModel;

		public override bool CanUpdate(string model, Version? version)
		{
			return Regex.IsMatch(model, $"\"Type\":.*\"{nameof(CityMarketModel)}\"")
				&& IsCompatible(version, _minimumSupportedVersion);
		}

		public override Task Update(string model)
		{
			var newModel = JsonConvert.DeserializeObject<CityMarketModel>(model, new VersionConverter());
			if (newModel == null)
			{
				return Task.CompletedTask;
			}

			if (_cityMarketModel != null
				&& newModel.SelectedCity == _cityMarketModel.SelectedCity
				&& newModel.Items.SequenceEqual(_cityMarketModel.Items, new MarketItemComparer()))
			{
				// Do not update if nothing has changed
				return Task.CompletedTask;
			}

			_cityMarketModel = newModel;

			StateHasChanged();
			return Task.CompletedTask;
		}

		public override Task ResetAsync()
		{
			_cityMarketModel = null;

			StateHasChanged();
			return Task.CompletedTask;
		}

		private void OnCitySelected(ChangeEventArgs e)
		{
			var selectedCity = e.Value?.ToString();
			if (string.IsNullOrEmpty(selectedCity))
			{
				return;
			}

			// Send filter message to server
			var filterModel = new CityMarketFilterModel
			{
				SelectedCity = selectedCity,
				Version = _cityMarketModel?.Version
			};

			var json = JsonConvert.SerializeObject(filterModel, new VersionConverter());
			OnMessageSent(json);
		}

		private class MarketItemComparer : IEqualityComparer<MarketItem>
		{
			public bool Equals(MarketItem? x, MarketItem? y)
			{
				if (x == null && y == null) return true;
				if (x == null || y == null) return false;
				return x.Name == y.Name && x.Price == y.Price && x.Category == y.Category;
			}

			public int GetHashCode(MarketItem obj)
			{
				return HashCode.Combine(obj.Name, obj.Price, obj.Category);
			}
		}
	}
}

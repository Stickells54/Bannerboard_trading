using Ed.Bannerboard.Models.Widgets;
using Microsoft.AspNetCore.Components;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Text.RegularExpressions;

namespace Ed.Bannerboard.UI.Widgets
{
	public partial class TradeRoutes
	{
		private readonly Version _minimumSupportedVersion = new("0.3.0");
		private TradeRoutesModel? _routesModel;

		public override bool CanUpdate(string model, Version? version)
		{
			return Regex.IsMatch(model, $"\"Type\":.*\"{nameof(TradeRoutesModel)}\"")
				&& IsCompatible(version, _minimumSupportedVersion);
		}

		public override Task Update(string model)
		{
			var newModel = JsonConvert.DeserializeObject<TradeRoutesModel>(model, new VersionConverter());
			if (newModel == null)
			{
				return Task.CompletedTask;
			}

			if (_routesModel != null
				&& newModel.Routes.SequenceEqual(_routesModel.Routes))
			{
				// Do not update if nothing has changed
				return Task.CompletedTask;
			}

			_routesModel = newModel;

			StateHasChanged();
			return Task.CompletedTask;
		}

		public override Task ResetAsync()
		{
			_routesModel = null;

			StateHasChanged();
			return Task.CompletedTask;
		}

		private string GetRiskBadgeClass(string riskLevel)
		{
			return riskLevel switch
			{
				"Low" => "badge badge-success",
				"Medium" => "badge badge-warning",
				"High" => "badge badge-danger",
				_ => "badge badge-secondary"
			};
		}

		private string GetStabilityBarColor(int stability)
		{
			if (stability >= 70) return "#28a745"; // Green
			if (stability >= 40) return "#ffc107"; // Yellow
			return "#dc3545"; // Red
		}
	}
}

using System;

namespace Ed.Bannerboard.Models.Widgets
{
	/// <summary>
	/// Filter message for selecting a city in the City Market widget.
	/// </summary>
	[Serializable]
	public class CityMarketFilterModel : IMessageModel
	{
		/// <summary>
		/// Type identifier for JSON serialization.
		/// </summary>
		public string Type => nameof(CityMarketFilterModel);

		/// <summary>
		/// Mod version.
		/// </summary>
		public Version Version { get; set; }

		/// <summary>
		/// Selected city name.
		/// </summary>
		public string SelectedCity { get; set; }
	}
}

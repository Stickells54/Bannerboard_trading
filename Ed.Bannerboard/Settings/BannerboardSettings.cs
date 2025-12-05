using MCM.Abstractions.Attributes;
using MCM.Abstractions.Attributes.v2;
using MCM.Abstractions.Base.Global;

namespace Ed.Bannerboard.Settings
{
	/// <summary>
	/// Bannerboard MCM settings for controlling widget behavior.
	/// </summary>
	public class BannerboardSettings : AttributeGlobalSettings<BannerboardSettings>
	{
		public override string Id => "BannerboardSettings";
		public override string DisplayName => "Bannerboard";
		public override string FolderName => "Bannerboard";
		public override string FormatType => "json";

		[SettingPropertyBool("Enable Widget Updates", Order = 0, RequireRestart = false,
			HintText = "Enable or disable sending widget data updates to the dashboard. When disabled, no data will be sent to the web dashboard.")]
		[SettingPropertyGroup("General", GroupOrder = 0)]
		public bool EnableWidgetUpdates { get; set; } = true;

		[SettingPropertyBool("Enable Trade Prices Widget", Order = 1, RequireRestart = false,
			HintText = "Enable or disable the Trade Prices widget updates.")]
		[SettingPropertyGroup("Widgets/Trading", GroupOrder = 1)]
		public bool EnableTradePrices { get; set; } = true;

		[SettingPropertyBool("Enable Trade Routes Widget", Order = 2, RequireRestart = false,
			HintText = "Enable or disable the Trade Routes widget updates.")]
		[SettingPropertyGroup("Widgets/Trading", GroupOrder = 1)]
		public bool EnableTradeRoutes { get; set; } = true;

		[SettingPropertyBool("Enable City Market Widget", Order = 3, RequireRestart = false,
			HintText = "Enable or disable the City Market widget updates.")]
		[SettingPropertyGroup("Widgets/Trading", GroupOrder = 1)]
		public bool EnableCityMarket { get; set; } = true;

		[SettingPropertyBool("Enable Kingdom Strength Widget", Order = 4, RequireRestart = false,
			HintText = "Enable or disable the Kingdom Strength widget updates.")]
		[SettingPropertyGroup("Widgets/Kingdom", GroupOrder = 2)]
		public bool EnableKingdomStrength { get; set; } = true;

		[SettingPropertyBool("Enable Kingdom Lords Widget", Order = 5, RequireRestart = false,
			HintText = "Enable or disable the Kingdom Lords widget updates.")]
		[SettingPropertyGroup("Widgets/Kingdom", GroupOrder = 2)]
		public bool EnableKingdomLords { get; set; } = true;

		[SettingPropertyBool("Enable Kingdom Wars Widget", Order = 6, RequireRestart = false,
			HintText = "Enable or disable the Kingdom Wars widget updates.")]
		[SettingPropertyGroup("Widgets/Kingdom", GroupOrder = 2)]
		public bool EnableKingdomWars { get; set; } = true;

		[SettingPropertyBool("Enable Party Stats Widget", Order = 7, RequireRestart = false,
			HintText = "Enable or disable the Party Stats widget updates.")]
		[SettingPropertyGroup("Widgets/Party", GroupOrder = 3)]
		public bool EnablePartyStats { get; set; } = true;

		[SettingPropertyBool("Enable Hero Tracker Widget", Order = 8, RequireRestart = false,
			HintText = "Enable or disable the Hero Tracker widget updates.")]
		[SettingPropertyGroup("Widgets/Party", GroupOrder = 3)]
		public bool EnableHeroTracker { get; set; } = true;

		[SettingPropertyBool("Enable Town Prosperity Widget", Order = 9, RequireRestart = false,
			HintText = "Enable or disable the Town Prosperity widget updates.")]
		[SettingPropertyGroup("Widgets/Towns", GroupOrder = 4)]
		public bool EnableTownProsperity { get; set; } = true;
	}
}

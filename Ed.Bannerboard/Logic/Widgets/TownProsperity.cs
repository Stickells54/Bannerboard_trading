using Ed.Bannerboard.Models.Widgets;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using SuperSocket.WebSocket;
using System;
using System.Linq;
using System.Text.RegularExpressions;
using TaleWorlds.CampaignSystem;
using TaleWorlds.Library;

namespace Ed.Bannerboard.Logic.Widgets
{
    /// <summary>
    /// A widget for displaying town prosperity.
    /// </summary>
    public class TownProsperity : WidgetBase
    {
        /// <summary>
        /// A widget for displaying town prosperity.
        /// </summary>
        /// <param name="server">WebSocket server to send data to.</param>
        /// <param name="version">Mod version.</param>
        public TownProsperity(WebSocketServer server, Version version)
            : base(server, version)
        {
        }

        public override void RegisterEvents()
        {
            CampaignEvents.HourlyTickEvent.AddNonSerializedListener(this, new Action(() =>
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
            // Note: Version is not checked yet
            return Regex.IsMatch(message, $"\"Type\":.*\"{nameof(TownProsperityFilterModel)}\"");
        }

        public override void HandleMessage(WebSocketSession session, string message)
        {
            // Ignore filter model, just send update
            SendUpdate(session);
        }

        private void SendUpdate(WebSocketSession session)
        {
            try
            {
                var model = new TownProsperityModel
                {
                    Towns = Campaign.Current.Settlements
                        .Where(s => s.IsTown)
                        .OrderByDescending(s => s.Town.Prosperity)
                        .Select(s => new TownProsperityItem
                        {
                            Name = s.Name.ToString(),
                            Prosperity = s.Town.Prosperity,
                            Militia = s.Militia,
                            Garrison = s.Parties.Where(p => p.IsGarrison).Sum(p => p.Party.MemberRoster.TotalManCount),
                            FactionName = s.MapFaction.Name.ToString(),
                            PrimaryColor = Color.FromUint(s.MapFaction.Color).ToString(),
                            SecondaryColor = Color.FromUint(s.MapFaction.Color2).ToString()
                        })
                        .ToList(),
                    Version = Version,
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

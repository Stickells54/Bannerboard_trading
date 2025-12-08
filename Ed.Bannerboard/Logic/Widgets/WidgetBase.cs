using SuperSocket.WebSocket;
using System;
using TaleWorlds.CampaignSystem;
using Ed.Bannerboard.Settings;

namespace Ed.Bannerboard.Logic.Widgets
{
    /// <summary>
    /// Base logic for all Bannerboard widgets.
    /// </summary>
    public abstract class WidgetBase : CampaignBehaviorBase
    {
        /// <summary>
        /// Base logic for all Bannerboard widgets.
        /// </summary>
        /// <param name="server">WebSocket server to send data to.</param>
        /// <param name="version">Mod version.</param>
        public WidgetBase(WebSocketServer server, Version version)
        {
            Server = server;
            Version = version;
        }

        /// <summary>
        /// WebSocket server to send data to.
        /// </summary>
        protected WebSocketServer Server { get; set; }

        /// <summary>
        /// Widget version.
        /// </summary>
        protected Version Version { get; set; }

        /// <summary>
        /// Check if widget updates are enabled globally and for this specific widget.
        /// </summary>
        protected virtual bool IsWidgetEnabled()
        {
            // Check if global widget updates are disabled
            if (BannerboardSettings.Instance != null && !BannerboardSettings.Instance.EnableWidgetUpdates)
            {
                return false;
            }
            return true;
        }

        /// <summary>
        /// Send data to all connected sessions if widget is enabled.
        /// </summary>
        protected void SendData(string data)
        {
            if (!IsWidgetEnabled())
            {
                return;
            }

            var sessions = Server.GetAllSessions();
            foreach (var session in sessions)
            {
                // Fire and forget - don't block main thread
                System.Threading.Tasks.Task.Run(() => 
                {
                    try 
                    {
                        session.Send(data);
                    }
                    catch 
                    {
                        // Ignore send failures (UDP-like behavior requested)
                    }
                });
            }
        }

        /// <summary>
        /// Send data to a specific session if widget is enabled.
        /// </summary>
        protected void SendData(WebSocketSession session, string data)
        {
            if (!IsWidgetEnabled())
            {
                return;
            }

            // Fire and forget - don't block main thread
            System.Threading.Tasks.Task.Run(() => 
            {
                try
                {
                    session.Send(data);
                }
                catch
                {
                    // Ignore send failures (UDP-like behavior requested)
                }
            });
        }

        /// <summary>
        /// Initializes a widget.
        /// </summary>
        /// <param name="session">The session to initialize the widget for.</param>
        public abstract void Init(WebSocketSession session);

        /// <summary>
        /// Determines whether the widget can handle a received message.
        /// </summary>
        /// <param name="message">The message that was sent.</param>
        public abstract bool CanHandleMessage(string message);

        /// <summary>
        /// Handles a received message.
        /// </summary>
        /// <param name="session">The session that the message was sent from.</param>
        /// <param name="message">The message that was sent.</param>
        public abstract void HandleMessage(WebSocketSession session, string message);

        /// <summary>
        /// Syncs widget save data.
        /// </summary>
        /// <param name="dataStore">Data store.</param>
        public override void SyncData(IDataStore dataStore)
        {
            // Nothing to sync
        }
    }
}

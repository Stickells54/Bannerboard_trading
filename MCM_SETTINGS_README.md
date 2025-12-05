# Bannerboard MCM Settings

## Overview
Bannerboard now supports Mod Configuration Menu (MCM) for controlling widget data updates. This allows you to disable widget updates globally or for specific widgets without restarting the game.

## Installation
1. Install **Mod Configuration Menu (MCM)** from:
   - [Nexus Mods](https://www.nexusmods.com/mountandblade2bannerlord/mods/612)
   - [Steam Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=2859238197)
2. Enable MCM in Bannerlord Launcher
3. Rebuild and deploy Bannerboard

## Settings

### Global Settings
- **Enable Widget Updates**: Master switch to enable/disable all widget data updates to the dashboard

### Widget-Specific Settings
Control individual widgets:

#### Trading Widgets
- **Enable Trade Prices Widget**: Show/hide trade prices data
- **Enable Trade Routes Widget**: Show/hide trade routes data  
- **Enable City Market Widget**: Show/hide city market data

#### Kingdom Widgets
- **Enable Kingdom Strength Widget**: Show/hide kingdom strength data
- **Enable Kingdom Lords Widget**: Show/hide kingdom lords data
- **Enable Kingdom Wars Widget**: Show/hide kingdom wars data

#### Party Widgets
- **Enable Party Stats Widget**: Show/hide party stats data
- **Enable Hero Tracker Widget**: Show/hide hero tracker data

#### Town Widgets
- **Enable Town Prosperity Widget**: Show/hide town prosperity data

## Usage
1. Press **ESC** in-game
2. Select **Mod Options**
3. Select **Bannerboard**
4. Toggle settings as desired
5. Changes apply immediately (no restart required)

## Benefits
- **Performance**: Disable unused widgets to reduce CPU usage
- **Privacy**: Control what data is sent to the dashboard
- **Flexibility**: Enable only the widgets you need
- **Real-time**: Changes apply without restarting

## Technical Details
- Settings are saved to `Documents/Mount and Blade II Bannerlord/Configs/Bannerboard/BannerboardSettings.json`
- All settings default to `true` (enabled)
- MCM dependency is marked as optional - mod will work without it
- When MCM is not installed, all widgets are enabled by default

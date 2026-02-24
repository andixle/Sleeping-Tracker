# Sleep Tracker

A mobile app for tracking sleep patterns and daytime alertness levels.

## Features

- **Sleep Logging**: Track overnight sleep duration
- **Sleepiness Tracking**: Log daytime alertness (1-7 scale)
- **Data Dashboard**: View statistics and trends
- **Cloud Backup**: AWS integration for data sync
- **Haptic Feedback**: Tactile confirmation for actions

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the app:
   ```bash
   ionic serve
   ```

3. Build for mobile:
   ```bash
   ionic build
   npx cap add android
   npx cap add ios
   ```

## How to Use

### Log Sleep
1. Tap "Log Overnight Sleep"
2. Select bedtime and wake time
3. Confirm entry

### Log Sleepiness
1. Tap "Log Sleepiness Level"
2. Select current level (1-7)
3. Confirm date/time
4. Submit

### View Data
1. Tap "View All Data"
2. Filter by type (all/overnight/sleepiness)
3. Sort by date (newest/oldest)
4. View statistics

### Cloud Backup
- Use "Backup to Cloud" to save data to AWS
- Works offline with local storage
- Sync across devices

## Technology

- **Frontend**: Ionic Framework + Angular
- **Storage**: Ionic Storage (local) + AWS DynamoDB (cloud)
- **Native**: Capacitor for haptic feedback
- **Platform**: iOS and Android

## Key Features

### Haptic Feedback
- Different vibrations for success/error
- Physical confirmation without looking at screen
- Uses Capacitor Haptics API

### Data Backup
- **Primary**: Local storage (offline first)
- **Secondary**: AWS DynamoDB (cloud backup)
- **Sync**: Manual backup with restore capability

### Mobile Design
- Large touch targets for easy interaction
- Color-coded sleepiness levels (green/yellow/red)
- Dark/light theme adaptation
- Responsive for all screen sizes

## Project Structure

```
sleeptracker/
├── src/app/
│   ├── home/           # Main dashboard
│   ├── log-sleep/      # Sleep logging
│   ├── log-sleepiness/ # Sleepiness tracking  
│   ├── view-data/      # Data visualization
│   └── services/       # Data management
└── assets/             # Images and icons
```

## AWS Integration

- **DynamoDB**: Cloud database storage
- **Dual Storage**: Local + cloud
- **Offline First**: Works without internet
- **Error Handling**: Graceful fallback

---

**Course**: INF133 @ UC Irvine
**Author**: Andy Le  
**GitHub**: andixle  
**Repository**: https://github.com/andixle/Sleeping-Tracker

# OverStats - Overwatch 2 Stats Tracker

![OverStats Logo](./public/img/bw.png)

## Overview

OverStats is a modern web application designed to track and display Overwatch 2 player statistics and game information. Built with React and Tailwind CSS, it offers a sleek, responsive interface with a glassmorphism design that enhances the visual experience while providing valuable insights about players, heroes, and maps.

## Features

### Player Statistics

- **Player Search**: Easily search for any Overwatch 2 player using their BattleTag
- **Comprehensive Stats**: View detailed statistics including:
  - General performance metrics (eliminations, deaths, healing, damage)
  - Win rates and KDA ratios
  - Role-specific performance data
  - Time played information
- **Hero Performance**: Analyze player performance with specific heroes
- **Historical Rankings**: See a player's best competitive ranks across different roles and seasons

### Heroes Information

- **Hero Browser**: View all Overwatch 2 heroes categorized by role (Tank, Damage, Support)
- **Hero Details**: Access comprehensive information about each hero:
  - Abilities and playstyle
  - Hero-specific statistics
  - Role information

### Maps Information

- **Maps Overview**: Browse through all maps available in Overwatch 2
- **Interactive UI**: Click on any map to view detailed information
- **Map Details**: Each map displays:
  - Location and country information
  - Game modes supported
  - Visual preview of the map
- **Filtering**: Filter maps by name, location, or game mode

### User Experience Features

- **Modern UI**: Sleek interface with glassmorphism effects and subtle animations
- **Responsive Design**: Fully optimized for all device sizes from mobile to desktop
- **Real-time Data**: Integration with Overfast API for up-to-date Overwatch 2 statistics
- **Error Handling**: Comprehensive error messages and loading states

## Technical Implementation

- **React**: Built using React for efficient component-based architecture
- **Tailwind CSS**: Styled using Tailwind for modern, responsive design
- **React Router**: Seamless navigation between different sections of the application
- **API Integration**: Connects to the Overfast API to fetch real-time Overwatch 2 data
- **Animations**: Smooth transitions and animations for an enhanced user experience

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Noootzzz/overstats
   ```

2. Navigate to the project directory:

   ```bash
   cd overstats
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Deployment

The application is deployed on Vercel and can be accessed at [overstats.vercel.app](https://overstats.vercel.app).

## Credits

- Data provided by [Overfast API](https://overfast-api.tekrop.fr/)
- Overwatch is a trademark of Blizzard Entertainment, Inc.


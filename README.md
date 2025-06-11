// valorant_spike_timer/README.md

# 🕒 Valorant Spike Timer Overlay

A lightweight in-game overlay for **Valorant** that automatically starts a **45-second countdown** whenever the **spike is planted**. This tool is built using **React** and the **Overwolf SDK**, which safely hooks into Valorant’s in-game events without violating Riot's policies.

## 🚀 Features

- ⏱️ **Automatic spike timer** triggered by the `bomb_planted` game event
- 🎮 **In-game transparent overlay** for minimal distraction
- ⚛️ **Built with React** for a fast and dynamic UI
- 🔐 **Riot-safe** using Overwolf's approved SDK
- 🔧 Easy to extend with custom themes, sound alerts, and settings

## 🛠️ Tech Stack

- **Overwolf SDK** – Access real-time Valorant events safely
- **React** – Component-based UI
- **HTML/CSS/JS** – Overlay layout and styling

## 📁 Project Structure

```plaintext
valorant_spike_timer/
├── public/
│   ├── manifest.json       # Overwolf app config
│   └── index.html          # App entry point
├── src/
│   ├── App.jsx             # React component (Timer)
│   └── index.js            # ReactDOM bootstrap
├── main.js                 # Overwolf event listener (bomb_planted)
├── package.json
└── README.md
```

## ▶️ Usage

1. Clone the repository
2. Build the React app: `npm run build`
3. Package the app for Overwolf using `overwolf-dev-tools`
4. Run the app through Overwolf Developer Console

## 📌 Notes

- You must have **Overwolf Developer Tools** installed.
- The app listens only to the `bomb_planted` event — other events like `defuse_start` can be added as needed.

## 📸 Preview
> _Insert a GIF or screenshot of the overlay in action here._

## 📄 License
MIT License

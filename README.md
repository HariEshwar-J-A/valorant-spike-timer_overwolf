# 🕒 Valorant Spike Timer Overlay

A lightweight in-game overlay for **Valorant** that automatically starts a **45-second countdown** whenever the **spike is planted**. This tool is built using **React**, **Electron**, and the **Overwolf SDK**, which safely hooks into Valorant's in-game events without violating Riot's policies.

## 🚀 Features

- ⏱️ **Automatic spike timer** triggered by the `bomb_planted` game event
- 🎮 **In-game transparent overlay** for minimal distraction
- ⚛️ **Built with React** for a fast and dynamic UI
- ⚡ **Electron integration** with ow-electron for improved event handling
- 🔐 **Riot-safe** using Overwolf's approved SDK
- 🔧 **Customizable settings** with hotkey support
- 🔊 **Optional sound alerts** at 10 seconds remaining
- 📱 **Draggable overlay** with position memory
- ⚙️ **Settings panel** accessible via Ctrl+Shift+S

## 🛠️ Tech Stack

- **Overwolf SDK** – Access real-time Valorant events safely
- **Electron JS** - Improved event handling and window management
- **React** – Component-based UI with Vite
- **ow-electron** – Bridge between Overwolf and Electron
- **HTML/CSS/JS** – Overlay layout and styling

## 📁 Project Structure

```plaintext
valorant_spike_timer/
├── public/
│   ├── manifest.json       # Overwolf app configuration
│   ├── main.js             # Electron main process
│   └── settings.html       # Settings window HTML
├── src/
│   ├── components/
│   │   └── Settings.jsx    # Settings component
│   ├── App.jsx             # Main timer overlay component
│   ├── main.jsx            # React entry point
│   └── index.css           # Overlay styles
├── scripts/
│   └── package-overwolf.js # Overwolf packaging script
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md
```

## 🚀 Development Setup (Bolt.new Environment)

### Prerequisites
- Node.js 18+ installed
- Overwolf client installed (for production testing)

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

This will:
- Start the React development server on `http://localhost:5173`
- Launch Electron with hot reload
- Show demo controls for testing without Valorant

3. **Development features:**
- **Demo mode**: Test timer functionality without Valorant running
- **Hot reload**: Changes reflect immediately
- **DevTools**: Electron DevTools available for debugging

### Development Workflow

1. **React Development:**
   - Edit components in `src/`
   - Changes auto-reload in Electron window
   - Use demo controls to test timer functionality

2. **Electron Main Process:**
   - Edit `public/main.js` for window management and IPC
   - Restart dev server to see changes

3. **Overwolf Integration:**
   - Edit `public/manifest.json` for game events and permissions
   - Test with actual Overwolf client for production validation

## 🏗️ Build Scripts

### Development
```bash
npm run dev              # Start development with hot reload
npm run react:dev        # Start only React dev server
npm run electron:dev     # Start only Electron (requires React server)
```

### Production Build
```bash
npm run build           # Build React app and package Electron
npm run react:build     # Build only React app
npm run electron:pack   # Package Electron app
```

### Overwolf Packaging
```bash
npm run overwolf:package  # Prepare Overwolf package in dist/
```

## 📦 Production Deployment

### 1. Build the Application
```bash
npm run build
```

### 2. Package for Overwolf
```bash
npm run overwolf:package
```

This creates a complete Overwolf package in the `dist/` directory with:
- Built React application
- Electron main process
- Overwolf manifest
- All required assets

### 3. Overwolf Submission Process

1. **Zip the dist/ directory**
2. **Upload to Overwolf Developer Console**
   - Go to [Overwolf Developer Console](https://console.overwolf.com/)
   - Create new app or update existing
   - Upload the zip file

3. **Configure CMP (Consent Management Platform)**
   - Set up user consent for data collection
   - Configure privacy settings
   - Add required legal notices

4. **Testing Phase**
   - Test with Overwolf client
   - Verify game event detection
   - Test overlay positioning and functionality

5. **App Store Submission**
   - Submit for Overwolf review
   - Wait for approval (typically 1-2 weeks)
   - Publish to Overwolf App Store

## ⚙️ Settings & Customization

### Hotkeys
- **Ctrl+Shift+S**: Toggle settings panel
- **Ctrl+Shift+O**: Toggle overlay visibility

### Customizable Options
- **Timer Duration**: Adjust countdown length (default: 45s)
- **Sound Alerts**: Enable/disable warning sound at 10s
- **Overlay Position**: Set custom X/Y coordinates
- **Overlay Size**: Adjust width and height

### Settings Persistence
Settings are automatically saved and restored between sessions.

## 🎮 Game Event Integration

### Supported Events
- `bomb_planted` - Starts the countdown timer
- `bomb_defused` - Stops the timer early
- `round_end` - Automatically stops timer
- `round_start` - Resets timer state

### Event Safety
- Uses only Overwolf-approved game events
- No memory reading or game file modification
- Complies with Riot Games' third-party tool policy

## 🔒 Riot Games Compliance

This application is **fully compliant** with Riot Games' policies:

- ✅ **Uses only approved Overwolf SDK**
- ✅ **No game memory reading**
- ✅ **No game file modification**
- ✅ **No unfair competitive advantage**
- ✅ **Transparent overlay only**
- ✅ **Public source code**

### Legal Notice
This tool provides timing information that is already visible in-game. It does not provide any competitive advantage beyond what skilled players can achieve through game awareness and timing practice.

## 🐛 Troubleshooting

### Common Issues

1. **Timer not starting automatically:**
   - Ensure Valorant is running
   - Check Overwolf is installed and running
   - Verify app permissions in Overwolf

2. **Overlay not visible:**
   - Check overlay position settings
   - Ensure Valorant is in focus
   - Try toggling overlay with Ctrl+Shift+O

3. **Settings not saving:**
   - Check file permissions
   - Restart the application
   - Reset to defaults in settings panel

### Debug Mode
Run with debug logging:
```bash
npm run electron:dev
```

Check console for event detection and error messages.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with Valorant
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Riot Games** for Valorant
- **Overwolf** for the game integration SDK
- **Electron** and **React** communities
- **Valorant community** for feedback and testing

---

**Disclaimer**: This is an unofficial tool not affiliated with Riot Games. Use at your own discretion and in accordance with Riot's Terms of Service.
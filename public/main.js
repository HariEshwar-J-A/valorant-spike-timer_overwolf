const { app, BrowserWindow, ipcMain, globalShortcut, screen } = require('electron');
const path = require('path');
const isDev = process.argv.includes('--dev');

let overlayWindow = null;
let settingsWindow = null;
let isOverwolfAvailable = false;

// Settings with defaults
let settings = {
  timerDuration: 45,
  soundEnabled: true,
  overlayPosition: { x: 100, y: 100 },
  overlaySize: { width: 400, height: 200 }
};

// Check if Overwolf is available
try {
  if (typeof overwolf !== 'undefined') {
    isOverwolfAvailable = true;
    console.log('Overwolf detected');
  }
} catch (error) {
  console.log('Running in standalone mode');
}

function createOverlayWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  overlayWindow = new BrowserWindow({
    width: settings.overlaySize.width,
    height: settings.overlaySize.height,
    x: settings.overlayPosition.x,
    y: settings.overlayPosition.y,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: true,
    minimizable: false,
    maximizable: false,
    closable: false,
    focusable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  const startUrl = isDev 
    ? 'http://localhost:5173' 
    : `file://${path.join(__dirname, '../dist/index.html')}`;
  
  overlayWindow.loadURL(startUrl);
  
  if (isDev) {
    overlayWindow.webContents.openDevTools({ mode: 'detach' });
  }

  overlayWindow.on('closed', () => {
    overlayWindow = null;
  });

  // Handle window movement to save position
  overlayWindow.on('moved', () => {
    if (overlayWindow) {
      const position = overlayWindow.getPosition();
      settings.overlayPosition = { x: position[0], y: position[1] };
    }
  });
}

function createSettingsWindow() {
  settingsWindow = new BrowserWindow({
    width: 600,
    height: 400,
    frame: true,
    transparent: false,
    alwaysOnTop: false,
    skipTaskbar: false,
    resizable: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  const settingsUrl = isDev 
    ? 'http://localhost:5173/settings.html' 
    : `file://${path.join(__dirname, '../dist/settings.html')}`;
  
  settingsWindow.loadURL(settingsUrl);

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

function initializeOverwolf() {
  if (!isOverwolfAvailable) {
    console.log('Overwolf not available, running in demo mode');
    return;
  }

  // Initialize Overwolf game events
  overwolf.extensions.current.getManifest((result) => {
    console.log('Manifest:', result);
  });

  // Set required features for Valorant
  overwolf.games.events.setRequiredFeatures(['bomb_planted', 'bomb_defused', 'round_start', 'round_end'], (info) => {
    if (info.status === 'error') {
      console.error('Failed to set required features:', info.reason);
    } else {
      console.log('Required features set successfully');
    }
  });

  // Listen for game events
  overwolf.games.events.onNewEvents.addListener((info) => {
    console.log('Game event received:', info);
    
    if (info && info.events) {
      info.events.forEach(event => {
        if (event.name === 'bomb_planted') {
          console.log('Spike planted! Starting timer...');
          startSpikeTimer();
        } else if (event.name === 'bomb_defused') {
          console.log('Spike defused! Stopping timer...');
          stopSpikeTimer();
        } else if (event.name === 'round_end') {
          console.log('Round ended! Stopping timer...');
          stopSpikeTimer();
        }
      });
    }
  });

  // Listen for game info updates
  overwolf.games.onGameInfoUpdated.addListener((info) => {
    console.log('Game info updated:', info);
    
    if (info && info.gameInfo) {
      if (info.gameInfo.isRunning) {
        console.log('Valorant is running');
        if (overlayWindow) {
          overlayWindow.show();
        }
      } else {
        console.log('Valorant is not running');
        if (overlayWindow) {
          overlayWindow.hide();
        }
      }
    }
  });

  // Get current game info
  overwolf.games.getRunningGameInfo((info) => {
    console.log('Current game info:', info);
    if (info && info.isRunning && info.id === 21640) {
      console.log('Valorant is currently running');
      if (overlayWindow) {
        overlayWindow.show();
      }
    }
  });
}

function startSpikeTimer() {
  if (overlayWindow) {
    overlayWindow.show();
    overlayWindow.webContents.send('start-timer', settings.timerDuration);
  }
}

function stopSpikeTimer() {
  if (overlayWindow) {
    overlayWindow.webContents.send('stop-timer');
  }
}

function toggleOverlay() {
  if (overlayWindow) {
    if (overlayWindow.isVisible()) {
      overlayWindow.hide();
    } else {
      overlayWindow.show();
    }
  }
}

function toggleSettings() {
  if (settingsWindow) {
    if (settingsWindow.isVisible()) {
      settingsWindow.hide();
    } else {
      settingsWindow.show();
      settingsWindow.webContents.send('load-settings', settings);
    }
  } else {
    createSettingsWindow();
    settingsWindow.once('ready-to-show', () => {
      settingsWindow.show();
      settingsWindow.webContents.send('load-settings', settings);
    });
  }
}

app.whenReady().then(() => {
  createOverlayWindow();
  
  // Register global shortcuts
  globalShortcut.register('CommandOrControl+Shift+S', toggleSettings);
  globalShortcut.register('CommandOrControl+Shift+O', toggleOverlay);
  
  // Demo mode - simulate spike plant after 5 seconds for testing
  if (!isOverwolfAvailable) {
    setTimeout(() => {
      console.log('Demo: Simulating spike plant...');
      startSpikeTimer();
    }, 5000);
  } else {
    initializeOverwolf();
  }

  overlayWindow.once('ready-to-show', () => {
    if (isDev) {
      overlayWindow.show(); // Show in dev mode for testing
    }
  });
});

// IPC handlers
ipcMain.handle('get-settings', () => {
  return settings;
});

ipcMain.handle('save-settings', (event, newSettings) => {
  settings = { ...settings, ...newSettings };
  console.log('Settings saved:', settings);
  return settings;
});

ipcMain.handle('simulate-spike-plant', () => {
  console.log('Simulating spike plant from renderer...');
  startSpikeTimer();
});

ipcMain.handle('hide-overlay', () => {
  if (overlayWindow) {
    overlayWindow.hide();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createOverlayWindow();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
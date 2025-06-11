class OverwolfService {
  constructor() {
    this.isOverwolfAvailable = typeof overwolf !== 'undefined';
    this.gameEventListeners = [];
    this.settings = {
      timerDuration: 45,
      soundEnabled: true,
      overlayPosition: { x: 100, y: 100 },
      overlaySize: { width: 400, height: 200 }
    };
  }

  async initialize() {
    if (!this.isOverwolfAvailable) {
      console.log('Overwolf not available, running in demo mode');
      return false;
    }

    try {
      // Get current extension manifest
      await this.getManifest();
      
      // Set required features for Valorant
      await this.setRequiredFeatures();
      
      // Setup event listeners
      this.setupGameEventListeners();
      this.setupGameInfoListeners();
      this.setupHotkeyListeners();
      
      // Get current game info
      await this.getCurrentGameInfo();
      
      console.log('Overwolf service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Overwolf service:', error);
      return false;
    }
  }

  getManifest() {
    return new Promise((resolve, reject) => {
      overwolf.extensions.current.getManifest((result) => {
        if (result.success) {
          console.log('Manifest loaded:', result.manifest);
          resolve(result.manifest);
        } else {
          reject(new Error('Failed to get manifest'));
        }
      });
    });
  }

  setRequiredFeatures() {
    return new Promise((resolve, reject) => {
      const requiredFeatures = ['bomb_planted', 'bomb_defused', 'round_start', 'round_end'];
      
      overwolf.games.events.setRequiredFeatures(requiredFeatures, (info) => {
        if (info.status === 'success') {
          console.log('Required features set successfully:', requiredFeatures);
          resolve(info);
        } else {
          console.error('Failed to set required features:', info.reason);
          reject(new Error(info.reason));
        }
      });
    });
  }

  setupGameEventListeners() {
    overwolf.games.events.onNewEvents.addListener((info) => {
      console.log('Game event received:', info);
      
      if (info && info.events) {
        info.events.forEach(event => {
          this.handleGameEvent(event);
        });
      }
    });

    overwolf.games.events.onInfoUpdates2.addListener((info) => {
      console.log('Game info update received:', info);
      
      if (info && info.info) {
        Object.keys(info.info).forEach(key => {
          this.handleGameInfoUpdate(key, info.info[key]);
        });
      }
    });
  }

  setupGameInfoListeners() {
    overwolf.games.onGameInfoUpdated.addListener((info) => {
      console.log('Game info updated:', info);
      
      if (info && info.gameInfo) {
        if (info.gameInfo.isRunning) {
          console.log('Valorant is running');
          this.onGameStarted();
        } else {
          console.log('Valorant is not running');
          this.onGameStopped();
        }
      }
    });
  }

  setupHotkeyListeners() {
    overwolf.settings.hotkeys.onPressed.addListener((info) => {
      console.log('Hotkey pressed:', info);
      
      switch (info.name) {
        case 'toggle_settings':
          this.toggleSettings();
          break;
        case 'toggle_overlay':
          this.toggleOverlay();
          break;
      }
    });
  }

  getCurrentGameInfo() {
    return new Promise((resolve) => {
      overwolf.games.getRunningGameInfo((info) => {
        console.log('Current game info:', info);
        
        if (info && info.isRunning && info.id === 21640) {
          console.log('Valorant is currently running');
          this.onGameStarted();
        }
        
        resolve(info);
      });
    });
  }

  handleGameEvent(event) {
    switch (event.name) {
      case 'bomb_planted':
        console.log('Spike planted! Starting timer...');
        this.onSpikeePlanted();
        break;
      case 'bomb_defused':
        console.log('Spike defused! Stopping timer...');
        this.onSpikeDefused();
        break;
      case 'round_end':
        console.log('Round ended! Stopping timer...');
        this.onRoundEnd();
        break;
      case 'round_start':
        console.log('Round started! Resetting timer...');
        this.onRoundStart();
        break;
    }
  }

  handleGameInfoUpdate(key, value) {
    // Handle specific game info updates
    console.log(`Game info update - ${key}:`, value);
  }

  // Event handlers
  onGameStarted() {
    this.notifyListeners('game-started');
  }

  onGameStopped() {
    this.notifyListeners('game-stopped');
  }

  onSpikeePlanted() {
    this.notifyListeners('spike-planted', { duration: this.settings.timerDuration });
  }

  onSpikeDefused() {
    this.notifyListeners('spike-defused');
  }

  onRoundEnd() {
    this.notifyListeners('round-end');
  }

  onRoundStart() {
    this.notifyListeners('round-start');
  }

  // Window management
  async openWindow(windowName) {
    return new Promise((resolve, reject) => {
      overwolf.windows.obtainDeclaredWindow(windowName, (result) => {
        if (result.success) {
          overwolf.windows.restore(result.window.id, (restoreResult) => {
            if (restoreResult.success) {
              resolve(result.window);
            } else {
              reject(new Error('Failed to restore window'));
            }
          });
        } else {
          reject(new Error('Failed to obtain window'));
        }
      });
    });
  }

  async closeWindow(windowName) {
    return new Promise((resolve, reject) => {
      overwolf.windows.obtainDeclaredWindow(windowName, (result) => {
        if (result.success) {
          overwolf.windows.close(result.window.id, (closeResult) => {
            if (closeResult.success) {
              resolve();
            } else {
              reject(new Error('Failed to close window'));
            }
          });
        } else {
          reject(new Error('Failed to obtain window'));
        }
      });
    });
  }

  async toggleSettings() {
    try {
      await this.openWindow('settings');
    } catch (error) {
      console.error('Failed to toggle settings:', error);
    }
  }

  async toggleOverlay() {
    try {
      const result = await this.getCurrentWindow();
      if (result.window.isVisible) {
        await this.hideCurrentWindow();
      } else {
        await this.showCurrentWindow();
      }
    } catch (error) {
      console.error('Failed to toggle overlay:', error);
    }
  }

  getCurrentWindow() {
    return new Promise((resolve, reject) => {
      overwolf.windows.getCurrentWindow((result) => {
        if (result.success) {
          resolve(result);
        } else {
          reject(new Error('Failed to get current window'));
        }
      });
    });
  }

  showCurrentWindow() {
    return new Promise((resolve, reject) => {
      overwolf.windows.getCurrentWindow((result) => {
        if (result.success) {
          overwolf.windows.restore(result.window.id, (restoreResult) => {
            if (restoreResult.success) {
              resolve();
            } else {
              reject(new Error('Failed to show window'));
            }
          });
        } else {
          reject(new Error('Failed to get current window'));
        }
      });
    });
  }

  hideCurrentWindow() {
    return new Promise((resolve, reject) => {
      overwolf.windows.getCurrentWindow((result) => {
        if (result.success) {
          overwolf.windows.hide(result.window.id, (hideResult) => {
            if (hideResult.success) {
              resolve();
            } else {
              reject(new Error('Failed to hide window'));
            }
          });
        } else {
          reject(new Error('Failed to get current window'));
        }
      });
    });
  }

  // Settings management
  getSettings() {
    return { ...this.settings };
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    console.log('Settings saved:', this.settings);
    return this.settings;
  }

  // Event listener management
  addEventListener(event, callback) {
    if (!this.gameEventListeners[event]) {
      this.gameEventListeners[event] = [];
    }
    this.gameEventListeners[event].push(callback);
  }

  removeEventListener(event, callback) {
    if (this.gameEventListeners[event]) {
      const index = this.gameEventListeners[event].indexOf(callback);
      if (index > -1) {
        this.gameEventListeners[event].splice(index, 1);
      }
    }
  }

  notifyListeners(event, data = null) {
    if (this.gameEventListeners[event]) {
      this.gameEventListeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  // Demo mode simulation
  simulateSpikePlant() {
    console.log('Simulating spike plant...');
    this.onSpikeePlanted();
  }

  simulateSpikeDdefuse() {
    console.log('Simulating spike defuse...');
    this.onSpikeDefused();
  }
}

// Create singleton instance
const overwolfService = new OverwolfService();

export default overwolfService;
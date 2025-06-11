import React, { useState, useEffect } from 'react';

const { ipcRenderer } = window.require ? window.require('electron') : {};

function Settings() {
  const [settings, setSettings] = useState({
    timerDuration: 45,
    soundEnabled: true,
    overlayPosition: { x: 100, y: 100 },
    overlaySize: { width: 400, height: 200 }
  });

  useEffect(() => {
    if (ipcRenderer) {
      // Listen for settings load event
      ipcRenderer.on('load-settings', (event, loadedSettings) => {
        setSettings(loadedSettings);
      });

      // Load initial settings
      ipcRenderer.invoke('get-settings').then(loadedSettings => {
        setSettings(loadedSettings);
      });

      return () => {
        ipcRenderer.removeAllListeners('load-settings');
      };
    }
  }, []);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    if (ipcRenderer) {
      ipcRenderer.invoke('save-settings', newSettings);
    }
  };

  const handlePositionChange = (axis, value) => {
    const newPosition = { ...settings.overlayPosition, [axis]: parseInt(value) };
    handleSettingChange('overlayPosition', newPosition);
  };

  const handleSizeChange = (dimension, value) => {
    const newSize = { ...settings.overlaySize, [dimension]: parseInt(value) };
    handleSettingChange('overlaySize', newSize);
  };

  return (
    <div className="settings-container">
      <h1>Valorant Spike Timer Settings</h1>
      
      <div className="settings-section">
        <h2>Timer Settings</h2>
        
        <div className="setting-item">
          <label htmlFor="timer-duration">Timer Duration (seconds):</label>
          <input
            id="timer-duration"
            type="number"
            min="1"
            max="120"
            value={settings.timerDuration}
            onChange={(e) => handleSettingChange('timerDuration', parseInt(e.target.value))}
          />
        </div>
        
        <div className="setting-item">
          <label htmlFor="sound-enabled">
            <input
              id="sound-enabled"
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
            />
            Enable warning sound at 10 seconds
          </label>
        </div>
      </div>
      
      <div className="settings-section">
        <h2>Overlay Position</h2>
        
        <div className="setting-item">
          <label htmlFor="pos-x">X Position:</label>
          <input
            id="pos-x"
            type="number"
            value={settings.overlayPosition.x}
            onChange={(e) => handlePositionChange('x', e.target.value)}
          />
        </div>
        
        <div className="setting-item">
          <label htmlFor="pos-y">Y Position:</label>
          <input
            id="pos-y"
            type="number"
            value={settings.overlayPosition.y}
            onChange={(e) => handlePositionChange('y', e.target.value)}
          />
        </div>
      </div>
      
      <div className="settings-section">
        <h2>Overlay Size</h2>
        
        <div className="setting-item">
          <label htmlFor="size-width">Width:</label>
          <input
            id="size-width"
            type="number"
            min="200"
            max="800"
            value={settings.overlaySize.width}
            onChange={(e) => handleSizeChange('width', e.target.value)}
          />
        </div>
        
        <div className="setting-item">
          <label htmlFor="size-height">Height:</label>
          <input
            id="size-height"
            type="number"
            min="100"
            max="400"
            value={settings.overlaySize.height}
            onChange={(e) => handleSizeChange('height', e.target.value)}
          />
        </div>
      </div>
      
      <div className="settings-section">
        <h2>Hotkeys</h2>
        <p>Ctrl+Shift+S - Toggle Settings</p>
        <p>Ctrl+Shift+O - Toggle Overlay</p>
      </div>
      
      <div className="settings-section">
        <h2>About</h2>
        <p>Valorant Spike Timer v1.0.0</p>
        <p>Built with ow-electron and React</p>
        <p>Riot Games compliant overlay using Overwolf SDK</p>
      </div>
    </div>
  );
}

export default Settings;
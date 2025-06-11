import React, { useState, useEffect, useRef } from 'react';

const { ipcRenderer } = window.require ? window.require('electron') : {};

function App() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState({
    timerDuration: 45,
    soundEnabled: true
  });
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Check if we're in Electron environment
    if (ipcRenderer) {
      // Load settings
      ipcRenderer.invoke('get-settings').then(loadedSettings => {
        setSettings(loadedSettings);
      });

      // Listen for timer events from main process
      ipcRenderer.on('start-timer', (event, duration) => {
        console.log('Received start-timer event with duration:', duration);
        startTimer(duration || settings.timerDuration);
      });

      ipcRenderer.on('stop-timer', () => {
        console.log('Received stop-timer event');
        stopTimer();
      });

      return () => {
        ipcRenderer.removeAllListeners('start-timer');
        ipcRenderer.removeAllListeners('stop-timer');
      };
    } else {
      // Demo mode for web browser
      setIsDemoMode(true);
      console.log('Running in demo mode (no Electron)');
    }
  }, [settings.timerDuration]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          
          // Play warning sound at 10 seconds
          if (newTime === 10 && settings.soundEnabled) {
            playWarningSound();
          }
          
          // Auto-hide when timer reaches 0
          if (newTime <= 0) {
            stopTimer();
            hideOverlay();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, settings.soundEnabled]);

  const startTimer = (duration = settings.timerDuration) => {
    console.log('Starting timer with duration:', duration);
    setTimeLeft(duration);
    setIsActive(true);
  };

  const stopTimer = () => {
    console.log('Stopping timer');
    setIsActive(false);
    setTimeLeft(0);
    clearInterval(intervalRef.current);
  };

  const hideOverlay = () => {
    if (ipcRenderer) {
      ipcRenderer.invoke('hide-overlay');
    }
  };

  const simulateSpikePlant = () => {
    if (ipcRenderer) {
      ipcRenderer.invoke('simulate-spike-plant');
    } else {
      // Demo mode
      startTimer(45);
    }
  };

  const playWarningSound = () => {
    try {
      // Create audio context for beep sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Could not play warning sound:', error);
    }
  };

  const formatTime = (seconds) => {
    return seconds.toString().padStart(2, '0');
  };

  const getTimerClass = () => {
    if (timeLeft <= 5) return 'timer-display critical';
    if (timeLeft <= 10) return 'timer-display warning';
    return 'timer-display';
  };

  const isVisible = isActive && timeLeft > 0;

  return (
    <div className="timer-overlay">
      {isVisible && (
        <div className="timer-container fade-in">
          <div className="controls">
            <button className="control-btn" onClick={stopTimer}>×</button>
          </div>
          
          <div className="timer-title">SPIKE PLANTED</div>
          <div className={getTimerClass()}>
            {formatTime(timeLeft)}
          </div>
          <div className="timer-subtitle">seconds remaining</div>
        </div>
      )}
      
      {isDemoMode && (
        <div className="demo-controls">
          <button className="demo-btn" onClick={simulateSpikePlant}>
            Simulate Spike Plant
          </button>
          <button className="demo-btn" onClick={stopTimer}>
            Stop Timer
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
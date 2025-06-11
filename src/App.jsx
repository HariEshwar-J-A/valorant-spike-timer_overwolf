import React, { useState, useEffect, useRef } from 'react';
import overwolfService from './services/overwolfService';

function App() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState({
    timerDuration: 45,
    soundEnabled: true
  });
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const intervalRef = useRef(null);

  useEffect(() => {
    // Initialize Overwolf service
    const initializeApp = async () => {
      const isOverwolfAvailable = await overwolfService.initialize();
      
      if (!isOverwolfAvailable) {
        setIsDemoMode(true);
        console.log('Running in demo mode (no Overwolf)');
      }

      // Load settings
      const loadedSettings = overwolfService.getSettings();
      setSettings(loadedSettings);

      // Setup event listeners
      overwolfService.addEventListener('spike-planted', handleSpikePlanted);
      overwolfService.addEventListener('spike-defused', handleSpikeDefused);
      overwolfService.addEventListener('round-end', handleRoundEnd);
      overwolfService.addEventListener('round-start', handleRoundStart);
    };

    initializeApp();

    // Cleanup event listeners
    return () => {
      overwolfService.removeEventListener('spike-planted', handleSpikePlanted);
      overwolfService.removeEventListener('spike-defused', handleSpikeDefused);
      overwolfService.removeEventListener('round-end', handleRoundEnd);
      overwolfService.removeEventListener('round-start', handleRoundStart);
    };
  }, []);

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

  const handleSpikePlanted = (data) => {
    console.log('Spike planted event received:', data);
    startTimer(data?.duration || settings.timerDuration);
  };

  const handleSpikeDefused = () => {
    console.log('Spike defused event received');
    stopTimer();
  };

  const handleRoundEnd = () => {
    console.log('Round end event received');
    stopTimer();
  };

  const handleRoundStart = () => {
    console.log('Round start event received');
    stopTimer();
  };

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

  const hideOverlay = async () => {
    try {
      await overwolfService.hideCurrentWindow();
    } catch (error) {
      console.error('Failed to hide overlay:', error);
    }
  };

  const simulateSpikePlant = () => {
    if (isDemoMode) {
      startTimer(45);
    } else {
      overwolfService.simulateSpikePlant();
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
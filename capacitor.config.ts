import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.quantumrunner',
  appName: 'Quantum Consciousness Runner',
  webDir: 'dist',
  plugins: {
    Geolocation: {
      backgroundLocation: true
    },
    StepCounter: {
      // Configuration for the step counter plugin
    }
  }
};

export default config;
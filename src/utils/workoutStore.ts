import { writable, derived } from 'svelte/store';

// Extend the Window interface to include GeolocationPosition
declare global {
  interface Window {
    GeolocationPosition: GeolocationPosition;
  }
}

// Workout state types
export type WorkoutState = 'idle' | 'running' | 'paused';

// Extend the Geolocation interface
interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

// Workout data interface
export interface WorkoutData {
  startTime: number | null;
  elapsedTime: number;
  totalDistance: number;
  currentSpeed: number;
  averageSpeed: number;
  maxSpeed: number;
  isWorkoutActive: boolean;
  workoutState: WorkoutState;
  // Geolocation data
  currentPosition: GeolocationPosition | null;
  locationError: string | null;
  isLocating: boolean;
  watchId: number | null;
}

// Initial workout data
const initialWorkoutData: WorkoutData = {
  startTime: null,
  elapsedTime: 0,
  totalDistance: 0,
  currentSpeed: 0,
  averageSpeed: 0,
  maxSpeed: 0,
  isWorkoutActive: false,
  workoutState: 'idle',
  // Geolocation data
  currentPosition: null,
  locationError: null,
  isLocating: false,
  watchId: null
};

// Create the workout store
export const workoutStore = writable<WorkoutData>(initialWorkoutData);

// Helper functions to update the store
export const startWorkout = () => {
  workoutStore.update(data => ({
    ...data,
    startTime: Date.now(),
    isWorkoutActive: true,
    workoutState: 'running',
    totalDistance: 0,
    currentSpeed: 0,
    averageSpeed: 0,
    maxSpeed: 0,
    elapsedTime: 0
  }));
};

export const pauseWorkout = () => {
  workoutStore.update(data => ({
    ...data,
    workoutState: 'paused'
  }));
};

export const resumeWorkout = () => {
  workoutStore.update(data => ({
    ...data,
    workoutState: 'running'
  }));
};

export const stopWorkout = () => {
  workoutStore.set(initialWorkoutData);
};

export const updateWorkoutStats = (stats: Partial<WorkoutData>) => {
  workoutStore.update(data => ({
    ...data,
    ...stats
  }));
};

// Geolocation functions
export const updateCurrentPosition = (position: GeolocationPosition) => {
  workoutStore.update(data => ({
    ...data,
    currentPosition: position,
    isLocating: false,
    locationError: null
  }));
};

export const setLocationError = (error: string) => {
  workoutStore.update(data => ({
    ...data,
    locationError: error,
    isLocating: false
  }));
};

export const setLocating = (isLocating: boolean) => {
  workoutStore.update(data => ({
    ...data,
    isLocating: isLocating
  }));
};

export const setWatchId = (watchId: number | null) => {
  workoutStore.update(data => ({
    ...data,
    watchId: watchId
  }));
};

// Derived store for formatted time
export const formattedTime = derived(
  workoutStore,
  ($workoutStore) => {
    const totalSeconds = Math.floor($workoutStore.elapsedTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
);

// Haversine formula for distance calculation
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth radius in meters
  const phi1 = lat1 * Math.PI/180;
  const phi2 = lat2 * Math.PI/180;
  const deltaPhi = (lat2-lat1) * Math.PI/180;
  const deltaLambda = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

// Speed calculation
export const calculateSpeed = (distance: number, timeDiffMs: number): number => {
  // Convert distance from meters to kilometers
  const distanceKm = distance / 1000;
  // Convert time from milliseconds to hours
  const timeHours = timeDiffMs / (1000 * 60 * 60);
  
  // Avoid division by zero
  if (timeHours <= 0) return 0;
  
  // Return speed in km/h
  return distanceKm / timeHours;
};
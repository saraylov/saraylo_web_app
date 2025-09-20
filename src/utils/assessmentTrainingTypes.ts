/**
 * Data structures for the audio-assisted assessment training system
 */

// Zone definition with parameters as specified in the requirements
export interface TrainingZone {
  id: number;
  name: 'Синяя' | 'Зеленая' | 'Желтая' | 'Оранжевая' | 'Красная';
  color: string;
  targetEffort: number; // Target effort percentage
  targetEffortRange?: { min: number; max: number }; // For zones with range
  duration: number; // Duration in milliseconds
  avgSpeed: number | null; // Average speed calculated for this zone
  speedRange: { min: number; max: number } | null; // Speed range [avg-1, avg+1] km/h
}

// User calibration data to be saved in the profile
export interface UserCalibrationData {
  userId: string; // User identifier
  timestamp: string; // ISO timestamp of calibration
  zones: {
    name: 'Синяя' | 'Зеленая' | 'Желтая' | 'Оранжевая' | 'Красная';
    avgSpeed: number; // Average speed in km/h
    speedRange: { min: number; max: number }; // Speed range [avg-1, avg+1] km/h
  }[];
}

// Speed data point collected during training
export interface SpeedDataPoint {
  speed: number; // Speed in m/s
  timestamp: number; // Timestamp in milliseconds
}

// Zone data buffer for collecting speed data during a zone
export interface ZoneDataBuffer {
  zoneId: number;
  speedData: SpeedDataPoint[];
  isValid: boolean; // Whether the data is valid (enough samples collected)
}

// Assessment training state
export interface AssessmentTrainingState {
  isActive: boolean;
  currentZoneIndex: number;
  startTime: Date | null;
  currentTime: Date | null;
  elapsedTime: number; // Elapsed time in milliseconds
  zoneBuffers: ZoneDataBuffer[]; // Data buffers for each zone
  isPaused: boolean;
  isCompleted: boolean;
}

// Error states for the assessment training
export interface AssessmentError {
  type: 'DATA_LOSS' | 'USER_INTERRUPT' | 'ANOMALY';
  zoneId: number;
  message: string;
  needsRetry: boolean;
}

// Audio instruction types
export type AudioInstruction = 
  | 'ZONE_START' 
  | 'ZONE_END_WARNING' 
  | 'ZONE_COUNTDOWN' 
  | 'ERROR_NOTIFICATION' 
  | 'PAUSE_NOTIFICATION' 
  | 'RESUME_NOTIFICATION';

// Export the zone definitions as specified in the requirements
export const ASSESSMENT_ZONES: TrainingZone[] = [
  {
    id: 1,
    name: 'Синяя',
    color: '#00BFFF',
    targetEffort: 15, // 15%
    duration: 6 * 60 * 1000, // 6 minutes
    avgSpeed: null,
    speedRange: null
  },
  {
    id: 2,
    name: 'Зеленая',
    color: '#18FF00',
    targetEffort: 0, // Range 16-25%
    targetEffortRange: { min: 16, max: 25 },
    duration: 5 * 60 * 1000, // 5 minutes
    avgSpeed: null,
    speedRange: null
  },
  {
    id: 3,
    name: 'Желтая',
    color: '#FFFC00',
    targetEffort: 0, // Range 26-50%
    targetEffortRange: { min: 26, max: 50 },
    duration: 5 * 60 * 1000, // 5 minutes
    avgSpeed: null,
    speedRange: null
  },
  {
    id: 4,
    name: 'Оранжевая',
    color: '#FF8800',
    targetEffort: 0, // Range 51-75%
    targetEffortRange: { min: 51, max: 75 },
    duration: 3 * 60 * 1000, // 3 minutes
    avgSpeed: null,
    speedRange: null
  },
  {
    id: 5,
    name: 'Красная',
    color: '#9B0000',
    targetEffort: 0, // Range 76-100%
    targetEffortRange: { min: 76, max: 100 },
    duration: 1 * 60 * 1000, // 1 minute
    avgSpeed: null,
    speedRange: null
  }
];
/**
 * Zone timing and transition logic for the assessment training system
 */
import type { TrainingZone, ZoneDataBuffer, AssessmentTrainingState, AssessmentError } from './assessmentTrainingTypes';
import { speedDataCollector } from './speedDataCollector';
import { audioInstructions } from './audioInstructions';
// Import the data storage utility
import { saveDailyData } from './dataStorage';

export class ZoneTransitionLogic {
  private zones: TrainingZone[];
  private state: AssessmentTrainingState;
  private onZoneChange: (zoneIndex: number) => void;
  private onTrainingComplete: (calibrationData: any) => void;
  private onError: (error: AssessmentError) => void;
  private zoneTimers: { warningTimer: number | null; transitionTimer: number | null }[] = [];
  private zoneBuffers: ZoneDataBuffer[] = [];

  constructor(
    zones: TrainingZone[],
    onZoneChange: (zoneIndex: number) => void,
    onTrainingComplete: (calibrationData: any) => void,
    onError: (error: AssessmentError) => void
  ) {
    this.zones = zones;
    this.onZoneChange = onZoneChange;
    this.onTrainingComplete = onTrainingComplete;
    this.onError = onError;
    
    // Initialize state
    this.state = {
      isActive: false,
      currentZoneIndex: 0,
      startTime: null,
      currentTime: null,
      elapsedTime: 0,
      zoneBuffers: [],
      isPaused: false,
      isCompleted: false
    };
    
    // Initialize zone buffers
    this.initializeZoneBuffers();
    
    // Initialize timers array
    this.zoneTimers = zones.map(() => ({
      warningTimer: null,
      transitionTimer: null
    }));
  }

  /**
   * Initialize zone data buffers
   */
  private initializeZoneBuffers(): void {
    this.zoneBuffers = this.zones.map(zone => ({
      zoneId: zone.id,
      speedData: [],
      isValid: false
    }));
    
    this.state.zoneBuffers = this.zoneBuffers;
  }

  /**
   * Start the assessment training
   */
  public async startTraining(): Promise<void> {
    if (this.state.isActive) {
      console.warn('Training is already active');
      return;
    }

    this.state.isActive = true;
    this.state.startTime = new Date();
    this.state.currentTime = new Date();
    this.state.elapsedTime = 0;
    this.state.isPaused = false;
    this.state.isCompleted = false;
    this.state.currentZoneIndex = 0;

    // Reset zone buffers
    this.initializeZoneBuffers();

    // Start speed data collection
    await speedDataCollector.startCollecting(
      (dataPoint) => this.handleSpeedData(dataPoint),
      (error) => this.handleDataError(error)
    );

    // Start first zone
    this.startCurrentZone();

    console.log('Assessment training started');
  }

  /**
   * Pause the assessment training
   */
  public pauseTraining(): void {
    if (!this.state.isActive || this.state.isPaused) {
      return;
    }

    this.state.isPaused = true;
    speedDataCollector.stopCollecting();
    audioInstructions.playInstruction('PAUSE_NOTIFICATION', this.zones[this.state.currentZoneIndex]);

    // Clear any pending timers
    this.clearZoneTimers();

    console.log('Assessment training paused');
  }

  /**
   * Resume the assessment training
   */
  public async resumeTraining(): Promise<void> {
    if (!this.state.isActive || !this.state.isPaused) {
      return;
    }

    this.state.isPaused = false;
    
    // Restart speed data collection
    await speedDataCollector.startCollecting(
      (dataPoint) => this.handleSpeedData(dataPoint),
      (error) => this.handleDataError(error)
    );

    audioInstructions.playInstruction('RESUME_NOTIFICATION', this.zones[this.state.currentZoneIndex]);

    // Restart current zone timers
    this.restartCurrentZoneTimers();

    console.log('Assessment training resumed');
  }

  /**
   * Stop the assessment training
   */
  public stopTraining(): void {
    this.state.isActive = false;
    this.state.isPaused = false;
    
    speedDataCollector.stopCollecting();
    this.clearZoneTimers();

    console.log('Assessment training stopped');
  }

  /**
   * Start the current zone
   */
  private startCurrentZone(): void {
    const currentZone = this.zones[this.state.currentZoneIndex];
    
    // Play audio instruction for zone start
    audioInstructions.playInstruction('ZONE_START', currentZone);
    
    // Set up timers for this zone
    this.setupZoneTimers();
    
    // Notify about zone change
    this.onZoneChange(this.state.currentZoneIndex);
    
    console.log(`Started ${currentZone.name} zone`);
  }

  /**
   * Set up timers for the current zone
   */
  private setupZoneTimers(): void {
    const currentZoneIndex = this.state.currentZoneIndex;
    const currentZone = this.zones[currentZoneIndex];
    
    // Clear any existing timers for this zone
    this.clearZoneTimers(currentZoneIndex);
    
    // Set warning timer (30 seconds before end)
    const warningTime = currentZone.duration - 30000; // 30 seconds before end
    if (warningTime > 0) {
      this.zoneTimers[currentZoneIndex].warningTimer = window.setTimeout(() => {
        this.handleZoneEndWarning();
      }, warningTime);
    }
    
    // Set transition timer
    this.zoneTimers[currentZoneIndex].transitionTimer = window.setTimeout(() => {
      this.handleZoneTransition();
    }, currentZone.duration);
  }

  /**
   * Restart timers for the current zone (after resume)
   */
  private restartCurrentZoneTimers(): void {
    // Calculate elapsed time in current zone
    const elapsedInZone = this.calculateElapsedInCurrentZone();
    
    if (elapsedInZone < 0) return;
    
    const currentZoneIndex = this.state.currentZoneIndex;
    const currentZone = this.zones[currentZoneIndex];
    const remainingTime = currentZone.duration - elapsedInZone;
    
    // Clear any existing timers
    this.clearZoneTimers(currentZoneIndex);
    
    // Set warning timer if there's enough time
    const warningTime = remainingTime - 30000; // 30 seconds before end
    if (warningTime > 0) {
      this.zoneTimers[currentZoneIndex].warningTimer = window.setTimeout(() => {
        this.handleZoneEndWarning();
      }, warningTime);
    }
    
    // Set transition timer
    this.zoneTimers[currentZoneIndex].transitionTimer = window.setTimeout(() => {
      this.handleZoneTransition();
    }, remainingTime);
  }

  /**
   * Calculate elapsed time in the current zone
   * @returns Elapsed time in milliseconds
   */
  private calculateElapsedInCurrentZone(): number {
    if (!this.state.startTime) return -1;
    
    // Calculate cumulative time for previous zones
    let cumulativeTime = 0;
    for (let i = 0; i < this.state.currentZoneIndex; i++) {
      cumulativeTime += this.zones[i].duration;
    }
    
    // Calculate elapsed time since start
    const totalTimeElapsed = this.state.elapsedTime;
    
    // Return time elapsed in current zone
    return totalTimeElapsed - cumulativeTime;
  }

  /**
   * Handle zone end warning (30 seconds before zone ends)
   */
  private handleZoneEndWarning(): void {
    const currentZone = this.zones[this.state.currentZoneIndex];
    const nextZone = this.zones[this.state.currentZoneIndex + 1];
    
    if (nextZone) {
      audioInstructions.playInstruction('ZONE_END_WARNING', currentZone, nextZone);
    }
  }

  /**
   * Handle zone transition
   */
  private handleZoneTransition(): void {
    const currentZoneIndex = this.state.currentZoneIndex;
    const currentZone = this.zones[currentZoneIndex];
    
    // Check if we have sufficient data for this zone
    const zoneBuffer = this.zoneBuffers[currentZoneIndex];
    if (!speedDataCollector.hasSufficientData(zoneBuffer, currentZone)) {
      // Not enough valid data - notify user and pause
      this.handleInsufficientDataError(currentZoneIndex);
      return;
    }
    
    // Mark this zone's data as valid
    zoneBuffer.isValid = true;
    
    // Move to next zone or complete training
    if (currentZoneIndex < this.zones.length - 1) {
      this.transitionToNextZone();
    } else {
      this.completeTraining();
    }
  }

  /**
   * Transition to the next zone
   */
  private transitionToNextZone(): void {
    // Play countdown from 5 to 1
    this.playCountdownSequence(() => {
      // Move to next zone
      this.state.currentZoneIndex++;
      
      // Start the new zone
      this.startCurrentZone();
    });
  }

  /**
   * Play countdown sequence
   * @param onComplete Callback when countdown is complete
   */
  private playCountdownSequence(onComplete: () => void): void {
    let count = 5;
    
    const countdown = () => {
      if (count >= 0) {
        audioInstructions.playInstruction('ZONE_COUNTDOWN', undefined, undefined, count);
        count--;
        
        if (count >= -1) {
          setTimeout(countdown, 1000);
        } else {
          onComplete();
        }
      }
    };
    
    countdown();
  }

  /**
   * Complete the training
   */
  private completeTraining(): void {
    this.state.isCompleted = true;
    this.state.isActive = false;
    
    speedDataCollector.stopCollecting();
    this.clearZoneTimers();
    
    // Process and save calibration data
    this.processAndSaveCalibrationData();
    
    console.log('Assessment training completed');
  }

  /**
   * Process and save calibration data
   */
  private processAndSaveCalibrationData(): void {
    try {
      // Calculate average speeds for each valid zone
      const validZones = this.zones.map((zone, index) => {
        const buffer = this.zoneBuffers[index];
        
        if (!buffer.isValid || buffer.speedData.length === 0) {
          return null;
        }
        
        // Calculate average speed for this zone
        const validData = speedDataCollector.filterOutliers(buffer.speedData, zone);
        const avgSpeed = validData.reduce((sum, point) => sum + point.speed, 0) / validData.length;
        
        // Calculate speed range [avg-1, avg+1] km/h
        const speedRange = {
          min: Math.max(0, avgSpeed - 1), // Ensure min is not negative
          max: avgSpeed + 1
        };
        
        return {
          name: zone.name,
          avgSpeed: avgSpeed,
          speedRange: speedRange
        };
      }).filter(zone => zone !== null);
      
      // Create calibration data object
      const calibrationData = {
        userId: 'user123', // This should be replaced with actual user ID
        timestamp: new Date().toISOString(),
        zones: validZones
      };
      
      // Save to user profile (using localStorage for now)
      try {
        localStorage.setItem('userCalibrationData', JSON.stringify(calibrationData));
      } catch (error) {
        console.error('Error saving calibration data:', error);
      }
      
      // Notify completion
      this.onTrainingComplete(calibrationData);
      
      console.log('Calibration data saved:', calibrationData);
    } catch (error) {
      console.error('Error processing calibration data:', error);
      this.onError({
        type: 'DATA_LOSS',
        zoneId: -1,
        message: 'Failed to process calibration data',
        needsRetry: false
      });
    }
  }

  /**
   * Handle speed data from sensor
   * @param dataPoint Speed data point
   */
  private handleSpeedData(dataPoint: { speed: number; timestamp: number }): void {
    if (!this.state.isActive || this.state.isPaused) return;
    
    // Update current time and elapsed time
    this.state.currentTime = new Date();
    if (this.state.startTime) {
      this.state.elapsedTime = this.state.currentTime.getTime() - this.state.startTime.getTime();
    }
    
    // Add data point to current zone buffer
    const currentZoneBuffer = this.zoneBuffers[this.state.currentZoneIndex];
    currentZoneBuffer.speedData.push(dataPoint);
  }

  /**
   * Handle data error from sensor
   * @param error Error message
   */
  private handleDataError(error: string): void {
    console.error('Sensor data error:', error);
    
    this.onError({
      type: 'DATA_LOSS',
      zoneId: this.state.currentZoneIndex,
      message: error,
      needsRetry: true
    });
  }

  /**
   * Handle insufficient data error
   * @param zoneIndex Index of zone with insufficient data
   */
  private handleInsufficientDataError(zoneIndex: number): void {
    const zone = this.zones[zoneIndex];
    
    // Pause training
    this.pauseTraining();
    
    // Notify error
    this.onError({
      type: 'DATA_LOSS',
      zoneId: zoneIndex,
      message: `Insufficient data collected for ${zone.name} zone. Please repeat this zone.`,
      needsRetry: true
    });
    
    // Play error notification
    audioInstructions.playInstruction('ERROR_NOTIFICATION');
  }

  /**
   * Clear timers for a specific zone or all zones
   * @param zoneIndex Index of zone to clear timers for, or null to clear all
   */
  private clearZoneTimers(zoneIndex: number | null = null): void {
    if (zoneIndex !== null) {
      // Clear timers for specific zone
      const timers = this.zoneTimers[zoneIndex];
      if (timers.warningTimer) {
        clearTimeout(timers.warningTimer);
        timers.warningTimer = null;
      }
      if (timers.transitionTimer) {
        clearTimeout(timers.transitionTimer);
        timers.transitionTimer = null;
      }
    } else {
      // Clear timers for all zones
      this.zoneTimers.forEach((timers, index) => {
        if (timers.warningTimer) {
          clearTimeout(timers.warningTimer);
          timers.warningTimer = null;
        }
        if (timers.transitionTimer) {
          clearTimeout(timers.transitionTimer);
          timers.transitionTimer = null;
        }
      });
    }
  }

  /**
   * Get current training state
   * @returns Current training state
   */
  public getState(): AssessmentTrainingState {
    return { ...this.state };
  }

  /**
   * Get zone buffers
   * @returns Array of zone data buffers
   */
  public getZoneBuffers(): ZoneDataBuffer[] {
    return [...this.zoneBuffers];
  }
}

// Export singleton instance
export const zoneTransitionLogic = new ZoneTransitionLogic(
  [], // Zones will be provided when initialized
  () => {}, // onZoneChange handler will be provided when initialized
  () => {}, // onTrainingComplete handler will be provided when initialized
  () => {}  // onError handler will be provided when initialized
);
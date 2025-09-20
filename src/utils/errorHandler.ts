/**
 * Error handling utilities for the assessment training system
 */
import type { AssessmentError } from './assessmentTrainingTypes';
import { audioInstructions } from './audioInstructions';

export class ErrorHandler {
  private errorCounts: Map<string, number> = new Map();
  private maxRetries: number = 3;
  private errorTimeouts: Map<string, number> = new Map();

  /**
   * Handle sensor data loss error
   * @param zoneId ID of the zone where error occurred
   * @param errorMessage Error message
   * @param onRetry Callback to retry the operation
   */
  public handleDataLossError(
    zoneId: number,
    errorMessage: string,
    onRetry: () => void
  ): void {
    const errorKey = `data_loss_zone_${zoneId}`;
    const retryCount = this.errorCounts.get(errorKey) || 0;

    // Increment error count
    this.errorCounts.set(errorKey, retryCount + 1);

    // If we haven't exceeded max retries, notify and allow retry
    if (retryCount < this.maxRetries) {
      // Play audio notification
      audioInstructions.playInstruction('ERROR_NOTIFICATION');
      
      // Notify user through callback
      const error: AssessmentError = {
        type: 'DATA_LOSS',
        zoneId: zoneId,
        message: `Sensor data loss detected: ${errorMessage}. Attempt ${retryCount + 1} of ${this.maxRetries}.`,
        needsRetry: true
      };
      
      // Set timeout to clear error count after 30 seconds of no errors
      if (this.errorTimeouts.has(errorKey)) {
        clearTimeout(this.errorTimeouts.get(errorKey)!);
      }
      
      const timeoutId = window.setTimeout(() => {
        this.errorCounts.delete(errorKey);
        this.errorTimeouts.delete(errorKey);
      }, 30000);
      
      this.errorTimeouts.set(errorKey, timeoutId);
      
      // Call retry callback
      onRetry();
    } else {
      // Max retries exceeded, notify that zone needs to be repeated
      const error: AssessmentError = {
        type: 'DATA_LOSS',
        zoneId: zoneId,
        message: `Sensor data loss detected: ${errorMessage}. Maximum retry attempts exceeded. Please repeat this zone.`,
        needsRetry: false
      };
      
      // Clear error count
      this.errorCounts.delete(errorKey);
      if (this.errorTimeouts.has(errorKey)) {
        clearTimeout(this.errorTimeouts.get(errorKey)!);
        this.errorTimeouts.delete(errorKey);
      }
      
      // Notify through callback
      // The zone transition logic will handle pausing and user notification
    }
  }

  /**
   * Handle user interrupt error
   * @param zoneId ID of the zone where interrupt occurred
   * @param onHandle Callback to handle the interrupt
   */
  public handleUserInterrupt(
    zoneId: number,
    onHandle: () => void
  ): void {
    const error: AssessmentError = {
      type: 'USER_INTERRUPT',
      zoneId: zoneId,
      message: 'Training interrupted by user',
      needsRetry: false
    };
    
    // Play audio notification
    audioInstructions.playInstruction('PAUSE_NOTIFICATION');
    
    // Call handle callback
    onHandle();
  }

  /**
   * Handle anomaly detection
   * @param zoneId ID of the zone where anomaly occurred
   * @param anomalyType Type of anomaly
   * @param details Additional details about the anomaly
   * @param onHandle Callback to handle the anomaly
   */
  public handleAnomaly(
    zoneId: number,
    anomalyType: string,
    details: string,
    onHandle: () => void
  ): void {
    const errorKey = `anomaly_${anomalyType}_zone_${zoneId}`;
    const errorCount = this.errorCounts.get(errorKey) || 0;

    // Increment error count
    this.errorCounts.set(errorKey, errorCount + 1);

    // For anomalies, we'll notify but not necessarily retry
    const error: AssessmentError = {
      type: 'ANOMALY',
      zoneId: zoneId,
      message: `Anomaly detected (${anomalyType}): ${details}`,
      needsRetry: errorCount < this.maxRetries
    };

    // Play audio notification for serious anomalies
    if (anomalyType === 'SPEED_SPIKE' || anomalyType === 'SENSOR_MALFUNCTION') {
      audioInstructions.playInstruction('ERROR_NOTIFICATION');
    }

    // Set timeout to clear error count after 60 seconds of no errors
    if (this.errorTimeouts.has(errorKey)) {
      clearTimeout(this.errorTimeouts.get(errorKey)!);
    }
    
    const timeoutId = window.setTimeout(() => {
      this.errorCounts.delete(errorKey);
      this.errorTimeouts.delete(errorKey);
    }, 60000);
    
    this.errorTimeouts.set(errorKey, timeoutId);

    // Call handle callback
    onHandle();
  }

  /**
   * Reset error counts for a specific zone or all zones
   * @param zoneId Optional zone ID to reset errors for, or null to reset all
   */
  public resetErrors(zoneId?: number): void {
    if (zoneId !== undefined) {
      // Clear errors for specific zone
      for (const key of this.errorCounts.keys()) {
        if (key.endsWith(`_zone_${zoneId}`)) {
          this.errorCounts.delete(key);
          if (this.errorTimeouts.has(key)) {
            clearTimeout(this.errorTimeouts.get(key)!);
            this.errorTimeouts.delete(key);
          }
        }
      }
    } else {
      // Clear all errors
      this.errorCounts.clear();
      for (const timeoutId of this.errorTimeouts.values()) {
        clearTimeout(timeoutId);
      }
      this.errorTimeouts.clear();
    }
  }

  /**
   * Get current error count for a specific error type and zone
   * @param errorType Type of error
   * @param zoneId Zone ID
   * @returns Current error count
   */
  public getErrorCount(errorType: string, zoneId: number): number {
    const errorKey = `${errorType}_zone_${zoneId}`;
    return this.errorCounts.get(errorKey) || 0;
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();
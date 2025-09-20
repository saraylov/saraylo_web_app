/**
 * Calibration data processing and calculation utilities
 */
import type { TrainingZone, SpeedDataPoint, UserCalibrationData } from './assessmentTrainingTypes';
import { speedDataCollector } from './speedDataCollector';

export class CalibrationCalculator {
  /**
   * Calculate average speed from speed data points
   * @param speedData Array of speed data points
   * @returns Average speed in km/h
   */
  public calculateAverageSpeed(speedData: SpeedDataPoint[]): number {
    if (speedData.length === 0) {
      return 0;
    }

    // Filter outliers first
    // Note: We need a zone to filter outliers, but for average calculation we can use a generic approach
    const filteredData = this.filterOutliersGeneric(speedData);
    
    // Calculate average
    const sum = filteredData.reduce((acc, point) => acc + point.speed, 0);
    return sum / filteredData.length;
  }

  /**
   * Generic outlier filtering without zone-specific parameters
   * @param speedData Array of speed data points
   * @returns Filtered array of speed data points
   */
  private filterOutliersGeneric(speedData: SpeedDataPoint[]): SpeedDataPoint[] {
    if (speedData.length === 0) return speedData;

    // For generic filtering, we'll use reasonable running speeds
    const reasonableMinSpeed = 0.5; // 1.8 km/h - very slow walk
    const reasonableMaxSpeed = 15; // 54 km/h - very fast run/sprint

    // Filter out physically impossible speeds
    return speedData.filter(point => {
      return point.speed >= reasonableMinSpeed && point.speed <= reasonableMaxSpeed;
    });
  }

  /**
   * Calculate speed range for a zone based on average speed
   * @param avgSpeed Average speed in km/h
   * @returns Speed range [avg-1, avg+1] km/h
   */
  public calculateSpeedRange(avgSpeed: number): { min: number; max: number } {
    return {
      min: Math.max(0, avgSpeed - 1), // Ensure min is not negative
      max: avgSpeed + 1
    };
  }

  /**
   * Process zone data to calculate calibration values
   * @param zone The training zone
   * @param speedData Speed data collected for this zone
   * @returns Object with avgSpeed and speedRange, or null if insufficient data
   */
  public processZoneData(zone: TrainingZone, speedData: SpeedDataPoint[]): {
    avgSpeed: number;
    speedRange: { min: number; max: number };
  } | null {
    if (speedData.length === 0) {
      return null;
    }

    // Filter outliers using the speed data collector's method
    const filteredData = speedDataCollector.filterOutliers(speedData, zone);
    
    if (filteredData.length === 0) {
      return null;
    }

    // Calculate average speed
    const avgSpeed = filteredData.reduce((sum, point) => sum + point.speed, 0) / filteredData.length;
    
    // Calculate speed range [avg-1, avg+1] km/h
    const speedRange = this.calculateSpeedRange(avgSpeed);
    
    return {
      avgSpeed,
      speedRange
    };
  }

  /**
   * Create user calibration data object from processed zones
   * @param userId User identifier
   * @param processedZones Array of processed zones with calibration data
   * @returns UserCalibrationData object
   */
  public createUserCalibrationData(
    userId: string,
    processedZones: {
      name: 'Синяя' | 'Зеленая' | 'Желтая' | 'Оранжевая' | 'Красная';
      avgSpeed: number;
      speedRange: { min: number; max: number };
    }[]
  ): UserCalibrationData {
    return {
      userId,
      timestamp: new Date().toISOString(),
      zones: processedZones
    };
  }

  /**
   * Validate calibration data
   * @param calibrationData User calibration data to validate
   * @returns True if valid, false otherwise
   */
  public validateCalibrationData(calibrationData: UserCalibrationData): boolean {
    // Check if we have data for all 5 zones
    if (calibrationData.zones.length !== 5) {
      console.warn('Calibration data does not contain data for all 5 zones');
      return false;
    }

    // Check if each zone has valid data
    for (const zone of calibrationData.zones) {
      // Check if avgSpeed is a positive number
      if (zone.avgSpeed <= 0) {
        console.warn(`Invalid average speed for ${zone.name} zone: ${zone.avgSpeed}`);
        return false;
      }

      // Check if speed range is valid
      if (zone.speedRange.min < 0 || zone.speedRange.max <= zone.speedRange.min) {
        console.warn(`Invalid speed range for ${zone.name} zone: ${JSON.stringify(zone.speedRange)}`);
        return false;
      }

      // Check if speed range matches [avg-1, avg+1] formula
      const expectedMin = Math.max(0, zone.avgSpeed - 1);
      const expectedMax = zone.avgSpeed + 1;
      
      if (Math.abs(zone.speedRange.min - expectedMin) > 0.01 || 
          Math.abs(zone.speedRange.max - expectedMax) > 0.01) {
        console.warn(`Speed range for ${zone.name} zone does not match expected [avg-1, avg+1] formula`);
        return false;
      }
    }

    return true;
  }

  /**
   * Get zone speed recommendation based on calibration data
   * @param calibrationData User's calibration data
   * @param zoneName Name of the zone to get recommendation for
   * @returns Speed range for the zone, or null if not found
   */
  public getZoneSpeedRecommendation(
    calibrationData: UserCalibrationData,
    zoneName: 'Синяя' | 'Зеленая' | 'Желтая' | 'Оранжевая' | 'Красная'
  ): { min: number; max: number } | null {
    const zone = calibrationData.zones.find(z => z.name === zoneName);
    return zone ? zone.speedRange : null;
  }

  /**
   * Calculate percentile values from speed data (for future use)
   * @param speedData Array of speed data points
   * @param percentile Percentile to calculate (0-100)
   * @returns Percentile value
   */
  public calculatePercentile(speedData: SpeedDataPoint[], percentile: number): number {
    if (speedData.length === 0) {
      return 0;
    }

    // Sort speeds
    const sortedSpeeds = speedData.map(point => point.speed).sort((a, b) => a - b);
    
    // Calculate percentile index
    const index = (percentile / 100) * (sortedSpeeds.length - 1);
    
    // If index is integer, return that value
    if (Number.isInteger(index)) {
      return sortedSpeeds[index];
    }
    
    // Otherwise interpolate between values
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);
    const weight = index - lowerIndex;
    
    return sortedSpeeds[lowerIndex] * (1 - weight) + sortedSpeeds[upperIndex] * weight;
  }
}

// Export singleton instance
export const calibrationCalculator = new CalibrationCalculator();
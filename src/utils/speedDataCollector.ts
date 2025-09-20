/**
 * Speed data collection service for the assessment training system
 */
import { Geolocation } from '@capacitor/geolocation';
import type { SpeedDataPoint, TrainingZone, ZoneDataBuffer } from './assessmentTrainingTypes';

export class SpeedDataCollector {
  private previousPosition: { lat: number; lng: number; timestamp: number } | null = null;
  private isCollecting: boolean = false;
  private collectionInterval: number | null = null;
  private onDataReceived: ((dataPoint: SpeedDataPoint) => void) | null = null;
  private onError: ((error: string) => void) | null = null;
  private sampleRate: number = 1000; // Default to 1 second (1 Hz)

  constructor() {
    // Initialize with default values
  }

  /**
   * Start collecting speed data
   * @param onDataReceived Callback function to receive speed data points
   * @param onError Callback function to handle errors
   * @param sampleRate Frequency of data collection in milliseconds (default: 1000ms = 1Hz)
   */
  public async startCollecting(
    onDataReceived: (dataPoint: SpeedDataPoint) => void,
    onError: (error: string) => void,
    sampleRate: number = 1000
  ): Promise<void> {
    this.onDataReceived = onDataReceived;
    this.onError = onError;
    this.sampleRate = sampleRate;
    this.isCollecting = true;

    // Clear any existing interval
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
    }

    // Start collecting data at the specified interval
    this.collectionInterval = window.setInterval(() => {
      this.collectSpeedData();
    }, this.sampleRate);

    console.log(`Speed data collection started with sample rate: ${sampleRate}ms`);
  }

  /**
   * Stop collecting speed data
   */
  public stopCollecting(): void {
    this.isCollecting = false;
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = null;
    }
    this.previousPosition = null;
    console.log('Speed data collection stopped');
  }

  /**
   * Collect speed data from GPS sensor
   */
  private async collectSpeedData(): Promise<void> {
    if (!this.isCollecting) return;

    try {
      // Get current position from GPS
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      });

      const currentLat = position.coords.latitude;
      const currentLng = position.coords.longitude;
      const currentTime = position.timestamp;

      // Create speed data point
      const dataPoint: SpeedDataPoint = {
        speed: 0, // Will be calculated below
        timestamp: currentTime
      };

      // Calculate speed if we have a previous position
      if (this.previousPosition) {
        const distance = this.calculateDistance(
          this.previousPosition.lat,
          this.previousPosition.lng,
          currentLat,
          currentLng
        );

        // Time difference in hours
        const timeDiffHours = (currentTime - this.previousPosition.timestamp) / (1000 * 60 * 60);

        // Avoid division by zero
        if (timeDiffHours > 0) {
          // Speed in km/h (distance is in meters, so we convert to km)
          dataPoint.speed = (distance / 1000) / timeDiffHours;
        }
      }

      // Update previous position
      this.previousPosition = {
        lat: currentLat,
        lng: currentLng,
        timestamp: currentTime
      };

      // Send data to callback
      if (this.onDataReceived) {
        this.onDataReceived(dataPoint);
      }
    } catch (error) {
      console.error('Error collecting speed data:', error);
      if (this.onError) {
        this.onError(`Failed to get location data: ${error}`);
      }
    }
  }

  /**
   * Calculate distance between two points using Haversine formula
   * @param lat1 Latitude of point 1
   * @param lon1 Longitude of point 1
   * @param lat2 Latitude of point 2
   * @param lon2 Longitude of point 2
   * @returns Distance in meters
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Apply outlier filtering to speed data
   * @param speedData Array of speed data points
   * @param zone The current training zone
   * @returns Filtered array of speed data points
   */
  public filterOutliers(speedData: SpeedDataPoint[], zone: TrainingZone): SpeedDataPoint[] {
    if (speedData.length === 0) return speedData;

    // For the first zone (Blue), we expect speeds around 2.5-3.5 m/s (9-12.6 km/h)
    // For other zones, we'll filter based on reasonable running speeds
    const reasonableMinSpeed = 0.5; // 1.8 km/h - very slow walk
    const reasonableMaxSpeed = 15; // 54 km/h - very fast run/sprint

    // Filter out physically impossible speeds
    const filteredData = speedData.filter(point => {
      return point.speed >= reasonableMinSpeed && point.speed <= reasonableMaxSpeed;
    });

    // If we have enough data, apply moving average filter
    if (filteredData.length > 3) {
      return this.applyMovingAverageFilter(filteredData);
    }

    return filteredData;
  }

  /**
   * Apply moving average filter to smooth speed data
   * @param speedData Array of speed data points
   * @param windowSize Size of the moving average window
   * @returns Smoothed array of speed data points
   */
  private applyMovingAverageFilter(speedData: SpeedDataPoint[], windowSize: number = 3): SpeedDataPoint[] {
    if (speedData.length < windowSize) return speedData;

    const smoothedData: SpeedDataPoint[] = [];

    for (let i = 0; i < speedData.length; i++) {
      const start = Math.max(0, i - Math.floor(windowSize / 2));
      const end = Math.min(speedData.length, i + Math.floor(windowSize / 2) + 1);
      
      let sum = 0;
      let count = 0;
      
      for (let j = start; j < end; j++) {
        sum += speedData[j].speed;
        count++;
      }
      
      const smoothedSpeed = count > 0 ? sum / count : speedData[i].speed;
      
      smoothedData.push({
        speed: smoothedSpeed,
        timestamp: speedData[i].timestamp
      });
    }

    return smoothedData;
  }

  /**
   * Check if we have sufficient data for a zone
   * @param zoneBuffer The zone data buffer
   * @param zone The training zone
   * @returns True if we have sufficient valid data, false otherwise
   */
  public hasSufficientData(zoneBuffer: ZoneDataBuffer, zone: TrainingZone): boolean {
    // Calculate expected number of samples
    const expectedSamples = Math.floor(zone.duration / this.sampleRate);
    const minRequiredSamples = Math.floor(expectedSamples * 0.7); // 70% as specified in requirements
    
    // Filter outliers
    const filteredData = this.filterOutliers(zoneBuffer.speedData, zone);
    
    // Update buffer with filtered data
    zoneBuffer.speedData = filteredData;
    
    // Check if we have enough valid samples
    return filteredData.length >= minRequiredSamples;
  }
}

// Export singleton instance
export const speedDataCollector = new SpeedDataCollector();
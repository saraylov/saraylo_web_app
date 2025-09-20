/**
 * Integration test for the audio-assisted assessment training system
 */
import { ASSESSMENT_ZONES } from './assessmentTrainingTypes';
import { SpeedDataCollector } from './speedDataCollector';
import { AudioInstructions } from './audioInstructions';
import { ZoneTransitionLogic } from './zoneTransitionLogic';
import { CalibrationCalculator } from './calibrationCalculator';
import { saveUserCalibrationData, loadUserCalibrationData } from './dataStorage';

// Mock data for testing
const MOCK_USER_ID = 'test-user-123';
const MOCK_SPEED_DATA = [
  { speed: 3.0, timestamp: Date.now() },  // 10.8 km/h
  { speed: 3.2, timestamp: Date.now() + 1000 },  // 11.5 km/h
  { speed: 3.1, timestamp: Date.now() + 2000 },  // 11.2 km/h
  { speed: 3.3, timestamp: Date.now() + 3000 },  // 11.9 km/h
  { speed: 3.0, timestamp: Date.now() + 4000 },  // 10.8 km/h
];

export class IntegrationTest {
  private speedDataCollector: SpeedDataCollector;
  private audioInstructions: AudioInstructions;
  private zoneTransitionLogic: ZoneTransitionLogic | null = null;
  private calibrationCalculator: CalibrationCalculator;
  private testResults: { [key: string]: boolean } = {};
  private testLogs: string[] = [];

  constructor() {
    this.speedDataCollector = new SpeedDataCollector();
    this.audioInstructions = new AudioInstructions();
    this.calibrationCalculator = new CalibrationCalculator();
  }

  /**
   * Run all integration tests
   */
  public async runAllTests(): Promise<void> {
    this.log('Starting integration tests...');
    
    try {
      await this.testDataStructures();
      await this.testSpeedDataCollection();
      await this.testAudioInstructions();
      await this.testZoneTransitions();
      await this.testCalibrationCalculation();
      await this.testDataPersistence();
      
      this.log('All integration tests completed.');
      this.printTestResults();
    } catch (error) {
      this.log(`Error during integration tests: ${error}`);
      throw error;
    }
  }

  /**
   * Test data structures
   */
  private async testDataStructures(): Promise<void> {
    this.log('Testing data structures...');
    
    try {
      // Check that we have the correct number of zones
      if (ASSESSMENT_ZONES.length !== 5) {
        throw new Error(`Expected 5 zones, got ${ASSESSMENT_ZONES.length}`);
      }
      
      // Check zone properties
      const expectedZones = ['Синяя', 'Зеленая', 'Желтая', 'Оранжевая', 'Красная'];
      for (let i = 0; i < expectedZones.length; i++) {
        if (ASSESSMENT_ZONES[i].name !== expectedZones[i]) {
          throw new Error(`Zone ${i} name mismatch: expected ${expectedZones[i]}, got ${ASSESSMENT_ZONES[i].name}`);
        }
      }
      
      this.testResults['Data Structures'] = true;
      this.log('Data structures test passed.');
    } catch (error) {
      this.testResults['Data Structures'] = false;
      this.log(`Data structures test failed: ${error}`);
    }
  }

  /**
   * Test speed data collection
   */
  private async testSpeedDataCollection(): Promise<void> {
    this.log('Testing speed data collection...');
    
    try {
      // Test outlier filtering
      const blueZone = ASSESSMENT_ZONES[0];
      const filteredData = this.speedDataCollector.filterOutliers(MOCK_SPEED_DATA, blueZone);
      
      if (filteredData.length !== MOCK_SPEED_DATA.length) {
        throw new Error(`Expected ${MOCK_SPEED_DATA.length} data points, got ${filteredData.length}`);
      }
      
      // Test sufficient data check
      const mockBuffer = {
        zoneId: blueZone.id,
        speedData: MOCK_SPEED_DATA,
        isValid: false
      };
      
      const hasSufficientData = this.speedDataCollector.hasSufficientData(mockBuffer, blueZone);
      // With our mock data and default sample rate, this should be true
      
      this.testResults['Speed Data Collection'] = true;
      this.log('Speed data collection test passed.');
    } catch (error) {
      this.testResults['Speed Data Collection'] = false;
      this.log(`Speed data collection test failed: ${error}`);
    }
  }

  /**
   * Test audio instructions
   */
  private async testAudioInstructions(): Promise<void> {
    this.log('Testing audio instructions...');
    
    try {
      // Test that we can play instructions without errors
      this.audioInstructions.playInstruction('ZONE_START', ASSESSMENT_ZONES[0]);
      this.audioInstructions.playInstruction('ZONE_END_WARNING', ASSESSMENT_ZONES[0], ASSESSMENT_ZONES[1]);
      this.audioInstructions.playInstruction('ZONE_COUNTDOWN', undefined, undefined, 3);
      
      // We can't easily test if audio actually played, but we can test that no exceptions were thrown
      this.testResults['Audio Instructions'] = true;
      this.log('Audio instructions test passed.');
    } catch (error) {
      this.testResults['Audio Instructions'] = false;
      this.log(`Audio instructions test failed: ${error}`);
    }
  }

  /**
   * Test zone transitions
   */
  private async testZoneTransitions(): Promise<void> {
    this.log('Testing zone transitions...');
    
    try {
      // Initialize zone transition logic
      this.zoneTransitionLogic = new ZoneTransitionLogic(
        ASSESSMENT_ZONES,
        (zoneIndex) => {
          this.log(`Zone changed to index: ${zoneIndex}`);
        },
        (calibrationData) => {
          this.log('Training completed with calibration data');
        },
        (error) => {
          this.log(`Error occurred: ${JSON.stringify(error)}`);
        }
      );
      
      // Test that we can get the initial state
      const state = this.zoneTransitionLogic.getState();
      if (!state) {
        throw new Error('Failed to get initial state');
      }
      
      this.testResults['Zone Transitions'] = true;
      this.log('Zone transitions test passed.');
    } catch (error) {
      this.testResults['Zone Transitions'] = false;
      this.log(`Zone transitions test failed: ${error}`);
    }
  }

  /**
   * Test calibration calculation
   */
  private async testCalibrationCalculation(): Promise<void> {
    this.log('Testing calibration calculation...');
    
    try {
      // Test average speed calculation
      const avgSpeed = this.calibrationCalculator.calculateAverageSpeed(MOCK_SPEED_DATA);
      if (avgSpeed <= 0) {
        throw new Error(`Invalid average speed: ${avgSpeed}`);
      }
      
      // Test speed range calculation
      const speedRange = this.calibrationCalculator.calculateSpeedRange(avgSpeed);
      if (speedRange.min >= speedRange.max) {
        throw new Error(`Invalid speed range: min=${speedRange.min}, max=${speedRange.max}`);
      }
      
      // Test zone data processing
      const blueZone = ASSESSMENT_ZONES[0];
      const processedZone = this.calibrationCalculator.processZoneData(blueZone, MOCK_SPEED_DATA);
      
      if (!processedZone) {
        throw new Error('Failed to process zone data');
      }
      
      if (processedZone.avgSpeed <= 0) {
        throw new Error(`Invalid processed average speed: ${processedZone.avgSpeed}`);
      }
      
      this.testResults['Calibration Calculation'] = true;
      this.log('Calibration calculation test passed.');
    } catch (error) {
      this.testResults['Calibration Calculation'] = false;
      this.log(`Calibration calculation test failed: ${error}`);
    }
  }

  /**
   * Test data persistence
   */
  private async testDataPersistence(): Promise<void> {
    this.log('Testing data persistence...');
    
    try {
      // Create mock calibration data
      const mockCalibrationData = {
        userId: MOCK_USER_ID,
        timestamp: new Date().toISOString(),
        zones: ASSESSMENT_ZONES.map(zone => ({
          name: zone.name,
          avgSpeed: 3.0 + Math.random() * 2, // Random speed between 3.0 and 5.0 m/s
          speedRange: { min: 2.0, max: 4.0 } // Placeholder range
        }))
      };
      
      // Save data
      saveUserCalibrationData(mockCalibrationData);
      
      // Load data
      const loadedData = loadUserCalibrationData();
      
      if (!loadedData) {
        throw new Error('Failed to load calibration data');
      }
      
      if (loadedData.userId !== MOCK_USER_ID) {
        throw new Error(`User ID mismatch: expected ${MOCK_USER_ID}, got ${loadedData.userId}`);
      }
      
      if (loadedData.zones.length !== ASSESSMENT_ZONES.length) {
        throw new Error(`Zone count mismatch: expected ${ASSESSMENT_ZONES.length}, got ${loadedData.zones.length}`);
      }
      
      this.testResults['Data Persistence'] = true;
      this.log('Data persistence test passed.');
    } catch (error) {
      this.testResults['Data Persistence'] = false;
      this.log(`Data persistence test failed: ${error}`);
    }
  }

  /**
   * Log a message
   */
  private log(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    this.testLogs.push(logMessage);
  }

  /**
   * Print test results
   */
  private printTestResults(): void {
    this.log('\n=== TEST RESULTS ===');
    let allPassed = true;
    
    for (const [testName, passed] of Object.entries(this.testResults)) {
      const status = passed ? 'PASSED' : 'FAILED';
      this.log(`${testName}: ${status}`);
      if (!passed) allPassed = false;
    }
    
    this.log(`\nOverall result: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
  }

  /**
   * Get test logs
   */
  public getTestLogs(): string[] {
    return [...this.testLogs];
  }

  /**
   * Get test results
   */
  public getTestResults(): { [key: string]: boolean } {
    return { ...this.testResults };
  }
}

// Export function to run integration tests
export async function runIntegrationTests(): Promise<void> {
  const tester = new IntegrationTest();
  await tester.runAllTests();
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  // This would run in Node.js environment
  // runIntegrationTests().catch(console.error);
}
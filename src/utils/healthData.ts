/**
 * Health data utility for retrieving and managing health metrics
 */

import { loadDailyData, getToday, formatDate } from './dataStorage';

// Define the structure for health data
export interface HealthData {
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  sleepHours: number;
  steps: number;
  stepsGoal: number;
  calories: number;
  hydration: number;
  stressLevel: string;
  bodyTemp: number;
  oxygenSat: number;
  activityLevel: string;
}

/**
 * Retrieve health data from various sources
 * This is the first method for retrieving health data as requested
 * @returns HealthData object with all health metrics
 */
export function retrieveHealthData(): HealthData {
  try {
    // Get today's date
    const today = getToday();
    
    // Load daily data from localStorage
    const dailyData = loadDailyData(today);
    
    // Initialize default values
    let healthData: HealthData = {
      heartRate: 75,
      systolicBP: 120,
      diastolicBP: 80,
      sleepHours: 7,
      steps: 5000,
      stepsGoal: 10000,
      calories: 300,
      hydration: 2.0,
      stressLevel: 'Низкий',
      bodyTemp: 36.6,
      oxygenSat: 98,
      activityLevel: 'Средняя'
    };
    
    // If we have daily data, update the health data with it
    if (dailyData) {
      // Update steps data
      healthData.steps = dailyData.steps.value;
      healthData.stepsGoal = dailyData.steps.goal;
      
      // Update activity data
      healthData.calories = dailyData.activity.move.value;
      
      // For demonstration, we'll map exercise minutes to heart rate
      healthData.heartRate = Math.min(200, Math.max(60, dailyData.activity.exercise.value * 2 + 70));
      
      // For demonstration, we'll map sleep hours to blood pressure
      healthData.systolicBP = Math.min(180, Math.max(90, 90 + dailyData.activity.stand.value * 2));
      healthData.diastolicBP = Math.min(120, Math.max(60, 60 + dailyData.activity.stand.value));
      
      // Sleep hours
      healthData.sleepHours = dailyData.activity.stand.value;
    }
    
    // Simulate other health metrics that might come from different sources
    // In a real application, these would come from health APIs or device sensors
    healthData.hydration = Math.min(3.0, Math.max(0.5, healthData.hydration + (Math.random() - 0.5) * 0.2));
    healthData.stressLevel = ['Низкий', 'Средний', 'Высокий'][Math.floor(Math.random() * 3)];
    healthData.bodyTemp = 36.0 + Math.random() * 1.0;
    healthData.oxygenSat = Math.min(100, Math.max(95, healthData.oxygenSat + (Math.random() - 0.5) * 2));
    healthData.activityLevel = ['Низкая', 'Средняя', 'Высокая'][Math.floor(Math.random() * 3)];
    
    return healthData;
  } catch (error) {
    console.error('Error retrieving health data:', error);
    
    // Return default values in case of error
    return {
      heartRate: 75,
      systolicBP: 120,
      diastolicBP: 80,
      sleepHours: 7,
      steps: 5000,
      stepsGoal: 10000,
      calories: 300,
      hydration: 2.0,
      stressLevel: 'Низкий',
      bodyTemp: 36.6,
      oxygenSat: 98,
      activityLevel: 'Средняя'
    };
  }
}

/**
 * Get health data for a specific date
 * @param date Date to get health data for
 * @returns HealthData object with all health metrics for the specified date
 */
export function getHealthDataForDate(date: Date): HealthData {
  try {
    const dateStr = formatDate(date);
    const dailyData = loadDailyData(dateStr);
    
    // Initialize default values
    let healthData: HealthData = {
      heartRate: 75,
      systolicBP: 120,
      diastolicBP: 80,
      sleepHours: 7,
      steps: 5000,
      stepsGoal: 10000,
      calories: 300,
      hydration: 2.0,
      stressLevel: 'Низкий',
      bodyTemp: 36.6,
      oxygenSat: 98,
      activityLevel: 'Средняя'
    };
    
    // If we have daily data, update the health data with it
    if (dailyData) {
      // Update steps data
      healthData.steps = dailyData.steps.value;
      healthData.stepsGoal = dailyData.steps.goal;
      
      // Update activity data
      healthData.calories = dailyData.activity.move.value;
      
      // For demonstration, we'll map exercise minutes to heart rate
      healthData.heartRate = Math.min(200, Math.max(60, dailyData.activity.exercise.value * 2 + 70));
      
      // For demonstration, we'll map sleep hours to blood pressure
      healthData.systolicBP = Math.min(180, Math.max(90, 90 + dailyData.activity.stand.value * 2));
      healthData.diastolicBP = Math.min(120, Math.max(60, 60 + dailyData.activity.stand.value));
      
      // Sleep hours
      healthData.sleepHours = dailyData.activity.stand.value;
    }
    
    return healthData;
  } catch (error) {
    console.error('Error retrieving health data for date:', error);
    
    // Return default values in case of error
    return {
      heartRate: 75,
      systolicBP: 120,
      diastolicBP: 80,
      sleepHours: 7,
      steps: 5000,
      stepsGoal: 10000,
      calories: 300,
      hydration: 2.0,
      stressLevel: 'Низкий',
      bodyTemp: 36.6,
      oxygenSat: 98,
      activityLevel: 'Средняя'
    };
  }
}
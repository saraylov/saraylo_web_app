/**
 * Data storage utility for persisting daily activity data
 */

// Define the structure for daily activity data
export interface DailyActivityData {
  date: string; // YYYY-MM-DD format
  steps: {
    value: number;
    goal: number;
  };
  activity: {
    move: { value: number; goal: number; color: string };
    exercise: { value: number; goal: number; color: string };
    stand: { value: number; goal: number; color: string };
  };
}

// Define the structure for user calibration data
export interface UserCalibrationData {
  userId: string;
  timestamp: string; // ISO timestamp
  zones: {
    name: 'Синяя' | 'Зеленая' | 'Желтая' | 'Оранжевая' | 'Красная';
    avgSpeed: number; // Average speed in km/h
    speedRange: { min: number; max: number }; // Speed range [avg-1, avg+1] km/h
  }[];
}

/**
 * Save daily activity data to localStorage
 * @param data Daily activity data to save
 */
export function saveDailyData(data: DailyActivityData): void {
  try {
    const key = `dailyData_${data.date}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving daily data:', error);
  }
}

/**
 * Load daily activity data from localStorage
 * @param date Date in YYYY-MM-DD format
 * @returns Daily activity data or null if not found
 */
export function loadDailyData(date: string): DailyActivityData | null {
  try {
    const key = `dailyData_${date}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading daily data:', error);
    return null;
  }
}

/**
 * Get all saved daily data dates
 * @returns Array of date strings in YYYY-MM-DD format
 */
export function getAllSavedDates(): string[] {
  try {
    const dates: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('dailyData_')) {
        dates.push(key.replace('dailyData_', ''));
      }
    }
    return dates;
  } catch (error) {
    console.error('Error getting saved dates:', error);
    return [];
  }
}

/**
 * Save user calibration data to localStorage
 * @param data User calibration data to save
 */
export function saveUserCalibrationData(data: UserCalibrationData): void {
  try {
    localStorage.setItem('userCalibrationData', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user calibration data:', error);
  }
}

/**
 * Load user calibration data from localStorage
 * @returns User calibration data or null if not found
 */
export function loadUserCalibrationData(): UserCalibrationData | null {
  try {
    const data = localStorage.getItem('userCalibrationData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading user calibration data:', error);
    return null;
  }
}

/**
 * Clear user calibration data from localStorage
 */
export function clearUserCalibrationData(): void {
  try {
    localStorage.removeItem('userCalibrationData');
  } catch (error) {
    console.error('Error clearing user calibration data:', error);
  }
}

/**
 * Format date as YYYY-MM-DD string
 * @param date Date object to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns Today's date string
 */
export function getToday(): string {
  return formatDate(new Date());
}

/**
 * Get yesterday's date in YYYY-MM-DD format
 * @returns Yesterday's date string
 */
export function getYesterday(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDate(yesterday);
}
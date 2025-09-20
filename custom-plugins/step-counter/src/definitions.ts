export interface StepCounterPlugin {
  /**
   * Get the current step count
   */
  getStepCount(): Promise<{ steps: number }>;

  /**
   * Start listening for step count updates
   */
  startTracking(): Promise<void>;

  /**
   * Stop listening for step count updates
   */
  stopTracking(): Promise<void>;

  /**
   * Add a listener for step count updates
   */
  addListener(
    eventName: 'stepCountUpdate',
    listenerFunc: (data: { steps: number }) => void
  ): Promise<import('@capacitor/core').PluginListenerHandle>;
}
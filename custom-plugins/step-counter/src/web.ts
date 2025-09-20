import { WebPlugin } from '@capacitor/core';

import type { StepCounterPlugin } from './definitions';

export class StepCounterWeb extends WebPlugin implements StepCounterPlugin {
  async getStepCount(): Promise<{ steps: number }> {
    // В веб-версии возвращаем 0 шагов
    return { steps: 0 };
  }

  async startTracking(): Promise<void> {
    // В веб-версии ничего не делаем
    return;
  }

  async stopTracking(): Promise<void> {
    // В веб-версии ничего не делаем
    return;
  }
}
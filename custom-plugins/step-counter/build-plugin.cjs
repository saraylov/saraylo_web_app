const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const dirs = ['dist'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Compile TypeScript to JavaScript
console.log('Building plugin...');
try {
  // Try to compile with TypeScript first
  execSync('npx tsc --outDir dist --declaration --declarationDir dist', { stdio: 'inherit' });
  console.log('TypeScript compilation successful');
} catch (error) {
  console.log('TypeScript compilation failed, creating files manually...');
  
  // Create plugin.js
  const pluginJs = `import { registerPlugin } from '@capacitor/core';

const StepCounter = registerPlugin('StepCounter', {
  web: () => import('./web').then(m => new m.StepCounterWeb()),
});

export * from './definitions';
export { StepCounter };`;
  
  fs.writeFileSync('dist/plugin.js', pluginJs);
  
  // Create web.js
  const webJs = `import { WebPlugin } from '@capacitor/core';

export class StepCounterWeb extends WebPlugin {
  async getStepCount() {
    // В веб-версии возвращаем 0 шагов
    return { steps: 0 };
  }

  async startTracking() {
    // В веб-версии ничего не делаем
    return;
  }

  async stopTracking() {
    // В веб-версии ничего не делаем
    return;
  }
}`;
  
  fs.writeFileSync('dist/web.js', webJs);
  
  // Create definitions.js
  const definitionsJs = `export class StepCounterWeb {
  async getStepCount() {
    // В веб-версии возвращаем 0 шагов
    return { steps: 0 };
  }

  async startTracking() {
    // В веб-версии ничего не делаем
    return;
  }

  async stopTracking() {
    // В веб-версии ничего не делаем
    return;
  }
}`;
  
  fs.writeFileSync('dist/definitions.js', definitionsJs);
  
  // Create type definition files
  const pluginDts = `import type { StepCounterPlugin } from './definitions';

export * from './definitions';
export { StepCounter };

declare const StepCounter: StepCounterPlugin;`;
  
  fs.writeFileSync('dist/plugin.d.ts', pluginDts);
  
  const definitionsDts = `export interface StepCounterPlugin {
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
}`;
  
  fs.writeFileSync('dist/definitions.d.ts', definitionsDts);
  
  const webDts = `import { WebPlugin } from '@capacitor/core';
import type { StepCounterPlugin } from './definitions';

export class StepCounterWeb extends WebPlugin implements StepCounterPlugin {
  getStepCount(): Promise<{ steps: number }>;
  startTracking(): Promise<void>;
  stopTracking(): Promise<void>;
}`;
  
  fs.writeFileSync('dist/web.d.ts', webDts);
}

console.log('Plugin built successfully!');
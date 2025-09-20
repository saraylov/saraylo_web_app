/**
 * Test runner for the audio-assisted assessment training system
 */
import { runIntegrationTests } from './src/utils/integrationTest';

async function runTests() {
  console.log('Running integration tests for audio-assisted assessment training system...\n');
  
  try {
    await runIntegrationTests();
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Tests failed with error:', error);
    process.exit(1);
  }
}

// Run the tests
runTests();
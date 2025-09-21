<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { workoutStore, startWorkout, pauseWorkout, resumeWorkout, stopWorkout } from './utils/workoutStore';
  import CircularProgressBar from './CircularProgressBar.svelte';
  
  // Exported properties
  export let handleStartWorkout: () => void;
  export let handleStopWorkout: () => void;
  export let handlePauseWorkout: () => void;
  export let handleResumeWorkout: () => void;
  
  // Reactive variables
  let progress = 0;
  let isHolding = false;
  let holdTimer: number | null = null;
  let holdStartTime: number | null = null;
  let buttonState: 'start' | 'stop' | 'pause' | 'resume' = 'start';
  let unsubscribe: (() => void) | null = null;
  
  // Constants
  const HOLD_DURATION = 2500; // 2.5 seconds in milliseconds
  
  // Initialize the component
  onMount(() => {
    // Subscribe to workout store changes
    unsubscribe = workoutStore.subscribe((data) => {
      if (data.workoutState === 'idle') {
        buttonState = 'start';
        resetProgress();
      } else if (data.workoutState === 'running') {
        buttonState = 'pause'; // Show pause button when running
      } else if (data.workoutState === 'paused') {
        buttonState = 'resume';
      }
    });
  });
  
  // Clean up on destroy
  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
    if (holdTimer) {
      clearTimeout(holdTimer);
    }
  });
  
  // Handle touch start event
  function handleTouchStart(e: TouchEvent, action: 'start' | 'stop' | 'pause' | 'resume') {
    e.preventDefault();
    startHold(action);
  }
  
  // Handle touch end event
  function handleTouchEnd(e: TouchEvent) {
    e.preventDefault();
    endHold();
  }
  
  // Handle mouse down event (for desktop testing)
  function handleMouseDown(e: MouseEvent, action: 'start' | 'stop' | 'pause' | 'resume') {
    e.preventDefault();
    startHold(action);
  }
  
  // Handle mouse up event (for desktop testing)
  function handleMouseUp(e: MouseEvent) {
    e.preventDefault();
    endHold();
  }
  
  // Start the hold timer
  function startHold(action: 'start' | 'stop' | 'pause' | 'resume') {
    if (isHolding) return;
    
    isHolding = true;
    holdStartTime = Date.now();
    progress = 0;
    
    // Update progress every 50ms for smooth animation
    holdTimer = window.setInterval(() => {
      if (holdStartTime) {
        const elapsed = Date.now() - holdStartTime;
        progress = Math.min(100, (elapsed / HOLD_DURATION) * 100);
        
        // If we've reached the full duration, trigger the action
        if (elapsed >= HOLD_DURATION) {
          completeHold(action);
        }
      }
    }, 50);
  }
  
  // End the hold timer
  function endHold() {
    if (!isHolding) return;
    
    isHolding = false;
    
    if (holdTimer) {
      clearInterval(holdTimer);
      holdTimer = null;
    }
    
    // Reset progress if not completed
    if (progress < 100) {
      resetProgress();
    }
  }
  
  // Reset progress to 0
  function resetProgress() {
    progress = 0;
  }
  
  // Complete the hold action
  function completeHold(action: 'start' | 'stop' | 'pause' | 'resume') {
    if (holdTimer) {
      clearInterval(holdTimer);
      holdTimer = null;
    }
    
    isHolding = false;
    
    // Trigger the appropriate action based on button state
    switch (action) {
      case 'start':
        if (handleStartWorkout) handleStartWorkout();
        startWorkout();
        break;
      case 'stop':
        if (handleStopWorkout) handleStopWorkout();
        stopWorkout();
        break;
      case 'pause':
        if (handlePauseWorkout) handlePauseWorkout();
        pauseWorkout();
        break;
      case 'resume':
        if (handleResumeWorkout) handleResumeWorkout();
        resumeWorkout();
        break;
    }
    
    // Reset progress after completion
    resetProgress();
  }
  
  // Handle click for resume button (immediate action)
  function handleClick(action: 'resume' | 'stop') {
    if (action === 'resume') {
      if (handleResumeWorkout) handleResumeWorkout();
      resumeWorkout();
      resetProgress();
    } else if (action === 'stop') {
      if (handleStopWorkout) handleStopWorkout();
      stopWorkout();
      resetProgress();
    }
  }
</script>

<!-- Workout buttons with different states -->
{#if buttonState === 'start'}
  <div 
    class="workout-button-container start-button"
    on:touchstart={(e) => handleTouchStart(e, 'start')}
    on:touchend={handleTouchEnd}
    on:mousedown={(e) => handleMouseDown(e, 'start')}
    on:mouseup={handleMouseUp}
    on:mouseleave={handleMouseUp}
    role="button"
    tabindex="0"
    aria-label="Начать тренировку"
  >
    <div class="workout-button-content">
      <CircularProgressBar 
        progress={progress} 
        size={80} 
        strokeWidth={8} 
        color="#00BFFF" 
        backgroundColor="rgba(255, 255, 255, 0.1)"
      />
      <div class="button-icon">
        <img src="images/Run3.png" alt="Начать тренировку" width="40" height="40" />
      </div>
    </div>
  </div>
{:else if buttonState === 'stop'}
  <div 
    class="workout-button-container stop-button"
    on:touchstart={(e) => handleTouchStart(e, 'stop')}
    on:touchend={handleTouchEnd}
    on:mousedown={(e) => handleMouseDown(e, 'stop')}
    on:mouseup={handleMouseUp}
    on:mouseleave={handleMouseUp}
    role="button"
    tabindex="0"
    aria-label="Остановить тренировку"
  >
    <div class="workout-button-content">
      <CircularProgressBar 
        progress={progress} 
        size={80} 
        strokeWidth={8} 
        color="#FF0000" 
        backgroundColor="rgba(255, 255, 255, 0.1)"
      />
      <div class="button-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="12" height="12" rx="2" fill="white"/>
        </svg>
      </div>
    </div>
  </div>
{:else if buttonState === 'pause'}
  <!-- Show both pause and stop buttons when workout is running -->
  <div class="workout-buttons-container">
    <div 
      class="workout-button-container pause-button"
      on:touchstart={(e) => handleTouchStart(e, 'pause')}
      on:touchend={handleTouchEnd}
      on:mousedown={(e) => handleMouseDown(e, 'pause')}
      on:mouseup={handleMouseUp}
      on:mouseleave={handleMouseUp}
      role="button"
      tabindex="0"
      aria-label="Приостановить тренировку"
    >
      <div class="workout-button-content">
        <CircularProgressBar 
          progress={progress} 
          size={80} 
          strokeWidth={8} 
          color="#FFFF00" 
          backgroundColor="rgba(255, 255, 255, 0.1)"
        />
        <div class="button-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="5" width="4" height="14" fill="white"/>
            <rect x="14" y="5" width="4" height="14" fill="white"/>
          </svg>
        </div>
      </div>
    </div>
    
    <div 
      class="workout-button-container stop-button small"
      on:click={() => handleClick('stop')}
      on:touchstart={() => handleClick('stop')}
      role="button"
      tabindex="0"
      aria-label="Остановить тренировку"
    >
      <div class="workout-button-content">
        <div class="button-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="6" width="12" height="12" rx="2" fill="white"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
{:else if buttonState === 'resume'}
  <div 
    class="workout-button-container resume-button"
    on:click={() => handleClick('resume')}
    on:touchstart={() => handleClick('resume')}
    role="button"
    tabindex="0"
    aria-label="Продолжить тренировку"
  >
    <div class="workout-button-content">
      <div class="button-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 5V19L19 12L8 5Z" fill="white"/>
        </svg>
      </div>
    </div>
  </div>
{/if}

<style>
  .workout-button-container {
    width: clamp(50px, 12vw, 80px);
    height: clamp(50px, 12vw, 80px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 clamp(4px, 1vw, 8px) clamp(8px, 2vw, 20px) rgba(0, 191, 255, 0.4);
    transition: all 0.3s ease;
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
    margin: 0 auto;
    aspect-ratio: 1 / 1;
    flex-shrink: 0;
    cursor: pointer;
    user-select: none;
    position: relative;
  }
  
  .small {
    width: clamp(30px, 8vw, 50px);
    height: clamp(30px, 8vw, 50px);
  }
  
  .start-button {
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
  }
  
  .stop-button {
    background: linear-gradient(135deg, #FF0000, #990000);
  }
  
  .pause-button {
    background: linear-gradient(135deg, #FFFF00, #CCCC00);
  }
  
  .resume-button {
    background: linear-gradient(135deg, #00FF00, #009900);
  }
  
  .workout-button-content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  
  .button-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .workout-button-container:hover {
    transform: scale(1.1);
  }
  
  .start-button:hover {
    box-shadow: 0 8px 20px rgba(255, 20, 147, 0.6);
  }
  
  .stop-button:hover {
    box-shadow: 0 8px 20px rgba(255, 0, 0, 0.6);
  }
  
  .pause-button:hover {
    box-shadow: 0 8px 20px rgba(255, 255, 0, 0.6);
  }
  
  .resume-button:hover {
    box-shadow: 0 8px 20px rgba(0, 255, 0, 0.6);
  }
  
  /* Container for multiple buttons */
  .workout-buttons-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    position: relative;
  }
  
  /* Ensure the circular progress bar fits properly */
  :global(.circular-progress-container) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  
  :global(.circular-progress) {
    width: 100%;
    height: 100%;
  }
</style>
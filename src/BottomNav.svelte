<script>
  export let handleBackToDashboard;
  export let handleHealthClick;
  export let handleTrainingClick;
  export let handleDevicesClick;
  export let handleProfileClick;
  export let handleSettingsClick;
  export let isInTrainingMode;
  
  // New handlers for workout button actions
  /** @type {() => void} */
  export let handleStartWorkout;
  /** @type {() => void} */
  export let handleStopWorkout;
  /** @type {() => void} */
  export let handlePauseWorkout;
  /** @type {() => void} */
  export let handleResumeWorkout;
  
  // Import the new WorkoutButton component
  import WorkoutButton from './WorkoutButton.svelte';
</script>

<!-- Bottom navigation panel -->
<div class="bottom-panel s-XsEmFtvddWTw">
  <div 
    class="nav-item"
    on:click={handleBackToDashboard}
    on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBackToDashboard(); }}
    role="button"
    tabindex="0"
    aria-label="Статистика"
  >
    <img src="images/Graf.png" alt="Статистика" width="24" height="24" />
    <span>Статистика</span>
  </div>
  <div 
    class="nav-item"
    on:click={handleHealthClick}
    on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleHealthClick(); }}
    role="button"
    tabindex="0"
    aria-label="Здоровье"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="2" fill="currentColor"/>
    </svg>
    <span>Здоровье</span>
  </div>
  
  <!-- Replace the original circle button with the new WorkoutButton component -->
  <div class="nav-item nav-item-center">
    <WorkoutButton 
      handleStartWorkout={handleStartWorkout}
      handleStopWorkout={handleStopWorkout}
      handlePauseWorkout={handlePauseWorkout}
      handleResumeWorkout={handleResumeWorkout}
    />
  </div>
  
  <div 
    class="nav-item"
    on:click={handleDevicesClick}
    on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDevicesClick(); }}
    role="button"
    tabindex="0"
    aria-label="Устройства"
  >
    <img src="images/Smart.png" alt="Устройства" width="24" height="24" />
    <span>Устройства</span>
  </div>
  <div 
    class="nav-item"
    on:click={handleProfileClick}
    on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleProfileClick(); }}
    role="button"
    tabindex="0"
    aria-label="Профиль"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2"/>
    </svg>
    <span>Профиль</span>
  </div>
</div>

<style>
  /* Add styles for the bottom panel to accommodate the new button layout */
  .bottom-panel {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 500px;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(51, 51, 51, 0.2));
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: clamp(10px, 2vw, 15px) 0;
    box-sizing: border-box;
    z-index: 100;
  }
  
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: clamp(5px, 1vw, 10px);
    border-radius: 10px;
    transition: all 0.3s ease;
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
  }
  
  .nav-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .nav-item span {
    font-size: clamp(0.7rem, 1.5vw, 0.9rem);
    color: var(--white);
    margin-top: clamp(3px, 0.5vw, 5px);
    text-align: center;
  }
  
  .nav-item img,
  .nav-item svg {
    width: clamp(20px, 4vw, 24px);
    height: clamp(20px, 4vw, 24px);
    color: var(--white);
  }
  
  .nav-item-center {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    margin: 0 clamp(5px, 1vw, 15px);
  }
</style>
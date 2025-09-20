<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { getToday } from './utils/dataStorage';
  
  // Handle back to dashboard
  export let handleBackToDashboard: () => void;
  
  // Navigation handlers
  export let handleHealthClick: () => void;
  export let handleTrainingClick: () => void;
  export let handleDevicesClick: () => void;
  export let handleProfileClick: () => void;
  
  // Health data state
  let heartRate = 0;
  let systolicBP = 0;
  let diastolicBP = 0;
  let sleepHours = 0;
  let steps = 0;
  let stepsGoal = 0;
  let calories = 0;
  let hydration = 0;
  let stressLevel = '';
  let bodyTemp = 0;
  let oxygenSat = 0;
  let activityLevel = '';
  
  // Data refresh interval
  let dataRefreshInterval: ReturnType<typeof setInterval> | undefined;
  
  // Helper function to check if in training mode
  function isInTrainingMode() {
    return false;
  }
  
  // Function to retrieve health data
  async function refreshHealthData() {
    try {
      // Simulate health data instead of retrieving from device
      const now = new Date();
      const hoursSinceMidnight = (now.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime()) / (1000 * 60 * 60);
      
      // Simulate heart rate (60-100 bpm at rest, can go higher during activity)
      heartRate = Math.floor(60 + Math.random() * 40);
      
      // Simulate blood pressure (normal range 90/60 to 120/80)
      systolicBP = Math.floor(110 + Math.random() * 20);
      diastolicBP = Math.floor(70 + Math.random() * 10);
      
      // Simulate sleep hours (7-9 hours is recommended)
      sleepHours = 7 + Math.random() * 2;
      
      // Simulate steps (using the same logic as in App.svelte)
      steps = Math.floor(hoursSinceMidnight * 2000);
      stepsGoal = 50000;
      
      // Simulate calories (2000-2500 per day)
      calories = Math.floor(hoursSinceMidnight * 100);
      
      // Simulate hydration (0-100%)
      hydration = Math.floor(50 + Math.random() * 50);
      
      // Simulate stress level
      const stressLevels = ['Низкий', 'Средний', 'Высокий'];
      stressLevel = stressLevels[Math.floor(Math.random() * stressLevels.length)];
      
      // Simulate body temperature (normal range 36.1-37.2°C)
      bodyTemp = 36.1 + Math.random() * 1.1;
      
      // Simulate oxygen saturation (normal range 95-100%)
      oxygenSat = 95 + Math.random() * 5;
      
      // Simulate activity level
      const activityLevels = ['Низкая', 'Средняя', 'Высокая'];
      activityLevel = activityLevels[Math.floor(Math.random() * activityLevels.length)];
    } catch (error: any) {
      console.error('Error refreshing health data:', error);
    }
  }
  
  onMount(() => {
    // Retrieve initial health data
    refreshHealthData();
    
    // Set up interval to refresh data every minute
    dataRefreshInterval = setInterval(refreshHealthData, 60000);
  });
  
  onDestroy(() => {
    // Clean up the interval when component is destroyed
    if (dataRefreshInterval) {
      clearInterval(dataRefreshInterval);
    }
  });
</script>

<div class="background-animation">
  <!-- 20 sports items -->
  <div class="sports-item football"></div>
  <div class="sports-item basketball"></div>
  <div class="sports-item sneakers"></div>
  <div class="sports-item shorts"></div>
  <div class="sports-item tshirt"></div>
  <div class="sports-item football"></div>
  <div class="sports-item basketball"></div>
  <div class="sports-item sneakers"></div>
  <div class="sports-item shorts"></div>
  <div class="sports-item tshirt"></div>
  <div class="sports-item football"></div>
  <div class="sports-item basketball"></div>
  <div class="sports-item sneakers"></div>
  <div class="sports-item shorts"></div>
  <div class="sports-item tshirt"></div>
  <div class="sports-item football"></div>
  <div class="sports-item basketball"></div>
  <div class="sports-item sneakers"></div>
  <div class="sports-item shorts"></div>
  <div class="sports-item tshirt"></div>
</div>

<div class="app-container">
  <div class="glass-panel">
    <!-- Header -->
    <div class="dashboard-header">
      <h1 class="dashboard-title">Здоровье</h1>
      <div 
        class="header-icon"
        on:click={refreshHealthData}
        on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') refreshHealthData(); }}
        role="button"
        tabindex="0"
        aria-label="Обновить"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 4V10H17" stroke="var(--primary-pink)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M1 20V14H7" stroke="var(--primary-pink)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3.51 9C4.15325 7.31783 5.34373 5.89598 6.89287 4.91342C8.44201 3.93085 10.2614 3.44349 12.0832 3.52309C13.9049 3.60269 15.6313 4.24495 17.004 5.35429C18.3767 6.46364 19.319 7.97818 19.68 9.65" stroke="var(--primary-pink)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20.49 15C19.8468 16.6822 18.6563 18.104 17.1071 19.0866C15.558 20.0691 13.7386 20.5565 11.9168 20.4769C10.0951 20.3973 8.36875 19.7551 6.996 18.6457C5.62325 17.5364 4.68101 16.0218 4.32 14.35" stroke="var(--primary-pink)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    
    <!-- Health content -->
    <div class="dashboard-main">
      <div class="health-grid">
        <!-- First column of panels -->
        <div class="health-column">
          <!-- Heart Rate Panel -->
          <div class="health-panel">
            <div class="panel-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.35 7.17C5.05 5.07 7.28 3.5 9.95 3.5H14.05C16.72 3.5 18.95 5.07 19.65 7.17L21.28 12.07C21.66 13.22 21.85 13.8 21.71 14.29C21.57 14.77 21.13 15.11 20.25 15.79L18.5 17.15C16.5 18.7 15.5 19.47 14.36 19.73C13.22 19.99 12.08 19.99 10.94 19.73C9.8 19.47 8.8 18.7 6.8 17.15L5.05 15.79C4.17 15.11 3.73 14.77 3.59 14.29C3.45 13.8 3.64 13.22 4.02 12.07L4.35 7.17Z" stroke="currentColor" stroke-width="2"/>
                <path d="M9 11L11 13L15 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <h3>Пульс</h3>
            </div>
            <div class="panel-content">
              <div class="heart-rate-value">{heartRate} <span>уд/мин</span></div>
              <div class="chart-placeholder">
                <!-- Heart rate chart would go here -->
                <div class="chart-line"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Bottom navigation panel -->
  <div class="bottom-panel">
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
    <div class="nav-item nav-item-center">
      <div 
        class="circle-button"
        class:training-mode={isInTrainingMode()}
        on:click={handleTrainingClick}
        on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTrainingClick(); }}
        role="button"
        tabindex="0"
        aria-label="Начать тренировку"
      >
        <img src="images/Run3.png" alt="Начать тренировку" width="40" height="40" />
      </div>
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
</div>

<style>
  /* Import global styles */
  @import './app.css';
  
  /* Health grid with two columns */
  .health-grid {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }
  
  .health-column {
    flex: 1;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  /* Адаптивный дизайн */
  @media (max-width: 768px) {
    .health-grid {
      flex-direction: column;
    }
    
    .health-column {
      min-width: 100%;
    }
    
    .rings-wrapper {
      gap: 15px;
    }
    
    .ring-container {
      transform: scale(0.9);
    }
  }
  
  @media (max-width: 480px) {
    .activity-rings-container {
      padding: 15px;
    }
    
    .rings-title {
      font-size: 1.3rem;
      margin-bottom: 20px;
    }
    
    .rings-wrapper {
      gap: 10px;
    }
    
    .ring-container {
      transform: scale(0.8);
    }
    
    .ring-value {
      font-size: 1rem;
    }
    
    .legend-text {
      font-size: 0.8rem;
    }
  }
  
  /* Animation keyframes - only keep the ones not in app.css */
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
</style>
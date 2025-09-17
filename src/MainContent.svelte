<script>
  import { createEventDispatcher } from 'svelte';
  
  export let activityData = {
    move: { value: 450, goal: 500, color: '#00BFFF' },
    exercise: { value: 30, goal: 60, color: '#FF1493' },
    stand: { value: 8, goal: 12, color: '#00FF00' }
  };
  
  export let handleDetailsClick;
  export let handleLogout;
  
  const dispatch = createEventDispatcher();
</script>

<!-- Main content -->
<div class="dashboard-main">
  <!-- Activity Rings -->
  <div class="activity-rings-container">
    <h2 class="rings-title">Активность</h2>
    <div class="rings-wrapper">
      <!-- Move Ring -->
      <div class="ring-container">
        <svg class="ring" width="100%" height="100%" viewBox="0 0 120 120">
          <circle 
            class="ring-background" 
            cx="60" 
            cy="60" 
            r="50" 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.1)" 
            stroke-width="10"
          />
          <circle 
            class="ring-progress" 
            cx="60" 
            cy="60" 
            r="50" 
            fill="none" 
            stroke={activityData.move.color} 
            stroke-width="10"
            stroke-dasharray="314.16"
            stroke-dashoffset={314.16 - (314.16 * Math.min(activityData.move.value / activityData.move.goal, 1))}
            stroke-linecap="round"
          />
        </svg>
        <div class="ring-label">
          <span class="ring-value">{activityData.move.value}</span>
          <span class="ring-unit">ккал</span>
        </div>
      </div>
      
      <!-- Exercise Ring -->
      <div class="ring-container">
        <svg class="ring" width="100%" height="100%" viewBox="0 0 120 120">
          <circle 
            class="ring-background" 
            cx="60" 
            cy="60" 
            r="50" 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.1)" 
            stroke-width="10"
          />
          <circle 
            class="ring-progress" 
            cx="60" 
            cy="60" 
            r="50" 
            fill="none" 
            stroke={activityData.exercise.color} 
            stroke-width="10"
            stroke-dasharray="314.16"
            stroke-dashoffset={314.16 - (314.16 * Math.min(activityData.exercise.value / activityData.exercise.goal, 1))}
            stroke-linecap="round"
          />
        </svg>
        <div class="ring-label">
          <span class="ring-value">{activityData.exercise.value}</span>
          <span class="ring-unit">мин</span>
        </div>
      </div>
      
      <!-- Stand Ring -->
      <div class="ring-container">
        <svg class="ring" width="100%" height="100%" viewBox="0 0 120 120">
          <circle 
            class="ring-background" 
            cx="60" 
            cy="60" 
            r="50" 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.1)" 
            stroke-width="10"
          />
          <circle 
            class="ring-progress" 
            cx="60" 
            cy="60" 
            r="50" 
            fill="none" 
            stroke={activityData.stand.color} 
            stroke-width="10"
            stroke-dasharray="314.16"
            stroke-dashoffset={314.16 - (314.16 * Math.min(activityData.stand.value / activityData.stand.goal, 1))}
            stroke-linecap="round"
          />
        </svg>
        <div class="ring-label">
          <span class="ring-value">{activityData.stand.value}</span>
          <span class="ring-unit">ч</span>
        </div>
      </div>
    </div>
    
    <!-- Rings Legend -->
    <div class="rings-legend">
      <div class="legend-item">
        <div class="legend-color" style="background-color: {activityData.move.color};"></div>
        <span class="legend-text">Затрата</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: {activityData.exercise.color};"></div>
        <span class="legend-text">Нагрузка</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: {activityData.stand.color};"></div>
        <span class="legend-text">Сон</span>
      </div>
    </div>
    
    <!-- Progress bar -->
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" style="width: 5.8%;"></div>
      </div>
      <p class="progress-text">2900 / 50000 шагов</p>
    </div>
  </div>
  
  <!-- Coffee button -->
  <button class="coffee-button">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8H20C20.5304 8 21.0391 8.21071 21.4142 8.58579C21.7893 8.96086 22 9.46957 22 10V12C22 15.3137 19.3137 18 16 18H6C3.79086 18 2 16.2091 2 14V10C2 9.46957 2.21071 8.96086 2.58579 8.58579C2.96086 8.21071 3.46957 8 4 8H6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M6 8V6C6 3.79086 7.79086 2 10 2H12C14.2091 2 16 3.79086 16 6V8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M18 12V8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M18 16V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M20 16V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M22 16V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <span>Подзарядите наши идеи</span>
  </button>
  
  <!-- Last training date -->
  <div class="training-date">
    <p>12 сент. 2024 г. (22:25 — 22:27)</p>
    <button class="details-button" on:click={handleDetailsClick}>Детали</button>
  </div>
  
  <!-- Logout button -->
  <div class="dashboard-actions">
    <button 
      class="telegram-auth-button" 
      on:click={handleLogout}
      style="background: rgba(255, 0, 0, 0.1);"
    >
      Выйти
    </button>
  </div>
</div>
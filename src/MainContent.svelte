<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  interface ActivityData {
    move: { value: number; goal: number; color: string };
    exercise: { value: number; goal: number; color: string };
    stand: { value: number; goal: number; color: string };
  }
  
  export let activityData: ActivityData = {
    move: { value: 450, goal: 500, color: '#00BFFF' },
    exercise: { value: 30, goal: 60, color: '#FF1493' },
    stand: { value: 8, goal: 12, color: '#00FF00' }
  };
  
  // Add stepsData export
  export let stepsData = {
    value: 0,
    goal: 50000
  };
  
  export let handleDetailsClick: () => void;
  export let handleLogout: () => void;
  
  // Add export for handleCalendarClick
  export let handleCalendarClick: () => void;
  
  const dispatch = createEventDispatcher();
  
  // Calculate progress percentage for steps
  $: stepsPercentage = stepsData.value && stepsData.goal ? 
    Math.min(100, (stepsData.value / stepsData.goal) * 100) : 0;
  
  // Function to determine the correct form of "шаг" based on the number
  $: getStepsWord = (value: number) => {
    const lastDigit = value % 10;
    const lastTwoDigits = value % 100;
    
    // Special case for 11-19
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return 'шагов';
    }
    
    // Cases for 1, 2, 3, 4
    switch (lastDigit) {
      case 1:
        return 'шаг';
      case 2:
      case 3:
      case 4:
        return 'шага';
      default:
        return 'шагов';
    }
  };
  
  // Functions to format values with fixed decimal places
  $: formatValue = (value: number) => {
    // If value is integer, don't add decimal places
    if (Number.isInteger(value)) {
      return value.toString();
    }
    // For fractional values, round to 1 decimal place
    return value.toFixed(1);
  };
  
  // Function to format sleep time in H:MM format
  $: formatSleepTime = (hours: number) => {
    // Convert decimal hours to hours and minutes
    const totalMinutes = Math.floor(hours * 60);
    const displayHours = Math.floor(totalMinutes / 60);
    const displayMinutes = totalMinutes % 60;
    
    // Format as H:MM
    return `${displayHours}:${displayMinutes.toString().padStart(2, '0')}`;
  };
</script>

<!-- Main content -->
<div class="dashboard-main">
  <!-- Activity Rings -->
  <div class="activity-rings-container">
    <div class="rings-header">
      <h2 class="rings-title">Активность</h2>
      <button class="calendar-button" on:click={handleCalendarClick}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    
    <div class="rings-wrapper">
      <!-- Move Ring (Calories) -->
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
          <span class="ring-value">{formatValue(activityData.move.value)}</span>
          <span class="ring-unit">ккал</span>
        </div>
      </div>
      
      <!-- Exercise Ring (Exercise Load) -->
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
          <span class="ring-value">{formatValue(activityData.exercise.value)}</span>
          <span class="ring-unit">мин</span>
        </div>
      </div>
      
      <!-- Stand Ring (Sleep Hours) -->
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
          <span class="ring-value">{formatSleepTime(activityData.stand.value)}</span>
          <span class="ring-unit">Время</span>
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
    
    <!-- Progress bar (Steps) -->
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" style="width: {stepsPercentage}%;"></div>
        <span class="progress-bar-text">{stepsData.value.toLocaleString()}</span>
      </div>
      <p class="progress-text">{stepsData.value.toLocaleString()} / {stepsData.goal.toLocaleString()} шагов</p>
    </div>
    
    <!-- Step count display -->

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

<style>
  /* Activity rings container */
  .activity-rings-container {
    width: 100%;
    max-width: min(100%, clamp(300px, 85vw, 600px));
    margin: 0 auto var(--element-spacing);
    padding: clamp(15px, 3vw, 30px);
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(51, 51, 51, 0.3));
    backdrop-filter: blur(5px);
    border-radius: var(--border-radius);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 191, 255, 0.2);
    position: relative;
  }
  
  /* Rings header with title and calendar button */
  .rings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: clamp(15px, 2vw, 30px);
  }
  
  .rings-title {
    text-align: center;
    font-size: clamp(1.2rem, 3vw, 1.8rem);
    font-weight: 700;
    color: var(--white);
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
  }
  
  .calendar-button {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.2));
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    width: clamp(36px, 6vw, 50px);
    height: clamp(36px, 6vw, 50px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
  }
  
  .calendar-button:hover {
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
    transform: scale(1.1);
  }
  
  .calendar-button svg {
    width: clamp(20px, 4vw, 24px);
    height: clamp(20px, 4vw, 24px);
    color: var(--white);
  }
  
  /* Rings wrapper */
  .rings-wrapper {
    display: flex;
    justify-content: center;
    gap: clamp(15px, 4vw, 30px);
    margin-bottom: clamp(20px, 3vw, 40px);
  }
  
  .ring-container {
    position: relative;
    width: clamp(80px, 20vw, 120px);
    height: clamp(80px, 20vw, 120px);
  }
  
  .ring {
    transform: rotate(-90deg);
  }
  
  .ring-background {
    stroke: rgba(255, 255, 255, 0.1);
  }
  
  .ring-progress {
    transition: stroke-dashoffset 0.5s ease;
  }
  
  .ring-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  
  .ring-value {
    display: block;
    font-size: clamp(1rem, 3vw, 1.5rem);
    font-weight: 800;
    color: var(--white);
  }
  
  .ring-unit {
    display: block;
    font-size: clamp(0.6rem, 1.5vw, 0.8rem);
    color: var(--light-gray);
  }
  
  /* Rings legend */
  .rings-legend {
    display: flex;
    justify-content: center;
    gap: clamp(15px, 3vw, 30px);
    margin-bottom: clamp(20px, 3vw, 30px);
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: clamp(5px, 1vw, 8px);
  }
  
  .legend-color {
    width: clamp(12px, 2vw, 16px);
    height: clamp(12px, 2vw, 16px);
    border-radius: 50%;
  }
  
  .legend-text {
    font-size: clamp(0.8rem, 2vw, 1rem);
    color: var(--light-gray);
  }
  
  /* Progress bar */
  .progress-container {
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: clamp(5px, 1vw, 10px);
    overflow: hidden;
    height: clamp(12px, 2vw, 20px);
    margin-bottom: clamp(10px, 1.5vw, 15px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: relative; /* Added for positioning the text */
  }
  
  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-pink));
    border-radius: clamp(5px, 1vw, 10px);
    position: relative;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-pink));
    border-radius: clamp(5px, 1vw, 10px);
  }
  
  /* Added style for text inside progress bar */
  .progress-bar-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: clamp(0.7rem, 1.5vw, 0.9rem);
    font-weight: 700;
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
    z-index: 2;
    white-space: nowrap;
  }
  
  .progress-text {
    text-align: center;
    font-size: clamp(0.8rem, 2vw, 1rem);
    color: var(--light-gray);
  }
  
  /* Steps count display */
  .steps-count-display {
    text-align: center;
    margin-top: clamp(10px, 2vw, 20px);
  }
  
  .steps-count {
    font-size: clamp(1rem, 2.5vw, 1.5rem);
    font-weight: 800;
    color: var(--white);
    margin: 0;
  }
  
  .steps-label {
    font-size: clamp(0.9rem, 2vw, 1.2rem);
    color: var(--light-gray);
    margin: 0;
  }
  
  /* Coffee button */
  .coffee-button {
    display: flex;
    align-items: center;
    gap: clamp(8px, 2vw, 15px);
    background: linear-gradient(135deg, var(--deep-black), #333333);
    border: clamp(1.5px, 0.2vw, 3px) solid var(--primary-pink);
    border-radius: clamp(10px, 2vw, 20px);
    padding: clamp(12px, 2.5vw, 20px) clamp(20px, 4vw, 40px);
    color: #FFFFFF;
    font-weight: 700;
    font-size: clamp(0.9rem, 2.5vw, 1.2rem);
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px) rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: clamp(250px, 50vw, 400px);
    margin: 0 auto clamp(20px, 3vw, 30px);
  }
  
  .coffee-button:hover {
    background: linear-gradient(135deg, #333333, var(--deep-black));
    transform: translateY(-3px);
    box-shadow: 0 clamp(6px, 1.5vw, 12px) clamp(12px, 3vw, 20px) rgba(0, 0, 0, 0.4);
    border-color: var(--primary-blue);
  }
  
  .coffee-button:active {
    transform: translateY(1px);
    box-shadow: 0 clamp(2px, 0.5vw, 4px) clamp(4px, 1vw, 8px) rgba(0, 0, 0, 0.3);
  }
  
  /* Training date */
  .training-date {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(8px, 1.5vw, 15px);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.1));
    padding: clamp(12px, 2vw, 20px) clamp(20px, 3vw, 30px);
    border-radius: clamp(10px, 2vw, 20px);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
    max-width: clamp(280px, 60vw, 500px);
    margin: 0 auto clamp(20px, 3vw, 30px);
  }
  
  .training-date p {
    font-size: clamp(0.9rem, 2.5vw, 1.2rem);
    color: var(--light-gray);
    font-weight: 500;
  }
  
  .details-button {
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-pink));
    border: none;
    border-radius: clamp(8px, 1.5vw, 15px);
    padding: clamp(8px, 1.5vw, 15px) clamp(15px, 2.5vw, 25px);
    color: white;
    font-weight: 700;
    font-size: clamp(0.8rem, 2vw, 1rem);
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 clamp(3px, 0.8vw, 6px) clamp(6px, 1.5vw, 10px) rgba(0, 0, 0, 0.2);
  }
  
  .details-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 clamp(4px, 1vw, 8px) clamp(8px, 2vw, 15px) rgba(0, 0, 0, 0.3);
    background: linear-gradient(90deg, var(--primary-pink), var(--primary-blue));
  }
  
  .details-button:active {
    transform: translateY(1px);
    box-shadow: 0 clamp(1.5px, 0.4vw, 3px) clamp(3px, 0.8vw, 6px) rgba(0, 0, 0, 0.2);
  }
  
  /* Dashboard actions */
  .dashboard-actions {
    display: flex;
    flex-direction: column;
    gap: clamp(10px, 2vw, 20px);
    width: 100%;
    max-width: clamp(250px, 50vw, 350px);
    margin: 0 auto;
    align-items: center;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .rings-wrapper {
      gap: clamp(10px, 2vw, 20px);
    }
    
    .ring-container {
      width: clamp(70px, 18vw, 100px);
      height: clamp(70px, 18vw, 100px);
    }
  }
  
  @media (max-width: 480px) {
    .rings-title {
      font-size: clamp(1rem, 3vw, 1.5rem);
      margin-bottom: clamp(12px, 1.5vw, 20px);
    }
    
    .rings-wrapper {
      gap: clamp(8px, 2vw, 15px);
    }
    
    .ring-container {
      width: clamp(60px, 16vw, 85px);
      height: clamp(60px, 16vw, 85px);
    }
    
    .ring-value {
      font-size: clamp(0.9rem, 3vw, 1.3rem);
    }
    
    .legend-text {
      font-size: clamp(0.7rem, 2vw, 0.9rem);
    }
  }
</style>
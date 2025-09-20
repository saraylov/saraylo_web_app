<script lang="ts">
  import { onMount } from 'svelte';
  import { loadDailyData, formatDate } from './utils/dataStorage';
  
  // Navigation handlers passed from parent
  export let handleBackToDashboard;
  export let handleHealthClick;
  export let handleTrainingClick;
  export let handleDevicesClick;
  export let handleProfileClick;
  export let handleSettingsClick;
  
  // Calendar state
  let currentDate = new Date();
  let selectedDate = new Date();
  
  // Popup state
  let showPopup = false;
  let popupDate = new Date();
  
  // Activity data for selected date
  let selectedActivityData = {
    move: { value: 0, goal: 500, color: '#00BFFF' }, // calories
    exercise: { value: 0, goal: 60, color: '#FF1493' }, // exercise minutes
    stand: { value: 0, goal: 12, color: '#00FF00' } // sleep hours
  };
  
  // Steps data for selected date
  let selectedStepsData = {
    value: 0,
    goal: 50000
  };
  
  // Generate calendar days
  function getCalendarDays() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // Days from previous month to show
    // Исправлено: правильно определяем день недели для первого дня месяца
    const firstDayOfWeek = firstDay.getDay();
    // В России неделя начинается с понедельника (1), а не с воскресенья (0)
    // Для понедельника (1) нужно 0 дней предыдущего месяца
    // Для воскресенья (0) нужно 6 дней предыдущего месяца
    // Исправлено: учитываем, что getDay() возвращает 0 для воскресенья, но у нас понедельник первый
    const prevMonthDays = (firstDayOfWeek + 6) % 7;
    // Days from next month to show
    const nextMonthDays = 42 - lastDay.getDate() - prevMonthDays;
    
    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = prevMonthDays; i > 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i + 1),
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Next month days
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  }
  
  // Navigation functions
  function prevMonth() {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  }
  
  function nextMonth() {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  }
  
  function goToToday() {
    currentDate = new Date();
    selectedDate = new Date();
  }
  
  // Handle date selection
  function handleDateSelect(date: Date) {
    selectedDate = date;
    popupDate = date;
    
    // Load data for the selected date
    const dateStr = formatDate(date);
    const savedData = loadDailyData(dateStr);
    
    if (savedData) {
      // Use saved data
      selectedActivityData = savedData.activity;
      selectedStepsData = savedData.steps;
    } else {
      // If no saved data exists, show empty/default values instead of mock data
      selectedActivityData = {
        move: { 
          value: 0, 
          goal: 500, 
          color: '#00BFFF' 
        },
        exercise: { 
          value: 0, 
          goal: 60, 
          color: '#FF1493' 
        },
        stand: { 
          value: 0, 
          goal: 12, 
          color: '#00FF00' 
        }
      };
      
      selectedStepsData = {
        value: 0,
        goal: 50000
      };
    }
    
    // Show popup with selected date info
    showPopup = true;
  }
  
  // Close popup
  function closePopup() {
    showPopup = false;
  }
  
  // Format month and year for display
  function getMonthYearString() {
    return currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  }
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
      <h1 class="dashboard-title">Статистика</h1>
      <div 
        class="header-icon"
        on:click={handleBackToDashboard}
        on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBackToDashboard(); }}
        role="button"
        tabindex="0"
        aria-label="Закрыть календарь"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    
    <!-- Calendar content -->
    <div class="dashboard-main">
      <!-- Calendar navigation -->
      <div class="calendar-nav-container">
        <button class="calendar-nav-button" on:click={prevMonth}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <h2 class="calendar-month-title">{getMonthYearString()}</h2>
        
        <button class="calendar-nav-button" on:click={nextMonth}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Calendar grid -->
      <div class="calendar-grid-container">
        <!-- Day headers -->
        <div class="calendar-day-headers">
          <div class="calendar-day-header">Пн</div>
          <div class="calendar-day-header">Вт</div>
          <div class="calendar-day-header">Ср</div>
          <div class="calendar-day-header">Чт</div>
          <div class="calendar-day-header">Пт</div>
          <div class="calendar-day-header">Сб</div>
          <div class="calendar-day-header">Вс</div>
        </div>
        
        <!-- Calendar days -->
        <div class="calendar-days-grid">
          {#each getCalendarDays() as day (day.date)}
            <div 
              class="calendar-day {day.isCurrentMonth ? '' : 'empty'} {day.date.toDateString() === selectedDate.toDateString() ? 'selected' : ''}"
              class:selected={day.date.toDateString() === selectedDate.toDateString()}
              on:click={() => day.isCurrentMonth && handleDateSelect(day.date)}
            >
              {day.date.getDate()}
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Popup overlay for selected date info -->
{#if showPopup}
  <div class="popup-overlay" on:click={closePopup}>
    <div class="popup-content" on:click|stopPropagation>
      <div class="popup-header">
        <h3 class="selected-date-title">
          {popupDate.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
        </h3>
        <button class="close-button" on:click={closePopup}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Activity Rings for selected date -->
      <div class="activity-rings-container">
        <h2 class="rings-title">Активность</h2>
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
                stroke={selectedActivityData.move.color} 
                stroke-width="10"
                stroke-dasharray="314.16"
                stroke-dashoffset={314.16 - (314.16 * Math.min(selectedActivityData.move.value / selectedActivityData.move.goal, 1))}
                stroke-linecap="round"
              />
            </svg>
            <div class="ring-label">
              <span class="ring-value">{selectedActivityData.move.value}</span>
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
                stroke={selectedActivityData.exercise.color} 
                stroke-width="10"
                stroke-dasharray="314.16"
                stroke-dashoffset={314.16 - (314.16 * Math.min(selectedActivityData.exercise.value / selectedActivityData.exercise.goal, 1))}
                stroke-linecap="round"
              />
            </svg>
            <div class="ring-label">
              <span class="ring-value">{selectedActivityData.exercise.value}</span>
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
                stroke={selectedActivityData.stand.color} 
                stroke-width="10"
                stroke-dasharray="314.16"
                stroke-dashoffset={314.16 - (314.16 * Math.min(selectedActivityData.stand.value / selectedActivityData.stand.goal, 1))}
                stroke-linecap="round"
              />
            </svg>
            <div class="ring-label">
              <span class="ring-value">{selectedActivityData.stand.value}</span>
              <span class="ring-unit">ч</span>
            </div>
          </div>
        </div>
        
        <!-- Rings Legend -->
        <div class="rings-legend">
          <div class="legend-item">
            <div class="legend-color" style="background-color: {selectedActivityData.move.color};"></div>
            <span class="legend-text">Затрата</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: {selectedActivityData.exercise.color};"></div>
            <span class="legend-text">Нагрузка</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: {selectedActivityData.stand.color};"></div>
            <span class="legend-text">Сон</span>
          </div>
        </div>
        
        <!-- Progress bar (Steps) -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width: {Math.min(100, (selectedStepsData.value / 50000) * 100)}%;"></div>
            <span class="progress-bar-text">{selectedStepsData.value.toLocaleString()}</span>
          </div>
          <p class="progress-text">{selectedStepsData.value.toLocaleString()} / {selectedStepsData.goal.toLocaleString()} шагов</p>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Import global styles */
  @import './app.css';
  
  /* Calendar navigation */
  .calendar-nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: clamp(20px, 3vw, 30px);
    padding: 0 clamp(10px, 2vw, 20px);
  }
  
  .calendar-nav-button {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.2));
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    width: clamp(36px, 6vw, 50px);
    height: clamp(36px, 6vw, 50px);
    min-width: clamp(36px, 6vw, 50px);
    min-height: clamp(36px, 6vw, 50px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
    aspect-ratio: 1;
    box-sizing: border-box;
    flex-shrink: 0; /* Prevent shrinking */
  }
  
  .calendar-nav-button:hover {
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
    transform: scale(1.1);
  }
  
  .calendar-nav-button svg {
    width: clamp(20px, 4vw, 24px);
    height: clamp(20px, 4vw, 24px);
    color: var(--white);
  }
  
  .calendar-month-title {
    font-size: clamp(1.3rem, 3vw, 1.8rem);
    font-weight: 700;
    color: var(--white);
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
    margin: 0;
  }
  
  /* Calendar grid */
  .calendar-grid-container {
    margin-bottom: clamp(20px, 3vw, 30px);
    /* Ensure the calendar grid takes up available space without scrolling */
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0; /* Allow flex children to shrink below their content size */
    
    /* Allow flexible scaling */
    width: 100%;
    
    /* Ensure calendar scales proportionally */
    max-height: 100%;
  }
  
  .calendar-day-headers {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: clamp(5px, 1vw, 8px);
    margin-bottom: clamp(10px, 1.5vw, 15px);
    
    /* Ensure proper scaling on all screen sizes */
    width: 100%;
    /* Center the header items to align with calendar days */
    justify-items: center;
  }
  
  .calendar-day-header {
    text-align: center;
    font-size: clamp(0.8rem, 1.8vw, 1rem);
    font-weight: 600;
    color: var(--light-gray);
    padding: clamp(8px, 1.5vw, 12px) 0;
    
    /* Ensure proper scaling on all screen sizes */
    min-width: 50px;
    width: 50px;
    text-align: center;
  }
  
  .calendar-days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: clamp(5px, 1vw, 8px);
    flex: 1;
    min-height: 0; /* Allow flex children to shrink below their content size */
    
    /* Ensure proper scaling on all screen sizes */
    width: 100%;
    max-height: 100%;
    /* Center the grid items */
    justify-items: center;
  }
  
  .calendar-day {
    text-align: center;
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    /* Fixed size for perfect circles - 50x50 pixels */
    width: 50px;
    height: 50px;
    min-width: 50px;
    min-height: 50px;
    max-width: 50px;
    max-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--white);
    font-weight: 500;
    /* Remove responsive sizing that was causing issues */
  }
  
  .calendar-day:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .calendar-day.selected {
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
  }
  
  .calendar-day.empty {
    display: none;
  }
  
  /* Popup overlay */
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
  }
  
  .popup-content {
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: var(--border-radius);
    border: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow);
    padding: clamp(20px, 4vw, 40px);
    width: min(100%, clamp(300px, 90vw, 800px));
    max-width: 750px;
    animation: fadeIn 0.3s ease-out;
    position: relative;
    
    /* Ensure proportional scaling */
    max-height: 90vh;
    width: 90vw;
    overflow-y: auto;
  }
  
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: clamp(20px, 3vw, 30px);
  }
  
  .close-button {
    background: transparent;
    border: none;
    color: var(--white);
    cursor: pointer;
    padding: clamp(5px, 1vw, 10px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
  }
  
  .close-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  /* Selected date info */
  .selected-date-info {
    margin-bottom: clamp(20px, 3vw, 30px);
    text-align: center;
  }
  
  .selected-date-title {
    font-size: clamp(1.2rem, 3vw, 1.6rem);
    font-weight: 700;
    color: var(--white);
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
  }
  
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
    
    /* Allow flexible scaling */
    width: 100%;
  }
  
  .rings-title {
    text-align: center;
    font-size: clamp(1.2rem, 3vw, 1.8rem);
    font-weight: 700;
    margin-bottom: clamp(15px, 2vw, 30px);
    color: var(--white);
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
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
    
    /* Ensure proportional scaling */
    aspect-ratio: 1 / 1;
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
    .calendar-nav-container {
      margin-bottom: clamp(15px, 2vw, 25px);
    }
    
    .calendar-day-header {
      font-size: clamp(0.7rem, 1.5vw, 0.9rem);
      padding: clamp(6px, 1.2vw, 10px) 0;
    }
    
    .calendar-day {
      font-size: clamp(0.8rem, 1.8vw, 1rem);
    }
    
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
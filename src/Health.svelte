<script>
  // Handle back to dashboard
  export let handleBackToDashboard;
  
  // Navigation handlers
  export let handleHealthClick;
  export let handleTrainingClick;
  export let handleDevicesClick;
  export let handleProfileClick;
  
  // Данные для колец активности
  let activityData = {
    move: { value: 450, goal: 500, color: '#00BFFF' },
    exercise: { value: 30, goal: 60, color: '#FF1493' },
    stand: { value: 8, goal: 12, color: '#00FF00' }
  };
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

<div class="container">
  <div class="glass-panel">
    <!-- Header -->
    <div class="dashboard-header">
      <div 
        class="header-icon" 
        on:click={handleBackToDashboard}
        on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBackToDashboard(); }}
        role="button"
        tabindex="0"
        aria-label="Назад к статистике"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5" stroke="var(--primary-blue)" stroke-width="2" stroke-linecap="round"/>
          <path d="M12 19L5 12L12 5" stroke="var(--primary-blue)" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <h1 class="dashboard-title">Здоровье</h1>
      <div 
        class="header-icon"
        on:click={() => console.log('Refresh health data')}
        on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') console.log('Refresh health data'); }}
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
      <!-- Кольца активности -->
      <div class="activity-rings-container">
        <h2 class="rings-title">Активность</h2>
        <div class="rings-wrapper">
          <!-- Кольцо "Перемещение" -->
          <div class="ring-container">
            <svg class="ring" width="120" height="120" viewBox="0 0 120 120">
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
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div class="ring-label">
              <span class="ring-value">{activityData.move.value}</span>
              <span class="ring-unit">ккал</span>
            </div>
          </div>
          
          <!-- Кольцо "Упражнения" -->
          <div class="ring-container">
            <svg class="ring" width="120" height="120" viewBox="0 0 120 120">
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
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div class="ring-label">
              <span class="ring-value">{activityData.exercise.value}</span>
              <span class="ring-unit">мин</span>
            </div>
          </div>
          
          <!-- Кольцо "Стояние" -->
          <div class="ring-container">
            <svg class="ring" width="120" height="120" viewBox="0 0 120 120">
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
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div class="ring-label">
              <span class="ring-value">{activityData.stand.value}</span>
              <span class="ring-unit">ч</span>
            </div>
          </div>
        </div>
        
        <!-- Легенда колец -->
        <div class="rings-legend">
          <div class="legend-item">
            <div class="legend-color" style="background-color: {activityData.move.color};"></div>
            <span class="legend-text">Перемещение</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: {activityData.exercise.color};"></div>
            <span class="legend-text">Упражнения</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: {activityData.stand.color};"></div>
            <span class="legend-text">Стояние</span>
          </div>
        </div>
      </div>
      
      <div class="health-grid">
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
            <div class="heart-rate-value">80 <span>уд/мин</span></div>
            <div class="chart-placeholder">
              <!-- Heart rate chart would go here -->
              <div class="chart-line"></div>
            </div>
          </div>
        </div>
        
        <!-- Blood Pressure Panel -->
        <div class="health-panel">
          <div class="panel-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
              <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <h3>Давление</h3>
          </div>
          <div class="panel-content">
            <div class="bp-value">120/80 <span>мм рт. ст.</span></div>
            <div class="chart-placeholder">
              <!-- Blood pressure chart would go here -->
              <div class="chart-line"></div>
            </div>
          </div>
        </div>
        
        <!-- Sleep Quality Panel -->
        <div class="health-panel">
          <div class="panel-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h3>Сон</h3>
          </div>
          <div class="panel-content">
            <div class="sleep-value">7.5 <span>часов</span></div>
            <div class="chart-placeholder">
              <!-- Sleep quality chart would go here -->
              <div class="chart-line"></div>
            </div>
          </div>
        </div>
        
        <!-- Steps Panel -->
        <div class="health-panel">
          <div class="panel-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <h3>Шаги</h3>
          </div>
          <div class="panel-content">
            <div class="steps-value">8,500</div>
            <div class="chart-placeholder">
              <!-- Steps chart would go here -->
              <div class="chart-line"></div>
            </div>
          </div>
        </div>
        
        <!-- Calories Panel -->
        <div class="health-panel">
          <div class="panel-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" stroke="currentColor" stroke-width="2"/>
              <path d="M10 20C10 18.9 10.9 18 12 18C13.1 18 14 18.9 14 20C14 21.1 13.1 22 12 22C10.9 22 10 21.1 10 20Z" stroke="currentColor" stroke-width="2"/>
              <path d="M4 12C4 10.9 4.9 10 6 10C7.1 10 8 10.9 8 12C8 13.1 7.1 14 6 14C4.9 14 4 13.1 4 12Z" stroke="currentColor" stroke-width="2"/>
              <path d="M16 12C16 10.9 16.9 10 18 10C19.1 10 20 10.9 20 12C20 13.1 19.1 22 18 22C16.9 22 16 21.1 16 20Z" stroke="currentColor" stroke-width="2"/>
            </svg>
            <h3>Калории</h3>
          </div>
          <div class="panel-content">
            <div class="calories-value">1,850 <span>ккал</span></div>
            <div class="chart-placeholder">
              <!-- Calories chart would go here -->
              <div class="chart-line"></div>
            </div>
          </div>
        </div>
        
        <!-- Hydration Panel -->
        <div class="health-panel">
          <div class="panel-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
              <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <h3>Вода</h3>
          </div>
          <div class="panel-content">
            <div class="hydration-value">1.8 <span>л</span></div>
            <div class="chart-placeholder">
              <!-- Hydration chart would go here -->
              <div class="chart-line"></div>
            </div>
          </div>
        </div>
        
        <!-- Stress Level Panel -->
        <div class="health-panel">
          <div class="panel-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M9 9h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M15 9h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <h3>Стресс</h3>
          </div>
          <div class="panel-content">
            <div class="stress-value">Низкий</div>
            <div class="chart-placeholder">
              <!-- Stress level chart would go here -->
              <div class="chart-line"></div>
            </div>
          </div>
        </div>
        
        <!-- Body Temperature Panel -->
        <div class="health-panel">
          <div class="panel-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" stroke="currentColor" stroke-width="2"/>
            </svg>
            <h3>Температура</h3>
          </div>
          <div class="panel-content">
            <div class="temp-value">36.6 <span>°C</span></div>
            <div class="chart-placeholder">
              <!-- Temperature chart would go here -->
              <div class="chart-line"></div>
            </div>
          </div>
        </div>
        
        <!-- Oxygen Saturation Panel -->
        <div class="health-panel">
          <div class="panel-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 12H22M2 12H7M12 2V7M12 17V22M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <h3>Кислород</h3>
          </div>
          <div class="panel-content">
            <div class="oxygen-value">98 <span>%</span></div>
            <div class="chart-placeholder">
              <!-- Oxygen saturation chart would go here -->
              <div class="chart-line"></div>
            </div>
          </div>
        </div>
        
        <!-- Activity Level Panel -->
        <div class="health-panel">
          <div class="panel-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h3>Активность</h3>
          </div>
          <div class="panel-content">
            <div class="activity-value">Высокая</div>
            <div class="chart-placeholder">
              <!-- Activity level chart would go here -->
              <div class="chart-line"></div>
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
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
          <path d="M4.35 7.17C5.05 5.07 7.28 3.5 9.95 3.5H14.05C16.72 3.5 18.95 5.07 19.65 7.17L21.28 12.07C21.66 13.22 21.85 13.8 21.71 14.29C21.57 14.77 21.13 15.11 20.25 15.79L18.5 17.15C16.5 18.7 15.5 19.47 14.36 19.73C13.22 19.99 12.08 19.99 10.94 19.73C9.8 19.47 8.8 18.7 6.8 17.15L5.05 15.79C4.17 15.11 3.73 14.77 3.59 14.29C3.45 13.8 3.64 13.22 4.02 12.07L4.35 7.17Z" stroke="currentColor" stroke-width="2"/>
          <path d="M9 11L11 13L15 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Здоровье</span>
      </div>
      <div class="nav-item nav-item-center">
        <div 
          class="circle-button" 
          on:click={handleTrainingClick}
          on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTrainingClick(); }}
          role="button"
          tabindex="0"
          aria-label="Начать тренировку"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2"/>
            <path d="M19.4 15C19.2667 15.4 18.9 16 18 16.5C17.1 17 16.0667 17.2667 15 17.3C13.9333 17.2667 12.9 17 12 16.5C11.1 16 10.7333 15.4 10.6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 9C12.9 8.5 13.9333 8.23333 15 8.2C16.0667 8.23333 17.1 8.5 18 9C18.9 9.5 19.2667 10.1 19.4 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M4.6 15C4.73333 14.6 5.1 14 6 13.5C6.9 13 7.93333 12.7333 9 12.7C10.0667 12.7333 11.1 13 12 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 15C11.1 15.5 10.0667 15.7667 9 15.8C7.93333 15.7667 6.9 15.5 6 15C5.1 14.5 4.73333 13.9 4.6 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2"/>
          <path d="M23 20.9999V18.9999C22.9993 18.1136 22.7044 17.2527 22.1614 16.5522C21.6184 15.8517 20.8581 15.3515 20 15.1299" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M16 3.12988C16.8604 3.35143 17.623 3.85051 18.1693 4.54956C18.7156 5.24861 19.0147 6.10829 19.02 7.00488" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
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
</div>

<style>
  /* Import global styles */
  @import './app.css';
  
  /* Activity Rings Styles */
  .activity-rings-container {
    width: 100%;
    max-width: 500px;
    margin: 0 auto 30px;
    padding: 20px;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(51, 51, 51, 0.3));
    backdrop-filter: blur(5px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 191, 255, 0.2);
  }
  
  .rings-title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 25px;
    color: var(--white);
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .rings-wrapper {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 25px;
  }
  
  .ring-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .ring {
    transform: rotate(-90deg);
  }
  
  .ring-progress {
    transition: stroke-dashoffset 1s ease-in-out;
  }
  
  .ring-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(90deg);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .ring-value {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--white);
  }
  
  .ring-unit {
    font-size: 0.8rem;
    color: var(--light-gray);
  }
  
  .rings-legend {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .legend-color {
    width: 15px;
    height: 15px;
    border-radius: 50%;
  }
  
  .legend-text {
    font-size: 0.9rem;
    color: var(--light-gray);
  }
  
  /* Адаптивный дизайн */
  @media (max-width: 768px) {
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
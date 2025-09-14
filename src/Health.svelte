<script>
  // Handle back to dashboard
  export let handleBackToDashboard;
  
  // Navigation handlers
  export let handleHealthClick;
  export let handleTrainingClick;
  export let handleDevicesClick;
  export let handleProfileClick;
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
</div>

<style>
  /* Import global styles */
  @import './app.css';
  
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
<script>
  import Button from './Button.svelte';
  
  /** @type {{id?: number, first_name: string, last_name?: string, username?: string} | null} */
  export let userData = {
    id: 123456789,
    first_name: 'Тестовый',
    last_name: 'Пользователь',
    username: 'testuser'
  };
  
  // Handle back to dashboard
  export let handleBackToDashboard;
  
  // Navigation handlers
  export let handleHealthClick;
  export let handleTrainingClick;
  export let handleDevicesClick;
  export let handleProfileClick;
  
  // Settings state
  let notificationsEnabled = true;
  let darkMode = true;
  let language = 'ru';
  let units = 'metric';
  let weeklyGoal = 50;
  let sendDataToCloud = true;
  
  // Function to save settings
  function saveSettings() {
    console.log('Settings saved:', {
      notificationsEnabled,
      darkMode,
      language,
      units,
      weeklyGoal,
      sendDataToCloud
    });
    // In a real app, you would save these settings to localStorage or a backend
  }
  
  // Function to reset settings to defaults
  function resetSettings() {
    notificationsEnabled = true;
    darkMode = true;
    language = 'ru';
    units = 'metric';
    weeklyGoal = 50;
    sendDataToCloud = true;
    console.log('Settings reset to defaults');
  }
  
  // Function to clear data
  function clearData() {
    if (confirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.')) {
      console.log('User data cleared');
      // In a real app, you would clear user data here
    }
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
      <h1 class="dashboard-title">Настройки</h1>
      <div class="header-icon">
        <img src="/images/111.png" alt="Настройки" width="24" height="24" />
      </div>
    </div>
    
    <!-- Settings content -->
    <div class="dashboard-main">
      <div class="settings-section">
        <h2>Основные настройки</h2>
        
        <div class="setting-item">
          <label for="notifications">Уведомления</label>
          <div class="toggle-switch">
            <input 
              type="checkbox" 
              id="notifications" 
              bind:checked={notificationsEnabled}
            >
            <label for="notifications" class="toggle-label">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
        
        <div class="setting-item">
          <label for="dark-mode">Темная тема</label>
          <div class="toggle-switch">
            <input 
              type="checkbox" 
              id="dark-mode" 
              bind:checked={darkMode}
            >
            <label for="dark-mode" class="toggle-label">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
        
        <div class="setting-item">
          <label for="language">Язык</label>
          <select id="language" bind:value={language}>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>
        
        <div class="setting-item">
          <label for="units">Единицы измерения</label>
          <select id="units" bind:value={units}>
            <option value="metric">Метрические (км, кг)</option>
            <option value="imperial">Имперские (мили, фунты)</option>
          </select>
        </div>
      </div>
      
      <div class="settings-section">
        <h2>Цели</h2>
        
        <div class="setting-item">
          <label for="weekly-goal">Еженедельная цель (км)</label>
          <input 
            type="range" 
            id="weekly-goal" 
            min="10" 
            max="100" 
            step="5" 
            bind:value={weeklyGoal}
          >
          <div class="range-value">{weeklyGoal} км</div>
        </div>
      </div>
      
      <div class="settings-section">
        <h2>Синхронизация</h2>
        
        <div class="setting-item">
          <label for="cloud-sync">Отправлять данные в облако</label>
          <div class="toggle-switch">
            <input 
              type="checkbox" 
              id="cloud-sync" 
              bind:checked={sendDataToCloud}
            >
            <label for="cloud-sync" class="toggle-label">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
      
      <div class="settings-section">
        <h2>Данные</h2>
        
        <div class="setting-item">
          <Button on:click={saveSettings} variant="primary">
            Сохранить настройки
          </Button>
        </div>
        
        <div class="setting-item">
          <Button on:click={resetSettings} variant="secondary">
            Сбросить настройки
          </Button>
        </div>
        
        <div class="setting-item">
          <Button on:click={clearData} variant="danger">
            Очистить данные
          </Button>
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
        <img src="/images/Graf.png" alt="Статистика" width="24" height="24" />
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
          <path d="M12 2C12 2 7 3 7 6C7 9 12 11 12 11C12 11 17 9 17 6C17 3 12 2 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19 13.5V16C19 18.2091 17.2091 20 15 20H9C6.79086 20 5 18.2091 5 16V13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 11V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 16H8.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 16H16.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
  
  /* Settings specific styles */
  .settings-section {
    width: 100%;
    max-width: 500px;
    margin: 0 auto 30px;
    padding: 20px;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(51, 51, 51, 0.2));
    backdrop-filter: blur(5px);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .settings-section h2 {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--white);
    text-align: center;
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .setting-item {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .setting-item label {
    font-size: 1rem;
    color: var(--white);
    font-weight: 500;
  }
  
  .setting-item select,
  .setting-item input[type="range"] {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--white);
    font-size: 1rem;
  }
  
  .setting-item input[type="range"] {
    padding: 0;
  }
  
  .range-value {
    text-align: center;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--white);
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* Toggle switch styles */
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
  }
  
  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .toggle-label {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: .4s;
    border-radius: 30px;
  }
  
  .toggle-slider {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 3px;
    background: var(--light-gray);
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .toggle-label {
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-pink));
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  input:checked + .toggle-label .toggle-slider {
    background: var(--white);
    transform: translateX(30px);
  }
  
  /* Action buttons */
  .action-button {
    width: 100%;
    padding: 15px;
    border-radius: 15px;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-pink));
    color: var(--white);
    box-shadow: 0 4px 15px rgba(0, 191, 255, 0.3);
  }
  
  .action-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 191, 255, 0.5);
  }
  
  .action-button.secondary {
    background: linear-gradient(90deg, #6c757d, #495057);
    box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
  }
  
  .action-button.secondary:hover {
    box-shadow: 0 6px 20px rgba(108, 117, 125, 0.5);
  }
  
  .action-button.danger {
    background: linear-gradient(90deg, #dc3545, #c82333);
    box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
  }
  
  .action-button.danger:hover {
    box-shadow: 0 6px 20px rgba(220, 53, 69, 0.5);
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .settings-section {
      padding: 15px;
      margin-bottom: 20px;
    }
    
    .settings-section h2 {
      font-size: 1.2rem;
      margin-bottom: 15px;
    }
    
    .setting-item {
      margin-bottom: 15px;
    }
    
    .setting-item label {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 480px) {
    .settings-section {
      padding: 12px;
      margin-bottom: 15px;
    }
    
    .setting-item {
      margin-bottom: 12px;
    }
    
    .action-button {
      padding: 12px;
      font-size: 0.9rem;
    }
  }
</style>
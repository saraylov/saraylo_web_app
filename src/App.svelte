<script>
  import { onMount } from 'svelte';
  import './app.css';
  import Profile from './Profile.svelte';
  import Training from './Training.svelte';
  import Devices from './Devices.svelte';
  import Health from './Health.svelte';
  import Settings from './Settings.svelte';
  
  /** @type {boolean} */
  let isAuthorized = true; // Временно установим в true для обхода авторизации
  /** @type {string} */
  let authStatus = '';
  /** @type {boolean} */
  let isLoading = false;
  /** @type {{id?: number, first_name: string, last_name?: string, username?: string} | null} */
  let userData = {
    id: 123456789,
    first_name: 'Тестовый',
    last_name: 'Пользователь',
    username: 'testuser'
  };
  /** @type {string} */
  let currentView = 'dashboard'; // Всегда показываем dashboard
  /** @type {boolean} */
  let showTelegramWidget = false;
  
  // Activity rings data
  let activityData = {
    move: { value: 450, goal: 500, color: '#00BFFF' },
    exercise: { value: 30, goal: 60, color: '#FF1493' },
    stand: { value: 8, goal: 12, color: '#00FF00' }
  };
  
  // Helper function to check if in training mode
  function isInTrainingMode() {
    return currentView === 'training';
  }
  
  // Handle logout
  function handleLogout() {
    // Временно отключим logout
    console.log('Logout temporarily disabled');
  }
  
  // Handle add button click
  function handleAddClick() {
    console.log('Add button clicked');
    // TODO: Implement add functionality
  }
  
  // Handle details button click
  function handleDetailsClick() {
    console.log('Details button clicked');
    // TODO: Implement details functionality
  }
  
  // Handle popstate events for browser navigation
  function handlePopState() {
    currentView = 'dashboard';
  }
  
  // Initialize
  onMount(() => {
    // Add event listener for browser navigation (back/forward buttons)
    window.addEventListener('popstate', handlePopState);
    
    // Always show dashboard
    currentView = 'dashboard';
    authStatus = 'Production by V Saraylo';
    
    // Cleanup event listeners
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  });
  
  // Watch for changes in showTelegramWidget
  $: if (showTelegramWidget) {
    // Temporarily disabled since loadTelegramWidget function is not defined
  }
  
  // Function to trigger Telegram Login Widget
  function handleTelegramAuth() {
    showTelegramWidget = true;
  }
  
  // Handle training button click
  function handleTrainingClick() {
    currentView = 'training';
  }
  
  // Handle back to dashboard from training
  function handleBackToDashboard() {
    currentView = 'dashboard';
  }
  
  // Handle profile navigation
  function handleProfileClick() {
    currentView = 'profile';
  }
  
  // Handle devices navigation
  function handleDevicesClick() {
    currentView = 'devices';
  }
  
  // Handle health navigation
  function handleHealthClick() {
    currentView = 'health';
  }
  
  // Handle settings navigation
  function handleSettingsClick() {
    currentView = 'settings';
  }
</script>

<svelte:head>
  <title>SARAYLO</title>
  <script>
    function onTelegramAuth(user) {
      // Dispatch event to Svelte component
      window.dispatchEvent(new CustomEvent('telegramAuth', { detail: user }));
    }
  </script>
</svelte:head>

{#if currentView === 'login'}
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
      <h1 class="main-title">SARAYLO</h1>
      
      <h2 class="subtitle">Next-gen система для спорта</h2>
      
      <div class="description">
        <p>Система, основанная на AI-технологии, которая совместно с пользователем создает революцию в восприятии спорта и фитнеса.</p>
        <p>Получайте персонализированные рекомендации для достижения ваших целей и предотвращения перетренированности</p>
        <p>Ваш личный тренер в режиме реального времени</p>
      </div>
      
      <div class="auth-section">
        <p class="production-info-static"><strong>Добро пожаловать</strong></p>
        
        <!-- Простая кнопка для перехода к dashboard -->
        <button 
          class="telegram-auth-button" 
          on:click={() => currentView = 'dashboard'}
          aria-label="Перейти к статистике"
        >
          <span>Перейти к статистике</span>
        </button>
        
        <p class="auth-status">Production by V Saraylo</p>
      </div>
    </div>
  </div>
{:else if currentView === 'dashboard'}
  <!-- Dashboard view -->
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
          on:click={handleSettingsClick}
          on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSettingsClick(); }}
          role="button"
          tabindex="0"
          aria-label="Настройки"
        >
          <img src="/images/111.png" alt="Настройки" width="24" height="24" />
        </div>
        <h1 class="dashboard-title">Статистика</h1>
        <div 
          class="header-icon" 
          on:click={handleAddClick}
          on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAddClick(); }}
          role="button"
          tabindex="0"
          aria-label="Добавить"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="var(--primary-pink)" stroke-width="2" stroke-linecap="round"/>
            <path d="M5 12H19" stroke="var(--primary-pink)" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
      
      <!-- Main content -->
      <div class="dashboard-main">
        <!-- Activity Rings -->
        <div class="activity-rings-container">
          <h2 class="rings-title">Активность</h2>
          <div class="rings-wrapper">
            <!-- Move Ring -->
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
                />
              </svg>
              <div class="ring-label">
                <span class="ring-value">{activityData.move.value}</span>
                <span class="ring-unit">ккал</span>
              </div>
            </div>
            
            <!-- Exercise Ring -->
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
                />
              </svg>
              <div class="ring-label">
                <span class="ring-value">{activityData.exercise.value}</span>
                <span class="ring-unit">мин</span>
              </div>
            </div>
            
            <!-- Stand Ring -->
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
              class:training-mode={isInTrainingMode()}
              on:click={handleTrainingClick}
              on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTrainingClick(); }}
              role="button"
              tabindex="0"
              aria-label="Начать тренировку"
            >
              <img src="/images/Run3.png" alt="Начать тренировку" width="40" height="40" />
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
            <img src="/images/Smart.png" alt="Устройства" width="24" height="24" />
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
  </div>
{:else if currentView === 'training'}
  <Training {handleBackToDashboard} {handleHealthClick} {handleTrainingClick} {handleDevicesClick} {handleProfileClick} {handleSettingsClick} />
{:else if currentView === 'devices'}
  <Devices {handleBackToDashboard} {handleHealthClick} {handleTrainingClick} {handleDevicesClick} {handleProfileClick} />
{:else if currentView === 'health'}
  <Health {handleBackToDashboard} {handleHealthClick} {handleTrainingClick} {handleDevicesClick} {handleProfileClick} />
{:else if currentView === 'profile'}
  <Profile {userData} {handleBackToDashboard} {handleHealthClick} {handleTrainingClick} {handleDevicesClick} {handleProfileClick} {handleSettingsClick} />
{:else if currentView === 'settings'}
  <Settings {userData} {handleBackToDashboard} {handleHealthClick} {handleTrainingClick} {handleDevicesClick} {handleProfileClick} />
{/if}

<style>
  /* Main title */
  .main-title {
    font-size: 4rem;
    font-weight: 800;
    /* Updated to use Miami Hit color scheme */
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-pink));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
    margin-bottom: 20px;
    text-shadow: 0 0 20px rgba(0, 191, 255, 0.3);
    animation: shimmer 3s ease-in-out infinite;
    background-size: 200% 200%;
  }
  
  .subtitle {
    font-size: 1.5rem;
    color: var(--light-gray);
    text-align: center;
    margin-bottom: 30px;
    font-weight: 500;
  }
  
  /* Description */
  .description {
    text-align: center;
    margin-bottom: 30px;
    color: var(--light-gray);
  }
  
  .description p {
    margin-bottom: 15px;
    line-height: 1.6;
  }
  
  /* Auth section */
  .auth-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .production-info-static {
    font-size: 1.2rem;
    color: var(--light-gray);
    margin-bottom: 10px;
  }
  
  .telegram-auth-button {
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
    border: none;
    border-radius: 12px;
    padding: 15px 30px;
    color: white;
    font-weight: 700;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 300px;
  }
  
  .telegram-auth-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
    background: linear-gradient(135deg, var(--primary-pink), var(--primary-blue));
  }
  
  .telegram-auth-button:active {
    transform: translateY(1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .auth-status {
    font-size: 1rem;
    color: var(--light-gray);
    text-align: center;
  }
  
  /* Dashboard styles */
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    margin-bottom: 25px;
    /* Updated to use Miami Hit color scheme */
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(51, 51, 51, 0.2));
    border-radius: 15px;
    padding: 15px 20px;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .dashboard-title {
    font-size: 1.8rem;
    font-weight: 800;
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 10px rgba(0, 191, 255, 0.3);
  }
  
  .header-icon {
    cursor: pointer;
    padding: 10px;
    /* Ensure perfect circle shape */
    border-radius: 50%;
    transition: all 0.3s ease;
    /* Updated to use Miami Hit color scheme */
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.2));
    /* Make sure the element is perfectly square */
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header-icon:hover {
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
    transform: scale(1.1);
  }
  
  /* Circle button styles */
  .circle-button {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 15px rgba(0, 191, 255, 0.4);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .circle-button:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 20px rgba(255, 20, 147, 0.6);
  }
  
  /* Main content styles */
  .dashboard-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    padding: 20px 0;
  }
  
  /* Progress bar */
  .progress-container {
    width: 100%;
    max-width: 400px;
    text-align: center;
    margin: 0 auto;
  }
  
  .progress-bar {
    height: 25px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 10px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .progress-fill {
    height: 100%;
    /* Updated to use Miami Hit color scheme */
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-pink));
    border-radius: 10px;
    position: relative;
    overflow: hidden;
  }
  
  .progress-fill::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: shimmer 2s infinite;
  }
  
  .progress-text {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--white);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  /* Expanded progress panel */
  
  /* Progress bar */
  .progress-container {
    width: 100%;
    max-width: 400px;
    text-align: center;
    margin: 0 auto;
  }
  
  .progress-bar {
    height: 25px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 10px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .progress-fill {
    height: 100%;
    /* Updated to use Miami Hit color scheme */
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-pink));
    border-radius: 10px;
    position: relative;
    overflow: hidden;
  }
  
  .progress-fill::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: shimmer 2s infinite;
  }
  
  .progress-text {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--white);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  /* Current level */
  

  

  
  /* Coffee button */
  .coffee-button {
    display: flex;
    align-items: center;
    gap: 12px;
    /* Updated to use Miami Hit color scheme */
    background: linear-gradient(135deg, var(--deep-black), #333333);
    border: 2px solid var(--primary-pink);
    border-radius: 15px;
    padding: 15px 30px;
    color: #FFFFFF;
    font-weight: 700;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
  
  .coffee-button:hover {
    /* Updated to use Miami Hit color scheme */
    background: linear-gradient(135deg, #333333, var(--deep-black));
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
    border-color: var(--primary-blue);
  }
  
  .coffee-button:active {
    transform: translateY(1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  /* Training date */
  .training-date {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    /* Updated to use Miami Hit color scheme */
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.1));
    padding: 15px 25px;
    border-radius: 15px;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .training-date p {
    font-size: 1.1rem;
    color: var(--light-gray);
    font-weight: 500;
  }
  
  .details-button {
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-pink));
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    color: white;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .details-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    background: linear-gradient(90deg, var(--primary-pink), var(--primary-blue));
  }
  
  .details-button:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  /* Bottom panel */
  .bottom-panel {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20px 15px;
    /* Updated to use Miami Hit color scheme */
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(51, 51, 51, 0.3));
    backdrop-filter: blur(10px);
    border-radius: 25px;
  }
  
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: var(--light-gray);
    transition: all 0.3s ease;
    padding: 10px;
    border-radius: 10px;
  }
  
  .nav-item:hover {
    color: var(--white);
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-3px);
  }
  
  .nav-item-center {
    margin-top: -40px;
  }
  
  .circle-button {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 15px rgba(0, 191, 255, 0.4);
    transition: all 0.3s ease;
  }
  
  .circle-button:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 20px rgba(255, 20, 147, 0.6);
  }
  
  /* Component-specific styles */
  .dashboard-actions {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
    align-items: center;
  }
  

  
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
    margin-bottom: 10px;
  }
  
  .ring-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .ring {
    transform: rotate(270deg);
  }
  
  .ring-progress {
    transition: stroke-dashoffset 1s ease-in-out;
  }
  
  .ring-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(0deg);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
    justify-content: center;
    flex-wrap: wrap;
    gap: 80px;
    margin-top: 5px;
    margin-bottom: 15px;
    margin-left: -15px;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    margin: 0 10px;
  }
  
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 5px;
  }
  
  .legend-text {
    font-size: 0.9rem;
    color: var(--light-gray);
  }
  
  /* Адаптивный дизайн */
  @media (max-width: 768px) {
    .dashboard-header {
      padding: 10px 0;
    }
    
    .dashboard-title {
      font-size: 1.3rem;
    }
    
    .nav-item span {
      font-size: 0.8rem;
    }
    
    .circle-button {
      width: 50px;
      height: 50px;
    }
    
    .rings-wrapper {
      gap: 15px;
    }
    
    .ring-container {
      transform: scale(0.9);
    }
  }
  
  @media (max-width: 480px) {
    .container {
      padding: 10px;
    }
    
    .glass-panel {
      width: 95%;
      padding: 25px 15px;
    }
    
    .dashboard-header {
      padding: 8px 0;
    }
    
    .dashboard-title {
      font-size: 1.1rem;
    }
    
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
  
  /* Dimmed effect for unreached levels */
  
  /* Note: The 'dimmed' class is applied to badge elements that represent unreached achievement levels */
  
  /* Profile view styles - moved to Profile.svelte */
  
  /* Expanded progress panel */
  
  /* Progress bar */
  .progress-container {
    width: 100%;
    max-width: 400px;
    text-align: center;
    margin: 0 auto;
  }
  
  .progress-bar {
    height: 25px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 10px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .progress-fill {
    height: 100%;
    /* Updated to use Miami Hit color scheme */
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-pink));
    border-radius: 10px;
    position: relative;
    overflow: hidden;
  }
  
  .progress-fill::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: shimmer 2s infinite;
  }
  
  .progress-text {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--white);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  /* Animation for shimmer effect */
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
</style>

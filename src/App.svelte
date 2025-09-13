<script>
  import { onMount } from 'svelte';
  import './app.css';
  
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
        <div class="header-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="var(--primary-blue)" stroke-width="2"/>
            <path d="M12 6V12L16 14" stroke="var(--primary-blue)" stroke-width="2" stroke-linecap="round"/>
          </svg>
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
        <!-- Central shield with "БЕГ" and achievement badges replaced with image -->
        <div class="central-shield">
          <div class="shield-content">
            <div class="shield-top">
              <div class="octagon-container">
              </div>
            </div>
            <div class="shield-bottom">
              <!-- Achievement levels inside shield -->
              <div class="achievement-section">
              </div>
            </div>
          </div>
        </div>
        
        <!-- Progress bar -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 5.8%;"></div>
          </div>
          <p class="progress-text">2,9 / 50 км</p>
        </div>
        
        <!-- Current level -->
        <div class="current-level">
          <p class="level-text">Текущий уровень</p>
          <h3 class="level-name">ЗЕЛЕНЫЙ</h3>
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
  </div>
{:else if currentView === 'training'}
  <!-- Training view -->
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
        <h1 class="dashboard-title">Тренировка</h1>
        <div class="header-icon">
          <!-- Empty icon placeholder -->
        </div>
      </div>
      
      <!-- Training content -->
      <div class="dashboard-main">
        <div class="central-shield">
          <div class="shield-content">
            <div class="shield-top">
              <div class="octagon-container">
              </div>
            </div>
            <div class="shield-bottom">
              <div class="training-info">
                <button class="start-training-button">
                  Начать тренировку
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Training stats -->
        <div class="training-stats">
          <div class="stat-card">
            <h4>Время</h4>
            <p class="stat-value">00:00:00</p>
          </div>
          <div class="stat-card">
            <h4>Дистанция</h4>
            <p class="stat-value">0.0 км</p>
          </div>
          <div class="stat-card">
            <h4>Темп</h4>
            <p class="stat-value">0:00 / км</p>
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
  </div>
{:else if currentView === 'profile'}
  <!-- Profile view -->
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
        <h1 class="dashboard-title">Профиль</h1>
        <div class="header-icon">
          <!-- Empty icon placeholder -->
        </div>
      </div>
      
      <!-- Profile content -->
      <div class="dashboard-main">
        <!-- User info card -->
        <div class="profile-card">
          <div class="profile-header">
            <div class="profile-avatar">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" stroke="var(--primary-blue)" stroke-width="2"/>
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="var(--primary-blue)" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h2 class="profile-name">{userData?.first_name} {userData?.last_name || ''}</h2>
            <p class="profile-username">@{userData?.username || 'username'}</p>
          </div>
          
          <div class="profile-stats">
            <div class="stat-item">
              <h3 class="stat-value">2,9</h3>
              <p class="stat-label">км пробежано</p>
            </div>
            <div class="stat-item">
              <h3 class="stat-value">5</h3>
              <p class="stat-label">тренировок</p>
            </div>
            <div class="stat-item">
              <h3 class="stat-value">12</h3>
              <p class="stat-label">дней подряд</p>
            </div>
          </div>
        </div>
        
        <!-- Profile details -->
        <div class="profile-details">
          <div class="detail-item">
            <h4>Личная информация</h4>
            <p>Возраст: 28 лет</p>
            <p>Рост: 175 см</p>
            <p>Вес: 70 кг</p>
          </div>
          
          <div class="detail-item">
            <h4>Цели</h4>
            <p>Еженедельная цель: 15 км</p>
            <p>Прогресс: 2,9 / 15 км</p>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 19.3%;"></div>
              </div>
            </div>
          </div>
          
          <div class="detail-item">
            <h4>Достижения</h4>
            <p>Последнее достижение: Зеленый уровень</p>
            <p>Следующее: Желтый уровень (50 км)</p>
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
  </div>
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
    box-shadow: 0 8px 20px rgba(0, 191, 255, 0.6);
  }
  
  /* Main content styles */
  .dashboard-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    padding: 20px 0;
  }
  
  /* Central shield */
  .central-shield {
    width: 100%;
    max-width: 500px;
    height: 400px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 15px;
    box-sizing: border-box;
    margin-bottom: 50px;
    /* Create a border effect using Miami Hit colors */
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
    border: none;
    padding: 3px;
  }
  
  .shield-content {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    padding: 0;
    position: relative;
    background: linear-gradient(135deg, #000000, #333333);
  }
  
  .shield-top {
    height: 66.66%; /* 2/3 of the space */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--primary-blue), #0080FF);
    border-radius: 9px 9px 0 0;
  }
  
  .shield-bottom {
    height: 33.33%; /* 1/3 of the space */
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(34, 34, 34, 0.7);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border-radius: 0 0 9px 9px;
  }
  
  .shield-content h2 {
    font-size: 3rem;
    font-weight: 700;
    color: #000000;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
  }
  
  /* Octagon container and elements */
  .octagon-container {
    position: relative;
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Achievement section inside shield */
  .achievement-section {
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    width: 100%;
  }
  
  .achievement-title {
    font-size: 1rem;
    margin-bottom: 10px;
    color: var(--light-gray);
    font-weight: 600;
  }
  
  .achievement-badges {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
    max-width: 80%;
    margin: 0 auto;
    padding: 10px 0;
  }
  
  .badge {
    width: 40px;
    height: 40px;
    /* Change from circle to octagon */
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    font-size: 0.7rem;
    transition: transform 0.3s ease;
    border: 2px solid #000000; /* Changed from white to black */
    /* Create octagon shape using clip-path */
    clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
  }
  
  /* Style each badge with appropriate colors */
  .badge:nth-child(1) { background: #4CAF50; } /* 0 - Green */
  .badge:nth-child(2) { background: #8BC34A; } /* 50 - Light Green */
  .badge:nth-child(3) { background: #CDDC39; } /* 250 - Lime */
  .badge:nth-child(4) { background: #FFEB3B; } /* 1K - Yellow */
  .badge:nth-child(5) { background: #FF9800; } /* 2.5K - Orange */
  .badge:nth-child(6) { background: var(--primary-pink); } /* 5K - Pink */
  
  .badge:hover {
    transform: scale(1.2);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  }
  
  .badge-text {
    font-size: 0.7rem;
    color: #000000;
    font-weight: 800;
    text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.5);
  }
  
  /* Animation keyframes */
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  
  @keyframes medalShimmer {
    0% { 
      background-color: #4CAF50;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }
    10% {
      background-color: #4CAF50;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }
    20% {
      background-color: #4CAF50;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }
    25% {
      background-color: #4CAF50;
      box-shadow: -10px 0 15px rgba(255, 255, 255, 0.6);
    }
    30% {
      background-color: #4CAF50;
      box-shadow: -5px 0 15px rgba(255, 255, 255, 0.6);
    }
    40% {
      background-color: #4CAF50;
      box-shadow: 5px 0 15px rgba(255, 255, 255, 0.6);
    }
    50% {
      background-color: #4CAF50;
      box-shadow: 10px 0 15px rgba(255, 255, 255, 0.6);
    }
    60% {
      background-color: #4CAF50;
      box-shadow: 5px 0 15px rgba(255, 255, 255, 0.6);
    }
    70% {
      background-color: #4CAF50;
      box-shadow: -5px 0 15px rgba(255, 255, 255, 0.6);
    }
    75% {
      background-color: #4CAF50;
      box-shadow: -10px 0 15px rgba(255, 255, 255, 0.6);
    }
    80% {
      background-color: #4CAF50;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }
    90% {
      background-color: #4CAF50;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }
    100% { 
      background-color: #4CAF50;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }
  }
  
  /* Progress bar */
  .progress-container {
    width: 100%;
    max-width: 400px;
    text-align: center;
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
  .current-level {
    text-align: center;
    /* Updated to use Miami Hit color scheme */
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(51, 51, 51, 0.3));
    padding: 15px 30px;
    border-radius: 15px;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  
  .level-text {
    font-size: 1.1rem;
    color: var(--light-gray);
    margin-bottom: 5px;
    font-weight: 500;
  }
  
  .level-name {
    font-size: 2rem;
    font-weight: 800;
    /* Use Miami Hit pink color for the level name */
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 10px rgba(255, 20, 147, 0.5);
    letter-spacing: 1px;
  }
  
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
  
  .loading-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .dashboard-header {
      padding: 10px 0;
    }
    
    .dashboard-title {
      font-size: 1.3rem;
    }
    
    .central-shield {
      width: 150px;
      height: 150px;
    }
    
    .shield-content {
      width: 130px;
      height: 130px;
    }
    
    .shield-content h2 {
      font-size: 2rem;
    }
    
    .nav-item span {
      font-size: 0.8rem;
    }
    
    .circle-button {
      width: 50px;
      height: 50px;
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
    
    .central-shield {
      width: 120px;
      height: 120px;
    }
    
    .shield-content {
      width: 100px;
      height: 100px;
    }
    
    .shield-content h2 {
      font-size: 1.5rem;
    }
  }
  
  /* Dimmed effect for unreached levels */
  
  /* Note: The 'dimmed' class is applied to badge elements that represent unreached achievement levels */
  
  /* Training view styles */
  .training-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 20px;
    text-align: center;
  }
  
  .training-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 15px;
    color: var(--white);
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .training-description {
    font-size: 1rem;
    color: var(--light-gray);
    margin-bottom: 25px;
    line-height: 1.5;
  }
  
  .start-training-button {
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
    max-width: 250px;
  }
  
  .start-training-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
    background: linear-gradient(135deg, var(--primary-pink), var(--primary-blue));
  }
  
  .start-training-button:active {
    transform: translateY(1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .training-stats {
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: 500px;
    gap: 15px;
    margin-top: 20px;
  }
  
  .stat-card {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(51, 51, 51, 0.3));
    backdrop-filter: blur(5px);
    border-radius: 15px;
    padding: 15px;
    text-align: center;
    flex: 1;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .stat-card h4 {
    font-size: 0.9rem;
    color: var(--light-gray);
    margin-bottom: 10px;
    font-weight: 500;
  }
  
  .stat-value {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--white);
    margin: 0;
  }
  
  /* Profile view styles */
  .profile-card {
    width: 100%;
    max-width: 500px;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(51, 51, 51, 0.3));
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 30px 20px;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 191, 255, 0.2);
  }
  
  .profile-header {
    margin-bottom: 25px;
  }
  
  .profile-avatar {
    margin: 0 auto 15px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3px;
  }
  
  .profile-name {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 10px 0 5px;
    color: var(--white);
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .profile-username {
    font-size: 1.1rem;
    color: var(--light-gray);
    margin: 0 0 15px;
  }
  
  .profile-stats {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    padding: 0 10px;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-item .stat-value {
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 5px;
    color: var(--white);
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .stat-item .stat-label {
    font-size: 0.9rem;
    color: var(--light-gray);
    margin: 0;
  }
  
  .profile-details {
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .detail-item {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(51, 51, 51, 0.2));
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border-radius: 15px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .detail-item h4 {
    font-size: 1.2rem;
    color: var(--white);
    margin-bottom: 15px;
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .detail-item p {
    font-size: 1rem;
    color: var(--light-gray);
    margin: 8px 0;
  }
</style>
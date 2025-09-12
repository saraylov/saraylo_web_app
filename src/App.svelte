<script>
  import { onMount } from 'svelte';
  import './app.css';
  
  /** @type {boolean} */
  let isAuthorized = false;
  /** @type {string} */
  let authStatus = '';
  /** @type {boolean} */
  let isLoading = false;
  /** @type {{id?: number, first_name: string, last_name?: string, username?: string} | null} */
  let userData = null;
  /** @type {string} */
  let currentView = 'login'; // 'login' or 'dashboard'
  /** @type {boolean} */
  let showTelegramWidget = false;
  
  // Handle Telegram authorization callback
  function onTelegramAuth(user) {
    console.log('Telegram user authenticated:', user);
    isAuthorized = true;
    userData = user;
    authStatus = `Добро пожаловать, ${user.first_name}!`;
    // Switch to dashboard view
    currentView = 'dashboard';
    // Update URL without page reload
    history.pushState({}, '', '/dashboard');
  }
  
  // Handle logout
  function handleLogout() {
    isAuthorized = false;
    userData = null;
    currentView = 'login';
    authStatus = 'Production by V Saraylo';
    showTelegramWidget = false;
    // Update URL without page reload
    history.pushState({}, '', '/');
  }
  
  // Test authorization function
  function testAuthorization() {
    // Simulate Telegram user data
    const testUser = {
      id: 123456789,
      first_name: 'Тестовый',
      last_name: 'Пользователь',
      username: 'testuser',
      language_code: 'ru'
    };
    
    // Trigger the same logic as Telegram authorization
    onTelegramAuth(testUser);
  }
  
  // Initialize
  onMount(() => {
    // Add event listener for Telegram authentication
    const handleTelegramAuthEvent = (event) => {
      onTelegramAuth(event.detail);
    };
    
    window.addEventListener('telegramAuth', handleTelegramAuthEvent);
    
    // Check if we should show the dashboard
    if (window.location.pathname === '/dashboard' && userData) {
      currentView = 'dashboard';
    }
    authStatus = 'Production by V Saraylo';
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('telegramAuth', handleTelegramAuthEvent);
    };
  });
  
  // Function to trigger Telegram Login Widget
  function handleTelegramAuth() {
    showTelegramWidget = true;
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
        
        <!-- Telegram Login Button -->
        {#if !showTelegramWidget}
          <button 
            class="telegram-auth-button" 
            on:click={handleTelegramAuth}
            disabled={isLoading || isAuthorized}
            aria-label="Авторизоваться через Telegram"
          >
            {#if isLoading}
              <div class="loading-spinner"></div>
            {:else}
              <svg class="telegram-icon" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.14.141-.259.259-.374.261l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.136-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
              </svg>
              <span>Авторизоваться через Telegram</span>
            {/if}
          </button>
          
          <!-- Test Authorization Button -->
          <button 
            class="telegram-auth-button" 
            on:click={testAuthorization}
            style="margin-top: 10px; background: rgba(0, 255, 0, 0.1); border-color: #00FF00;"
            aria-label="Тестовая авторизация"
          >
            <span>Тестовая авторизация</span>
          </button>
        {:else}
          <script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-login="Saraylo_bot" data-size="large" data-onauth="onTelegramAuth(user)" data-request-access="write"></script>
        {/if}
        
        {#if authStatus}
          <p class="auth-status">{authStatus}</p>
        {/if}
        
        {#if isAuthorized && userData}
          <div class="user-info">
            <p>Вы вошли как: {userData.first_name} {userData.last_name || ''}</p>
            {#if userData.username}
              <p>Username: @{userData.username}</p>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{:else}
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
        <div class="header-icon" on:click={handleAddClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="var(--primary-pink)" stroke-width="2" stroke-linecap="round"/>
            <path d="M5 12H19" stroke="var(--primary-pink)" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
      
      <!-- Main content -->
      <div class="dashboard-main">
        <!-- Central shield with "БЕГ" -->
        <div class="central-shield">
          <div class="shield-content">
            <h2>БЕГ</h2>
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
        
        <!-- Achievement levels -->
        <div class="achievement-section">
          <h3 class="achievement-title">Все беговые уровни</h3>
          <div class="achievement-badges">
            <div class="badge" style="background-color: #4CAF50;">
              <span class="badge-text">0</span>
            </div>
            <div class="badge" style="background-color: #8BC34A;">
              <span class="badge-text">50</span>
            </div>
            <div class="badge" style="background-color: #CDDC39;">
              <span class="badge-text">250</span>
            </div>
            <div class="badge" style="background-color: #FFEB3B;">
              <span class="badge-text">1K</span>
            </div>
            <div class="badge" style="background-color: #FF9800;">
              <span class="badge-text">2,5K</span>
            </div>
            <div class="badge" style="background-color: #F44336;">
              <span class="badge-text">5K</span>
            </div>
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
        
        <!-- Bottom navigation panel -->
        <div class="bottom-panel">
          <div class="nav-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Статистика</span>
          </div>
          <div class="nav-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.35 7.17C5.05 5.07 7.28 3.5 9.95 3.5H14.05C16.72 3.5 18.95 5.07 19.65 7.17L21.28 12.07C21.66 13.22 21.85 13.8 21.71 14.29C21.57 14.77 21.13 15.11 20.25 15.79L18.5 17.15C16.5 18.7 15.5 19.47 14.36 19.73C13.22 19.99 12.08 19.99 10.94 19.73C9.8 19.47 8.8 18.7 6.8 17.15L5.05 15.79C4.17 15.11 3.73 14.77 3.59 14.29C3.45 13.8 3.64 13.22 4.02 12.07L4.35 7.17Z" stroke="currentColor" stroke-width="2"/>
              <path d="M9 11L11 13L15 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Здоровье</span>
          </div>
          <div class="nav-item nav-item-center">
            <div class="circle-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2"/>
                <path d="M19.4 15C19.2667 15.4 18.9 16 18 16.5C17.1 17 16.0667 17.2667 15 17.3C13.9333 17.2667 12.9 17 12 16.5C11.1 16 10.7333 15.4 10.6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M12 9C12.9 8.5 13.9333 8.23333 15 8.2C16.0667 8.23333 17.1 8.5 18 9C18.9 9.5 19.2667 10.1 19.4 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M4.6 15C4.73333 14.6 5.1 14 6 13.5C6.9 13 7.93333 12.7333 9 12.7C10.0667 12.7333 11.1 13 12 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M12 15C11.1 15.5 10.0667 15.7667 9 15.8C7.93333 15.7667 6.9 15.5 6 15C5.1 14.5 4.73333 13.9 4.6 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
          <div class="nav-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2"/>
              <path d="M23 20.9999V18.9999C22.9993 18.1136 22.7044 17.2527 22.1614 16.5522C21.6184 15.8517 20.8581 15.3515 20 15.1299" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M16 3.12988C16.8604 3.35143 17.623 3.85051 18.1693 4.54956C18.7156 5.24861 19.0147 6.10829 19.02 7.00488" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Устройства</span>
          </div>
          <div class="nav-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Профиль</span>
          </div>
        </div>
        
        <!-- Logout button -->
        <div class="dashboard-actions">
          <button 
            class="telegram-auth-button" 
            on:click={handleLogout}
            style="background: rgba(255, 0, 0, 0.1); border-color: #FF0000;"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Dashboard styles */
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    margin-bottom: 20px;
  }
  
  .dashboard-title {
    font-size: 1.5rem;
    font-weight: 700;
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .header-icon {
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: background 0.3s ease;
  }
  
  .header-icon:hover {
    background: rgba(255, 255, 255, 0.1);
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
    width: 200px;
    height: 200px;
    background: conic-gradient(
      from 0deg,
      var(--primary-blue),
      var(--primary-pink),
      var(--primary-blue)
    );
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: 0 0 20px rgba(0, 191, 255, 0.5);
  }
  
  .shield-content {
    width: 170px;
    height: 170px;
    background: var(--deep-black);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .shield-content h2 {
    font-size: 2.5rem;
    font-weight: 700;
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* Progress bar */
  .progress-container {
    width: 100%;
    max-width: 400px;
    text-align: center;
  }
  
  .progress-bar {
    height: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
    border: 1px solid var(--glass-border);
  }
  
  .progress-fill {
    height: 100%;
    background: var(--gradient-border);
    border-radius: 10px;
  }
  
  .progress-text {
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  /* Current level */
  .current-level {
    text-align: center;
  }
  
  .level-text {
    font-size: 1rem;
    color: var(--light-gray);
    margin-bottom: 5px;
  }
  
  .level-name {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--primary-blue);
  }
  
  /* Achievement section */
  .achievement-section {
    width: 100%;
    max-width: 500px;
    text-align: center;
  }
  
  .achievement-title {
    font-size: 1.3rem;
    margin-bottom: 20px;
    color: var(--light-gray);
  }
  
  .achievement-badges {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  
  .badge {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .badge-text {
    font-size: 0.8rem;
  }
  
  /* Coffee button */
  .coffee-button {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(139, 69, 19, 0.2);
    border: 2px solid #D2691E;
    border-radius: 12px;
    padding: 12px 24px;
    color: #D2691E;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .coffee-button:hover {
    background: rgba(139, 69, 19, 0.3);
    transform: scale(1.05);
  }
  
  /* Training date */
  .training-date {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .training-date p {
    font-size: 1rem;
    color: var(--light-gray);
  }
  
  .details-button {
    background: transparent;
    border: 2px solid var(--primary-blue);
    border-radius: 8px;
    padding: 8px 16px;
    color: var(--primary-blue);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .details-button:hover {
    background: rgba(0, 191, 255, 0.1);
  }
  
  /* Bottom panel */
  .bottom-panel {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 15px 10px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid var(--glass-border);
    width: 100%;
    margin-top: 20px;
  }
  
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    color: var(--light-gray);
    transition: color 0.3s ease;
  }
  
  .nav-item:hover {
    color: var(--white);
  }
  
  .nav-item-center {
    margin-top: -30px;
  }
  
  .circle-button {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--gradient-border);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(0, 191, 255, 0.4);
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
    
    .achievement-badges {
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .badge {
      width: 40px;
      height: 40px;
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
    
    .progress-container {
      max-width: 300px;
    }
    
    .achievement-badges {
      gap: 5px;
    }
    
    .badge {
      width: 35px;
      height: 35px;
    }
    
    .badge-text {
      font-size: 0.7rem;
    }
    
    .coffee-button {
      padding: 10px 20px;
      font-size: 0.9rem;
    }
    
    .nav-item span {
      font-size: 0.7rem;
    }
    
    .circle-button {
      width: 45px;
      height: 45px;
    }
  }
</style>
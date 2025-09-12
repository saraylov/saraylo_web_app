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
      <h1 class="main-title">SARAYLO</h1>
      
      <h2 class="subtitle">Next-gen система для спорта</h2>
      
      <div class="description">
        <p>Система, основанная на AI-технологии, которая совместно с пользователем создает революцию в восприятии спорта и фитнеса.</p>
        <p>Получайте персонализированные рекомендации для достижения ваших целей и предотвращения перетренированности</p>
        <p>Ваш личный тренер в режиме реального времени</p>
      </div>
      
      <div class="auth-section">
        {#if userData}
          <div class="user-info">
            <h3 class="production-info-static">Добро пожаловать</h3>
            
            <div style="margin: 20px 0; padding: 15px; border-radius: 10px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border);">
              <h4 style="color: var(--primary-blue); margin-bottom: 10px;">Ваш профиль</h4>
              <p>Имя: {userData.first_name} {userData.last_name || ''}</p>
              {#if userData.username}
                <p>Username: @{userData.username}</p>
              {/if}
              {#if userData.id}
                <p>ID: {userData.id}</p>
              {/if}
            </div>
            
            <div style="margin: 20px 0; padding: 15px; border-radius: 10px; background: rgba(0, 191, 255, 0.1); border: 1px solid var(--primary-blue);">
              <h4 style="color: var(--primary-blue); margin-bottom: 10px;">Доступные функции</h4>
              <ul style="text-align: left; margin: 10px 0 10px 20px;">
                <li>Анализ тренировок в реальном времени</li>
                <li>Персональные рекомендации</li>
                <li>Отслеживание прогресса</li>
                <li>Предотвращение перетренированности</li>
              </ul>
            </div>
            
            <div class="dashboard-actions" style="display: flex; flex-direction: column; gap: 15px; margin-top: 20px; align-items: center;">
              <button 
                class="telegram-auth-button" 
                on:click={handleLogout}
                style="background: rgba(255, 0, 0, 0.1); border-color: #FF0000;"
              >
                Выйти
              </button>
            </div>
          </div>
        {:else}
          <div class="loading-section">
            <p>Загрузка данных пользователя...</p>
            <div class="loading-spinner"></div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  /* Component-specific styles can be added here if needed */
  .dashboard-actions {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
  
  .loading-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
</style>
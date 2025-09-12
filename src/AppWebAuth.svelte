<script>
  import { onMount } from 'svelte';
  import { initTelegramWebApp, authenticateUser } from './telegram';
  import './app.css';
  
  let isAuthorized = false;
  let authStatus = '';
  let isLoading = false;
  let userData = null;
  let isTelegramAvailable = false;
  let showLoginOptions = true;
  
  // Initialize Telegram Web App
  onMount(() => {
    isTelegramAvailable = initTelegramWebApp();
    if (isTelegramAvailable) {
      authStatus = 'Обнаружен Telegram Web App. Вы можете авторизоваться через Telegram.';
    } else {
      authStatus = 'Авторизация через Telegram доступна только при запуске в Telegram Web App.';
    }
  });
  
  // Handle Telegram authorization
  async function handleTelegramAuth() {
    if (!isTelegramAvailable) {
      authStatus = 'Авторизация через Telegram возможна только внутри Telegram Web App';
      return;
    }
    
    isLoading = true;
    authStatus = 'Авторизация через Telegram...';
    
    try {
      const user = await authenticateUser();
      
      if (user) {
        isAuthorized = true;
        userData = user;
        authStatus = `Добро пожаловать, ${user.first_name}!`;
        showLoginOptions = false;
      } else {
        authStatus = 'Не удалось получить данные пользователя из Telegram';
      }
      
      isLoading = false;
    } catch (error) {
      authStatus = 'Ошибка авторизации через Telegram';
      isLoading = false;
      console.error('Authorization error:', error);
    }
  }
  
  // Simulate demo login
  function handleDemoLogin() {
    isLoading = true;
    authStatus = 'Авторизация в демо-режиме...';
    
    // Simulate API call delay
    setTimeout(() => {
      isAuthorized = true;
      userData = {
        id: 123456,
        first_name: 'Демо',
        last_name: 'Пользователь',
        username: 'demo_user'
      };
      authStatus = `Добро пожаловать, ${userData.first_name} ${userData.last_name}!`;
      showLoginOptions = false;
      isLoading = false;
    }, 1000);
  }
  
  // Logout function
  function handleLogout() {
    isAuthorized = false;
    userData = null;
    showLoginOptions = true;
    authStatus = isTelegramAvailable 
      ? 'Обнаружен Telegram Web App. Вы можете авторизоваться через Telegram.' 
      : 'Авторизация через Telegram доступна только при запуске в Telegram Web App.';
  }
</script>

<svelte:head>
  <title>Квантовый Беговой Тренер</title>
  <!-- Telegram Web App script -->
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
</svelte:head>

<div class="background-animation">
  <!-- 10 particles -->
  <div class="particle"></div>
  <div class="particle"></div>
  <div class="particle"></div>
  <div class="particle"></div>
  <div class="particle"></div>
  <div class="particle"></div>
  <div class="particle"></div>
  <div class="particle"></div>
  <div class="particle"></div>
  <div class="particle"></div>
</div>

<div class="container">
  <div class="glass-panel">
    <h1 class="main-title">Квантовый Беговой Тренер</h1>
    
    <h2 class="subtitle">Интеллектуальный анализ вашего физиологического состояния в реальном времени для оптимизации тренировок</h2>
    
    <div class="description">
      <p>Система на основе нейросетей анализирует данные с датчиков, чтобы оценить ваше текущее состояние, уровень усталости и эффективность тренировки</p>
      <p>Получайте персонализированные рекомендации для достижения ваших целей и предотвращения перетренированности</p>
      <p>Ваш личный тренер в режиме реального времени</p>
    </div>
    
    {#if !isAuthorized}
      <div class="auth-section">
        <p class="auth-status">{authStatus}</p>
        
        {#if showLoginOptions}
          <div class="login-options">
            {#if isTelegramAvailable}
              <button 
                class="telegram-auth-button" 
                on:click={handleTelegramAuth}
                disabled={isLoading}
                aria-label="Войти через Telegram"
              >
                {#if isLoading}
                  <div class="loading-spinner"></div>
                {:else}
                  <svg class="telegram-icon" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.14.141-.259.259-.374.261l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.136-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                  <span>Войти через Telegram</span>
                {/if}
              </button>
            {:else}
              <div class="telegram-required">
                <p>Для авторизации через Telegram откройте приложение внутри Telegram</p>
                <p>Найдите бота @Saraylo_bot и запустите Web App</p>
              </div>
            {/if}
            
            <div class="divider">
              <span>или</span>
            </div>
            
            <button 
              class="telegram-auth-button" 
              on:click={handleDemoLogin}
              disabled={isLoading}
              style="background: rgba(128, 128, 128, 0.2); border-color: #CCCCCC;"
            >
              {#if isLoading}
                <div class="loading-spinner"></div>
              {:else}
                <span>Войти в демо-режиме</span>
              {/if}
            </button>
          </div>
        {/if}
      </div>
    {:else}
      <div class="auth-section">
        <div class="user-info">
          <h3 style="color: var(--primary-blue); margin-bottom: 15px;">Вы успешно вошли в систему!</h3>
          <p>Вы вошли как: {userData.first_name} {userData.last_name || ''}</p>
          {#if userData.username}
            <p>Username: @{userData.username}</p>
          {/if}
          
          <div style="margin-top: 20px; padding: 15px; border-radius: 10px; background: rgba(0, 191, 255, 0.1); border: 1px solid var(--primary-blue);">
            <h4 style="color: var(--primary-blue); margin-bottom: 10px;">Добро пожаловать в Квантовый Беговой Тренер!</h4>
            <p>Теперь вы можете:</p>
            <ul style="text-align: left; margin: 10px 0 10px 20px;">
              <li>Анализировать свои тренировки в реальном времени</li>
              <li>Получать персональные рекомендации</li>
              <li>Отслеживать прогресс и достигать целей</li>
              <li>Предотвращать перетренированность</li>
            </ul>
          </div>
          
          <button 
            class="telegram-auth-button" 
            on:click={handleLogout}
            style="margin-top: 20px; background: rgba(255, 0, 0, 0.1); border-color: #FF0000;"
          >
            Выйти
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .login-options {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
  
  .divider {
    display: flex;
    align-items: center;
    text-align: center;
    color: var(--light-gray);
  }
  
  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--glass-border);
  }
  
  .divider::before {
    margin-right: 10px;
  }
  
  .divider::after {
    margin-left: 10px;
  }
</style>
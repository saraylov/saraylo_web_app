<script>
  import { onMount } from 'svelte';
  import { initTelegramWebApp, authenticateUser } from './telegram';
  import './app.css';
  
  let isAuthorized = false;
  let authStatus = '';
  let isLoading = false;
  let userData = null;
  let isTelegramAvailable = false;
  let isTestMode = false;
  
  // Initialize Telegram Web App
  onMount(() => {
    isTelegramAvailable = initTelegramWebApp();
    if (!isTelegramAvailable) {
      authStatus = 'Приложение должно быть запущено внутри Telegram. В тестовом режиме можно продолжить без авторизации.';
      isTestMode = true;
    }
  });
  
  // Handle Telegram authorization
  async function handleTelegramAuth() {
    if (!isTelegramAvailable) {
      // Test mode - simulate authorization
      isAuthorized = true;
      userData = {
        id: 123456,
        first_name: 'Тестовый',
        last_name: 'Пользователь',
        username: 'testuser'
      };
      authStatus = `Добро пожаловать, ${userData.first_name}!`;
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
        // In a real app, you would redirect to the main application
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
  
  // Skip authorization for testing
  function skipAuthorization() {
    isAuthorized = true;
    userData = {
      id: 123456,
      first_name: 'Тестовый',
      last_name: 'Пользователь',
      username: 'testuser'
    };
    authStatus = `Добро пожаловать, ${userData.first_name}!`;
  }
</script>

<svelte:head>
  <title>Квантовый Беговой Тренер - Тест</title>
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
    
    <div class="auth-section">
      <p class="access-info">Доступ к приложению возможен только после авторизации через Telegram</p>
      
      {#if isTelegramAvailable}
        <button 
          class="telegram-auth-button" 
          on:click={handleTelegramAuth}
          disabled={isLoading || isAuthorized}
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
          <p>Для использования приложения откройте его внутри Telegram</p>
          <p>Найдите бота @Saraylo_bot и запустите Web App</p>
          {#if isTestMode}
            <button 
              class="telegram-auth-button" 
              on:click={skipAuthorization}
              style="margin-top: 20px;"
            >
              Продолжить без авторизации (тестовый режим)
            </button>
          {/if}
        </div>
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
          <p style="margin-top: 20px; color: #00BFFF;">Приложение успешно загружено и работает!</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  /* Component-specific styles can be added here if needed */
</style>
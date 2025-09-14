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
  export let handleSettingsClick; // Add this new handler
  
  // Profile actions
  function handleEditProfile() {
    console.log('Edit profile clicked');
    // In a real app, you would navigate to an edit profile page
  }
  
  function handleShareProfile() {
    console.log('Share profile clicked');
    // In a real app, you would implement sharing functionality
  }
  
  function handleExportData() {
    console.log('Export data clicked');
    // In a real app, you would implement data export functionality
  }
  
  // Default implementation for settings click if not provided
  if (typeof handleSettingsClick !== 'function') {
    handleSettingsClick = () => {
      console.log('Settings button clicked');
      // In a real app, you would navigate to settings page
    };
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
      <h1 class="dashboard-title">Профиль</h1>
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
    </div>
    
    <!-- Profile content -->
    <div class="dashboard-main">
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="var(--primary-blue)" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="var(--primary-blue)" stroke-width="2"/>
            </svg>
          </div>
          <h2 class="profile-name">{userData?.first_name} {userData?.last_name || ''}</h2>
          <p class="profile-username">@{userData?.username}</p>
        </div>
        
        <div class="profile-stats">
          <div class="stat-item">
            <p class="stat-value">12</p>
            <p class="stat-label">Тренировки</p>
          </div>
          <div class="stat-item">
            <p class="stat-value">85</p>
            <p class="stat-label">Км</p>
          </div>
          <div class="stat-item">
            <p class="stat-value">420</p>
            <p class="stat-label">Калории</p>
          </div>
        </div>
      </div>
      
      <div class="profile-details">
        <div class="detail-item">
          <h4>Персональная информация</h4>
          {#if userData?.last_name}
            <p>Фамилия: {userData.last_name}</p>
          {/if}
          <p>Пол: Мужской</p>
          <p>Возраст: 28 лет</p>
          <p>Рост: 180 см</p>
          <p>Вес: 75 кг</p>
        </div>
        
        <div class="detail-item">
          <h4>Цели</h4>
          <p>Еженедельная цель: 50 км</p>
          <div class="progress-container">
            <div class="progress-bar" style="width: 65%"></div>
          </div>
          <p>Прогресс: 32.5 / 50 км</p>
        </div>
        
        <div class="detail-item">
          <h4>Предпочтения</h4>
          <p>Единицы измерения: Метрические</p>
          <p>Уведомления: Включены</p>
          <p>Темная тема: Включена</p>
        </div>
      </div>
      
      <!-- Profile actions -->
      <div class="profile-actions">
        <Button on:click={handleEditProfile} variant="primary" size="medium">
          Редактировать профиль
        </Button>
        
        <Button on:click={handleShareProfile} variant="outline" size="medium">
          Поделиться профилем
        </Button>
        
        <Button on:click={handleExportData} variant="secondary" size="medium">
          Экспорт данных
        </Button>
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

<style>
  /* Import global styles */
  @import './app.css';
  
  /* Profile specific styles */
  .profile-card {
    width: 100%;
    max-width: 500px;
    margin: 0 auto 30px;
    padding: 25px;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(51, 51, 51, 0.2));
    backdrop-filter: blur(5px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 191, 255, 0.2);
    text-align: center;
  }
  
  .profile-header {
    margin-bottom: 25px;
  }
  
  .profile-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(0, 191, 255, 0.2), rgba(255, 20, 147, 0.2));
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
    border: 2px solid var(--primary-blue);
  }
  
  .profile-name {
    font-size: 1.8rem;
    font-weight: 800;
    margin-bottom: 5px;
    color: var(--white);
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .profile-username {
    font-size: 1.1rem;
    color: var(--light-gray);
    margin-bottom: 20px;
  }
  
  .profile-stats {
    display: flex;
    justify-content: space-around;
    gap: 15px;
  }
  
  .stat-item {
    flex: 1;
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--white);
    margin-bottom: 5px;
  }
  
  .stat-label {
    font-size: 0.9rem;
    color: var(--light-gray);
  }
  
  .profile-details {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .detail-item {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(51, 51, 51, 0.2));
    backdrop-filter: blur(5px);
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .detail-item h4 {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 15px;
    color: var(--white);
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .detail-item p {
    font-size: 1rem;
    color: var(--light-gray);
    margin-bottom: 8px;
  }
  
  .detail-item p:last-child {
    margin-bottom: 0;
  }
  
  /* Progress bar */
  .progress-container {
    width: 100%;
    height: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    overflow: hidden;
    margin-top: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-pink));
    border-radius: 6px;
    position: relative;
    overflow: hidden;
  }
  
  .progress-bar::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: shimmer 2s infinite;
  }
  
  /* Profile actions */
  .profile-actions {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
  }
  
  /* Animation keyframes - only keep the ones not in app.css */
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .profile-card {
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .profile-name {
      font-size: 1.5rem;
    }
    
    .profile-stats {
      gap: 10px;
    }
    
    .stat-value {
      font-size: 1.2rem;
    }
    
    .detail-item {
      padding: 15px;
      margin-bottom: 15px;
    }
    
    .detail-item h4 {
      font-size: 1.1rem;
      margin-bottom: 10px;
    }
  }
  
  @media (max-width: 480px) {
    .profile-card {
      padding: 15px;
    }
    
    .profile-avatar {
      width: 60px;
      height: 60px;
    }
    
    .profile-name {
      font-size: 1.3rem;
    }
    
    .profile-stats {
      flex-direction: column;
      gap: 15px;
    }
  }
</style>
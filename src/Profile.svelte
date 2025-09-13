<script>
  /** @type {{id?: number, first_name: string, last_name?: string, username?: string} | null} */
  export let userData = {
    id: 123456789,
    first_name: 'Тестовый',
    last_name: 'Пользователь',
    username: 'testuser'
  };
  
  // Handle back to dashboard
  export let handleBackToDashboard;
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
    </div>
  </div>
</div>

<style>
  /* Import global styles */
  @import './app.css';
  
  /* Animation keyframes - only keep the ones not in app.css */
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
</style>
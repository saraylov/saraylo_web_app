<script>
  export let setCurrentView;
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

<div class="app-container">
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
        on:click={() => setCurrentView('dashboard')}
        aria-label="Перейти к статистике"
      >
        <span>Перейти к статистике</span>
      </button>
      
      <p class="auth-status">Production by V Saraylo</p>
    </div>
  </div>
</div>
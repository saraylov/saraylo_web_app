<script>
  export let handleBackToDashboard;
  export let handleHealthClick;
  export let handleTrainingClick;
  export let handleDevicesClick;
  export let handleProfileClick;
  export let isInTrainingMode;
</script>

<!-- Bottom navigation panel -->
<div class="bottom-panel s-XsEmFtvddWTw">
  <div 
    class="nav-item"
    on:click={handleBackToDashboard}
    on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBackToDashboard(); }}
    role="button"
    tabindex="0"
    aria-label="Статистика"
  >
    <img src="images/Graf.png" alt="Статистика" width="24" height="24" />
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
      class:training-mode={isInTrainingMode}
      on:click={handleTrainingClick}
      on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTrainingClick(); }}
      role="button"
      tabindex="0"
      aria-label="Начать тренировку"
    >
      <img src="images/Run3.png" alt="Начать тренировку" width="40" height="40" />
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
    <img src="images/Smart.png" alt="Устройства" width="24" height="24" />
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
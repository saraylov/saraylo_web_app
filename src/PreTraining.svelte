<style>
  /* Import global styles */
  @import './styles/main.css';
  
  /* App container */
  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, var(--background-dark), var(--background-light));
    padding: clamp(10px, 2vw, 20px);
    position: relative;
    overflow-x: hidden;
  }
  
  /* Panel title */
  .panel-title {
    font-size: clamp(1.3rem, 3vw, 1.8rem);
    font-weight: 700;
    color: var(--white);
    margin: 0 0 clamp(15px, 2vw, 25px) 0;
    text-align: center;
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* Header icons */
  .header-icons {
    display: flex;
    gap: clamp(10px, 2vw, 20px);
    margin-bottom: clamp(20px, 3vw, 40px);
    width: 100%;
    justify-content: space-between;
  }
  
  /* Training settings panel */
  .training-settings-panel {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(51, 51, 51, 0.3));
    backdrop-filter: blur(5px);
    border-radius: var(--border-radius);
    padding: clamp(15px, 3vw, 25px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: var(--glass-shadow);
    width: 100%;
    box-sizing: border-box;
    margin-bottom: clamp(15px, 2vw, 30px);
  }
  
  /* Settings grid */
  .settings-grid {
    display: flex;
    flex-direction: column;
    gap: clamp(12px, 2vw, 20px);
  }
  
  /* Setting item */
  .setting-item {
    padding: clamp(10px, 2vw, 15px);
    border-radius: clamp(8px, 1.5vw, 12px);
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  /* Setting header */
  .setting-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: clamp(5px, 1vw, 10px);
  }
  
  /* Setting label */
  .setting-label {
    font-size: clamp(1rem, 2.5vw, 1.3rem);
    font-weight: 600;
    color: var(--white);
  }
  
  /* Setting duration */
  .setting-duration {
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    font-weight: 500;
    color: var(--light-gray);
    background: rgba(0, 191, 255, 0.2);
    padding: clamp(3px, 0.5vw, 6px) clamp(8px, 1.5vw, 12px);
    border-radius: clamp(5px, 1vw, 10px);
  }
  
  /* Setting description */
  .setting-description {
    font-size: clamp(0.85rem, 2vw, 1rem);
    color: var(--light-gray);
    margin: 0;
    line-height: 1.4;
  }
  
  /* Training selection section */
  .training-selection-section {
    display: flex;
    justify-content: center;
    margin: clamp(15px, 2vw, 25px) 0;
    width: 100%;
  }
  
  /* Training selection button */
  .training-selection-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(8px, 2vw, 15px);
    background: linear-gradient(135deg, rgba(0, 191, 255, 0.2), rgba(255, 20, 147, 0.2));
    border: 1px solid var(--glass-border);
    border-radius: clamp(12px, 2.5vw, 20px);
    padding: clamp(10px, 2vw, 18px) clamp(20px, 4vw, 40px);
    color: var(--white);
    font-weight: 600;
    font-size: clamp(1rem, 2.5vw, 1.2rem);
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px) rgba(0, 191, 255, 0.3);
    width: 100%;
    max-width: clamp(250px, 50vw, 400px);
  }
  
  .training-selection-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 clamp(6px, 1.5vw, 12px) clamp(12px, 3vw, 20px) rgba(0, 191, 255, 0.5);
    background: linear-gradient(135deg, rgba(0, 191, 255, 0.3), rgba(255, 20, 147, 0.3));
  }
  
  .training-selection-button:active {
    transform: translateY(1px);
    box-shadow: 0 clamp(2px, 0.5vw, 4px) clamp(4px, 1vw, 8px) rgba(0, 191, 255, 0.3);
  }
  
  /* Start training section */
  .start-training-section {
    display: flex;
    justify-content: center;
    margin-top: clamp(10px, 2vw, 20px);
    width: 100%;
    margin-bottom: clamp(20px, 3vw, 40px);
  }
  
  /* Start training button */
  .start-training-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(8px, 2vw, 15px);
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
    border: none;
    border-radius: clamp(12px, 2.5vw, 20px);
    padding: clamp(12px, 2.5vw, 20px) clamp(20px, 4vw, 40px);
    color: white;
    font-weight: 700;
    font-size: clamp(1rem, 2.5vw, 1.3rem);
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px) rgba(0, 191, 255, 0.4);
    width: 100%;
    max-width: clamp(250px, 50vw, 400px);
  }
  
  .start-training-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 clamp(6px, 1.5vw, 12px) clamp(12px, 3vw, 20px) rgba(0, 191, 255, 0.6);
    background: linear-gradient(135deg, var(--primary-pink), var(--primary-blue));
  }
  
  .start-training-button:active {
    transform: translateY(1px);
    box-shadow: 0 clamp(2px, 0.5vw, 4px) clamp(4px, 1vw, 8px) rgba(0, 191, 255, 0.4);
  }
  
  /* Menu overlay */
  .menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  }
  
  /* Menu container */
  .menu-container {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(51, 51, 51, 0.8));
    border-radius: var(--border-radius);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: var(--glass-shadow);
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: slideIn 0.3s ease;
  }
  
  /* Menu header */
  .menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: clamp(15px, 3vw, 25px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  /* Menu title */
  .menu-title {
    font-size: clamp(1.2rem, 3vw, 1.6rem);
    font-weight: 700;
    color: var(--white);
    margin: 0;
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* Menu close button */
  .menu-close {
    width: clamp(30px, 5vw, 40px);
    height: clamp(30px, 5vw, 40px);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .menu-close:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }
  
  /* Menu items */
  .menu-items {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    max-height: calc(80vh - 100px);
  }
  
  /* Menu item */
  .menu-item {
    padding: clamp(12px, 2vw, 20px) clamp(15px, 3vw, 25px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .menu-item:last-child {
    border-bottom: none;
  }
  
  .menu-item:hover {
    background: rgba(0, 191, 255, 0.1);
  }
  
  .menu-item.selected {
    background: rgba(0, 191, 255, 0.2);
  }
  
  /* Menu item content */
  .menu-item-content {
    display: flex;
    flex-direction: column;
    gap: clamp(5px, 1vw, 10px);
  }
  
  /* Menu item title */
  .menu-item-title {
    font-size: clamp(1rem, 2.5vw, 1.3rem);
    font-weight: 600;
    color: var(--white);
    margin: 0;
  }
  
  /* Menu item details */
  .menu-item-details {
    display: flex;
    gap: clamp(10px, 2vw, 20px);
  }
  
  /* Menu item duration */
  .menu-item-duration {
    font-size: clamp(0.8rem, 2vw, 1rem);
    color: var(--light-gray);
    background: rgba(0, 191, 255, 0.2);
    padding: clamp(3px, 0.5vw, 6px) clamp(8px, 1.5vw, 12px);
    border-radius: clamp(5px, 1vw, 10px);
  }
  
  /* Menu item intensity */
  .menu-item-intensity {
    font-size: clamp(0.8rem, 2vw, 1rem);
    color: var(--light-gray);
    background: rgba(255, 20, 147, 0.2);
    padding: clamp(3px, 0.5vw, 6px) clamp(8px, 1.5vw, 12px);
    border-radius: clamp(5px, 1vw, 10px);
  }
  
  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { 
      transform: translateY(-20px);
      opacity: 0;
    }
    to { 
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .training-settings-panel {
      padding: clamp(10px, 2vw, 15px);
    }
    
    .setting-item {
      padding: clamp(8px, 2vw, 12px);
    }
    
    .criteria-item {
      gap: clamp(8px, 2vw, 12px);
    }
  }
  
  @media (max-width: 480px) {
    .setting-header {
      flex-direction: column;
      align-items: flex-start;
      gap: clamp(3px, 0.5vw, 5px);
    }
    
    .setting-duration {
      align-self: flex-start;
    }
    
    .menu-item-details {
      flex-direction: column;
      gap: clamp(3px, 0.5vw, 5px);
    }
  }
</style>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import BottomNav from './BottomNav.svelte';
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Exported props
  export let handleBackToDashboard: () => void;
  export let handleStartTraining: () => void;
  export let handleHealthClick: () => void;
  export let handleTrainingClick: () => void;
  export let handleDevicesClick: () => void;
  export let handleProfileClick: () => void;
  export let handleSettingsClick: () => void;
  
  // Menu state
  let isMenuOpen = false;
  
  // Training options
  const trainingOptions = [
    { id: 1, title: 'Оценочная тренировка', duration: '15 мин', intensity: 'Низкая' },
    { id: 2, title: 'Базовая тренировка', duration: '20 мин', intensity: 'Низкая' },
    { id: 3, title: 'Интервальная тренировка', duration: '30 мин', intensity: 'Средняя' },
    { id: 4, title: 'Силовая тренировка', duration: '45 мин', intensity: 'Высокая' },
    { id: 5, title: 'Кардио тренировка', duration: '35 мин', intensity: 'Средняя' }
  ];
  
  // Selected training
  let selectedTraining = trainingOptions[0];
  
  // Toggle menu
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  // Select training
  function selectTraining(training: typeof trainingOptions[0]) {
    selectedTraining = training;
    isMenuOpen = false;
  }
  
  // Handle start training
  function handleStart() {
    dispatch('startTraining');
    if (handleStartTraining) handleStartTraining();
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

<div class="app-container">
  <div class="glass-panel">
    <!-- Header with back button -->
    <div class="header-icons">
      <div></div> <!-- Empty div for spacing -->
      <div 
        class="header-icon back-button" 
        on:click={handleBackToDashboard}
        role="button" 
        tabindex="0" 
        aria-label="Назад"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    
    <!-- Training settings panel -->
    <div class="training-settings-panel">
      <h2 class="panel-title">План тренировки</h2>
      <div class="settings-grid">
        <div class="setting-item">
          <div class="setting-header">
            <span class="setting-label">Разминка</span>
            <span class="setting-duration">5 мин</span>
          </div>
          <p class="setting-description">Легкая разминка для подготовки тела к нагрузке</p>
        </div>
        
        <div class="setting-item">
          <div class="setting-header">
            <span class="setting-label">Основная тренировка</span>
            <span class="setting-duration">{selectedTraining.duration}</span>
          </div>
          <p class="setting-description">{selectedTraining.title} с интенсивностью {selectedTraining.intensity}</p>
        </div>
        
        <div class="setting-item">
          <div class="setting-header">
            <span class="setting-label">Заминка</span>
            <span class="setting-duration">5 мин</span>
          </div>
          <p class="setting-description">Постепенное снижение нагрузки и растяжка</p>
        </div>
      </div>
    </div>
    
    <!-- Training selection button - moved between settings and criteria -->
    <div class="training-selection-section">
      <button class="training-selection-button" on:click={toggleMenu}>
        <span>Выбрать тренировку</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 9L12 5L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 15L12 19L8 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    
    <!-- Start training button -->
    <div class="start-training-section">
      <button class="start-training-button" on:click={handleStart}>
        Начать тренировку
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
  
  <!-- Menu overlay -->
  {#if isMenuOpen}
    <div class="menu-overlay" on:click={toggleMenu}>
      <div class="menu-container" on:click|stopPropagation>
        <div class="menu-header">
          <h3 class="menu-title">Выберите тренировку</h3>
          <div class="menu-close" on:click={toggleMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="menu-items">
          {#each trainingOptions as training}
            <div 
              class="menu-item" 
              on:click={() => selectTraining(training)}
              class:selected={training.id === selectedTraining.id}
            >
              <div class="menu-item-content">
                <h4 class="menu-item-title">{training.title}</h4>
                <div class="menu-item-details">
                  <span class="menu-item-duration">{training.duration}</span>
                  <span class="menu-item-intensity">{training.intensity}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<BottomNav 
  {handleBackToDashboard}
  {handleHealthClick}
  {handleTrainingClick}
  {handleDevicesClick}
  {handleProfileClick}
  {handleSettingsClick}
  isInTrainingMode={false}
/>
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { ASSESSMENT_ZONES, type UserCalibrationData } from './utils/assessmentTrainingTypes';
  import { SpeedDataCollector } from './utils/speedDataCollector';
  import { AudioInstructions } from './utils/audioInstructions';
  import { ZoneTransitionLogic } from './utils/zoneTransitionLogic';
  import { CalibrationCalculator } from './utils/calibrationCalculator';
  import { errorHandler } from './utils/errorHandler';
  import { saveUserCalibrationData, loadUserCalibrationData } from './utils/dataStorage';
  
  // Navigation handlers
  export let handleBackToDashboard: () => void;
  export let handleHealthClick: () => void;
  export let handleTrainingClick: () => void;
  export let handleDevicesClick: () => void;
  export let handleProfileClick: () => void;
  export let handleSettingsClick: () => void;
  
  // State variables
  let isAssessmentActive = false;
  let isAssessmentPaused = false;
  let currentZoneIndex = 0;
  let assessmentStartTime: Date | null = null;
  let currentTime: Date | null = null;
  let elapsedTime = 0;
  let showResults = false;
  let calibrationData: UserCalibrationData | null = null;
  let errorMessage: string | null = null;
  let isProcessing = false;
  
  // Initialize utilities
  const speedDataCollector = new SpeedDataCollector();
  const audioInstructions = new AudioInstructions();
  let zoneTransitionLogic: ZoneTransitionLogic | null = null;
  const calibrationCalculator = new CalibrationCalculator();
  
  // Initialize zone transition logic
  onMount(() => {
    zoneTransitionLogic = new ZoneTransitionLogic(
      ASSESSMENT_ZONES,
      (zoneIndex) => {
        currentZoneIndex = zoneIndex;
      },
      (data) => {
        handleTrainingComplete(data);
      },
      (error) => {
        handleAssessmentError(error);
      }
    );
    
    // Load previous calibration data if exists
    const savedData = loadUserCalibrationData();
    if (savedData) {
      calibrationData = savedData;
    }
  });
  
  // Clean up on destroy
  onDestroy(() => {
    if (zoneTransitionLogic) {
      zoneTransitionLogic.stopTraining();
    }
    speedDataCollector.stopCollecting();
    audioInstructions.mute();
  });
  
  // Function to start the assessment training
  async function startAssessment() {
    if (!zoneTransitionLogic) return;
    
    try {
      isProcessing = true;
      errorMessage = null;
      
      // Reset state
      isAssessmentActive = true;
      isAssessmentPaused = false;
      currentZoneIndex = 0;
      assessmentStartTime = new Date();
      currentTime = new Date();
      elapsedTime = 0;
      showResults = false;
      calibrationData = null;
      
      // Start the training
      await zoneTransitionLogic.startTraining();
      
      isProcessing = false;
    } catch (error) {
      console.error('Error starting assessment:', error);
      errorMessage = 'Failed to start assessment training. Please try again.';
      isProcessing = false;
      isAssessmentActive = false;
    }
  }
  
  // Function to pause the assessment training
  function pauseAssessment() {
    if (!zoneTransitionLogic || !isAssessmentActive) return;
    
    zoneTransitionLogic.pauseTraining();
    isAssessmentPaused = true;
    audioInstructions.playInstruction('PAUSE_NOTIFICATION');
  }
  
  // Function to resume the assessment training
  async function resumeAssessment() {
    if (!zoneTransitionLogic || !isAssessmentActive) return;
    
    try {
      isProcessing = true;
      errorMessage = null;
      
      await zoneTransitionLogic.resumeTraining();
      isAssessmentPaused = false;
      isProcessing = false;
    } catch (error) {
      console.error('Error resuming assessment:', error);
      errorMessage = 'Failed to resume assessment training. Please try again.';
      isProcessing = false;
    }
  }
  
  // Function to stop the assessment training
  function stopAssessment() {
    if (!zoneTransitionLogic) return;
    
    zoneTransitionLogic.stopTraining();
    isAssessmentActive = false;
    isAssessmentPaused = false;
    speedDataCollector.stopCollecting();
    audioInstructions.mute();
  }
  
  // Function to handle training completion
  function handleTrainingComplete(data: UserCalibrationData) {
    calibrationData = data;
    showResults = true;
    isAssessmentActive = false;
    isAssessmentPaused = false;
    
    // Save calibration data
    saveUserCalibrationData(data);
    
    // Play completion audio
    audioInstructions.playInstruction('RESUME_NOTIFICATION'); // Using this for completion message
  }
  
  // Function to handle assessment errors
  function handleAssessmentError(error: any) {
    errorMessage = error.message;
    
    if (error.type === 'DATA_LOSS' && error.needsRetry) {
      // For data loss that needs retry, we let the zone transition logic handle it
      return;
    }
    
    if (error.type === 'DATA_LOSS' && !error.needsRetry) {
      // For data loss that doesn't need retry, pause the training
      pauseAssessment();
    }
    
    // For other errors, show message
    console.error('Assessment error:', error);
  }
  
  // Function to restart assessment
  function restartAssessment() {
    stopAssessment();
    showResults = false;
    errorMessage = null;
    setTimeout(() => {
      startAssessment();
    }, 500);
  }
  
  // Function to format time (mm:ss)
  function formatTime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  
  // Function to get current zone
  function getCurrentZone() {
    return ASSESSMENT_ZONES[currentZoneIndex];
  }
  
  // Function to get time remaining in current zone
  function getTimeRemainingInZone(): number {
    if (!assessmentStartTime) return 0;
    
    // Calculate cumulative time for previous zones
    let cumulativeTime = 0;
    for (let i = 0; i < currentZoneIndex; i++) {
      cumulativeTime += ASSESSMENT_ZONES[i].duration;
    }
    
    // Calculate elapsed time since start
    const totalTimeElapsed = elapsedTime;
    
    // Calculate time elapsed in current zone
    const timeInCurrentZone = totalTimeElapsed - cumulativeTime;
    
    // Calculate time remaining in current zone
    const timeRemaining = ASSESSMENT_ZONES[currentZoneIndex].duration - timeInCurrentZone;
    
    return Math.max(0, timeRemaining);
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
    <!-- Header -->
    <div class="dashboard-header-container">
      <div class="dashboard-header">
        <h1 class="dashboard-title">Аудио-ассистентная оценочная тренировка</h1>
      </div>
    </div>
    
    <!-- Main content -->
    <div class="dashboard-main">
      {#if !isAssessmentActive && !showResults}
        <!-- Preparation and initialization phase -->
        <div class="assessment-info">
          <h2>Подготовка к оценочной тренировке</h2>
          <p>Оценочная тренировка поможет определить ваши индивидуальные зоны интенсивности с помощью аудио-ассистента.</p>
          
          <div class="zones-info">
            <h3>Параметры тренировки:</h3>
            <ul>
              <li>Количество зон интенсивности: 5</li>
              <li>Общая длительность: 20 минут</li>
              <li>Аудио-инструкции в режиме реального времени</li>
            </ul>
          </div>
          
          <div class="zones-timeline">
            <h3>Расписание зон:</h3>
            {#each ASSESSMENT_ZONES as zone}
            <div class="zone-timeline-item">
              <div class="zone-color" style="background-color: {zone.color};"></div>
              <div class="zone-details">
                <span class="zone-name">{zone.name} зона</span>
                <span class="zone-duration">{zone.duration / 60000} мин</span>
                <span class="zone-effort">
                  {#if zone.targetEffort > 0}
                    {zone.targetEffort}%
                  {:else}
                    {zone.targetEffortRange?.min}-{zone.targetEffortRange?.max}%
                  {/if}
                </span>
              </div>
            </div>
            {/each}
          </div>
          
          {#if calibrationData}
            <div class="previous-results">
              <h3>Последняя калибровка:</h3>
              <p>Дата: {new Date(calibrationData.timestamp).toLocaleDateString('ru-RU')}</p>
              <button class="view-results-btn" on:click={() => showResults = true}>
                Просмотреть результаты
              </button>
            </div>
          {/if}
          
          <button class="start-assessment-btn" on:click={startAssessment} disabled={isProcessing}>
            {isProcessing ? 'Запуск...' : 'Начать оценочную тренировку'}
          </button>
          
          {#if errorMessage}
            <div class="error-message">
              {errorMessage}
            </div>
          {/if}
        </div>
      {:else if isAssessmentActive}
        <!-- Execution phase -->
        <div class="assessment-active">
          <div class="timer-display">
            <h2>Оценочная тренировка</h2>
            <div class="time-remaining">
              Осталось: {formatTime(getTimeRemainingInZone())}
            </div>
          </div>
          
          <div class="current-zone">
            <h3>Текущая зона:</h3>
            <div class="zone-indicator" style="background-color: {getCurrentZone().color};">
              <span class="zone-text">БЕГАЙТЕ В {getCurrentZone().name.toUpperCase()} ЗОНЕ</span>
            </div>
            <div class="zone-effort">
              Целевое усилие: 
              {#if getCurrentZone().targetEffort > 0}
                {getCurrentZone().targetEffort}%
              {:else}
                {getCurrentZone().targetEffortRange?.min}-{getCurrentZone().targetEffortRange?.max}%
              {/if}
            </div>
          </div>
          
          <div class="shield-content">
            <div class="location-message">
              <p>Сбор данных о скорости...</p>
              <div class="spinner"></div>
            </div>
          </div>
          
          <div class="training-controls">
            {#if isAssessmentPaused}
              <button class="resume-btn" on:click={resumeAssessment} disabled={isProcessing}>
                {isProcessing ? 'Возобновление...' : 'Продолжить'}
              </button>
            {:else}
              <button class="pause-btn" on:click={pauseAssessment}>
                Пауза
              </button>
            {/if}
            <button class="stop-btn" on:click={stopAssessment}>
              Завершить
            </button>
          </div>
          
          {#if errorMessage}
            <div class="error-message">
              {errorMessage}
            </div>
          {/if}
        </div>
      {:else if showResults}
        <!-- Results processing phase -->
        <div class="assessment-results">
          <h2>Результаты оценочной тренировки</h2>
          
          {#if calibrationData}
            <div class="calibration-info">
              <p>Калибровка завершена: {new Date(calibrationData.timestamp).toLocaleString('ru-RU')}</p>
            </div>
            
            <div class="zones-results">
              <h3>Ваши индивидуальные зоны интенсивности:</h3>
              <div class="zones-grid">
                {#each calibrationData.zones as zone, i}
                  <div class="zone-result-card" style="border-left: 5px solid {ASSESSMENT_ZONES[i].color};">
                    <h4>{zone.name} зона</h4>
                    <p>{zone.speedRange.min.toFixed(1)} - {zone.speedRange.max.toFixed(1)} км/ч</p>
                  </div>
                {/each}
              </div>
            </div>
            
            <div class="recommendations">
              <h3>Рекомендации:</h3>
              <ul>
                <li>Используйте эти зоны для планирования своих тренировок</li>
                <li>Следуйте модели 80/20: 80% времени в низких зонах, 20% в высоких</li>
                <li>Повторяйте оценочную тренировку каждые 4-6 месяцев для актуализации зон</li>
              </ul>
            </div>
          {:else}
            <p>Не удалось рассчитать зоны интенсивности. Попробуйте повторить тренировку.</p>
          {/if}
          
          <div class="results-actions">
            <button class="restart-btn" on:click={restartAssessment}>
              Повторить оценочную тренировку
            </button>
            <button class="back-btn" on:click={() => { showResults = false; }}>
              Назад
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
  
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
        class:training-mode={true}
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
</div>

<style>
  /* Import existing styles from app.css */
  @import './app.css';
  
  /* Assessment specific styles */
  .assessment-info, .assessment-active, .assessment-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 20px;
  }
  
  .zones-info, .zones-timeline, .zones-results, .recommendations, .previous-results {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(5px);
    border-radius: 15px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
    max-width: 600px;
  }
  
  .zones-timeline {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .zone-timeline-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }
  
  .zone-color {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  
  .zone-details {
    display: flex;
    justify-content: space-between;
    flex: 1;
    font-size: 0.9rem;
  }
  
  .start-assessment-btn, .restart-btn, .back-btn, .view-results-btn, .pause-btn, .resume-btn, .stop-btn {
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
    color: white;
    border: none;
    border-radius: 25px;
    padding: 15px 30px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 10px 0;
    min-width: 200px;
  }
  
  .start-assessment-btn:hover, .restart-btn:hover, .back-btn:hover, .view-results-btn:hover,
  .pause-btn:hover, .resume-btn:hover, .stop-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 191, 255, 0.4);
  }
  
  .start-assessment-btn:disabled, .resume-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  .pause-btn, .stop-btn {
    background: linear-gradient(135deg, #6c757d, #495057);
    min-width: 120px;
  }
  
  .stop-btn {
    background: linear-gradient(135deg, #dc3545, #c82333);
  }
  
  .timer-display {
    text-align: center;
  }
  
  .time-remaining {
    font-size: 1.5rem;
    font-weight: 700;
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .current-zone {
    text-align: center;
    width: 100%;
  }
  
  .zone-indicator {
    padding: 20px;
    border-radius: 15px;
    margin: 15px 0;
    animation: pulse 2s infinite;
  }
  
  .zone-text {
    font-size: 1.3rem;
    font-weight: 700;
    color: white;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
  
  .zone-effort {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--light-gray);
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }
  
  /* Container for header with left panel */
  .dashboard-header-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: 15px;
  }
  
  /* Compact dashboard header styles */
  .dashboard-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(51, 51, 51, 0.2));
    border-radius: 10px;
    padding: 8px 15px;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 551px;
    margin: 0 auto;
  }
  
  .dashboard-title {
    font-size: clamp(1.3rem, 4vw, 2rem);
    font-weight: 800;
    margin: 0;
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 clamp(5px, 1vw, 12px) rgba(0, 191, 255, 0.3);
    flex-grow: 0;
    text-align: center;
  }
  
  .shield-content {
    width: 100%;
    height: 40vh;
    border-radius: 15px;
    margin: 15px 0;
    position: relative;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .location-message {
    text-align: center;
    color: var(--light-gray);
  }
  
  .spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 4px solid var(--primary-blue);
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 15px auto;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .training-controls {
    display: flex;
    gap: 15px;
    justify-content: center;
    width: 100%;
    margin: 20px 0;
  }
  
  .zones-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
    margin: 20px 0;
  }
  
  .zone-result-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    padding: 15px;
    text-align: center;
  }
  
  .zone-result-card h4 {
    margin-bottom: 10px;
    color: var(--light-gray);
  }
  
  .error-message {
    background: rgba(220, 53, 69, 0.2);
    border: 1px solid #dc3545;
    border-radius: 10px;
    padding: 15px;
    color: #ff8888;
    text-align: center;
    width: 100%;
    max-width: 600px;
  }
  
  .results-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
    margin: 20px 0;
  }
  
  .calibration-info {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(5px);
    border-radius: 15px;
    padding: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
    max-width: 600px;
    text-align: center;
    color: var(--light-gray);
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .zones-grid {
      grid-template-columns: 1fr;
    }
    
    .shield-content {
      height: 30vh;
    }
    
    .training-controls {
      flex-direction: column;
      align-items: center;
    }
    
    .zone-details {
      flex-direction: column;
      gap: 5px;
      align-items: flex-start;
    }
  }
  
  @media (max-width: 480px) {
    .zones-info, .zones-timeline, .zones-results, .recommendations, .previous-results {
      padding: 15px;
    }
    
    .shield-content {
      height: 25vh;
    }
    
    .start-assessment-btn, .restart-btn, .back-btn, .view-results-btn {
      min-width: auto;
      width: 100%;
      max-width: 300px;
    }
  }
</style>
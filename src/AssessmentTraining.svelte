<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  
  // Navigation handlers
  export let handleBackToDashboard: () => void;
  export let handleHealthClick: () => void;
  export let handleTrainingClick: () => void;
  export let handleDevicesClick: () => void;
  export let handleProfileClick: () => void;
  export let handleSettingsClick: () => void;
  
  // Assessment training parameters
  const ASSESSMENT_DURATION = 20 * 60 * 1000; // 20 minutes in milliseconds
  const ZONES = [
    { id: 1, name: 'Синяя', color: '#00BFFF', duration: 6 * 60 * 1000 }, // 6 minutes
    { id: 2, name: 'Зеленая', color: '#18FF00', duration: 5 * 60 * 1000 }, // 5 minutes
    { id: 3, name: 'Жёлтая', color: '#FFFC00', duration: 5 * 60 * 1000 }, // 5 minutes
    { id: 4, name: 'Оранжевая', color: '#FF8800', duration: 3 * 60 * 1000 }, // 3 minutes
    { id: 5, name: 'Красная', color: '#9B0000', duration: 1 * 60 * 1000 }  // 1 minute
  ];
  
  // State variables
  let isAssessmentActive = false;
  let assessmentStartTime: Date | null = null;
  let currentTime: Date | null = null;
  let elapsedTime = 0;
  let currentZoneIndex = 0;
  let speedData: { speed: number; timestamp: number }[] = [];
  let timeInZones = [0, 0, 0, 0, 0]; // Time spent in each zone
  let assessmentInterval: number | undefined;
  let zoneInterval: number | undefined;
  let map: mapboxgl.Map | undefined;
  let mapContainer: HTMLElement | undefined;
  let marker: mapboxgl.Marker | undefined;
  let geolocateControl: mapboxgl.GeolocateControl | undefined;
  let isLocating = false;
  let locationError = false;
  let userLocation: [number, number] | null = null;
  let watchId: number | null = null;
  let previousPosition: [number, number] | null = null;
  let initialLocationSet = false;
  
  // Kalman filter variables for speed smoothing
  let kalmanState = 0;
  let kalmanCovariance = 1;
  let kalmanProcessNoise = 0.01;
  let kalmanMeasurementNoise = 0.1;
  
  // UI state
  let showResults = false;
  let intensityZones: { lb: number; ub: number; zones: { min: number; max: number }[] } | null = null;
  
  // Helper function to apply Kalman filter to speed data
  function applyKalmanFilter(measurement: number): number {
    // Prediction step
    kalmanState = kalmanState; // Constant velocity model
    kalmanCovariance = kalmanCovariance + kalmanProcessNoise;
    
    // Update step
    const kalmanGain = kalmanCovariance / (kalmanCovariance + kalmanMeasurementNoise);
    kalmanState = kalmanState + kalmanGain * (measurement - kalmanState);
    kalmanCovariance = (1 - kalmanGain) * kalmanCovariance;
    
    return kalmanState;
  }
  
  // Function to calculate distance between two points (in meters)
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
  }
  
  // Function to simulate getting speed from GPS (in a real app, this would come from the geolocation API)
  function getSpeedFromGPS(): number {
    // In a real implementation, this would calculate speed based on position changes
    // For simulation, we'll generate realistic running speeds
    if (!isAssessmentActive) return 0;
    
    // Generate speed based on current zone
    const zone = ZONES[currentZoneIndex];
    let minSpeed, maxSpeed;
    
    switch(zone.id) {
      case 1: // Blue zone - slowest
        minSpeed = 2.5; // 9 km/h
        maxSpeed = 3.5; // 12.6 km/h
        break;
      case 2: // Green zone
        minSpeed = 3.0; // 10.8 km/h
        maxSpeed = 4.2; // 15.1 km/h
        break;
      case 3: // Yellow zone
        minSpeed = 3.8; // 13.7 km/h
        maxSpeed = 5.0; // 18 km/h
        break;
      case 4: // Orange zone
        minSpeed = 4.5; // 16.2 km/h
        maxSpeed = 6.0; // 21.6 km/h
        break;
      case 5: // Red zone - fastest
        minSpeed = 5.5; // 19.8 km/h
        maxSpeed = 7.5; // 27 km/h
        break;
      default:
        minSpeed = 3.0;
        maxSpeed = 4.0;
    }
    
    // Add some random variation
    const variation = (Math.random() - 0.5) * 0.5;
    const rawSpeed = minSpeed + Math.random() * (maxSpeed - minSpeed) + variation;
    
    // Apply Kalman filter to smooth the speed
    return applyKalmanFilter(Math.max(0, rawSpeed));
  }
  
  // Function to start the assessment training
  function startAssessment() {
    isAssessmentActive = true;
    assessmentStartTime = new Date();
    currentTime = new Date();
    elapsedTime = 0;
    speedData = [];
    timeInZones = [0, 0, 0, 0, 0];
    currentZoneIndex = 0;
    showResults = false;
    intensityZones = null;
    
    // Reset Kalman filter
    kalmanState = 0;
    kalmanCovariance = 1;
    
    // Start the assessment timer
    assessmentInterval = window.setInterval(() => {
      if (!isAssessmentActive) return;
      
      currentTime = new Date();
      elapsedTime = currentTime.getTime() - (assessmentStartTime?.getTime() || 0);
      
      // Check if assessment is complete
      if (elapsedTime >= ASSESSMENT_DURATION) {
        finishAssessment();
        return;
      }
      
      // Get current speed and store it
      const currentSpeed = getSpeedFromGPS();
      speedData.push({ speed: currentSpeed, timestamp: currentTime.getTime() });
      
      // Update time in current zone
      timeInZones[currentZoneIndex] += 1000; // Assuming we're called every second
      
    }, 1000);
    
    // Start zone transition timer
    zoneInterval = window.setInterval(() => {
      if (!isAssessmentActive) return;
      
      // Calculate cumulative time for zone transitions
      let cumulativeTime = 0;
      for (let i = 0; i <= currentZoneIndex; i++) {
        cumulativeTime += ZONES[i].duration;
      }
      
      // Move to next zone if time has elapsed
      if (elapsedTime >= cumulativeTime && currentZoneIndex < ZONES.length - 1) {
        currentZoneIndex++;
        // In a real app, we might play a voice notification here
        console.log(`Moving to ${ZONES[currentZoneIndex].name} zone`);
      }
    }, 1000);
  }
  
  // Function to finish the assessment and calculate results
  function finishAssessment() {
    isAssessmentActive = false;
    
    if (assessmentInterval) {
      clearInterval(assessmentInterval);
    }
    
    if (zoneInterval) {
      clearInterval(zoneInterval);
    }
    
    // Calculate intensity zones based on percentiles
    calculateIntensityZones();
    
    // Show results
    showResults = true;
    
    // Save results to user profile
    saveAssessmentResults();
  }
  
  // Function to calculate intensity zones based on 20th and 80th percentiles
  function calculateIntensityZones() {
    if (speedData.length === 0) return;
    
    // Sort speeds
    const speeds = speedData.map(data => data.speed).sort((a, b) => a - b);
    
    // Calculate 20th and 80th percentiles
    const percentile20Index = Math.floor(speeds.length * 0.2);
    const percentile80Index = Math.floor(speeds.length * 0.8);
    
    const lb = speeds[percentile20Index]; // Lower bound
    const ub = speeds[percentile80Index]; // Upper bound
    const range = ub - lb;
    
    // Calculate zone boundaries
    const zones = [
      { min: lb, max: lb + 0.15 * range }, // 0-15%
      { min: lb + 0.15 * range, max: lb + 0.25 * range }, // 16-25%
      { min: lb + 0.25 * range, max: lb + 0.50 * range }, // 26-50%
      { min: lb + 0.50 * range, max: lb + 0.75 * range }, // 51-75%
      { min: lb + 0.75 * range, max: ub } // 76-100%
    ];
    
    intensityZones = { lb, ub, zones };
  }
  
  // Function to save assessment results to user profile
  function saveAssessmentResults() {
    if (!intensityZones) return;
    
    try {
      const assessmentData = {
        date: new Date().toISOString(),
        zones: intensityZones.zones,
        lb: intensityZones.lb,
        ub: intensityZones.ub,
        speedData: speedData
      };
      
      localStorage.setItem('assessmentTrainingResults', JSON.stringify(assessmentData));
      console.log('Assessment results saved to localStorage');
    } catch (error) {
      console.error('Error saving assessment results:', error);
    }
  }
  
  // Function to load previous assessment results
  function loadPreviousResults() {
    try {
      const savedData = localStorage.getItem('assessmentTrainingResults');
      if (savedData) {
        const assessmentData = JSON.parse(savedData);
        // In a real app, we would display these results
        console.log('Previous assessment results loaded:', assessmentData);
      }
    } catch (error) {
      console.error('Error loading assessment results:', error);
    }
  }
  
  // Function to initialize the map
  function initializeMap() {
    try {
      mapboxgl.accessToken = 'pk.eyJ1Ijoia29tbXVuMTV0IiwiYSI6ImNtZmk1ZzlsNTBoejAybHF3ejR6bjEwZ3oifQ.GHO6tJYDnc03P7fxUshk8A';
      
      if (!mapContainer) {
        console.error('Map container not found');
        return;
      }
      
      map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [30.3158, 59.9343], // Default to St. Petersburg
        zoom: 17,
        maxZoom: 23,
        minZoom: 10,
        pitch: 0,
        bearing: 0
      });
      
      // Add navigation controls
      if (map) {
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      }
      
      // Add geolocate control
      if (map) {
        geolocateControl = new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true
        });
        
        map.addControl(geolocateControl);
        
        // Listen for geolocation events
        geolocateControl.on('geolocate', (position) => {
          locationError = false;
          isLocating = false;
          
          if (position && position.coords && map) {
            userLocation = [position.coords.longitude, position.coords.latitude];
            
            // Update marker position or create new marker
            if (marker) {
              marker.setLngLat([position.coords.longitude, position.coords.latitude]);
            } else {
              const el = document.createElement('div');
              el.className = 'runner-marker';
              marker = new mapboxgl.Marker({ element: el })
                .setLngLat([position.coords.longitude, position.coords.latitude])
                .addTo(map);
            }
            
            // Center map on user
            if (!initialLocationSet) {
              map.setCenter([position.coords.longitude, position.coords.latitude]);
              initialLocationSet = true;
            } else {
              map.easeTo({
                center: [position.coords.longitude, position.coords.latitude],
                zoom: 17,
                duration: 1000
              });
            }
          }
        });
        
        geolocateControl.on('error', (error) => {
          console.error('Geolocation error:', error);
          locationError = true;
          isLocating = false;
        });
        
        map.on('load', () => {
          setTimeout(() => {
            if (geolocateControl) {
              isLocating = true;
              // @ts-ignore
              geolocateControl.trigger();
            }
          }, 500);
        });
      }
    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
    }
  }
  
  onMount(() => {
    // Initialize the map
    initializeMap();
    
    // Load previous results
    loadPreviousResults();
  });
  
  onDestroy(() => {
    if (assessmentInterval) {
      clearInterval(assessmentInterval);
    }
    
    if (zoneInterval) {
      clearInterval(zoneInterval);
    }
    
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }
  });
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
        <h1 class="dashboard-title">Оценочная тренировка</h1>
      </div>
    </div>
    
    <!-- Main content -->
    <div class="dashboard-main">
      {#if !isAssessmentActive && !showResults}
        <!-- Preparation and initialization phase -->
        <div class="assessment-info">
          <h2>Подготовка к оценочной тренировке</h2>
          <p>Оценочная тренировка поможет определить ваши индивидуальные зоны интенсивности.</p>
          
          <div class="zones-info">
            <h3>Параметры тренировки:</h3>
            <ul>
              <li>Длительность: 20 минут</li>
              <li>Количество зон интенсивности: 5</li>
              <li>Общее время: {ASSESSMENT_DURATION / 60000} минут</li>
            </ul>
          </div>
          
          <div class="zones-timeline">
            <h3>Расписание зон:</h3>
            {#each ZONES as zone}
            <div class="zone-timeline-item">
              <div class="zone-color" style="background-color: {zone.color};"></div>
              <div class="zone-details">
                <span class="zone-name">{zone.name} зона</span>
                <span class="zone-duration">{zone.duration / 60000} мин</span>
              </div>
            </div>
            {/each}
          </div>
          
          <button class="start-assessment-btn" on:click={startAssessment}>
            Начать оценочную тренировку
          </button>
        </div>
      {:else if isAssessmentActive}
        <!-- Execution phase -->
        <div class="assessment-active">
          <div class="timer-display">
            <h2>Оценочная тренировка</h2>
            <div class="time-remaining">
              Осталось: {Math.max(0, Math.floor((ASSESSMENT_DURATION - elapsedTime) / 60000))}:
              {String(Math.max(0, Math.floor((ASSESSMENT_DURATION - elapsedTime) % 60000 / 1000))).padStart(2, '0')}
            </div>
          </div>
          
          <div class="current-zone">
            <h3>Текущая зона:</h3>
            <div class="zone-indicator" style="background-color: {ZONES[currentZoneIndex].color};">
              <span class="zone-text">БЕГАЙТЕ В {ZONES[currentZoneIndex].name.toUpperCase()} ЗОНЕ</span>
            </div>
          </div>
          
          <div class="shield-content" bind:this={mapContainer}>
            {#if isLocating}
              <div class="location-message">
                <p>Поиск вашего местоположения...</p>
                <div class="spinner"></div>
              </div>
            {/if}
            
            {#if locationError}
              <div class="location-error">
                <p>Не удалось определить местоположение.</p>
              </div>
            {/if}
          </div>
          
          <div class="training-stats s-nHmVefn3S3wX">
            <div class="stat-card s-nHmVefn3S3wX">
              <h4 class="s-nHmVefn3S3wX">Время</h4>
              <p class="stat-value s-nHmVefn3S3wX">
                {Math.floor(elapsedTime / 60000)}:{String(Math.floor((elapsedTime % 60000) / 1000)).padStart(2, '0')}
              </p>
            </div>
            <div class="stat-card s-nHmVefn3S3wX">
              <h4 class="s-nHmVefn3S3wX">Скорость</h4>
              <p class="stat-value s-nHmVefn3S3wX">
                {speedData.length > 0 ? (speedData[speedData.length - 1].speed * 3.6).toFixed(1) : '0.0'} км/ч
              </p>
            </div>
            <div class="stat-card s-nHmVefn3S3wX">
              <h4 class="s-nHmVefn3S3wX">Зона</h4>
              <p class="stat-value s-nHmVefn3S3wX">{ZONES[currentZoneIndex].name}</p>
            </div>
          </div>
        </div>
      {:else if showResults}
        <!-- Results processing phase -->
        <div class="assessment-results">
          <h2>Результаты оценочной тренировки</h2>
          
          {#if intensityZones}
            <div class="zones-results">
              <h3>Ваши индивидуальные зоны интенсивности:</h3>
              <div class="zones-grid">
                {#each intensityZones.zones as zone, i}
                  <div class="zone-result-card" style="border-left: 5px solid {ZONES[i].color};">
                    <h4>{ZONES[i].name} зона ({i === 0 ? '0-15%' : i === 1 ? '16-25%' : i === 2 ? '26-50%' : i === 3 ? '51-75%' : '76-100%'})</h4>
                    <p>{(zone.min * 3.6).toFixed(1)} - {(zone.max * 3.6).toFixed(1)} км/ч</p>
                  </div>
                {/each}
              </div>
            </div>
            
            <div class="visualization">
              <h3>Время в зонах:</h3>
              <div class="time-in-zones-chart">
                {#each timeInZones as time, i}
                  <div class="zone-bar">
                    <div class="zone-bar-fill" style="height: {Math.min(100, (time / (ZONES[i].duration) * 100))}%; background-color: {ZONES[i].color};"></div>
                    <span class="zone-label">{ZONES[i].name}</span>
                    <span class="time-label">{Math.floor(time / 60000)}:{String(Math.floor((time % 60000) / 1000)).padStart(2, '0')}</span>
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
            
            <!-- Red Zone Information Visualization -->
            <div class="red-zone-info">
              <h3>Информация о красной зоне скорости</h3>
              <div class="red-zone-details">
                <div class="red-zone-card">
                  <h4>Максимальная скорость в красной зоне</h4>
                  {#if speedData.length > 0}
                    <p class="stat-value">
                      {#if timeInZones[4] > 0}
                        {#if speedData.length >= 5}
                          {Math.max(...speedData.slice(-5).map(d => d.speed * 3.6)).toFixed(1)} км/ч
                        {:else}
                          {#if speedData.length > 0}
                            {(speedData[speedData.length - 1].speed * 3.6).toFixed(1)} км/ч
                          {:else}
                            0.0 км/ч
                          {/if}
                        {/if}
                      {:else}
                        0.0 км/ч
                      {/if}
                    </p>
                  {/if}
                </div>
                
                <div class="red-zone-card">
                  <h4>Время в красной зоне</h4>
                  <p class="stat-value">{Math.floor(timeInZones[4] / 60000)}:{String(Math.floor((timeInZones[4] % 60000) / 1000)).padStart(2, '0')}</p>
                </div>
                
                <div class="red-zone-card">
                  <h4>Средняя скорость в красной зоне</h4>
                  {#if speedData.length > 0 && timeInZones[4] > 0}
                    {#if speedData.length >= 5}
                      {#if speedData.slice(-5).length > 0}
                        {(speedData.slice(-5).reduce((sum, data) => sum + data.speed * 3.6, 0) / speedData.slice(-5).length).toFixed(1)} км/ч
                      {:else}
                        0.0 км/ч
                      {/if}
                    {:else}
                      {#if speedData.length > 0}
                        {(speedData[speedData.length - 1].speed * 3.6).toFixed(1)} км/ч
                      {:else}
                        0.0 км/ч
                      {/if}
                    {/if}
                  {:else}
                    <p class="stat-value">0.0 км/ч</p>
                  {/if}
                </div>
              </div>
              
              <div class="red-zone-explanation">
                <h4>О красной зоне:</h4>
                <p>Красная зона (#9B0000) - это зона максимальной интенсивности, которая активируется в последние 60 секунд оценочной тренировки. 
                Эта зона помогает определить ваш пиковый уровень производительности и используется для расчета ваших персональных зон интенсивности.</p>
                <p>Максимальная зафиксированная скорость в этой зоне составляет важный показатель для определения ваших спортивных возможностей.</p>
              </div>
            </div>
          {:else}
            <p>Не удалось рассчитать зоны интенсивности. Попробуйте повторить тренировку.</p>
          {/if}
          
          <button class="restart-btn" on:click={() => { showResults = false; }}>
            Повторить оценочную тренировку
          </button>
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
  
  .zones-info, .zones-timeline, .zones-results, .visualization, .recommendations {
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
  }
  
  .start-assessment-btn, .restart-btn {
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
    color: white;
    border: none;
    border-radius: 25px;
    padding: 15px 30px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 20px 0;
  }
  
  .start-assessment-btn:hover, .restart-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 191, 255, 0.4);
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
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }
  
  /* Container for map and stats to eliminate gap */
  .map-stats-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0;
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
  
  .training-stats {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: clamp(8px, 2vw, 15px);
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    border-radius: clamp(10px, 2vw, 20px);
    padding: clamp(10px, 1.5vw, 15px);
    border: clamp(1px, 0.2vw, 2px) solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 clamp(5px, 1vw, 10px) clamp(15px, 2vw, 35px) rgba(0, 191, 255, 0.2);
    box-sizing: border-box;
    width: 100%;
    max-width: min(100%, clamp(280px, 90vw, 600px));
    margin-top: 0;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    z-index: 2;
    min-height: auto;
    height: auto;
  }
  
  .stat-card {
    text-align: center;
    padding: clamp(5px, 1vw, 10px);
    min-height: clamp(35px, 5vh, 60px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    width: 33%;
    min-width: 0;
  }
  
  .stat-card h4 {
    font-size: clamp(0.8rem, 2vw, 1.1rem);
    color: var(--light-gray);
    margin-bottom: clamp(3px, 1vw, 8px);
  }
  
  .stat-value {
    font-size: clamp(0.7rem, 2vw, 1rem);
    font-weight: 700;
    color: var(--white);
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
  
  .shield-content {
    width: 100%;
    height: 40vh;
    border-radius: 15px;
    margin-bottom: 15px;
    position: relative;
    overflow: hidden;
  }
  
  .shield-content > div {
    width: 100%;
    height: 100%;
  }
  
  .shield-content :global(.mapboxgl-map) {
    width: 100%;
    height: 100%;
    border-radius: clamp(8px, 2vw, 15px);
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
  
  .time-in-zones-chart {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 150px;
    gap: 10px;
    margin: 20px 0;
  }
  
  .zone-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    gap: 5px;
  }
  
  .zone-bar-fill {
    width: 100%;
    border-radius: 5px 5px 0 0;
    transition: height 0.5s ease;
  }
  
  .zone-label, .time-label {
    font-size: 0.9rem;
  }
  
  .zone-label {
    font-weight: 600;
  }
  
  /* Red Zone Information Styles */
  .red-zone-info {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(5px);
    border-radius: 15px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
    max-width: 600px;
    margin-top: 20px;
  }
  
  .red-zone-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin: 20px 0;
  }
  
  .red-zone-card {
    background: rgba(155, 0, 0, 0.2);
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    border: 1px solid #9b0000;
  }
  
  .red-zone-card h4 {
    color: #ff8888;
    margin-bottom: 10px;
  }
  
  .red-zone-explanation {
    margin-top: 20px;
    padding: 15px;
    background: rgba(155, 0, 0, 0.1);
    border-radius: 10px;
    border-left: 3px solid #9b0000;
  }
  
  .red-zone-explanation h4 {
    color: #ff8888;
    margin-bottom: 10px;
  }
  
  .red-zone-explanation p {
    margin-bottom: 10px;
    line-height: 1.5;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .zones-grid {
      grid-template-columns: 1fr;
    }
    
    .shield-content {
      height: 30vh;
    }
    
    .time-in-zones-chart {
      height: 120px;
    }
    
    .red-zone-details {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 480px) {
    .zones-info, .zones-timeline, .zones-results, .visualization, .recommendations {
      padding: 15px;
    }
    
    .zone-details {
      flex-direction: column;
      gap: 5px;
    }
    
    .shield-content {
      height: 25vh;
    }
    
    .time-in-zones-chart {
      height: 100px;
    }
  }
</style>
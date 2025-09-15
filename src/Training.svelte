<script lang="ts">
  // Handle back to dashboard
  export let handleBackToDashboard: () => void;
  
  // Navigation handlers
  export let handleHealthClick: () => void;
  export let handleTrainingClick: () => void;
  export let handleDevicesClick: () => void;
  export let handleProfileClick: () => void;
  export let handleSettingsClick: () => void; // Add this new handler
  
  // Helper function to check if in training mode
  function isInTrainingMode() {
    return true;
  }
  
  // Mapbox integration
  import mapboxgl from 'mapbox-gl';
  import { onMount } from 'svelte';
  import Button from './Button.svelte'; // Импортируем универсальный компонент Button
  
  let mapContainer: HTMLElement | undefined;
  let map: mapboxgl.Map | undefined;
  let marker: mapboxgl.Marker | undefined;
  let geolocateControl: mapboxgl.GeolocateControl | undefined;
  let isLocating = false; // Флаг для отслеживания процесса определения местоположения
  let locationError = false; // Флаг для отслеживания ошибок геолокации
  let userLocation: [number, number] | null = null; // Для хранения координат пользователя
  let watchId: number | null = null; // ID для отслеживания геолокации
  let previousPosition: [number, number] | null = null; // Для отслеживания предыдущей позиции
  let initialLocationSet = false; // Флаг для отслеживания установки начального местоположения
  
  // Ключ для хранения последней позиции в localStorage
  const LAST_POSITION_KEY = 'lastUserPosition';
  
  onMount(() => {
    try {
      // Получаем последнюю сохраненную позицию пользователя
      const lastPosition = getLastSavedPosition();
      
      // Initialize the map with last saved position or default coordinates
      if (lastPosition) {
        initializeMap(lastPosition.lng, lastPosition.lat);
      } else {
        initializeMap(30.3158, 59.9343); // St. Petersburg coordinates as example
      }
    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
    }
    
    // Cleanup function
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  });
  
  // Функция для получения последней сохраненной позиции
  function getLastSavedPosition(): {lng: number, lat: number} | null {
    try {
      const savedPosition = localStorage.getItem(LAST_POSITION_KEY);
      if (savedPosition) {
        return JSON.parse(savedPosition);
      }
    } catch (error) {
      console.error('Error reading last position from localStorage:', error);
    }
    return null;
  }
  
  // Функция для сохранения текущей позиции пользователя
  function saveCurrentPosition(lng: number, lat: number) {
    try {
      const position = { lng, lat, timestamp: Date.now() };
      localStorage.setItem(LAST_POSITION_KEY, JSON.stringify(position));
    } catch (error) {
      console.error('Error saving position to localStorage:', error);
    }
  }
  
  function initializeMap(lon: number, lat: number) {
    try {
      // Initialize Mapbox map
      mapboxgl.accessToken = 'pk.eyJ1Ijoia29tbXVuMTV0IiwiYSI6ImNtZmk1ZzlsNTBoejAybHF3ejR6bjEwZ3oifQ.GHO6tJYDnc03P7fxUshk8A';
      
      if (!mapContainer) {
        console.error('Map container not found');
        return;
      }
      
      // Инициализируем карту с координатами (последними сохраненными или дефолтными)
      map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lon, lat],
        zoom: 17, // Очень крупный zoom для тренировки
        maxZoom: 23, // Увеличен максимальный zoom до 23 уровня
        minZoom: 10, // Разрешаем отдаление для просмотра всего пути
        pitch: 0, // Устанавливаем нулевой угол наклона камеры
        bearing: 0 // Устанавливаем нулевой поворот камеры
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
          console.log('User location found:', position);
          locationError = false;
          isLocating = false;
          
          // Update current position with user location
          if (position && position.coords && map) {
            userLocation = [position.coords.longitude, position.coords.latitude];
            
            // Сохраняем текущую позицию пользователя
            saveCurrentPosition(position.coords.longitude, position.coords.latitude);
            
            // Update marker position or create new marker
            if (marker) {
              marker.setLngLat([position.coords.longitude, position.coords.latitude]);
            } else {
              // Создаем маркер в форме бегуна
              const el = document.createElement('div');
              el.className = 'runner-marker';
              marker = new mapboxgl.Marker({ element: el })
                .setLngLat([position.coords.longitude, position.coords.latitude])
                .addTo(map!); // Используем оператор ! для утверждения, что map не undefined
            }
            
            // Центрируем карту на пользователе с плавной анимацией только если это первое определение местоположения
            if (!initialLocationSet) {
              map.setCenter([position.coords.longitude, position.coords.latitude]);
              initialLocationSet = true;
            } else {
              // Для последующих обновлений используем плавную анимацию
              map.easeTo({
                center: [position.coords.longitude, position.coords.latitude],
                zoom: 17,
                duration: 1000 // Плавная анимация 1 секунда
              });
            }
          }
        });
        
        geolocateControl.on('error', (error) => {
          console.error('Geolocation error:', error);
          locationError = true;
          isLocating = false;
          
          // Если геолокация не удалась, начинаем отслеживание местоположения вручную
          startLocationTracking();
        });
        
        // Trigger geolocation when map loads
        map.on('load', () => {
          // Add a small delay to ensure the map is fully loaded
          setTimeout(() => {
            // Автоматически запрашиваем геолокацию при загрузке карты
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
  
  // Функция для отслеживания местоположения в реальном времени
  function startLocationTracking() {
    if (!('geolocation' in navigator)) {
      console.error('Geolocation is not supported by this browser');
      return;
    }
    
    // Начинаем отслеживание местоположения с высокой точностью
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (map && position.coords) {
          const lng = position.coords.longitude;
          const lat = position.coords.latitude;
          const currentPosition: [number, number] = [lng, lat];
          
          // Сохраняем текущую позицию пользователя
          saveCurrentPosition(lng, lat);
          
          // Обновляем позицию маркера
          if (marker) {
            marker.setLngLat(currentPosition);
          } else {
            // Создаем маркер в форме бегуна
            const el = document.createElement('div');
            el.className = 'runner-marker';
            marker = new mapboxgl.Marker({ element: el })
              .setLngLat(currentPosition)
              .addTo(map);
          }
          
          // Плавно центрируем карту на пользователе, если расстояние достаточно большое
          if (previousPosition) {
            const distance = calculateDistance(
              previousPosition[1], previousPosition[0],
              lat, lng
            );
            
            // Если пользователь переместился более чем на 5 метров, обновляем карту
            if (distance > 5) {
              map.easeTo({
                center: currentPosition,
                zoom: 17,
                duration: 1000 // Плавная анимация 1 секунда
              });
              previousPosition = currentPosition;
            }
          } else {
            // Первоначальное центрирование
            map.setCenter(currentPosition);
            initialLocationSet = true;
            previousPosition = currentPosition;
          }
          
          // Сохраняем текущее местоположение
          userLocation = currentPosition;
          
          console.log('Position updated:', lng, lat);
        }
      },
      (error) => {
        console.error('Error watching position:', error);
        locationError = true;
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000, // Используем кэшированное местоположение до 3 секунд
        timeout: 8000 // Таймаут 8 секунд
      }
    );
  }
  
  // Вспомогательная функция для расчета расстояния между двумя точками (в метрах)
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Радиус Земли в метрах
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
  
  // Функция для повторного запроса геолокации в случае ошибки
  function retryGeolocation() {
    locationError = false;
    if (geolocateControl) {
      isLocating = true;
      // @ts-ignore
      geolocateControl.trigger();
    }
  }
  
  // Функция для очистки сохраненной позиции (по желанию)
  function clearSavedPosition() {
    try {
      localStorage.removeItem(LAST_POSITION_KEY);
    } catch (error) {
      console.error('Error clearing saved position:', error);
    }
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
      <h1 class="dashboard-title">Тренировка</h1>
      <div 
        class="header-icon"
        on:click={handleSettingsClick}
        on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSettingsClick(); }}
        role="button"
        tabindex="0"
        aria-label="Настройки"
      >
        <img src="images/111.png" alt="Настройки" width="24" height="24" />
      </div>
    </div>
    
    <!-- Training content -->
    <div class="dashboard-main">
      
      <!-- Container for map and training stats to eliminate gap -->
      <div class="map-stats-container">
        <!-- Map container -->
        <div class="shield-content" bind:this={mapContainer}>
          <!-- Отображаем сообщение о поиске местоположения -->
          {#if isLocating}
            <div class="location-message">
              <p>Поиск вашего местоположения...</p>
              <div class="spinner"></div>
            </div>
          {/if}
          
          <!-- Отображаем сообщение об ошибке геолокации -->
          {#if locationError}
            <div class="location-error">
              <p>Не удалось определить местоположение. Используются координаты по умолчанию.</p>
            </div>
          {/if}
          
          <!-- Map will be initialized here by Mapbox GL JS -->
        </div>
        
        <!-- Training stats panel positioned below the map -->
        <div class="training-stats s-nHmVefn3S3wX">
          <div class="stat-card s-nHmVefn3S3wX">
            <h4 class="s-nHmVefn3S3wX">Время</h4>
            <p class="stat-value s-nHmVefn3S3wX">00:00:00</p>
          </div>
          <div class="stat-card s-nHmVefn3S3wX">
            <h4 class="s-nHmVefn3S3wX">Дистанция</h4>
            <p class="stat-value s-nHmVefn3S3wX">0.0 км</p>
          </div>
          <div class="stat-card s-nHmVefn3S3wX">
            <h4 class="s-nHmVefn3S3wX">Темп</h4>
            <p class="stat-value s-nHmVefn3S3wX">0:00 / км</p>
          </div>
        </div>
      </div>
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
  /* Container for map and stats to eliminate gap */
  .map-stats-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0;
  }
  
  /* Map container styles */
  .shield-content {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: clamp(8px, 2vw, 15px);
    display: flex;
    flex-direction: column;
    padding: 0;
    position: relative;
    background: linear-gradient(135deg, #000000, #333333);
    /* Уменьшаем минимальную высоту на 30% */
    min-height: clamp(210px, 49vh, 490px);
    /* Remove any extra spacing that might create gaps */
    margin-bottom: 0;
  }
  
  /* Custom runner marker */
  .runner-marker {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #FF1493;
    border: 2px solid white;
    box-shadow: 0 0 10px rgba(255, 20, 147, 0.7);
    position: relative;
  }
  
  .runner-marker::after {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 10px solid #FF1493;
  }
  
  /* Location message styles */
  .location-message, .location-error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    background: rgba(0, 0, 0, 0.8);
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    color: white;
    width: 80%;
    max-width: 300px;
  }
  
  .location-error button {
    margin-top: 10px;
    padding: 8px 16px;
    background: var(--primary-blue);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 4px solid white;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: 10px auto 0;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
    /* Position panel directly below map with no gap */
    margin-top: 0;
    position: relative;
    /* Center the panel horizontally */
    margin-left: auto;
    margin-right: auto;
    z-index: 2;
    /* Ensure proper height */
    min-height: auto;
    height: auto;
  }
  
  .stat-card {
    text-align: center;
    /* Reduce padding to make panel less tall */
    padding: clamp(5px, 1vw, 10px);
    /* Reduce min-height to make panel less tall */
    min-height: clamp(35px, 5vh, 60px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
  
  .stat-card h4 {
    font-size: clamp(0.8rem, 2vw, 1.1rem);
    color: var(--light-gray);
    margin-bottom: clamp(3px, 1vw, 8px);
  }
  
  .stat-value {
    font-size: clamp(1rem, 3vw, 1.5rem);
    font-weight: 700;
    color: var(--white);
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* Ensure the map container fills the shield content area */
  .shield-content > div {
    width: 100%;
    height: 100%;
  }
  
  /* Make sure the map fills the entire shield content area */
  .shield-content :global(.mapboxgl-map) {
    width: 100%;
    height: 100%;
    border-radius: clamp(8px, 2vw, 15px);
  }
  
  /* Style for the geolocate control */
  .shield-content :global(.mapboxgl-ctrl-group) {
    background: rgba(0, 0, 0, 0.7);
    border-radius: clamp(5px, 1vw, 10px);
    border: clamp(1px, 0.1vw, 2px) solid rgba(255, 255, 255, 0.2);
  }
  
  .shield-content :global(.mapboxgl-ctrl-group button) {
    background: transparent;
    color: white;
  }
  
  .shield-content :global(.mapboxgl-ctrl-group button:hover) {
    background: rgba(255, 255, 255, 0.1);
  }
  
  /* Style for navigation controls */
  .shield-content :global(.mapboxgl-ctrl-group:not(:empty)) {
    box-shadow: 0 0 0 clamp(1px, 0.1vw, 3px) rgba(0, 0, 0, 0.1);
  }
  
  /* Responsive design for Training component */
  @media (max-width: 768px) {
    .shield-content {
      min-height: clamp(175px, 42vh, 350px);
      border-radius: clamp(6px, 2.5vw, 12px);
    }
    
    .training-stats {
      grid-template-columns: 1fr;
      gap: clamp(5px, 2vw, 10px);
      /* Reduce padding for smaller screens */
      padding: clamp(7px, 1.5vw, 12px);
      border-radius: clamp(8px, 2.5vw, 15px);
    }
    
    .stat-card {
      /* Reduce min-height and padding for smaller screens */
      min-height: clamp(30px, 4vh, 50px);
      padding: clamp(4px, 1vw, 8px);
    }
    
    .stat-card h4 {
      font-size: clamp(0.7rem, 2.2vw, 0.9rem);
      margin-bottom: clamp(1px, 0.5vw, 3px);
    }
    
    .stat-value {
      font-size: clamp(0.9rem, 3.2vw, 1.3rem);
    }
  }
  
  @media (max-width: 480px) {
    .shield-content {
      min-height: clamp(140px, 38.5vh, 280px);
      border-radius: clamp(5px, 3vw, 10px);
    }
    
    .training-stats {
      grid-template-columns: 1fr;
      gap: clamp(4px, 2vw, 8px);
      /* Further reduce padding for very small screens */
      padding: clamp(5px, 1.5vw, 8px);
      border-radius: clamp(6px, 3vw, 12px);
    }
    
    .stat-card {
      /* Further reduce min-height and padding for very small screens */
      min-height: clamp(25px, 3vh, 40px);
      padding: clamp(3px, 1vw, 6px);
    }
    
    .stat-card h4 {
      font-size: clamp(0.6rem, 2.5vw, 0.8rem);
      margin-bottom: clamp(1px, 0.5vw, 2px);
    }
    
    .stat-value {
      font-size: clamp(0.8rem, 3.5vw, 1.1rem);
    }
  }
  
  /* Large screens */
  @media (min-width: 1200px) {
    .shield-content {
      min-height: clamp(280px, 52.5vh, 560px);
      border-radius: clamp(10px, 1.5vw, 20px);
    }
    
    .training-stats {
      grid-template-columns: repeat(3, 1fr);
      gap: clamp(12px, 0.8vw, 20px);
      /* Reduce padding for large screens to prevent excessive height */
      padding: clamp(12px, 0.8vw, 18px);
      border-radius: clamp(15px, 1.5vw, 25px);
    }
    
    .stat-card {
      /* Reduce min-height for large screens */
      min-height: clamp(50px, 6vh, 75px);
      padding: clamp(10px, 0.7vw, 18px);
    }
    
    .stat-card h4 {
      font-size: clamp(0.9rem, 1vw, 1.2rem);
      margin-bottom: clamp(3px, 0.3vw, 8px);
    }
    
    .stat-value {
      font-size: clamp(1.1rem, 1.8vw, 1.6rem);
    }
  }
</style>
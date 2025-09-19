<script lang="ts">
  // Handle back to dashboard
  export let handleBackToDashboard: () => void;
  
  // Navigation handlers
  export let handleHealthClick: () => void;
  export let handleTrainingClick: () => void;
  export let handleDevicesClick: () => void;
  export let handleProfileClick: () => void;
  export let handleSettingsClick: () => void;
  export let handleHistoryClick: (() => void) | null = null;
  export let handleAssessmentTrainingClick: (() => void) | null = null;
  
  // Добавим состояние для управления меню
  let isMenuOpen = false;
  let menuContainer: HTMLDivElement | null = null;
  
  // Функция для переключения состояния меню
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    console.log('Menu toggled, isMenuOpen:', isMenuOpen);
    
    // После открытия меню регистрируем обработчик клика вне меню
    if (isMenuOpen) {
      // Небольшая задержка, чтобы избежать немедленного срабатывания
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 10);
    } else {
      // При закрытии меню удаляем обработчик
      document.removeEventListener('click', handleClickOutside);
    }
  }
  
  // Функция для закрытия меню
  function closeMenu() {
    isMenuOpen = false;
    // Удаляем обработчик при закрытии меню
    document.removeEventListener('click', handleClickOutside);
  }
  
  // Функция для обработки клика вне меню
  function handleClickOutside(event: MouseEvent) {
    // Проверяем, что меню открыто и клик был вне меню
    if (isMenuOpen && menuContainer) {
      // Проверяем, что клик был вне контейнера меню
      if (!menuContainer.contains(event.target as Node)) {
        closeMenu();
        console.log('Clicked outside menu, closing menu');
      }
    }
  }
  
  // Calorie tracking variables
  let trainingCalories = 0;
  let caloriesInterval: ReturnType<typeof setInterval> | undefined;
  let trainingStartTime: Date | null = null;
  
  // Speed tracking variables
  let currentSpeed = 0; // Current speed in km/h
  let averageSpeed = 0; // Average speed in km/h
  let maxSpeed = 0; // Maximum speed in km/h
  let totalDistance = 0; // Total distance in km
  let previousPosition: [number, number, number] | null = null; // [longitude, latitude, timestamp]
  
  // Mapbox integration
  import mapboxgl from 'mapbox-gl';
  import { onMount, onDestroy } from 'svelte';
  import Button from './Button.svelte'; // Импортируем универсальный компонент Button
  
  let mapContainer: HTMLElement | undefined;
  let map: mapboxgl.Map | undefined;
  let marker: mapboxgl.Marker | undefined;
  let geolocateControl: mapboxgl.GeolocateControl | undefined;
  let isLocating = false; // Флаг для отслеживания процесса определения местоположения
  let locationError = false; // Флаг для отслеживания ошибок геолокации
  let userLocation: [number, number] | null = null; // Для хранения координат пользователя
  let watchId: number | null = null; // ID для отслеживания геолокации
  let initialLocationSet = false; // Флаг для отслеживания установки начального местоположения
  
  // Ключ для хранения последней позиции в localStorage
  const LAST_POSITION_KEY = 'lastUserPosition';
  const POSITION_VALIDITY_DURATION = 24 * 60 * 60 * 1000; // 24 часа в миллисекундах
  
  // Функция для очистки сохраненной позиции (для отладки)
  function clearSavedPosition() {
    console.log('Clearing saved position from localStorage');
    localStorage.removeItem(LAST_POSITION_KEY);
  }
  
  // Helper function to check if in training mode
  function isInTrainingMode() {
    return true;
  }
  
  // Function to simulate getting calories burned during training
  function getCaloriesFromFitnessTracker(): number {
    if (!trainingStartTime) return 0;
    
    // In a real implementation, this would connect to the fitness tracker API
    // For now, we'll simulate with a value based on training duration
    const now = new Date();
    const trainingDurationMinutes = (now.getTime() - trainingStartTime.getTime()) / (1000 * 60);
    
    // Simulate burning 5-15 calories per minute during training
    const caloriesPerMinute = 10; // Average value
    return Math.floor(trainingDurationMinutes * caloriesPerMinute);
  }
  
  // Function to start training
  function startTraining() {
    trainingStartTime = new Date();
    updateCalories();
  }
  
  // Function to stop training
  function stopTraining() {
    trainingStartTime = null;
    trainingCalories = 0;
    currentSpeed = 0;
    averageSpeed = 0;
    maxSpeed = 0;
    totalDistance = 0;
    previousPosition = null;
  }
  
  // Function to update calorie display
  function updateCalories() {
    trainingCalories = getCaloriesFromFitnessTracker();
  }
  
  // Функция для получения последней сохраненной позиции
  function getLastSavedPosition(): {lng: number, lat: number, timestamp: number} | null {
    try {
      const savedPosition = localStorage.getItem(LAST_POSITION_KEY);
      console.log('Raw saved position from localStorage:', savedPosition);
      if (savedPosition) {
        const position = JSON.parse(savedPosition);
        console.log('Parsed saved position:', position);
        return position;
      }
    } catch (error) {
      console.error('Error reading last position from localStorage:', error);
    }
    return null;
  }
  
  // Функция для сохранения текущей позиции пользователя
  function saveCurrentPosition(lng: number, lat: number) {
    try {
      const position = { 
        lng, 
        lat, 
        timestamp: Date.now(),
        // Добавим дополнительные данные для отладки
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(LAST_POSITION_KEY, JSON.stringify(position));
      console.log('Position saved to localStorage:', position);
      
      // Дополнительно проверим, что данные действительно сохранились
      const saved = localStorage.getItem(LAST_POSITION_KEY);
      console.log('Verification - data actually saved:', saved);
    } catch (error) {
      console.error('Error saving position to localStorage:', error);
    }
  }
  
  // Функция для проверки, является ли сохраненная позиция актуальной
  function isSavedPositionValid(savedPosition: {lng: number, lat: number, timestamp: number} | null): boolean {
    if (!savedPosition || !savedPosition.timestamp) {
      console.log('No saved position or timestamp');
      return false;
    }
    
    const now = Date.now();
    const positionAge = now - savedPosition.timestamp;
    
    console.log(`Position age: ${positionAge}ms, validity duration: ${POSITION_VALIDITY_DURATION}ms`);
    
    const isValid = positionAge < POSITION_VALIDITY_DURATION;
    console.log('Is saved position valid:', isValid);
    
    return isValid;
  }
  
  // Функция для получения последней сохраненной позиции с проверкой актуальности
  function getLastValidPosition(): {lng: number, lat: number} | null {
    try {
      const savedPosition = getLastSavedPosition();
      if (savedPosition) {
        console.log('Found saved position, checking validity...');
        if (isSavedPositionValid(savedPosition)) {
          console.log('Using valid saved position:', savedPosition);
          return { lng: savedPosition.lng, lat: savedPosition.lat };
        } else {
          console.log('Saved position is outdated, removing it');
          // Удаляем устаревшую позицию
          localStorage.removeItem(LAST_POSITION_KEY);
        }
      } else {
        console.log('No saved position found');
      }
    } catch (error) {
      console.error('Error reading last position from localStorage:', error);
      // В случае ошибки удаляем поврежденные данные
      localStorage.removeItem(LAST_POSITION_KEY);
    }
    console.log('No valid saved position found, will use default');
    return null;
  }
  
  // Функция для расчета скорости между двумя точками
  function calculateSpeed(lat1: number, lon1: number, time1: number, lat2: number, lon2: number, time2: number): number {
    // Calculate distance in meters
    const distance = calculateDistance(lat1, lon1, lat2, lon2);
    
    // Calculate time difference in hours
    const timeDiffHours = (time2 - time1) / (1000 * 60 * 60);
    
    // Avoid division by zero
    if (timeDiffHours <= 0) return 0;
    
    // Calculate speed in km/h
    return (distance / 1000) / timeDiffHours;
  }
  
  // Функция для обновления статистики на основе новой позиции
  function updateTrainingStats(position: GeolocationPosition) {
    console.log('Updating training stats with position:', position);
    const now = new Date();
    const currentTime = now.getTime();
    
    // Update total training time
    let trainingTime = "00:00:00";
    if (trainingStartTime) {
      const diffMs = currentTime - trainingStartTime.getTime();
      const diffHours = Math.floor(diffMs / 3600000);
      const diffMinutes = Math.floor((diffMs % 3600000) / 60000);
      const diffSeconds = Math.floor((diffMs % 60000) / 1000);
      
      trainingTime = `${diffHours.toString().padStart(2, '0')}:${diffMinutes.toString().padStart(2, '0')}:${diffSeconds.toString().padStart(2, '0')}`;
    }
    
    // If we have a previous position, calculate distance and speed
    if (previousPosition && position.coords) {
      const [prevLng, prevLat, prevTime] = previousPosition;
      const currentLng = position.coords.longitude;
      const currentLat = position.coords.latitude;
      
      // Calculate distance between points in meters
      const distance = calculateDistance(prevLat, prevLng, currentLat, currentLng);
      
      // Convert to kilometers and add to total distance
      totalDistance += distance / 1000;
      
      // Calculate current speed in km/h
      currentSpeed = calculateSpeed(prevLat, prevLng, prevTime, currentLat, currentLng, currentTime);
      
      // Update maximum speed if current speed is higher
      if (currentSpeed > maxSpeed) {
        maxSpeed = currentSpeed;
      }
      
      // Calculate average speed
      if (trainingStartTime) {
        const totalTrainingTimeHours = (currentTime - trainingStartTime.getTime()) / (1000 * 60 * 60);
        if (totalTrainingTimeHours > 0) {
          averageSpeed = totalDistance / totalTrainingTimeHours;
        }
      }
    }
    
    // Store current position for next calculation
    if (position.coords) {
      previousPosition = [position.coords.longitude, position.coords.latitude, currentTime];
      
      // Также сохраняем позицию в localStorage
      saveCurrentPosition(position.coords.longitude, position.coords.latitude);
    }
  }
  
  function initializeMap() {
    try {
      // Initialize Mapbox map
      mapboxgl.accessToken = 'pk.eyJ1Ijoia29tbXVuMTV0IiwiYSI6ImNtZmk1ZzlsNTBoejAybHF3ejR6bjEwZ3oifQ.GHO6tJYDnc03P7fxUshk8A';
      
      if (!mapContainer) {
        console.error('Map container not found');
        return;
      }
      
      // Получаем последнюю сохраненную позицию пользователя
      console.log('Getting last valid position...');
      const lastPosition = getLastValidPosition();
      
      // Инициализируем карту с последними сохраненными координатами или координатами по умолчанию
      const initialLng = lastPosition ? lastPosition.lng : 30.3158;
      const initialLat = lastPosition ? lastPosition.lat : 59.9343;
      
      console.log('Initializing map with coordinates:', initialLng, initialLat, 'Last position was:', lastPosition);
      
      // Дополнительно проверим, что координаты действительно взяты из сохраненных данных
      if (lastPosition) {
        console.log('CONFIRMATION: Using saved coordinates - Lng:', initialLng, 'Lat:', initialLat);
      } else {
        console.log('CONFIRMATION: Using default coordinates - Lng:', initialLng, 'Lat:', initialLat);
      }
      
      map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [initialLng, initialLat],
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
          console.log('User location found via geolocate event:', position);
          locationError = false;
          isLocating = false;
          
          // Update training stats
          updateTrainingStats(position);
          
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
              console.log('Setting initial map center');
              map.setCenter([position.coords.longitude, position.coords.latitude]);
              initialLocationSet = true;
            } else {
              // Для последующих обновлений используем плавную анимацию
              console.log('Animating map to new position');
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
          if (map) {
            startLocationTracking();
          }
        });
        
        // Trigger geolocation when map loads
        if (map) {
          map.on('load', () => {
            if (map) {
              console.log('Map loaded, current center:', map.getCenter());
              console.log('Map loaded, triggering geolocation');
              // Add a small delay to ensure the map is fully loaded
              setTimeout(() => {
                // Автоматически запрашиваем геолокацию при загрузке карты
                if (geolocateControl) {
                  isLocating = true;
                  // @ts-ignore
                  geolocateControl.trigger();
                }
              }, 500);
            }
          });
          
          // Дополнительно проверяем позицию при каждом обновлении карты
          map.on('moveend', () => {
            if (userLocation && map) {
              const center = map.getCenter();
              // Проверяем, если центр карты изменился, сохраняем новую позицию
              if (Math.abs(center.lng - userLocation[0]) > 0.0001 || Math.abs(center.lat - userLocation[1]) > 0.0001) {
                console.log('Map moved, saving new position:', center.lng, center.lat);
                saveCurrentPosition(center.lng, center.lat);
                userLocation = [center.lng, center.lat];
              }
            }
          });
        }
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
    
    console.log('Starting manual location tracking');
    
    // Начинаем отслеживание местоположения с высокой точностью
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        console.log('Manual location tracking update:', position);
        if (map && position.coords) {
          const lng = position.coords.longitude;
          const lat = position.coords.latitude;
          const currentPosition: [number, number] = [lng, lat];
          
          // Update training stats
          updateTrainingStats(position);
          
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
              console.log('User moved significantly, updating map position');
              map.easeTo({
                center: currentPosition,
                zoom: 17,
                duration: 1000 // Плавная анимация 1 секунда
              });
              // Update previous position
              previousPosition = [lng, lat, Date.now()];
            }
          } else {
            // Первоначальное центрирование
            console.log('Initial map centering in manual tracking');
            map.setCenter(currentPosition);
            initialLocationSet = true;
            previousPosition = [lng, lat, Date.now()];
          }
          
          // Сохраняем текущее местоположение
          userLocation = currentPosition;
          
          console.log('Position updated via manual tracking:', lng, lat);
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
  
  onMount(() => {
    try {
      console.log('Training component mounted');
      
      // Проверим сохраненную позицию до инициализации карты
      console.log('Checking for saved position before map initialization...');
      const savedPosition = getLastValidPosition();
      console.log('Saved position before map init:', savedPosition);
      
      // Set training start time
      trainingStartTime = new Date();
      
      // Start updating calories
      startTraining();
      caloriesInterval = setInterval(updateCalories, 60000); // Update every minute
      
      // Initialize the map
      initializeMap();
    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
    }
  });
  
  onDestroy(() => {
    console.log('Training component destroying');
    // Clean up the interval when component is destroyed
    if (caloriesInterval) {
      clearInterval(caloriesInterval);
    }
    
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }
    
    // Сохраняем последнюю позицию перед уничтожением компонента
    if (map && userLocation) {
      const center = map.getCenter();
      console.log('Saving final position before destroy:', center.lng, center.lat);
      saveCurrentPosition(center.lng, center.lat);
    }
    
    // Удалим обработчик кликов
    document.removeEventListener('click', handleClickOutside);
  });
  
  // Helper function to format time
  function formatTime(date: Date | null): string {
    if (!date) return "00:00:00";
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffMinutes = Math.floor((diffMs % 3600000) / 60000);
    const diffSeconds = Math.floor((diffMs % 60000) / 1000);
    
    return `${diffHours.toString().padStart(2, '0')}:${diffMinutes.toString().padStart(2, '0')}:${diffSeconds.toString().padStart(2, '0')}`;
  }
  
  // Helper function to format distance
  function formatDistance(distance: number): string {
    return distance.toFixed(2);
  }
  
  // Helper function to format speed
  function formatSpeed(speed: number): string {
    return speed.toFixed(2);
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
    <!-- Header with left panel button -->
    <div class="dashboard-header-container">
      <div class="dashboard-header">
        <h1 class="dashboard-title">Тренировка</h1>
        <!-- Добавим кнопку меню в правую часть заголовка -->
        <div class="header-icon menu-button" on:click={toggleMenu} role="button" tabindex="0" aria-label="Меню">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Выдвижное меню -->
    {#if isMenuOpen}
      <div class="menu-overlay" on:click={closeMenu}>
        <div class="menu-container" bind:this={menuContainer} on:click|stopPropagation={() => {}}>
          <div class="menu-header">
            <h3>Функции</h3>
            <button class="menu-close" on:click={closeMenu} aria-label="Закрыть меню">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="menu-items">
            <div class="menu-item" on:click={() => { if (handleHistoryClick) { closeMenu(); handleHistoryClick(); } }}>
              <span>История тренировок</span>
            </div>
            <div class="menu-item" on:click={() => { if (handleAssessmentTrainingClick) { closeMenu(); handleAssessmentTrainingClick(); } }}>
              <span>Оценочная тренировка</span>
            </div>
          </div>
        </div>
      </div>
    {/if}
    
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
            <p class="stat-value s-nHmVefn3S3wX">{formatTime(trainingStartTime)}</p>
          </div>
          <div class="stat-card s-nHmVefn3S3wX">
            <h4 class="s-nHmVefn3S3wX">Дистанция</h4>
            <p class="stat-value s-nHmVefn3S3wX">{formatDistance(totalDistance)} км</p>
          </div>
          <div class="stat-card s-nHmVefn3S3wX">
            <h4 class="s-nHmVefn3S3wX">Скорость</h4>
            <p class="stat-value s-nHmVefn3S3wX">{formatSpeed(currentSpeed)} км/ч</p>
          </div>
          <div class="stat-card s-nHmVefn3S3wX">
            <h4 class="s-nHmVefn3S3wX">Средняя</h4>
            <p class="stat-value s-nHmVefn3S3wX">{formatSpeed(averageSpeed)} км/ч</p>
          </div>
        </div>
        
        <!-- Копия панели статистики тренировки -->
        <div class="training-stats s-nHmVefn3S3wX">
          <div class="stat-card s-nHmVefn3S3wX">
            <h4 class="s-nHmVefn3S3wX">Темп</h4>
            <p class="stat-value s-nHmVefn3S3wX">{currentSpeed > 0 ? (60 / currentSpeed).toFixed(2) : '0.00'} мин/км</p>
          </div>
          <div class="stat-card s-nHmVefn3S3wX">
            <h4 class="s-nHmVefn3S3wX">Ср.Темп</h4>
            <p class="stat-value s-nHmVefn3S3wX">{averageSpeed > 0 ? (60 / averageSpeed).toFixed(2) : '0.00'} мин/км</p>
          </div>
          <div class="stat-card s-nHmVefn3S3wX">
            <h4 class="s-nHmVefn3S3wX">Калории</h4>
            <p class="stat-value s-nHmVefn3S3wX">{trainingCalories} ккал</p>
          </div>
          <div class="stat-card s-nHmVefn3S3wX">
            <h4 class="s-nHmVefn3S3wX">Пульс</h4>
            <p class="stat-value s-nHmVefn3S3wX">0 уд/мин</p>
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
    /* Ограничиваем максимальную высоту контейнера */
    max-height: 80vh;
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
    justify-content: space-between; /* Изменим на space-between для размещения заголовка по центру и кнопки справа */
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
    /* Убираем центрирование текста */
    flex-grow: 0; /* Позволяет заголовку занимать только необходимое пространство */
    text-align: left; /* Выравниваем текст по левому краю */
  }
  
  /* Стили для кнопки меню */
  .menu-button {
    cursor: pointer;
    padding: 16px;
    border-radius: 50%;
    transition: all 0.3s ease;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.2));
    width: var(--touch-target-min);
    height: var(--touch-target-min);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
    margin-left: auto; /* Отправляет кнопку вправо */
    z-index: 1001; /* Убедимся, что кнопка поверх других элементов */
  }
  
  .menu-button:hover {
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
    transform: scale(1.1);
  }
  
  /* Стили для выдвижного меню */
  .menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: flex-end;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
  }
  
  .menu-container {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(51, 51, 51, 0.7));
    backdrop-filter: blur(10px);
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    width: clamp(250px, 70vw, 350px);
    height: 100%;
    display: flex;
    flex-direction: column;
    animation: slideIn 0.3s ease-out;
    z-index: 1001;
  }
  
  .menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .menu-header h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .menu-close {
    background: none;
    border: none;
    color: var(--white);
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.3s ease;
  }
  
  .menu-close:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .menu-items {
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    flex-grow: 1;
  }
  
  .menu-item {
    padding: 15px 20px;
    color: var(--white);
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .menu-item:hover {
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-pink));
  }
  
  .menu-item:last-child {
    border-bottom: none;
  }
  
  /* Анимации */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
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
    /* Добавляем фиксированную ширину для всех элементов */
    width: 20%;
    /* Убираем минимальную ширину, чтобы все элементы были одинакового размера */
    min-width: 0;
    /* Ensure content fits properly */
    box-sizing: border-box;
  }
  
  .stat-card h4 {
    font-size: clamp(0.8rem, 2vw, 1.1rem);
    color: var(--light-gray);
    margin-bottom: clamp(3px, 1vw, 8px);
  }
  
  .stat-value {
    font-size: clamp(0.7rem, 2vw, 1rem); /* Reduced from clamp(0.8rem, 2.5vw, 1.2rem) */
    font-weight: 700;
    color: var(--white);
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    /* Ensure value stays on one line */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    /* Ensure text fits within container */
    min-width: 0;
    box-sizing: border-box;
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
  .shield-content {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    padding: 0;
    position: relative;
    background: linear-gradient(135deg, #000000, #333333);
    flex: 1;
    box-sizing: border-box;
    margin-bottom: 0;
    /* Ограничиваем максимальную высоту контейнера карты */
    max-height: 70vh;
  }
  
  @media (max-width: 768px) {
    .shield-content {
      min-height: clamp(250px, 60vh, 500px);
      border-radius: clamp(6px, 2.5vw, 12px);
    }
    
    .training-stats {
      grid-template-columns: 1fr;
      gap: clamp(5px, 2vw, 10px);
      /* Reduce padding for smaller screens */
      padding: clamp(7px, 1.5vw, 12px);
      border-radius: clamp(8px, 2.5vw, 15px);
      /* На мобильных устройствах элементы будут располагаться вертикально */
      flex-direction: column;
    }
    
    .stat-card {
      /* Reduce min-height and padding for smaller screens */
      min-height: clamp(30px, 4vh, 50px);
      padding: clamp(4px, 1vw, 8px);
      /* На мобильных устройствах ширина будет 100% */
      width: 100%;
      /* Ensure content fits properly */
      box-sizing: border-box;
    }
    
    .stat-card h4 {
      font-size: clamp(0.7rem, 2.2vw, 0.9rem);
      margin-bottom: clamp(1px, 0.5vw, 3px);
    }
    
    .stat-value {
      font-size: clamp(0.6rem, 2.5vw, 0.85rem); /* Reduced from clamp(0.7rem, 2.8vw, 1rem) */
      /* Ensure value stays on one line for mobile */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      /* Ensure text fits within container */
      min-width: 0;
      box-sizing: border-box;
    }
    
    /* Compact header for mobile */
    .dashboard-header {
      padding: 6px 12px;
      margin-bottom: 10px;
      border-radius: 8px;
    }
  }
  
  @media (max-width: 480px) {
    .shield-content {
      min-height: clamp(200px, 55vh, 400px);
      border-radius: clamp(5px, 3vw, 10px);
    }
    
    .training-stats {
      grid-template-columns: 1fr;
      gap: clamp(4px, 2vw, 8px);
      /* Further reduce padding for very small screens */
      padding: clamp(5px, 1.5vw, 8px);
      border-radius: clamp(6px, 3vw, 12px);
      /* На мобильных устройствах элементы будут располагаться вертикально */
      flex-direction: column;
    }
    
    .stat-card {
      /* Further reduce min-height and padding for very small screens */
      min-height: clamp(25px, 3vh, 40px);
      padding: clamp(3px, 1vw, 6px);
      /* На мобильных устройствах ширина будет 100% */
      width: 100%;
      /* Ensure content fits properly */
      box-sizing: border-box;
    }
    
    .stat-card h4 {
      font-size: clamp(0.6rem, 2.5vw, 0.8rem);
      margin-bottom: clamp(1px, 0.5vw, 2px);
    }
    
    .stat-value {
      font-size: clamp(0.5rem, 2.8vw, 0.7rem); /* Reduced from clamp(0.6rem, 3vw, 0.85rem) */
      /* Ensure text fits within container */
      min-width: 0;
      box-sizing: border-box;
    }
    
    /* Even more compact header for small screens */
    .dashboard-header {
      padding: 5px 10px;
      margin-bottom: 8px;
      border-radius: 6px;
    }
    
    /* Адаптация меню для маленьких экранов */
    .menu-container {
      width: clamp(200px, 85vw, 300px);
    }
  }
  
  /* Medium screens */
  @media (min-width: 769px) and (max-width: 1199px) {
    .shield-content {
      min-height: clamp(350px, 70vh, 600px);
      border-radius: clamp(8px, 1.5vw, 15px);
    }
    
    .training-stats {
      gap: clamp(10px, 1vw, 15px);
      padding: clamp(10px, 1vw, 15px);
      border-radius: clamp(12px, 1.5vw, 20px);
    }
    
    .stat-card {
      min-height: clamp(40px, 5vh, 60px);
      padding: clamp(8px, 0.8vw, 15px);
      width: 20%;
    }
    
    .stat-card h4 {
      font-size: clamp(0.8rem, 1.2vw, 1.1rem);
      margin-bottom: clamp(2px, 0.3vw, 6px);
    }
    
    .stat-value {
      font-size: clamp(0.7rem, 1.3vw, 1rem);
    }
  }
  
  /* Large screens */
  @media (min-width: 1200px) {
    .shield-content {
      min-height: clamp(400px, 65vh, 700px);
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
      /* На больших экранах все элементы будут одинакового размера */
      width: 20%;
    }
    
    .stat-card h4 {
      font-size: clamp(0.9rem, 1vw, 1.2rem);
      margin-bottom: clamp(3px, 0.3vw, 8px);
    }
    
    .stat-value {
      font-size: clamp(0.8rem, 1.2vw, 1.1rem); /* Reduced from clamp(0.9rem, 1.5vw, 1.3rem) */
    }
  }
  
  /* Extra large screens */
  @media (min-width: 1600px) {
    .shield-content {
      min-height: clamp(400px, 60vh, 650px);
      border-radius: clamp(12px, 1.5vw, 25px);
    }
    
    .training-stats {
      gap: clamp(15px, 0.8vw, 25px);
      padding: clamp(15px, 0.8vw, 22px);
      border-radius: clamp(18px, 1.5vw, 30px);
    }
    
    .stat-card {
      min-height: clamp(55px, 6vh, 80px);
      padding: clamp(12px, 0.7vw, 20px);
      width: 20%;
    }
    
    .stat-card h4 {
      font-size: clamp(1rem, 1vw, 1.3rem);
      margin-bottom: clamp(4px, 0.3vw, 10px);
    }
    
    .stat-value {
      font-size: clamp(0.9rem, 1.2vw, 1.2rem);
    }
  }
</style>
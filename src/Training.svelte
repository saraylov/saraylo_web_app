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
  
  // Workout handlers
  export let onStartWorkoutProp: () => void;
  export let onStopWorkoutProp: () => void;
  export let onPauseWorkoutProp: () => void;
  export let onResumeWorkoutProp: () => void;
  
  // Training options - adding this data structure for the selected training panel
  const trainingOptions = [
    { id: 1, title: 'Оценочная тренировка', duration: '15 мин', intensity: 'Низкая' },
    { id: 2, title: 'Базовая тренировка', duration: '20 мин', intensity: 'Низкая' },
    { id: 3, title: 'Интервальная тренировка', duration: '30 мин', intensity: 'Средняя' },
    { id: 4, title: 'Силовая тренировка', duration: '45 мин', intensity: 'Высокая' },
    { id: 5, title: 'Кардио тренировка', duration: '35 мин', intensity: 'Средняя' }
  ];
  
  // Selected training - for displaying the selected training panel
  let selectedTraining = trainingOptions[0];
  
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
  import BottomNav from './BottomNav.svelte'; // Импортируем нижнюю панель навигации
  
  // Route tracking variables
  let routeCoordinates: [number, number][] = [];
  let routeLine: mapboxgl.MapboxGeoJSONFeature | null = null;
  let lastRouteUpdate: number = 0;
  const ROUTE_UPDATE_INTERVAL = 1000; // Update route every 1 second
  
  // Import workout store and components
  import { 
    workoutStore,
    startWorkout as startWorkoutStore, 
    pauseWorkout as pauseWorkoutStore, 
    resumeWorkout as resumeWorkoutStore, 
    stopWorkout as stopWorkoutStore, 
    updateWorkoutStats,
    updateCurrentPosition,
    setLocationError,
    setLocating,
    setWatchId,
    calculateDistance,
    calculateSpeed
  } from './utils/workoutStore';
  
  // Import audio assistant
  import { audioAssistant } from './utils/audioAssistant';
  
  let mapContainer: HTMLElement | undefined;
  let map: mapboxgl.Map | undefined;
  let marker: mapboxgl.Marker | undefined;
  let geolocateControl: mapboxgl.GeolocateControl | undefined;
  let isLocating = false; // Флаг для отслеживания процесса определения местоположения
  let locationError = false; // Флаг для отслеживания ошибок геолокации
  let userLocation: [number, number] | null = null; // Для хранения координат пользователя
  let watchId: number | null = null; // ID для отслеживания геолокации
  let initialLocationSet = false; // Флаг для отслеживания установки начального местоположения
  
  // Subscribe to workout store to update UI
  let unsubscribe: (() => void) | null = null;
  
  onMount(() => {
    // Subscribe to workout store changes
    unsubscribe = workoutStore.subscribe((data) => {
      // Update local variables with workout data
      totalDistance = data.totalDistance;
      currentSpeed = data.currentSpeed;
      averageSpeed = data.averageSpeed;
      maxSpeed = data.maxSpeed;
      
      // Update elapsed time if needed
      if (data.startTime && data.workoutState === 'running') {
        const now = Date.now();
        const elapsedTime = now - data.startTime;
        // Update workout stats with elapsed time
        updateWorkoutStats({ elapsedTime });
      }
    });
    
    try {
      console.log('Training component mounted');
      
      // Проверим сохраненную позицию до инициализации карты
      console.log('Checking for saved position before map initialization...');
      const savedPosition = getLastValidPosition();
      console.log('Saved position before map init:', savedPosition);
      
      // Проверим содержимое localStorage напрямую
      try {
        const rawPosition = localStorage.getItem(LAST_POSITION_KEY);
        console.log('Raw position from localStorage:', rawPosition);
      } catch (e) {
        console.error('Error reading raw position from localStorage:', e);
      }
      
      // Initialize the map
      initializeMap();
    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
    }
  });
  
  onDestroy(() => {
    console.log('Training component destroying');
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }
    
    // Unsubscribe from the store
    if (unsubscribe) {
      unsubscribe();
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
  
  // Workout handlers
  function handleStartWorkout() {
    console.log('Starting workout');
    startWorkoutStore();
    // Start geolocation tracking
    startLocationTracking();
    
    // Announce workout start
    if (audioAssistant.isSupported()) {
      audioAssistant.speak('Тренировка началась');
    }
    
    // Call the prop function if provided
    if (onStartWorkoutProp) onStartWorkoutProp();
  }
  
  function handleStopWorkout() {
    console.log('Stopping workout');
    stopWorkoutStore();
    // Stop geolocation tracking
    stopLocationTracking();
    
    // Announce workout stop
    if (audioAssistant.isSupported()) {
      audioAssistant.speak('Тренировка завершена');
    }
    
    // Call the prop function if provided
    if (onStopWorkoutProp) onStopWorkoutProp();
  }
  
  function handlePauseWorkout() {
    console.log('Pausing workout');
    pauseWorkoutStore();
    // Pause geolocation tracking
    pauseLocationTracking();
    
    // Announce workout pause
    if (audioAssistant.isSupported()) {
      audioAssistant.speak('Тренировка приостановлена');
    }
    
    // Call the prop function if provided
    if (onPauseWorkoutProp) onPauseWorkoutProp();
  }
  
  function handleResumeWorkout() {
    console.log('Resuming workout');
    resumeWorkoutStore();
    // Resume geolocation tracking
    resumeLocationTracking();
    
    // Announce workout resume
    if (audioAssistant.isSupported()) {
      audioAssistant.speak('Тренировка возобновлена');
    }
    
    // Call the prop function if provided
    if (onResumeWorkoutProp) onResumeWorkoutProp();
  }
  
  // Функция для запуска отслеживания местоположения
  function startLocationTracking() {
    console.log('Starting location tracking');
    if (navigator.geolocation) {
      // Clear any existing watch
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      
      // Start watching position
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          console.log('Position update received:', position);
          locationError = false;
          isLocating = false;
          
          // Update training stats
          updateTrainingStats(position);
          
          // Update current position with user location
          if (position && position.coords) {
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
              if (map) {
                map.setCenter([position.coords.longitude, position.coords.latitude]);
                map.setZoom(15); // Set more appropriate zoom level for initial tracking
              }
              initialLocationSet = true;
            } else {
              // Для последующих обновлений используем плавную анимацию
              console.log('Animating map to new position');
              if (map) {
                map.easeTo({
                  center: [position.coords.longitude, position.coords.latitude],
                  zoom: 17,
                  duration: 1000 // Плавная анимация 1 секунда
                });
              }
            }
            
            // Update route tracking
            updateRouteTracking(position.coords.longitude, position.coords.latitude);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          locationError = true;
          isLocating = false;
          setLocationError('Geolocation error occurred');
        },
        {
          enableHighAccuracy: true,
          maximumAge: 30000, // Use cached position up to 30 seconds old
          timeout: 27000 // Timeout after 27 seconds
        }
      );
      
      setWatchId(watchId);
      setLocating(true);
      setLocationError('');
    } else {
      console.error('Geolocation is not supported by this browser');
      locationError = true;
      isLocating = false;
      setLocationError('Geolocation is not supported by this browser');
    }
  }
  
  // Функция для остановки отслеживания местоположения
  function stopLocationTracking() {
    console.log('Stopping location tracking');
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
      setWatchId(null);
    }
    setLocating(false);
  }
  
  // Функция для паузы отслеживания местоположения
  function pauseLocationTracking() {
    console.log('Pausing location tracking');
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
      setWatchId(null);
    }
    setLocating(false);
  }
  
  // Функция для возобновления отслеживания местоположения
  function resumeLocationTracking() {
    console.log('Resuming location tracking');
    startLocationTracking();
  }
  
  // Функция для обновления трекинга маршрута
  function updateRouteTracking(lng: number, lat: number) {
    const now = Date.now();
    // Only update route every second to reduce load
    if (now - lastRouteUpdate < ROUTE_UPDATE_INTERVAL) {
      return;
    }
    
    lastRouteUpdate = now;
    
    // Add new coordinate to route
    routeCoordinates.push([lng, lat]);
    
    // Update the route line on the map
    if (map && routeCoordinates.length > 1) {
      // Remove existing route source if it exists
      if (map.getSource('route')) {
        map.removeLayer('route-line');
        map.removeSource('route');
      }
      
      // Create GeoJSON for the route
      const geojson = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeCoordinates
        }
      };
      
      // Add route source and layer
      map.addSource('route', {
        type: 'geojson',
        data: geojson as any
      });
      
      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#00BFFF',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });
    }
  }
  
  // Функция для обновления статистики тренировки
  function updateTrainingStats(position: GeolocationPosition) {
    if (!position || !position.coords) return;
    
    const now = Date.now();
    const coords = position.coords;
    
    // If we have a previous position, calculate distance and speed
    if (previousPosition) {
      const [prevLng, prevLat, prevTime] = previousPosition;
      const timeDiff = (now - prevTime) / 1000; // Convert to seconds
      
      if (timeDiff > 0) {
        // Calculate distance between points
        const distance = calculateDistance(prevLat, prevLng, coords.latitude, coords.longitude);
        totalDistance += distance;
        
        // Calculate current speed (km/h)
        const speed = calculateSpeed(distance, timeDiff);
        currentSpeed = speed;
        
        // Update max speed if current speed is higher
        if (speed > maxSpeed) {
          maxSpeed = speed;
        }
        
        // Update workout store with new stats
        updateWorkoutStats({
          totalDistance,
          currentSpeed,
          maxSpeed
        });
      }
    }
    
    // Update previous position
    previousPosition = [coords.longitude, coords.latitude, now];
    
    // Update current position in store
    if (coords) {
      updateCurrentPosition({
        coords: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          altitude: coords.altitude || null,
          accuracy: coords.accuracy || 0,
          altitudeAccuracy: coords.altitudeAccuracy || null,
          heading: coords.heading || null,
          speed: coords.speed || null
        },
        timestamp: now
      });
    }
  }
  
  // Constants for localStorage
  const LAST_POSITION_KEY = 'lastUserPosition';
  const POSITION_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  // Функция для сохранения текущей позиции пользователя
  function saveCurrentPosition(lng: number, lat: number) {
    try {
      const positionData = {
        lng,
        lat,
        timestamp: Date.now()
      };
      
      localStorage.setItem(LAST_POSITION_KEY, JSON.stringify(positionData));
      console.log('Position saved to localStorage:', positionData);
    } catch (error) {
      console.error('Error saving position to localStorage:', error);
    }
  }
  
  // Функция для получения последней сохраненной позиции пользователя
  function getLastValidPosition() {
    try {
      const savedPosition = localStorage.getItem(LAST_POSITION_KEY);
      console.log('Raw saved position from localStorage:', savedPosition);
      
      if (savedPosition) {
        const positionData = JSON.parse(savedPosition);
        console.log('Parsed position data:', positionData);
        
        // Проверяем, что данные действительны и не истекли
        if (positionData && 
            typeof positionData.lng === 'number' && 
            typeof positionData.lat === 'number' &&
            typeof positionData.timestamp === 'number') {
          
          const now = Date.now();
          const timeDiff = now - positionData.timestamp;
          
          console.log('Time difference since last position:', timeDiff, 'ms');
          
          // Проверяем, что позиция не устарела (менее 5 минут)
          if (timeDiff < POSITION_EXPIRY_TIME) {
            console.log('Valid saved position found:', positionData);
            return {
              lng: positionData.lng,
              lat: positionData.lat
            };
          } else {
            console.log('Saved position is too old, will use default');
            // Удаляем устаревшие данные
            localStorage.removeItem(LAST_POSITION_KEY);
          }
        } else {
          console.log('Invalid position data format, removing');
          // Удаляем поврежденные данные
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
      
      // Инициализируем карту с последними сохраненными координатами или без координат (null)
      // Убираем значения по умолчанию - карта должна определять местоположение пользователя
      const initialLng = lastPosition ? lastPosition.lng : null;
      const initialLat = lastPosition ? lastPosition.lat : null;
      
      console.log('Initializing map with coordinates:', initialLng, initialLat, 'Last position was:', lastPosition);
      
      // Дополнительно проверим, что координаты действительно взяты из сохраненных данных
      if (lastPosition) {
        console.log('CONFIRMATION: Using saved coordinates - Lng:', initialLng, 'Lat:', initialLat);
      } else {
        console.log('CONFIRMATION: No saved coordinates, will determine user location');
      }
      
      // Create map configuration with a default world view when no coordinates
      const mapConfig: mapboxgl.MapboxOptions = {
        container: mapContainer,
        style: 'mapbox://styles/mapbox/streets-v12',
        zoom: lastPosition ? 17 : 10, // Use more appropriate zoom level (10) when no position
        maxZoom: 23, // Увеличен максимальный zoom до 23 уровня
        minZoom: 1, // Allow zooming out to world view
        pitch: 0, // Устанавливаем нулевой угол наклона камеры
        bearing: 0 // Устанавливаем нулевой поворот камеры
      };
      
      // Only set center if we have coordinates
      if (initialLng !== null && initialLat !== null) {
        mapConfig.center = [initialLng, initialLat];
      } else {
        // Set a default world view center to avoid map splitting
        mapConfig.center = [0, 0];
      }
      
      map = new mapboxgl.Map(mapConfig);
      
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
              map.setZoom(15); // Set more appropriate zoom level for initial tracking
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
              }, 1000); // Increased delay to 1 second
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
  
  // Функция для повторного запроса геолокации в случае ошибки
  function retryGeolocation() {
    locationError = false;
    if (geolocateControl) {
      isLocating = true;
      // @ts-ignore
      geolocateControl.trigger();
    }
  }
  
  // Helper function to format distance
  function formatDistance(distance: number): string {
    return distance.toFixed(2);
  }
  
  // Helper function to format speed
  function formatSpeed(speed: number): string {
    return speed.toFixed(2);
  }
  
  // Helper function to check if in training mode (always true for this page)
  function isInTrainingMode() {
    return true;
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
          <div class="menu-items">
          </div>
        </div>
      </div>
    {/if}
    
    <!-- Selected training panel -->
    <div class="selected-training-panel">
      <h3 class="selected-training-title">Выбранная тренировка</h3>
      <div class="selected-training-details">
        <div class="training-detail-item">
          <span class="training-detail-label">Название</span>
          <span class="training-detail-value">{selectedTraining.title}</span>
        </div>
        <div class="training-detail-item">
          <span class="training-detail-label">Длительность</span>
          <span class="training-detail-value">{selectedTraining.duration}</span>
        </div>
        <div class="training-detail-item">
          <span class="training-detail-label">Интенсивность</span>
          <span class="training-detail-value">{selectedTraining.intensity}</span>
        </div>
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
              <p>Не удалось определить местоположение. Пожалуйста, проверьте настройки геолокации.</p>
            </div>
          {/if}
          
          <!-- Map will be initialized here by Mapbox GL JS -->
        </div>
        
        <!-- Container for both training stats panels -->
        <div class="training-stats-container">
          <!-- Training stats panel positioned below the map -->
          <div class="training-stats s-nHmVefn3S3wX">
            <div class="stat-card s-nHmVefn3S3wX">
              <h4 class="s-nHmVefn3S3wX">Время</h4>
              <p class="stat-value s-nHmVefn3S3wX">00:00:00</p>
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
              <h4 class="s-nHmVefn3S3wX">Максимум</h4>
              <p class="stat-value s-nHmVefn3S3wX">{formatSpeed(maxSpeed)} км/ч</p>
            </div>
          </div>
          
          <!-- Additional training stats panel -->
          <div class="training-stats s-nHmVefn3S3wX">
            <div class="stat-card s-nHmVefn3S3wX">
              <h4 class="s-nHmVefn3S3wX">Средняя</h4>
              <p class="stat-value s-nHmVefn3S3wX">{formatSpeed(averageSpeed)} км/ч</p>
            </div>
            <div class="stat-card s-nHmVefn3S3wX">
              <h4 class="s-nHmVefn3S3wX">Темп</h4>
              <p class="stat-value s-nHmVefn3S3wX">00:00</p>
            </div>
            <div class="stat-card s-nHmVefn3S3wX">
              <h4 class="s-nHmVefn3S3wX">Калории</h4>
              <p class="stat-value s-nHmVefn3S3wX">0 ккал</p>
            </div>
            <div class="stat-card s-nHmVefn3S3wX">
              <h4 class="s-nHmVefn3S3wX">Высота</h4>
              <p class="stat-value s-nHmVefn3S3wX">0 м</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Bottom navigation panel -->
  <BottomNav 
    {handleBackToDashboard}
    {handleHealthClick}
    {handleTrainingClick}
    {handleDevicesClick}
    {handleProfileClick}
    {handleSettingsClick}
    {handleStartWorkout}
    {handleStopWorkout}
    {handlePauseWorkout}
    {handleResumeWorkout}
    isInTrainingMode={isInTrainingMode}
  />
</div>

<style>
  /* Import Mapbox CSS */
  @import 'mapbox-gl/dist/mapbox-gl.css';
  
  /* Selected training panel */
  .selected-training-panel {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(51, 51, 51, 0.3));
    backdrop-filter: blur(5px);
    border-radius: var(--border-radius);
    padding: clamp(15px, 3vw, 25px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: var(--glass-shadow);
    width: 100%;
    box-sizing: border-box;
    margin-bottom: clamp(15px, 2vw, 30px);
    text-align: center;
  }
  
  /* Selected training title */
  .selected-training-title {
    font-size: clamp(1.2rem, 3vw, 1.6rem);
    font-weight: 600;
    color: var(--white);
    margin: 0 0 clamp(10px, 2vw, 15px) 0;
  }
  
  /* Selected training details */
  .selected-training-details {
    display: flex;
    justify-content: center;
    gap: clamp(15px, 3vw, 25px);
    flex-wrap: wrap;
  }
  
  /* Training detail item */
  .training-detail-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  /* Training detail label */
  .training-detail-label {
    font-size: clamp(0.8rem, 2vw, 1rem);
    color: var(--light-gray);
    margin-bottom: clamp(3px, 0.5vw, 5px);
  }
  
  /* Training detail value */
  .training-detail-value {
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    font-weight: 600;
    color: var(--white);
    background: rgba(0, 191, 255, 0.2);
    padding: clamp(3px, 0.5vw, 6px) clamp(8px, 1.5vw, 12px);
    border-radius: clamp(5px, 1vw, 10px);
  }
  
  /* Map container styles */
  .shield-content {
    width: 100%;
    height: 40vh; /* Уменьшена высота карты для лучшей видимости панелей */
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    /* Добавим минимальную высоту для очень маленьких экранов */
    min-height: 200px;
    /* Добавим максимальную высоту для очень больших экранов */
    max-height: 500px;
    /* Добавим box-sizing для правильного расчета размеров */
    box-sizing: border-box;
    /* Ensure proper rendering to prevent map splitting */
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    will-change: transform;
    height: clamp(200px, 40vh, 500px);
    width: 100%;
    box-sizing: border-box;
    transition: all 0.3s ease-in-out;
    max-width: 100%;
    margin: 0 auto;
  }
  
  /* Specific styles for the shield-content with class s-nHmVefn3S3wX */
  .shield-content.s-nHmVefn3S3wX {
    width: 100%;
    height: 40vh;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    min-height: 200px;
    max-height: 500px;
    box-sizing: border-box;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    will-change: transform;
    height: clamp(200px, 40vh, 500px);
    width: 100%;
    box-sizing: border-box;
    transition: all 0.3s ease-in-out;
    max-width: 100%;
    margin: 0 auto;
  }
  
  /* Responsive map height adjustments */
  @media (min-width: 768px) {
    .shield-content {
      height: 45vh;
      max-height: 550px;
    }
    
    .shield-content.s-nHmVefn3S3wX {
      height: 45vh;
      max-height: 550px;
    }
  }
  
  @media (min-width: 1024px) {
    .shield-content {
      height: 50vh;
      max-height: 600px;
    }
    
    .shield-content.s-nHmVefn3S3wX {
      height: 50vh;
      max-height: 600px;
    }
  }
  
  @media (min-width: 1440px) {
    .shield-content {
      height: 55vh;
      max-height: 650px;
    }
    
    .shield-content.s-nHmVefn3S3wX {
      height: 55vh;
      max-height: 650px;
    }
  }
  
  @media (min-width: 1920px) {
    .shield-content {
      height: 60vh;
      max-height: 700px;
    }
    
    .shield-content.s-nHmVefn3S3wX {
      height: 60vh;
      max-height: 700px;
    }
  }
  
  /* Location message styles */
  .location-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    z-index: 10;
  }
  
  .location-error {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 0, 0, 0.7);
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    text-align: center;
    z-index: 10;
    font-size: 14px;
    max-width: 90%;
  }
  
  /* Spinner styles */
  .spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: 10px auto 0;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Map stats container */
  .map-stats-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    box-sizing: border-box;
    min-height: 150px;
    justify-content: flex-start;
    align-items: center;
    min-height: clamp(150px, 25vh, 400px);
    transition: all 0.3s ease-in-out;
    flex: 1 1 auto;
    /* Prevent scrolling in container */
    overflow: hidden;
    /* Ensure the container has the same width as the map */
    max-width: 100%;
    margin: 0 auto;
  }
  
  /* Container for both stats panels */
  .training-stats-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    align-items: center;
    justify-content: flex-start;
    /* Prevent scrolling in container */
    overflow: hidden;
    /* Ensure the container has the same width as the map */
    max-width: 100%;
    margin: 0 auto;
  }
  
  /* Runner marker styles */
  .runner-marker {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
    border: 2px solid white;
    box-shadow: 0 0 10px rgba(0, 191, 255, 0.8);
    /* Добавим анимацию пульсации */
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(0, 191, 255, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(0, 191, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(0, 191, 255, 0);
    }
  }
  
  /* Ensure text fits in stat-value elements */
  .stat-value {
    min-width: 0;
    box-sizing: border-box;
  }
  
  /* Ensure dashboard header container maintains consistent width */
  .dashboard-header-container {
    width: 100%;
    box-sizing: border-box;
  }
  
  /* Ensure dashboard header maintains consistent width */
  .dashboard-header {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  /* Ensure dashboard main maintains consistent width */
  .dashboard-main {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
</style>
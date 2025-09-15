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
  
  // Sample coordinates for real-time tracking (initial position)
  let currentPosition: [number, number] = [30.3158, 59.9343]; // St. Petersburg coordinates as example
  
  // Path coordinates (simulating a running route)
  let pathCoordinates: [number, number][] = [
    [30.3158, 59.9343],
    [30.3168, 59.9345],
    [30.3178, 59.9347],
    [30.3188, 59.9349],
    [30.3198, 59.9351]
  ];
  
  onMount(() => {
    try {
      // Initialize Mapbox map
      mapboxgl.accessToken = 'pk.eyJ1Ijoia29tbXVuMTV0IiwiYSI6ImNtZmk1ZzlsNTBoejAybHF3ejR6bjEwZ3oifQ.GHO6tJYDnc03P7fxUshk8A';
      
      if (!mapContainer) {
        console.error('Map container not found');
        return;
      }
      
      map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [currentPosition[0], currentPosition[1]],
        zoom: 14
      });
      
      // Add navigation controls
      if (map) {
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      }
      
      // Add geolocate control
      if (map) {
        map.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
          })
        );
      }
      
      // Add the path line to the map
      if (map) {
        map.on('load', () => {
          if (!map) return;
          
          map.addSource('route', {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {},
              'geometry': {
                'type': 'LineString',
                'coordinates': pathCoordinates
              }
            }
          });
          
          map.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': {
              'line-join': 'round',
              'line-cap': 'round'
            },
            'paint': {
              'line-color': '#00BFFF',
              'line-width': 4
            }
          });
          
          // Add a marker for the current position
          if (map) {
            marker = new mapboxgl.Marker({ color: '#FF1493' })
              .setLngLat([currentPosition[0], currentPosition[1]])
              .addTo(map);
          }
        });
      }
      
      // Simulate real-time tracking updates
      const updatePosition = () => {
        // In a real app, this would come from GPS/location services
        // For demo purposes, we'll just move the marker along the path
        const nextIndex = (pathCoordinates.findIndex(coord => 
          coord[0] === currentPosition[0] && coord[1] === currentPosition[1]) + 1) % pathCoordinates.length;
        
        currentPosition = pathCoordinates[nextIndex];
        
        if (marker && map) {
          marker.setLngLat([currentPosition[0], currentPosition[1]]);
          map.setCenter([currentPosition[0], currentPosition[1]]);
        }
      };
      
      // Update position every 3 seconds (simulating real-time tracking)
      setInterval(updatePosition, 3000);
    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
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
      <div class="central-shield">
        <div class="shield-content" bind:this={mapContainer}>
          <!-- Map content goes here -->
        </div>
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
    /* Ensure the map fills the container */
    min-height: clamp(250px, 50vh, 500px);
  }
  
  /* Training stats overlay */
  .training-stats-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    width: 100%;
    max-width: min(100%, clamp(280px, 90vw, 600px));
    padding: 0 clamp(10px, 2vw, 25px);
    box-sizing: border-box;
  }
  
  .training-stats {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: clamp(8px, 2vw, 15px);
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    border-radius: clamp(10px, 2vw, 20px);
    padding: clamp(12px, 2vw, 20px);
    border: clamp(1px, 0.2vw, 2px) solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 clamp(5px, 1vw, 10px) clamp(15px, 2vw, 35px) rgba(0, 191, 255, 0.2);
    box-sizing: border-box;
    width: 100%;
    /* Position below the map */
    position: relative;
    margin-top: clamp(10px, 2vw, 20px);
    max-width: min(100%, clamp(280px, 90vw, 600px));
    margin-left: auto;
    margin-right: auto;
  }
  
  .stat-card {
    text-align: center;
    padding: clamp(8px, 2vw, 15px);
    min-height: clamp(60px, 10vh, 100px);
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
      min-height: clamp(200px, 45vh, 400px);
      border-radius: clamp(6px, 2.5vw, 12px);
    }
    
    .training-stats-overlay {
      max-width: min(100%, clamp(250px, 95vw, 500px));
      padding: 0 clamp(8px, 3vw, 20px);
    }
    
    .training-stats {
      grid-template-columns: 1fr;
      gap: clamp(6px, 2.5vw, 12px);
      padding: clamp(10px, 2.5vw, 15px);
      border-radius: clamp(8px, 2.5vw, 15px);
    }
    
    .stat-card {
      min-height: clamp(50px, 8vh, 80px);
      padding: clamp(6px, 2vw, 12px);
    }
    
    .stat-card h4 {
      font-size: clamp(0.7rem, 2.2vw, 0.9rem);
      margin-bottom: clamp(2px, 1vw, 5px);
    }
    
    .stat-value {
      font-size: clamp(0.9rem, 3.2vw, 1.3rem);
    }
  }
  
  @media (max-width: 480px) {
    .shield-content {
      min-height: clamp(180px, 40vh, 350px);
      border-radius: clamp(5px, 3vw, 10px);
    }
    
    .training-stats-overlay {
      max-width: min(100%, clamp(220px, 98vw, 400px));
      padding: 0 clamp(5px, 3.5vw, 15px);
    }
    
    .training-stats {
      grid-template-columns: 1fr;
      gap: clamp(5px, 3vw, 10px);
      padding: clamp(8px, 3vw, 12px);
      border-radius: clamp(6px, 3vw, 12px);
    }
    
    .stat-card {
      min-height: clamp(45px, 10vh, 70px);
      padding: clamp(5px, 2.5vw, 10px);
    }
    
    .stat-card h4 {
      font-size: clamp(0.6rem, 2.5vw, 0.8rem);
      margin-bottom: clamp(1px, 1vw, 3px);
    }
    
    .stat-value {
      font-size: clamp(0.8rem, 3.5vw, 1.1rem);
    }
  }
  
  /* Large screens */
  @media (min-width: 1200px) {
    .shield-content {
      min-height: clamp(300px, 55vh, 600px);
      border-radius: clamp(10px, 1.5vw, 20px);
    }
    
    .training-stats-overlay {
      max-width: min(100%, clamp(400px, 70vw, 800px));
    }
    
    .training-stats {
      grid-template-columns: repeat(3, 1fr);
      gap: clamp(15px, 1vw, 25px);
      padding: clamp(20px, 1.5vw, 30px);
      border-radius: clamp(15px, 1.5vw, 25px);
    }
    
    .stat-card {
      min-height: clamp(80px, 12vh, 120px);
      padding: clamp(15px, 1vw, 25px);
    }
    
    .stat-card h4 {
      font-size: clamp(1rem, 1.2vw, 1.3rem);
      margin-bottom: clamp(5px, 0.5vw, 10px);
    }
    
    .stat-value {
      font-size: clamp(1.2rem, 2vw, 1.8rem);
    }
  }
</style>
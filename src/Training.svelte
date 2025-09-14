<script lang="ts">
  // Handle back to dashboard
  export let handleBackToDashboard;
  
  // Navigation handlers
  export let handleHealthClick;
  export let handleTrainingClick;
  export let handleDevicesClick;
  export let handleProfileClick;
  
  // Mapbox integration
  import mapboxgl from 'mapbox-gl';
  import { onMount } from 'svelte';
  
  let mapContainer;
  let map;
  let marker;
  
  // Sample coordinates for real-time tracking (initial position)
  let currentPosition = [30.3158, 59.9343]; // St. Petersburg coordinates as example
  
  // Path coordinates (simulating a running route)
  let pathCoordinates = [
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
        center: currentPosition,
        zoom: 14
      });
      
      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add geolocate control
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true
        })
      );
      
      // Add the path line to the map
      map.on('load', () => {
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
        marker = new mapboxgl.Marker({ color: '#FF1493' })
          .setLngLat(currentPosition)
          .addTo(map);
      });
      
      // Simulate real-time tracking updates
      const updatePosition = () => {
        // In a real app, this would come from GPS/location services
        // For demo purposes, we'll just move the marker along the path
        const nextIndex = (pathCoordinates.findIndex(coord => 
          coord[0] === currentPosition[0] && coord[1] === currentPosition[1]) + 1) % pathCoordinates.length;
        
        currentPosition = pathCoordinates[nextIndex];
        
        if (marker) {
          marker.setLngLat(currentPosition);
        }
        
        if (map) {
          map.setCenter(currentPosition);
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
      <h1 class="dashboard-title">Тренировка</h1>
      <div class="header-icon">
        <!-- Empty icon placeholder -->
      </div>
    </div>
    
    <!-- Training content -->
    <div class="dashboard-main">
      <div class="central-shield">
        <div class="shield-content" bind:this={mapContainer}>
        </div>
      </div>
      
      <!-- Training stats -->
      <div class="training-stats">
        <div class="stat-card">
          <h4>Время</h4>
          <p class="stat-value">00:00:00</p>
        </div>
        <div class="stat-card">
          <h4>Дистанция</h4>
          <p class="stat-value">0.0 км</p>
        </div>
        <div class="stat-card">
          <h4>Темп</h4>
          <p class="stat-value">0:00 / км</p>
        </div>
      </div>
      
      <!-- Bottom navigation panel -->
      <div class="bottom-panel">
        <div 
          class="nav-item"
          on:click={handleBackToDashboard}
          on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBackToDashboard(); }}
          role="button"
          tabindex="0"
          aria-label="Статистика"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
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
            <path d="M4.35 7.17C5.05 5.07 7.28 3.5 9.95 3.5H14.05C16.72 3.5 18.95 5.07 19.65 7.17L21.28 12.07C21.66 13.22 21.85 13.8 21.71 14.29C21.57 14.77 21.13 15.11 20.25 15.79L18.5 17.15C16.5 18.7 15.5 19.47 14.36 19.73C13.22 19.99 12.08 19.99 10.94 19.73C9.8 19.47 8.8 18.7 6.8 17.15L5.05 15.79C4.17 15.11 3.73 14.77 3.59 14.29C3.45 13.8 3.64 13.22 4.02 12.07L4.35 7.17Z" stroke="currentColor" stroke-width="2"/>
            <path d="M9 11L11 13L15 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Здоровье</span>
        </div>
        <div class="nav-item nav-item-center">
          <div 
            class="circle-button training-mode" 
            on:click={handleTrainingClick}
            on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTrainingClick(); }}
            role="button"
            tabindex="0"
            aria-label="Начать тренировку"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2"/>
              <path d="M19.4 15C19.2667 15.4 18.9 16 18 16.5C17.1 17 16.0667 17.2667 15 17.3C13.9333 17.2667 12.9 17 12 16.5C11.1 16 10.7333 15.4 10.6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 9C12.9 8.5 13.9333 8.23333 15 8.2C16.0667 8.23333 17.1 8.5 18 9C18.9 9.5 19.2667 10.1 19.4 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M4.6 15C4.73333 14.6 5.1 14 6 13.5C6.9 13 7.93333 12.7333 9 12.7C10.0667 12.7333 11.1 13 12 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 15C11.1 15.5 10.0667 15.7667 9 15.8C7.93333 15.7667 6.9 15.5 6 15C5.1 14.5 4.73333 13.9 4.6 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2"/>
            <path d="M23 20.9999V18.9999C22.9993 18.1136 22.7044 17.2527 22.1614 16.5522C21.6184 15.8517 20.8581 15.3515 20 15.1299" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M16 3.12988C16.8604 3.35143 17.623 3.85051 18.1693 4.54956C18.7156 5.24861 19.0147 6.10829 19.02 7.00488" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
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
  </div>
</div>

<style>
  /* Map container styles */
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
    /* Ensure the map fills the container */
    min-height: 300px;
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
    border-radius: 12px;
  }
  
  /* Style for the geolocate control */
  .shield-content :global(.mapboxgl-ctrl-group) {
    background: rgba(0, 0, 0, 0.7);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
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
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }
  
  /* All other styles are now in app.css */
</style>
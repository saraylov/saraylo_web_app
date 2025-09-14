<script>
  // Handle back to dashboard
  export let handleBackToDashboard;
  
  // Navigation handlers
  export let handleHealthClick;
  export let handleTrainingClick;
  export let handleDevicesClick;
  export let handleProfileClick;
  
  // Device data
  let devices = [
    { id: 1, name: 'Xiaomi Mi Band 7', type: 'fitness-tracker', connected: true, battery: 85 },
    { id: 2, name: 'Apple Watch Series 8', type: 'smartwatch', connected: true, battery: 60 },
    { id: 3, name: 'Samsung Galaxy Watch 5', type: 'smartwatch', connected: true, battery: 45 },
    { id: 4, name: 'Fitbit Versa 4', type: 'fitness-tracker', connected: true, battery: 90 },
    { id: 5, name: 'Garmin Forerunner 255', type: 'smartwatch', connected: true, battery: 70 }
  ];
  
  // Filter to show only fitness trackers and smartwatches
  $: connectedDevices = devices.filter(device => 
    device.connected && (device.type === 'fitness-tracker' || device.type === 'smartwatch')
  );
  
  // Function to disconnect a device
  function disconnectDevice(deviceId) {
    devices = devices.map(device => 
      device.id === deviceId ? {...device, connected: false} : device
    );
  }
  
  // Function to connect a device
  function connectDevice(deviceId) {
    devices = devices.map(device => 
      device.id === deviceId ? {...device, connected: true} : device
    );
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

<div class="container">
  <div class="glass-panel">
    <!-- Header -->
    <div class="dashboard-header">
      <div 
        class="header-icon" 
        on:click={handleProfileClick}
        on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleProfileClick(); }}
        role="button"
        tabindex="0"
        aria-label="Профиль"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5" stroke="var(--primary-blue)" stroke-width="2" stroke-linecap="round"/>
          <path d="M12 19L5 12L12 5" stroke="var(--primary-blue)" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <h1 class="dashboard-title">Устройства</h1>
      <div class="header-icon">
        <img src="/images/111.png" alt="Настройки" width="24" height="24" />
      </div>
    </div>
    
    <!-- Devices content -->
    <div class="dashboard-main">
      <div class="devices-info">
        <h2 class="devices-title">Подключенные устройства</h2>
        <p class="devices-description">Здесь отображаются только фитнес-браслеты и смарт-часы, подключенные через Bluetooth</p>
      </div>
      
      <!-- Devices list -->
      <div class="devices-list">
        {#each connectedDevices as device (device.id)}
          <div class="device-card">
            <div class="device-icon">
              {#if device.type === 'fitness-tracker'}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5C10.0109 4.5 8.10323 5.29018 6.69671 6.69671C5.29018 8.10323 4.5 10.0109 4.5 12C4.5 13.9891 5.29018 15.8968 6.69671 17.3033C8.10323 18.7098 10.0109 19.5 12 19.5C13.9891 19.5 15.8968 18.7098 17.3033 17.3033C18.7098 15.8968 19.5 13.9891 19.5 12C19.5 10.0109 18.7098 8.10323 17.3033 6.69671C15.8968 5.29018 13.9891 4.5 12 4.5Z" stroke="var(--primary-blue)" stroke-width="2"/>
                  <path d="M12 8V12L14 14" stroke="var(--primary-blue)" stroke-width="2" stroke-linecap="round"/>
                </svg>
              {:else}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="var(--primary-pink)" stroke-width="2"/>
                  <path d="M12 6V12L16 14" stroke="var(--primary-pink)" stroke-width="2" stroke-linecap="round"/>
                </svg>
              {/if}
            </div>
            <div class="device-info">
              <h3 class="device-name">{device.name}</h3>
              <p class="device-type">
                {#if device.type === 'fitness-tracker'}
                  Фитнес-браслет
                {:else}
                  Смарт-часы
                {/if}
              </p>
              <div class="battery-info">
                <span class="battery-label">Батарея:</span>
                <span class="battery-value">{device.battery}%</span>
              </div>
            </div>
            <div class="device-actions">
              <button 
                class="disconnect-button"
                on:click={() => disconnectDevice(device.id)}
              >
                Отключить
              </button>
            </div>
          </div>
        {/each}
        
        {#if connectedDevices.length === 0}
          <div class="no-devices">
            <p>Нет подключенных устройств</p>
          </div>
        {/if}
      </div>
      
      <!-- Scan for devices button -->
      <button class="scan-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12C21 12.5304 20.7893 13.0391 20.4142 13.4142C20.0391 13.7893 19.5304 14 19 14M21 12C21 11.4696 20.7893 10.9609 20.4142 10.5858C20.0391 10.2107 19.5304 10 19 10M21 12H17M3 12C3 12.5304 3.21071 13.0391 3.58579 13.4142C3.96086 13.7893 4.46957 14 5 14M3 12C3 11.4696 3.21071 10.9609 3.58579 10.5858C3.96086 10.2107 4.46957 10 5 10M3 12H7M12 3C12.5304 3 13.0391 3.21071 13.4142 3.58579C13.7893 3.96086 14 4.46957 14 5M12 3C11.4696 3 10.9609 3.21071 10.5858 3.58579C10.2107 3.96086 10 4.46957 10 5M12 3V7M12 21C12.5304 21 13.0391 20.7893 13.4142 20.4142C13.7893 20.0391 14 19.5304 14 19M12 21C11.4696 21 10.9609 20.7893 10.5858 20.4142C10.2107 20.0391 10 19.5304 10 19M12 21V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>Поиск устройств</span>
      </button>
      
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
          <img src="/images/Graf.png" alt="Статистика" width="24" height="24" />
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
            on:click={handleTrainingClick}
            on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTrainingClick(); }}
            role="button"
            tabindex="0"
            aria-label="Начать тренировку"
          >
            <img src="/images/Run3.png" alt="Начать тренировку" width="40" height="40" />
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
          <img src="/images/Smart.png" alt="Устройства" width="24" height="24" />
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
  /* All styles are now in app.css */
</style>
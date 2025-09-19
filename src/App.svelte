<script lang="ts">
  import { onMount } from 'svelte';
  import './app.css';
  import Profile from './Profile.svelte';
  import Training from './Training.svelte';
  import Devices from './Devices.svelte';
  import Health from './Health.svelte';
  import Settings from './Settings.svelte';
  import HistoryTrain from './HistoryTrain.svelte';
  import AssessmentTraining from './AssessmentTraining.svelte';
  import Dashboard from './Dashboard.svelte';
  import Login from './Login.svelte';
  import Calendar from './Calendar.svelte';
  
  /** @type {boolean} */
  let isAuthorized = true; // Временно установим в true для обхода авторизации
  /** @type {string} */
  let authStatus = '';
  /** @type {boolean} */
  let isLoading = false;
  /** @type {{id?: number, first_name: string, last_name?: string, username?: string} | null} */
  let userData = {
    id: 123456789,
    first_name: 'Тестовый',
    last_name: 'Пользователь',
    username: 'testuser'
  };
  /** @type {string} */
  let currentView = 'dashboard'; // Всегда показываем dashboard
  /** @type {boolean} */
  let showTelegramWidget = false;
  
  // Activity rings data - updated to use real user data
  let activityData = {
    move: { value: 0, goal: 500, color: '#00BFFF' }, // calories
    exercise: { value: 0, goal: 60, color: '#FF1493' }, // exercise minutes
    stand: { value: 0, goal: 12, color: '#00FF00' } // sleep hours
  };
  
  // Steps data for progress bar
  let stepsData = {
    value: 0,
    goal: 50000
  };
  
  // Helper function to check if in training mode
  function isInTrainingMode() {
    return currentView === 'training';
  }
  
  // Function to simulate getting real user data
  function getRealUserData() {
    // In a real implementation, this would connect to a fitness/health API
    // For now, we'll simulate with realistic values that change over time
    
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const hoursSinceMidnight = (now.getTime() - startOfDay.getTime()) / (1000 * 60 * 60);
    
    // Simulate calories burned (average 2000-2500 calories per day)
    const caloriesBurned = Math.min(500, Math.floor(hoursSinceMidnight * 200));
    
    // Simulate exercise minutes (average 30-60 minutes per day)
    const exerciseMinutes = Math.min(60, Math.floor(hoursSinceMidnight * 2.5));
    
    // Simulate sleep hours (typically 7-9 hours per night)
    // For simulation, we'll assume sleep started 8 hours ago
    const sleepHours = Math.min(12, Math.max(0, 8 - (hoursSinceMidnight > 8 ? hoursSinceMidnight - 8 : 0)));
    
    // Simulate steps (average 8000-10000 steps per day)
    const steps = Math.min(50000, Math.floor(hoursSinceMidnight * 400));
    
    // Update activity data
    activityData.move.value = caloriesBurned;
    activityData.exercise.value = exerciseMinutes;
    activityData.stand.value = sleepHours;
    
    // Update steps data
    stepsData.value = steps;
  }
  
  // Handle logout
  function handleLogout() {
    // Временно отключим logout
    console.log('Logout temporarily disabled');
  }
  
  // Handle add button click
  function handleAddClick() {
    console.log('Add button clicked');
    // TODO: Implement add functionality
  }
  
  // Handle details button click
  function handleDetailsClick() {
    console.log('Details button clicked');
    // TODO: Implement details functionality
  }
  
  // Handle popstate events for browser navigation
  function handlePopState() {
    currentView = 'dashboard';
  }
  
  // Initialize
  onMount(() => {
    // Add event listener for browser navigation (back/forward buttons)
    window.addEventListener('popstate', handlePopState);
  
    // Always show dashboard
    currentView = 'dashboard';
    authStatus = 'Production by V Saraylo';
    
    // Initialize with real user data
    getRealUserData();
    
    // Update data every minute to simulate real-time updates
    setInterval(getRealUserData, 60000);
  
    // Cleanup event listeners
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  });
  
  // Watch for changes in showTelegramWidget
  $: if (showTelegramWidget) {
    // Temporarily disabled since loadTelegramWidget function is not defined
  }
  
  // Function to trigger Telegram Login Widget
  function handleTelegramAuth() {
    showTelegramWidget = true;
  }
  
  // Handle training button click
  function handleTrainingClick() {
    console.log('handleTrainingClick called, setting currentView to training');
    currentView = 'training';
  }
  
  // Handle back to dashboard from training
  function handleBackToDashboard() {
    console.log('handleBackToDashboard called, setting currentView to dashboard');
    currentView = 'dashboard';
  }

  // Handle profile navigation
  function handleProfileClick() {
    console.log('handleProfileClick called, setting currentView to profile');
    currentView = 'profile';
  }

  // Handle devices navigation
  function handleDevicesClick() {
    console.log('handleDevicesClick called, setting currentView to devices');
    currentView = 'devices';
  }

  // Handle health navigation
  function handleHealthClick() {
    console.log('handleHealthClick called, setting currentView to health');
    currentView = 'health';
  }

  // Handle settings navigation
  function handleSettingsClick() {
    console.log('handleSettingsClick called, setting currentView to settings');
    currentView = 'settings';
  }

  // Handle history navigation
  function handleHistoryClick() {
    console.log('handleHistoryClick called in App.svelte');
    console.log('Current view before change:', currentView);
    // Let's also add a small delay to see if there's a timing issue
    setTimeout(() => {
      currentView = 'history';
      console.log('Current view after change:', currentView);
    }, 10);
  }
  
  // Handle assessment training navigation
  function handleAssessmentTrainingClick() {
    console.log('handleAssessmentTrainingClick called, setting currentView to assessment');
    currentView = 'assessment';
  }
  
  // Handle calendar navigation
  function handleCalendarClick() {
    console.log('handleCalendarClick called, setting currentView to calendar');
    currentView = 'calendar';
  }
  
  // Handle setting current view (for Login component)
  function setCurrentView(view: string) {
    currentView = view;
  }
  
  // Helper function to ensure userData has all required properties for Settings component
  function getSettingsUserData() {
    if (!userData) {
      return {
        id: 0,
        first_name: '',
        last_name: '',
        username: ''
      };
    }
    
    return {
      id: userData.id || 0,
      first_name: userData.first_name,
      last_name: userData.last_name || '',
      username: userData.username || ''
    };
  }
</script>

<svelte:head>
  <title>SARAYLO</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <script>
    function onTelegramAuth(user) {
      // Dispatch event to Svelte component
      window.dispatchEvent(new CustomEvent('telegramAuth', { detail: user }));
    }
  </script>
</svelte:head>

{#if currentView === 'login'}
  <Login {setCurrentView} />
{:else if currentView === 'dashboard'}
  <Dashboard 
    {activityData}
    {handleAddClick}
    {handleDetailsClick}
    {handleLogout}
    isInTrainingMode={isInTrainingMode()}
    {handleBackToDashboard}
    {handleHealthClick}
    {handleTrainingClick}
    {handleDevicesClick}
    {handleProfileClick}
    {handleSettingsClick}
    {handleCalendarClick}
  />
{:else if currentView === 'training'}
  <Training 
    {handleBackToDashboard} 
    {handleHealthClick} 
    {handleTrainingClick} 
    {handleDevicesClick} 
    {handleProfileClick} 
    {handleSettingsClick} 
    {handleHistoryClick}
  />
{:else if currentView === 'devices'}
  <Devices {handleBackToDashboard} {handleHealthClick} {handleTrainingClick} {handleDevicesClick} {handleProfileClick} />
{:else if currentView === 'health'}
  <Health {handleBackToDashboard} {handleHealthClick} {handleTrainingClick} {handleDevicesClick} {handleProfileClick} />
{:else if currentView === 'profile'}
  <Profile {userData} {handleBackToDashboard} {handleHealthClick} {handleTrainingClick} {handleDevicesClick} {handleProfileClick} {handleSettingsClick} />
{:else if currentView === 'settings'}
  <Settings 
    userData={getSettingsUserData()} 
    handleBackToDashboard={handleBackToDashboard} 
    handleHealthClick={handleHealthClick} 
    handleTrainingClick={handleTrainingClick} 
    handleDevicesClick={handleDevicesClick} 
    handleProfileClick={handleProfileClick} 
  />
{:else if currentView === 'history'}
  <HistoryTrain {handleBackToDashboard} {handleHealthClick} {handleTrainingClick} {handleDevicesClick} {handleProfileClick} {handleSettingsClick} />
{:else if currentView === 'assessment'}
  <AssessmentTraining 
    {handleBackToDashboard} 
    {handleHealthClick} 
    {handleTrainingClick} 
    {handleDevicesClick} 
    {handleProfileClick} 
    {handleSettingsClick} 
  />
{:else if currentView === 'calendar'}
  <Calendar {handleBackToDashboard} {handleHealthClick} {handleTrainingClick} {handleDevicesClick} {handleProfileClick} {handleSettingsClick} />
{/if}

<style>
  /* Main title */
  .main-title {
    font-size: clamp(2rem, 8vw, 4rem);
    font-weight: 800;
    /* Updated to use Miami Hit color scheme */
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-pink));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
    margin-bottom: clamp(15px, 3vw, 30px);
    text-shadow: 0 0 clamp(10px, 2vw, 25px) rgba(0, 191, 255, 0.3);
    animation: shimmer 3s ease-in-out infinite;
    background-size: 200% 200%;
  }
  
  .subtitle {
    font-size: clamp(1.1rem, 3.5vw, 1.8rem);
    color: var(--light-gray);
    text-align: center;
    margin-bottom: clamp(20px, 3vw, 40px);
    font-weight: 500;
  }
  
  /* Description */
  .description {
    text-align: center;
    margin-bottom: clamp(20px, 3vw, 40px);
    color: var(--light-gray);
  }
  
  .description p {
    margin-bottom: clamp(10px, 1.5vw, 20px);
    line-height: 1.6;
    font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  }
  
  /* Auth section */
  .auth-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(15px, 2.5vw, 30px);
  }
  
  .production-info-static {
    font-size: clamp(1rem, 2.8vw, 1.3rem);
    color: var(--light-gray);
    margin-bottom: clamp(8px, 1.5vw, 15px);
  }
  
  .telegram-auth-button {
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
    border: none;
    border-radius: clamp(8px, 2vw, 15px);
    padding: clamp(12px, 2.5vw, 20px) clamp(25px, 4vw, 40px);
    color: white;
    font-weight: 700;
    font-size: clamp(1rem, 2.5vw, 1.2rem);
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px) rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: clamp(250px, 50vw, 350px);
  }
  
  .telegram-auth-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 clamp(6px, 1.5vw, 12px) clamp(12px, 3vw, 20px) rgba(0, 0, 0, 0.4);
    background: linear-gradient(135deg, var(--primary-pink), var(--primary-blue));
  }
  
  .telegram-auth-button:active {
    transform: translateY(1px);
    box-shadow: 0 clamp(3px, 0.8vw, 6px) clamp(6px, 1.5vw, 12px) rgba(0, 0, 0, 0.3);
  }
  
  .auth-status {
    font-size: clamp(0.8rem, 2vw, 1.1rem);
    color: var(--light-gray);
    text-align: center;
  }
  
  /* Dashboard styles */
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: clamp(12px, 2vw, 20px) 0;
    margin-bottom: clamp(15px, 2vw, 30px);
    /* Updated to use Miami Hit color scheme */
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(51, 51, 51, 0.2));
    border-radius: clamp(10px, 2vw, 20px);
    padding: clamp(10px, 1.5vw, 15px) clamp(15px, 2vw, 25px);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .dashboard-title {
    font-size: clamp(1.3rem, 4vw, 2rem);
    font-weight: 800;
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 clamp(5px, 1vw, 12px) rgba(0, 191, 255, 0.3);
  }
  
  .header-icon {
    cursor: pointer;
    padding: clamp(8px, 2vw, 16px);
    /* Ensure perfect circle shape */
    border-radius: 50%;
    transition: all 0.3s ease;
    /* Updated to use Miami Hit color scheme */
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.2));
    /* Make sure the element is perfectly square */
    width: clamp(36px, 6vw, 50px);
    height: clamp(36px, 6vw, 50px);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
  }

  .header-icon:hover {
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
    transform: scale(1.1);
  }
  
  /* Circle button styles */
  .circle-button {
    width: clamp(50px, 10vw, 80px);
    height: clamp(50px, 10vw, 80px);
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 clamp(4px, 1vw, 8px) clamp(10px, 2vw, 20px) rgba(0, 191, 255, 0.4);
    transition: all 0.3s ease;
    cursor: pointer;
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
  }
  
  .circle-button:hover {
    transform: scale(1.1);
    box-shadow: 0 clamp(6px, 1.5vw, 12px) clamp(15px, 3vw, 25px) rgba(255, 20, 147, 0.6);
  }
  
  /* Coffee button */
  .coffee-button {
    display: flex;
    align-items: center;
    gap: clamp(8px, 2vw, 15px);
    /* Updated to use Miami Hit color scheme */
    background: linear-gradient(135deg, var(--deep-black), #333333);
    border: clamp(1.5px, 0.2vw, 3px) solid var(--primary-pink);
    border-radius: clamp(10px, 2vw, 20px);
    padding: clamp(12px, 2.5vw, 20px) clamp(20px, 4vw, 40px);
    color: #FFFFFF;
    font-weight: 700;
    font-size: clamp(0.9rem, 2.5vw, 1.2rem);
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px) rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: clamp(250px, 50vw, 400px);
    margin: 0 auto;
  }
  
  .coffee-button:hover {
    /* Updated to use Miami Hit color scheme */
    background: linear-gradient(135deg, #333333, var(--deep-black));
    transform: translateY(-3px);
    box-shadow: 0 clamp(6px, 1.5vw, 12px) clamp(12px, 3vw, 20px) rgba(0, 0, 0, 0.4);
    border-color: var(--primary-blue);
  }
  
  .coffee-button:active {
    transform: translateY(1px);
    box-shadow: 0 clamp(2px, 0.5vw, 4px) clamp(4px, 1vw, 8px) rgba(0, 0, 0, 0.3);
  }
  
  /* Training date */
  .training-date {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(8px, 1.5vw, 15px);
    /* Updated to use Miami Hit color scheme */
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.1));
    padding: clamp(12px, 2vw, 20px) clamp(20px, 3vw, 30px);
    border-radius: clamp(10px, 2vw, 20px);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
    max-width: clamp(280px, 60vw, 500px);
    margin: 0 auto;
  }
  
  .training-date p {
    font-size: clamp(0.9rem, 2.5vw, 1.2rem);
    color: var(--light-gray);
    font-weight: 500;
  }
  
  .details-button {
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-pink));
    border: none;
    border-radius: clamp(8px, 1.5vw, 15px);
    padding: clamp(8px, 1.5vw, 15px) clamp(15px, 2.5vw, 25px);
    color: white;
    font-weight: 700;
    font-size: clamp(0.8rem, 2vw, 1rem);
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 clamp(3px, 0.8vw, 6px) clamp(6px, 1.5vw, 10px) rgba(0, 0, 0, 0.2);
  }
  
  .details-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 clamp(4px, 1vw, 8px) clamp(8px, 2vw, 15px) rgba(0, 0, 0, 0.3);
    background: linear-gradient(90deg, var(--primary-pink), var(--primary-blue));
  }
  
  .details-button:active {
    transform: translateY(1px);
    box-shadow: 0 clamp(1.5px, 0.4vw, 3px) clamp(3px, 0.8vw, 6px) rgba(0, 0, 0, 0.2);
  }
  
  /* Component-specific styles */
  .dashboard-actions {
    display: flex;
    flex-direction: column;
    gap: clamp(10px, 2vw, 20px);
    width: 100%;
    max-width: clamp(250px, 50vw, 350px);
    margin: 0 auto;
    align-items: center;
  }
  
  /* Rings title */
  .rings-title {
    text-align: center;
    font-size: clamp(1.2rem, 3vw, 1.8rem);
    font-weight: 700;
    margin-bottom: clamp(15px, 2vw, 30px);
    color: var(--white);
    background: var(--gradient-border);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* Адаптивный дизайн */
  @media (max-width: 768px) {
    .dashboard-header {
      padding: clamp(8px, 2vw, 15px) 0;
    }
    
    .dashboard-title {
      font-size: clamp(1.1rem, 4vw, 1.5rem);
    }
    
    .nav-item span {
      font-size: clamp(0.6rem, 2vw, 0.9rem);
    }
    
    .circle-button {
      width: clamp(45px, 12vw, 65px);
      height: clamp(45px, 12vw, 65px);
    }
    
    .rings-wrapper {
      gap: clamp(10px, 2vw, 20px);
    }
    
    .ring-container {
      width: clamp(70px, 18vw, 100px);
      height: clamp(70px, 18vw, 100px);
    }
  }
  
  @media (max-width: 480px) {
    .app-container {
      padding: clamp(8px, 3vw, 15px);
      padding-bottom: clamp(80px, 14vw, 140px); /* Increased padding for fixed bottom panel */
    }
    
    .glass-panel {
      width: min(100%, clamp(280px, 95vw, 500px));
      padding: clamp(20px, 5vw, 30px) clamp(12px, 3vw, 20px);
    }
    
    .dashboard-header {
      padding: clamp(6px, 1.5vw, 12px) 0;
    }
    
    .dashboard-title {
      font-size: clamp(1rem, 4vw, 1.3rem);
    }
    
    .activity-rings-container {
      padding: clamp(12px, 3vw, 20px);
      margin-bottom: clamp(15px, 2vw, 25px); /* Ensure spacing from other elements */
    }
    
    .rings-title {
      font-size: clamp(1rem, 3vw, 1.5rem);
      margin-bottom: clamp(12px, 1.5vw, 20px);
    }
    
    .rings-wrapper {
      gap: clamp(8px, 2vw, 15px);
    }
    
    .ring-container {
      width: clamp(60px, 16vw, 85px);
      height: clamp(60px, 16vw, 85px);
    }
    
    .ring-value {
      font-size: clamp(0.9rem, 3vw, 1.3rem);
    }
    
    .legend-text {
      font-size: clamp(0.7rem, 2vw, 0.9rem);
    }
    
    /* Ensure bottom panel is properly positioned on small screens */
    .bottom-panel.s-XsEmFtvddWTw {
      padding-bottom: max(clamp(8px, 3vw, 15px), calc(clamp(8px, 3vw, 15px) + var(--safe-area-inset-bottom)));
    }
  }
</style>
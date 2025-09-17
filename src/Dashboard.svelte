<script>
  import { onMount } from 'svelte';
  import BottomNav from './BottomNav.svelte';
  import Header from './Header.svelte';
  import MainContent from './MainContent.svelte';
  
  export let activityData = {
    move: { value: 450, goal: 500, color: '#00BFFF' },
    exercise: { value: 30, goal: 60, color: '#FF1493' },
    stand: { value: 8, goal: 12, color: '#00FF00' }
  };
  
  export let handleAddClick;
  export let handleDetailsClick;
  export let handleLogout;
  
  // Helper function to check if in training mode
  export let isInTrainingMode;
  
  // Navigation handlers need to be passed from parent
  export let handleBackToDashboard;
  export let handleHealthClick;
  export let handleTrainingClick;
  export let handleDevicesClick;
  export let handleProfileClick;
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
    <Header {handleAddClick} />
    <MainContent {activityData} {handleDetailsClick} {handleLogout} />
  </div>
  
  <BottomNav 
    {handleBackToDashboard}
    {handleHealthClick}
    {handleTrainingClick}
    {handleDevicesClick}
    {handleProfileClick}
    isInTrainingMode={isInTrainingMode}
  />
</div>
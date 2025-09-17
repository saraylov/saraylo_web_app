<script>
  import { createEventDispatcher } from 'svelte';
  
  export let handleAddClick;
  
  const dispatch = createEventDispatcher();
</script>

<!-- Header -->
<div class="dashboard-header">
  <h1 class="dashboard-title">Статистика</h1>
  <div 
    class="header-icon" 
    on:click={handleAddClick}
    on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAddClick(); }}
    role="button"
    tabindex="0"
    aria-label="Добавить"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V19" stroke="var(--primary-pink)" stroke-width="2" stroke-linecap="round"/>
      <path d="M5 12H19" stroke="var(--primary-pink)" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </div>
</div>
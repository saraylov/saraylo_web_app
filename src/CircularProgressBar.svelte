<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  
  // Exported properties
  export let progress: number = 0; // Progress from 0 to 100
  export let size: number = 80; // Size of the circle in pixels
  export let strokeWidth: number = 8; // Width of the progress bar
  export let color: string = '#00BFFF'; // Color of the progress bar
  export let backgroundColor: string = 'rgba(255, 255, 255, 0.1)'; // Background circle color
  export let showProgressText: boolean = false; // Whether to show progress percentage text
  
  // Reactive variables
  let radius: number;
  let circumference: number;
  let dashoffset: number;
  
  // Calculate SVG dimensions and progress values
  $: {
    radius = (size - strokeWidth) / 2;
    circumference = radius * 2 * Math.PI;
    dashoffset = circumference - (progress / 100) * circumference;
  }
  
  // Ensure progress is between 0 and 100
  $: progress = Math.min(100, Math.max(0, progress));
</script>

<div class="circular-progress-container">
  <svg
    class="circular-progress"
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
  >
    <!-- Background circle -->
    <circle
      class="circular-progress-background"
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="none"
      stroke={backgroundColor}
      stroke-width={strokeWidth}
    />
    
    <!-- Progress circle -->
    <circle
      class="circular-progress-bar"
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="none"
      stroke={color}
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={circumference}
      stroke-dashoffset={dashoffset}
      transform={`rotate(-90 ${size / 2} ${size / 2})`}
    />
    
    <!-- Progress text if enabled -->
    {#if showProgressText}
      <text
        class="circular-progress-text"
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-size={size / 5}
        fill={color}
      >
        {Math.round(progress)}%
      </text>
    {/if}
  </svg>
</div>

<style>
  .circular-progress-container {
    display: inline-block;
  }
  
  .circular-progress {
    transform: rotate(-90deg);
    transition: transform 0.3s ease;
  }
  
  .circular-progress-bar {
    transition: stroke-dashoffset 0.3s ease, stroke 0.3s ease;
    transform-origin: center;
  }
  
  .circular-progress-text {
    transform: rotate(90deg);
    transition: fill 0.3s ease;
  }
</style>
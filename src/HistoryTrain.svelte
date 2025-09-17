<script lang="ts">
	import { onMount } from 'svelte';
	
	// Navigation handlers
	export let handleBackToDashboard: () => void;
	export let handleHealthClick: () => void;
	export let handleTrainingClick: () => void;
	export let handleDevicesClick: () => void;
	export let handleProfileClick: () => void;
	export let handleSettingsClick: () => void;
	
	// Helper function to check if in training mode (needed for bottom panel)
	function isInTrainingMode(): boolean {
		// In a real app, this would check the current view or training state
		// For now, we'll return false as History is not a training view
		return false;
	}
	
	interface TrainingSession {
		id: number;
		date: string;
		duration: string;
		distance: string;
		calories: number;
		pace: string;
	}
	
	let trainingHistory: TrainingSession[] = [];
	
	onMount(() => {
		console.log('HistoryTrain component mounted');
		// Mock data for training history
		trainingHistory = [
			{
				id: 1,
				date: '2023-06-15',
				duration: '45:30',
				distance: '5.2 km',
				calories: 320,
				pace: '8:42 /km'
			},
			{
				id: 2,
				date: '2023-06-12',
				duration: '32:15',
				distance: '4.1 km',
				calories: 245,
				pace: '7:51 /km'
			},
			{
				id: 3,
				date: '2023-06-10',
				duration: '60:45',
				distance: '7.8 km',
				calories: 480,
				pace: '7:48 /km'
			},
			{
				id: 4,
				date: '2023-06-08',
				duration: '28:20',
				distance: '3.5 km',
				calories: 210,
				pace: '8:06 /km'
			},
			{
				id: 5,
				date: '2023-06-05',
				duration: '52:10',
				distance: '6.3 km',
				calories: 395,
				pace: '8:17 /km'
			}
		];
	});
	
	function formatDateTime(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<div class="history-container">
	<div class="dashboard-header">
		<h1>История тренировок</h1>
		<div class="header-icon" on:click={handleSettingsClick} role="button" tabindex="0" aria-label="Настройки">
			<img src="images/111.png" alt="Настройки" width="24" height="24" />
		</div>
	</div>
	
	<div class="history-content">
		{#if trainingHistory.length > 0}
			<div class="history-list">
				{#each trainingHistory as session}
					<div class="history-card glass-panel">
						<div class="session-header">
							<h3>{formatDateTime(session.date)}</h3>
						</div>
						<div class="session-details">
							<div class="stat-item">
								<span class="stat-label">Длительность</span>
								<span class="stat-value">{session.duration}</span>
							</div>
							<div class="stat-item">
								<span class="stat-label">Дистанция</span>
								<span class="stat-value">{session.distance}</span>
							</div>
							<div class="stat-item">
								<span class="stat-label">Калории</span>
								<span class="stat-value">{session.calories} ккал</span>
							</div>
							<div class="stat-item">
								<span class="stat-label">Темп</span>
								<span class="stat-value">{session.pace}</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="no-history">
				<p>История тренировок пуста</p>
			</div>
		{/if}
	</div>
</div>

<!-- Bottom navigation panel - identical to the one in App.svelte -->
<div class="bottom-panel">
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
      class:training-mode={isInTrainingMode()}
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

<style>
	.history-container {
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
	}
	
	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 0;
		margin-bottom: 25px;
		background: linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(51, 51, 51, 0.2));
		border-radius: 15px;
		padding: 15px 20px;
		backdrop-filter: blur(5px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	h1 {
		font-size: 1.5rem;
		font-weight: 600;
		text-align: center;
		flex-grow: 1;
		margin: 0;
	}
	
	.header-icon-placeholder {
		width: var(--touch-target-min);
		height: var(--touch-target-min);
	}
	
	.header-icon {
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
	}
	
	.history-content {
		width: 100%;
	}
	
	.history-list {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	
	.history-card {
		background: var(--glass-bg);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-radius: var(--border-radius);
		border: 1px solid var(--glass-border);
		box-shadow: var(--glass-shadow);
		padding: 20px;
		width: 100%;
		text-align: center;
		animation: fadeIn 0.8s ease-out;
		position: relative;
		overflow: hidden;
	}
	
	.session-header {
		margin-bottom: 15px;
		padding-bottom: 10px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	h3 {
		font-size: 1.2rem;
		font-weight: 600;
		margin: 0;
	}
	
	.session-details {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 15px;
	}
	
	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 10px;
	}
	
	.stat-label {
		font-size: 0.9rem;
		color: var(--light-gray);
		margin-bottom: 5px;
	}
	
	.stat-value {
		font-size: 1.1rem;
		font-weight: 600;
	}
	
	.no-history {
		text-align: center;
		padding: 40px 20px;
		background: var(--glass-bg);
		border-radius: var(--border-radius);
		border: 1px solid var(--glass-border);
	}
	
	.no-history p {
		font-size: 1.1rem;
		color: var(--light-gray);
		margin: 0;
	}
	
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}
	
	/* Bottom panel styles - imported from app.css */
	.bottom-panel {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		align-items: center;
		padding: clamp(10px, 2vw, 25px) clamp(8px, 2vw, 20px);
		background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(51, 51, 51, 0.3));
		backdrop-filter: blur(10px);
		border-radius: var(--border-radius);
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: calc(100% - (var(--container-padding) * 2));
		max-width: min(100%, clamp(300px, 95vw, 800px));
		margin: 0 auto;
		z-index: 1000;
		padding-bottom: max(clamp(10px, 2vw, 25px), calc(clamp(10px, 2vw, 25px) + var(--safe-area-inset-bottom)));
		margin-bottom: var(--safe-area-inset-bottom);
		min-height: var(--touch-target-min);
		box-sizing: border-box;
	}
	
	.nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(3px, 1vw, 10px);
		cursor: pointer;
		color: var(--light-gray);
		transition: all 0.3s ease;
		padding: clamp(8px, 2vw, 16px);
		border-radius: clamp(5px, 1vw, 12px);
		min-width: var(--touch-target-min);
		min-height: var(--touch-target-min);
		justify-content: center;
		text-align: center;
	}
	
	.nav-item-center {
		margin-top: calc(clamp(-25px, -4vw, -50px));
		grid-column: 3;
	}
	
	.circle-button {
		/* Make the button responsive using consistent clamp values */
		width: clamp(50px, 12vw, 80px);
		height: clamp(50px, 12vw, 80px);
		border-radius: 50%;
		background: linear-gradient(135deg, var(--primary-blue), var(--primary-pink));
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 clamp(4px, 1vw, 8px) clamp(8px, 2vw, 20px) rgba(0, 191, 255, 0.4);
		transition: all 0.3s ease;
		min-width: var(--touch-target-min);
		min-height: var(--touch-target-min);
		margin: 0 auto;
		
		/* Ensure the button maintains its circular shape */
		aspect-ratio: 1 / 1;
		
		/* Prevent deformation at small screen sizes */
		object-fit: contain;
		flex-shrink: 0;
	}
	
	.circle-button:hover {
		transform: scale(1.05);
		box-shadow: 0 clamp(6px, 1.5vw, 12px) clamp(12px, 3vw, 30px) rgba(0, 191, 255, 0.6);
	}
	
	.circle-button:active {
		transform: scale(0.95);
	}
	
	.circle-button.training-mode {
		animation: pulse 2s infinite;
	}
	
	@keyframes pulse {
		0% { box-shadow: 0 0 0 0 rgba(0, 191, 255, 0.7); }
		70% { box-shadow: 0 0 0 clamp(15px, 3vw, 30px) rgba(0, 191, 255, 0); }
		100% { box-shadow: 0 0 0 0 rgba(0, 191, 255, 0); }
	}
	
	.nav-item:hover {
		color: var(--white);
		background: rgba(255, 255, 255, 0.1);
		transform: translateY(-3px);
	}
	
	@media (max-width: 600px) {
		.session-details {
			grid-template-columns: 1fr;
		}
		
		.history-container {
			padding: 10px;
		}
	}
</style>
<script lang="ts">
	import { onMount } from 'svelte';
	
	// Navigation handlers
	export let handleBackToDashboard: () => void;
	export let handleHealthClick: () => void;
	export let handleTrainingClick: () => void;
	export let handleDevicesClick: () => void;
	export let handleProfileClick: () => void;
	export let handleSettingsClick: () => void;
	
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
	
	@media (max-width: 600px) {
		.session-details {
			grid-template-columns: 1fr;
		}
		
		.history-container {
			padding: 10px;
		}
	}
</style>
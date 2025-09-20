import { StepCounter } from '@saraylo/step-counter';

/**
 * Утилита для работы с шагами
 */

// Текущее количество шагов
let currentSteps = 0;

// Функция для получения текущего количества шагов
export async function getStepCount(): Promise<number> {
  try {
    const result = await StepCounter.getStepCount();
    currentSteps = result.steps;
    return currentSteps;
  } catch (error) {
    console.error('Ошибка при получении количества шагов:', error);
    return currentSteps; // Возвращаем последнее известное значение
  }
}

// Функция для запуска отслеживания шагов
export async function startStepTracking(): Promise<void> {
  try {
    // Запрашиваем разрешения, если необходимо
    await StepCounter.startTracking();
    
    // Добавляем слушатель для обновлений
    await StepCounter.addListener('stepCountUpdate', (data) => {
      currentSteps = data.steps;
      console.log('Обновление шагов:', currentSteps);
      
      // Здесь можно добавить код для обновления UI или сохранения данных
      // Например, можно отправить событие или обновить localStorage
    });
    
    console.log('Отслеживание шагов запущено');
  } catch (error) {
    console.error('Ошибка при запуске отслеживания шагов:', error);
  }
}

// Функция для остановки отслеживания шагов
export async function stopStepTracking(): Promise<void> {
  try {
    await StepCounter.stopTracking();
    console.log('Отслеживание шагов остановлено');
  } catch (error) {
    console.error('Ошибка при остановке отслеживания шагов:', error);
  }
}

// Функция для инициализации счетчика шагов
export async function initializeStepCounter(): Promise<void> {
  try {
    // Получаем начальное количество шагов
    await getStepCount();
    
    // Запускаем отслеживание
    await startStepTracking();
    
    console.log('Счетчик шагов инициализирован');
  } catch (error) {
    console.error('Ошибка при инициализации счетчика шагов:', error);
  }
}
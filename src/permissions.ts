import { Geolocation } from '@capacitor/geolocation';
import { PushNotifications } from '@capacitor/push-notifications';
import type { PermissionState } from '@capacitor/core';

// Функция для запроса разрешений на геолокацию
export async function requestLocationPermission(): Promise<{location: PermissionState} | null> {
  try {
    // Проверяем текущий статус разрешений
    const status = await Geolocation.checkPermissions();
    
    // Если разрешения уже предоставлены
    if (status.location === 'granted') {
      console.log('Разрешение на геолокацию уже предоставлено');
      return status;
    }
    
    // Запрашиваем разрешения
    const permission = await Geolocation.requestPermissions();
    console.log('Статус разрешения на геолокацию:', permission);
    return permission;
  } catch (error) {
    console.error('Ошибка при запросе разрешения на геолокацию:', error);
    return null;
  }
}

// Функция для запроса разрешений на уведомления
export async function requestNotificationPermission(): Promise<any> {
  try {
    // Запрашиваем разрешения на уведомления
    const permission = await PushNotifications.requestPermissions();
    console.log('Статус разрешения на уведомления:', permission);
    return permission;
  } catch (error) {
    console.error('Ошибка при запросе разрешения на уведомления:', error);
    return null;
  }
}

// Функция для получения текущей позиции
export async function getCurrentPosition() {
  try {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Текущая позиция:', coordinates);
    return coordinates;
  } catch (error) {
    console.error('Ошибка при получении текущей позиции:', error);
    return null;
  }
}

// Функция для запуска отслеживания геолокации
export async function startLocationTracking() {
  try {
    const watcherId = await Geolocation.watchPosition({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }, (position: any, err: any) => {
      if (err) {
        console.error('Ошибка отслеживания позиции:', err);
        return;
      }
      
      console.log('Обновленная позиция:', position);
      // Здесь можно добавить код для обработки обновленной позиции
    });
    
    console.log('Отслеживание геолокации запущено с ID:', watcherId);
    return watcherId;
  } catch (error) {
    console.error('Ошибка при запуске отслеживания геолокации:', error);
    return null;
  }
}

// Функция для остановки отслеживания геолокации
export async function stopLocationTracking(watcherId: string) {
  try {
    await Geolocation.clearWatch({ id: watcherId });
    console.log('Отслеживание геолокации остановлено');
  } catch (error) {
    console.error('Ошибка при остановке отслеживания геолокации:', error);
  }
}

// Функция для регистрации уведомлений
export async function setupPushNotifications() {
  try {
    // Регистрируем обработчики событий уведомлений
    PushNotifications.addListener('registration', (token: any) => {
      console.log('Регистрационный токен уведомлений:', token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Ошибка регистрации уведомлений:', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
      console.log('Получено уведомление:', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: any) => {
      console.log('Действие по уведомлению:', notification);
    });

    // Регистрируем приложение для получения уведомлений
    const result = await PushNotifications.register();
    console.log('Регистрация уведомлений завершена:', result);
  } catch (error) {
    console.error('Ошибка настройки уведомлений:', error);
  }
}

// Функция для запроса всех необходимых разрешений
export async function requestAllPermissions() {
  console.log('Запрос всех необходимых разрешений...');
  
  // Запрашиваем разрешение на геолокацию
  const locationPermission = await requestLocationPermission();
  
  // Запрашиваем разрешение на уведомления
  const notificationPermission = await requestNotificationPermission();
  
  return {
    location: locationPermission,
    notifications: notificationPermission
  };
}
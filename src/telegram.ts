// Telegram Web App integration
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
}

export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    chat?: any;
    chat_type?: string;
    chat_instance?: string;
    start_param?: string;
    auth_date: number;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: any;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  BackButton: any;
  MainButton: any;
  SettingsButton: any;
  HapticFeedback: any;
  CloudStorage: any;
  BiometricManager: any;
  openLink: (url: string) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (url: string, callback?: (status: 'paid' | 'failed' | 'pending' | 'cancelled') => void) => void;
  shareToStory: (media_url: string, params?: { text?: string; widget_link?: { url: string; name: string } }) => void;
  switchInlineQuery: (query: string, choose_chat_types?: ('users' | 'bots' | 'groups' | 'channels')[]) => void;
}

export interface Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}

// Extend the ImportMeta interface to include env property
declare global {
  interface ImportMeta {
    env: {
      VITE_TELEGRAM_TOKEN?: string;
    };
  }
  
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

// Bot configuration - теперь используем только переменные окружения
const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_TOKEN || '';
const BOT_USERNAME = 'Saraylo_bot';

// Добавим проверку наличия токена
if (!BOT_TOKEN) {
  console.warn('VITE_TELEGRAM_TOKEN is not set in environment variables. Telegram integration will not work.');
}

/**
 * Инициализация Telegram Web App
 * @returns true если инициализация прошла успешно, false в противном случае
 */
export function initTelegramWebApp(): boolean {
  try {
    if (typeof window === 'undefined') {
      console.warn('Window object is not available (server-side rendering)');
      return false;
    }
    
    if (!(window as any).Telegram) {
      console.warn('Telegram Web App API is not available');
      return false;
    }
    
    if (!(window as any).Telegram.WebApp) {
      console.warn('Telegram Web App instance is not available');
      return false;
    }
    
    const webApp: TelegramWebApp = (window as any).Telegram.WebApp;
    webApp.ready();
    webApp.expand();
    console.log('Telegram Web App initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Telegram Web App:', error);
    return false;
  }
}

/**
 * Аутентификация пользователя через Telegram
 * @returns Promise с данными пользователя или null
 */
export function authenticateUser(): Promise<TelegramUser | null> {
  return new Promise((resolve) => {
    try {
      if (typeof window === 'undefined') {
        console.warn('Window object is not available (server-side rendering)');
        resolve(null);
        return;
      }
      
      if (!(window as any).Telegram?.WebApp) {
        console.warn('Telegram Web App not available');
        resolve(null);
        return;
      }
      
      const webApp: TelegramWebApp = (window as any).Telegram.WebApp;
      
      // Check if we have user data from Telegram
      if (webApp.initDataUnsafe?.user && webApp.initDataUnsafe.auth_date) {
        // Добавим проверку актуальности данных (не старше 1 дня)
        const isDataFresh = (Date.now() / 1000 - webApp.initDataUnsafe.auth_date) < 24 * 60 * 60;
        if (isDataFresh) {
          console.log('User authenticated via Telegram:', webApp.initDataUnsafe.user);
          resolve(webApp.initDataUnsafe.user);
        } else {
          console.warn('Telegram user data is outdated');
          resolve(null);
        }
      } else {
        console.warn('No user data available from Telegram');
        resolve(null);
      }
    } catch (error) {
      console.error('Error during Telegram authentication:', error);
      resolve(null);
    }
  });
}

/**
 * Получение данных инициализации Telegram
 * @returns Данные инициализации или null
 */
export function getTelegramInitData(): string | null {
  try {
    if (typeof window === 'undefined') {
      console.warn('Window object is not available (server-side rendering)');
      return null;
    }
    
    if (!(window as any).Telegram?.WebApp) {
      console.warn('Telegram Web App not available');
      return null;
    }
    
    return (window as any).Telegram.WebApp.initData;
  } catch (error) {
    console.error('Error getting Telegram init data:', error);
    return null;
  }
}

/**
 * Валидация данных Telegram Web App
 * @param initData Данные инициализации для валидации
 * @returns true если данные валидны, false в противном случае
 */
export function validateTelegramData(initData: string): boolean {
  if (!BOT_TOKEN) {
    console.error('BOT_TOKEN is not set. Cannot validate Telegram data.');
    return false;
  }
  
  try {
    // Проверяем наличие данных
    if (!initData) {
      console.warn('No init data provided for validation');
      return false;
    }
    
    // В реальной реализации здесь должна быть проверка HMAC-SHA256 подписи
    // Пока что просто проверяем формат
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    
    if (!hash) {
      console.warn('No hash found in Telegram init data');
      return false;
    }
    
    // Базовая проверка структуры данных
    const requiredFields = ['auth_date', 'user'];
    for (const field of requiredFields) {
      if (!params.has(field)) {
        console.warn(`Required field '${field}' not found in Telegram init data`);
        return false;
      }
    }
    
    console.log('Telegram data validation passed basic checks');
    return true;
  } catch (error) {
    console.error('Error validating Telegram data:', error);
    return false;
  }
}

export { BOT_TOKEN, BOT_USERNAME };
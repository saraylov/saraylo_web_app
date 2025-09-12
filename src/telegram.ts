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

// Bot configuration
const BOT_TOKEN = '7950779597:AAFZ8xZJ590qQ9yjLGCu6K_mhrxK46av7zo';
const BOT_USERNAME = 'Saraylo_bot';

export function initTelegramWebApp() {
  try {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const webApp = (window as any).Telegram.WebApp;
      webApp.ready();
      webApp.expand();
      console.log('Telegram Web App initialized');
      return true;
    } else {
      console.warn('Telegram Web App is not available in this environment');
      return false;
    }
  } catch (error) {
    console.error('Error initializing Telegram Web App:', error);
    return false;
  }
}

export function authenticateUser(): Promise<TelegramUser | null> {
  return new Promise((resolve) => {
    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const webApp = (window as any).Telegram.WebApp;
        
        // Check if we have user data from Telegram
        if (webApp.initDataUnsafe?.user) {
          console.log('User authenticated via Telegram:', webApp.initDataUnsafe.user);
          resolve(webApp.initDataUnsafe.user);
        } else {
          console.warn('No user data available from Telegram');
          resolve(null);
        }
      } else {
        console.warn('Telegram Web App not available');
        resolve(null);
      }
    } catch (error) {
      console.error('Error during Telegram authentication:', error);
      resolve(null);
    }
  });
}

export function getTelegramInitData() {
  try {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      return (window as any).Telegram.WebApp.initData;
    }
    return null;
  } catch (error) {
    console.error('Error getting Telegram init data:', error);
    return null;
  }
}

export { BOT_TOKEN, BOT_USERNAME };
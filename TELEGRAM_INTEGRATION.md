# Интеграция с Telegram ботом @Saraylo_bot

## Обзор

Этот документ описывает интеграцию веб-приложения "Квантовый Беговой Тренер" с Telegram ботом @Saraylo_bot. Интеграция позволяет пользователям авторизовываться через Telegram и получать доступ к функциям приложения.

## Конфигурация бота

- **Имя бота**: @Saraylo_bot
- **API Token**: Задается через переменную окружения `VITE_TELEGRAM_TOKEN` (**никогда не хранится в коде**)
- **Тип интеграции**: Telegram Web App

## Файлы интеграции

### telegram.ts

Основной файл интеграции с Telegram Web App API. Содержит:

1. Интерфейсы TypeScript для работы с Telegram Web App
2. Функции инициализации и аутентификации
3. Константы с данными бота

### App.svelte

Главный компонент приложения с кнопкой авторизации через Telegram.

## Как работает интеграция

### 1. Инициализация

При загрузке приложения вызывается функция `initTelegramWebApp()`, которая:

- Проверяет наличие Telegram Web App API
- Инициализирует Web App с помощью `Telegram.WebApp.ready()`
- Раскрывает Web App на весь экран с помощью `Telegram.WebApp.expand()`

### 2. Авторизация

При нажатии на кнопку "Войти через Telegram":

1. Отправляется запрос к Telegram Web App API
2. Получаются данные пользователя из `Telegram.WebApp.initDataUnsafe.user`
3. Отображается приветствие с именем пользователя

### 3. Данные пользователя

После успешной авторизации доступны следующие данные:

- `id`: Уникальный идентификатор пользователя
- `first_name`: Имя пользователя
- `last_name`: Фамилия пользователя (опционально)
- `username`: Имя пользователя в Telegram (опционально)
- `language_code`: Код языка пользователя
- `is_premium`: Признак премиум-статуса пользователя

## Настройка Web App в Telegram

Для работы приложения как Web App в Telegram необходимо:

1. Открыть [@BotFather](https://t.me/BotFather) в Telegram
2. Выбрать своего бота (@Saraylo_bot)
3. Отправить команду `/setmenubutton`
4. Выбрать бота из списка
5. Ввести URL вашего приложения: `https://ваш-домен.com`
6. Ввести текст для кнопки меню (например, "Открыть приложение")

## Безопасность

### ВАЖНО: Безопасность токена

**Никогда не храните токен бота в исходном коде!** 
- Токен должен быть задан только через переменные окружения
- Файл [.env](file://e:/DevBuild/AI/AI%20Running/saraylo_web_app/.env) добавлен в [.gitignore](file://e:/DevBuild/AI/AI%20Running/saraylo_web_app/.gitignore) и не попадает в репозиторий
- Используйте [.env.example](file://e:/DevBuild/AI/AI%20Running/saraylo_web_app/.env.example) как шаблон для настройки

### Валидация данных

Для проверки подлинности данных от Telegram необходимо:

1. Использовать секретный ключ бота (API Token)
2. Проверять подпись данных (`hash`) с помощью HMAC-SHA256
3. Убедиться, что `auth_date` не слишком старый (рекомендуется < 1 день)

### Пример проверки подписи (Node.js)

```javascript
const crypto = require('crypto');

function validateTelegramData(initData, token) {
  const secret = crypto.createHmac('sha256', 'WebAppData')
    .update(token)
    .digest();
    
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  params.delete('hash');
  
  const sortedParams = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
    
  const calculatedHash = crypto
    .createHmac('sha256', secret)
    .update(sortedParams)
    .digest('hex');
    
  return calculatedHash === hash;
}
```

## Конфигурация переменных окружения

Для настройки Telegram токена:

1. Создайте файл `.env` в корне проекта
2. Добавьте в него строку:
   ```
   VITE_TELEGRAM_TOKEN=ваш_токен_бота_здесь
   ```
3. Замените `ваш_токен_бота_здесь` на реальный токен вашего бота

Если файл `.env` не существует или не содержит токен, интеграция с Telegram не будет работать.

Также доступен пример файла конфигурации [.env.example](file://e:/DevBuild/AI/AI%20Running/saraylo_web_app/.env.example).

## Развертывание

### Локальная разработка

Для локальной разработки используйте:

```bash
npm run dev
```

Обратите внимание, что Telegram Web App API будет работать только внутри Telegram.

### Для тестирования вне Telegram

В режиме разработки приложение симулирует авторизацию через Telegram, если API недоступен.

## Ограничения

1. Telegram Web App API работает только внутри Telegram
2. Для полноценной работы необходим HTTPS
3. Некоторые функции Telegram Web App могут быть недоступны в браузере

## Дополнительные ресурсы

- [Официальная документация Telegram Web App](https://core.telegram.org/bots/webapps)
- [Telegram Web App JavaScript SDK](https://telegram.org/js/telegram-web-app.js)
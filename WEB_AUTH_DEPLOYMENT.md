# Развертывание веб-приложения с авторизацией через Telegram

## Описание

Эта версия приложения представляет собой полнофункциональный веб-сайт с возможностью авторизации через Telegram. Приложение работает как обычный сайт, но предоставляет пользователям возможность авторизоваться через Telegram Web App, если они открывают его в Telegram.

## Особенности

1. Работает как обычный веб-сайт
2. Поддерживает авторизацию через Telegram Web App
3. Имеет демо-режим для тестирования функционала
4. Корректно отображается на всех устройствах
5. Использует относительные пути для корректной работы на GitHub Pages

## Структура файлов

- Основной компонент: `src/AppWebAuth.svelte`
- Точка входа: `src/mainWebAuth.ts`
- Конфигурация Vite: `viteWebAuth.config.ts`
- Сборка: `distWebAuth/`

## Сборка приложения

### Разработка

Для запуска приложения в режиме разработки:
```bash
npm run dev:webauth
```

Приложение будет доступно по адресу: http://localhost:5177

### Сборка для продакшена

Для сборки приложения для продакшена:
```bash
npm run build:webauth
```

Собранные файлы будут находиться в папке `distWebAuth`.

### Предварительный просмотр

Для предварительного просмотра собранного приложения:
```bash
npm run preview:webauth
```

## Развертывание на GitHub Pages

### Подготовка

1. Убедитесь, что у вас установлена последняя версия Node.js (20 или выше)
2. Установите зависимости:
   ```bash
   npm install
   ```

3. Соберите приложение:
   ```bash
   npm run build:webauth
   ```

### Ручное развертывание

1. Закоммитьте содержимое папки `distWebAuth` в ваш репозиторий:
   ```bash
   git add distWebAuth
   git commit -m "Добавление веб-приложения с авторизацией через Telegram"
   git push origin main
   ```

2. Перейдите в настройки репозитория на GitHub:
   - Откройте вкладку "Settings"
   - Прокрутите до раздела "Pages"

3. Настройте GitHub Pages:
   - В разделе "Source" выберите "Deploy from a branch"
   - В выпадающем списке "Branch" выберите ветку (обычно `main`)
   - В поле "Folder" выберите `/distWebAuth`
   - Нажмите "Save"

### Автоматическое развертывание с GitHub Actions

Создайте файл `.github/workflows/deploy-webauth.yml`:
```yaml
name: Deploy WebAuth App to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build:webauth
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./distWebAuth
```

Закоммитьте и запушьте файл workflow:
```bash
git add .github/workflows/deploy-webauth.yml
git commit -m "Добавление GitHub Actions для развертывания веб-приложения с авторизацией"
git push origin main
```

## Использование приложения

### Для обычных пользователей

1. Откройте сайт в браузере
2. Выберите один из вариантов входа:
   - Авторизация через Telegram (если сайт открыт в Telegram)
   - Демо-режим (для тестирования функционала)

### Для пользователей Telegram

1. Найдите бота @Saraylo_bot в Telegram
2. Запустите Web App через меню бота
3. Авторизуйтесь через Telegram

## Настройка авторизации через Telegram

Для полноценной работы авторизации через Telegram необходимо:

1. Настроить бота в [@BotFather](https://t.me/BotFather)
2. Установить Web App URL на ваш сайт
3. Реализовать серверную часть для проверки данных авторизации

### Настройка Web App в @BotFather

1. Откройте [@BotFather](https://t.me/BotFather)
2. Выберите своего бота
3. Отправьте команду `/setmenubutton`
4. Выберите бота из списка
5. Введите URL вашего приложения: `https://ваш-логин.github.io/имя-репозитория/`
6. Введите текст для кнопки меню (например, "Открыть приложение")

## Возможные проблемы и их решения

### Белый экран при загрузке

1. Проверьте консоль браузера (F12) на наличие ошибок
2. Убедитесь, что пути к ресурсам в index.html начинаются с "./"
3. Проверьте, что все необходимые файлы были загружены на GitHub Pages

### Ошибки загрузки ресурсов (404)

1. Убедитесь, что папка `distWebAuth` содержит все необходимые файлы
2. Проверьте, что GitHub Pages настроен на правильную папку
3. Убедитесь, что в конфигурации Vite установлен параметр `base: './'`

### Проблемы с маршрутизацией

Если вы используете клиентскую маршрутизацию, создайте файл `404.html` в папке `distWebAuth` с содержимым `index.html`:
```bash
cp distWebAuth/index.html distWebAuth/404.html
```

## Обновление приложения

Для обновления приложения:

1. Внесите необходимые изменения в код
2. Соберите приложение заново:
   ```bash
   npm run build:webauth
   ```
3. Закоммитьте и запушьте изменения:
   ```bash
   git add .
   git commit -m "Обновление веб-приложения с авторизацией"
   git push origin main
   ```

Если вы используете GitHub Actions, приложение будет обновлено автоматически.
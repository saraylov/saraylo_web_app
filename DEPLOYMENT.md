# Развертывание веб-приложения на GitHub Pages

## Подготовка приложения

1. Убедитесь, что у вас установлена последняя версия Node.js (20 или выше)
2. Установите зависимости:
   ```bash
   npm install
   ```

## Сборка приложения

Для сборки веб-версии приложения выполните:
```bash
npm run build:web
```

Собранные файлы будут находиться в папке `distWeb`.

## Настройка GitHub Pages

1. Закоммитьте и запушьте изменения в ваш репозиторий:
   ```bash
   git add .
   git commit -m "Добавление веб-версии приложения"
   git push origin main
   ```

2. Перейдите в настройки репозитория на GitHub:
   - Откройте вкладку "Settings"
   - Прокрутите до раздела "Pages"

3. Настройте GitHub Pages:
   - В разделе "Source" выберите "Deploy from a branch"
   - В выпадающем списке "Branch" выберите ветку (обычно `main`)
   - В поле "Folder" выберите `/distWeb` (если вы настроили публикацию из этой папки) или `/` если будете копировать содержимое папки `distWeb` в корень репозитория
   - Нажмите "Save"

## Альтернативный способ: использование GitHub Actions

Вы можете настроить автоматическую сборку и развертывание с помощью GitHub Actions:

1. Создайте файл `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
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
           run: npm run build:web
           
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./distWeb
   ```

2. Закоммитьте и запушьте файл workflow:
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Добавление GitHub Actions для развертывания"
   git push origin main
   ```

3. GitHub Actions автоматически соберет и развернет приложение при каждом пуше в ветку `main`.

## Ручное копирование файлов

Если вы предпочитаете ручной способ развертывания:

1. Соберите приложение:
   ```bash
   npm run build:web
   ```

2. Скопируйте содержимое папки `distWeb` в корень вашего репозитория или в ветку `gh-pages`

3. Закоммитьте и запушьте изменения:
   ```bash
   git add .
   git commit -m "Обновление веб-приложения"
   git push origin main
   ```

## Проверка развертывания

После настройки GitHub Pages ваше приложение будет доступно по адресу:
`https://ваш-логин.github.io/имя-репозитория/`

Например: `https://saraylov.github.io/saraylo_web_app/`

## Возможные проблемы и их решения

### Белый экран при загрузке

1. Проверьте консоль браузера (F12) на наличие ошибок
2. Убедитесь, что пути к ресурсам в index.html начинаются с "./", а не с "/"
3. Проверьте, что все необходимые файлы были загружены на GitHub Pages

### Ошибки загрузки ресурсов (404)

1. Убедитесь, что папка `distWeb` содержит все необходимые файлы
2. Проверьте, что GitHub Pages настроен на правильную папку
3. Убедитесь, что в конфигурации Vite установлен параметр `base: './'`

### Проблемы с маршрутизацией

Если вы используете клиентскую маршрутизацию (например, SvelteKit), создайте файл `404.html` в папке `distWeb` с содержимым `index.html`:
```bash
cp distWeb/index.html distWeb/404.html
```

Это необходимо для корректной работы SPA на GitHub Pages.

## Обновление приложения

Для обновления приложения:

1. Внесите необходимые изменения в код
2. Соберите приложение заново:
   ```bash
   npm run build:web
   ```
3. Закоммитьте и запушьте изменения:
   ```bash
   git add .
   git commit -m "Обновление приложения"
   git push origin main
   ```

Если вы используете GitHub Actions, приложение будет обновлено автоматически.
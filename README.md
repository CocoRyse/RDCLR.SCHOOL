# RDCLR.SCHOOL — учебный проект

Учебная копия лендинга RDCLR.HOME — серии офлайн-лекций студии Red Collar. Проект сделан в рамках курса RDCLR.SCHOOL как первый опыт вёрстки: чёрные блоки, красный #EC3332, тени со сдвигом 10px и шрифт Montserrat.

![Скриншот проекта](https://github.com/CocoRyse/RDCLR.SCHOOL/blob/master/image/HonestWork.jpg)

## Демо

- https://cocoryse.github.io/RDCLR.SCHOOL/

## Стек

- HTML / CSS / JavaScript
- Без фреймворков и сборки

## Запуск локально

```bash
python3 -m http.server 8000
```

Открыть http://localhost:8000

## Что внутри

Страницы:

- Главная (`index.html`)
- О нас (`text.html`)
- Мерч (`merch.html`)
- Контакты (`contacts.html`)

Фичи:

- Слайдеры
- Бегущие строки
- Валидация формы с попапом
- Параллакс лого
- Lazy-load YouTube-видео

## Что улучшено

Проект отрефакторен в 2026 году:

- CSS-переменные вместо «магических» значений
- Доступность: aria-атрибуты, `focus-visible`, `prefers-reduced-motion`
- Семантическая разметка
- Рефакторинг JS
- Исправление багов

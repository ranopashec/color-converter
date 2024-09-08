# Задача

Изучить цветовые модели: RGB, CMYK, HSV, HLS, XYZ, LAB, переход от одной модели к другой, исследовать цветовой график МКО.

Создать приложение/веб-приложение, позволяющее пользователю выбирать, а затем интерактивно менять цвет, показывая при этом его составляющие в трех моделях одновременно (варианты приведены в таблице ниже).

## На проверку сдаются:

- **exe**, который должен работать на ПК преподавателя под Windows/веб-приложение, размещенное в общем доступе;
- Исходный код приложения на **GitHub**;
- Сопроводительная документация.

## Основные требования к приложению

- В интерфейсе дать возможность пользователю задавать точные цвета (поля ввода), выбирать цвета из палитры (аналогично графическим редакторам), плавно изменять цвета (например, ползунки).
- При изменении любой компоненты цвета все остальные представления этого цвета в двух других цветовых моделях пересчитываются автоматически.
- При «некорректных цветах» (например, при переходе из XYZ в RGB в вашем расчете получился выход за границы изменения рассчитываемого параметра) выдавать ненавязчивое предупреждение, что происходит обрезание-округление и т.п.

## Баллы

- Корректность перевода из одной модели в другую: **40 баллов**.
- Дружелюбный и удобный интерфейс: **30 баллов**.
- Возможность задания цвета в каждой из трех моделей тремя способами: **20 баллов**.
- Автоматический пересчет цвета во всех моделях при изменении любой из координат: **20 баллов**.

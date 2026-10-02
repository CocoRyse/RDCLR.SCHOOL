'use strict';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
    initBurger();
    initHeaderHide();
    initSlider();
    initLongSlider();
    initMarquee();
    initHeroParallax();
    initDirections();
    initForm();
    initReel();
    initCardScroll();
});

/* Бургер в шапке: открывает полноэкранное меню на мобильных */
function initBurger() {
    const button = document.querySelector('header button');
    const menu = document.querySelector('header nav');
    if (!button || !menu) return;

    button.addEventListener('click', () => {
        const opened = menu.classList.toggle('active');
        button.classList.toggle('active', opened);
        document.documentElement.classList.toggle('active', opened);
        button.setAttribute('aria-label', opened ? 'Закрыть меню' : 'Открыть меню');
    });
}

/* Прячем шапку при скролле вниз, возвращаем при скролле вверх */
function initHeaderHide() {
    const header = document.querySelector('header');
    if (!header) return;

    let prevScroll = window.scrollY;
    let hidden = false;
    let scrolledUp = 0;

    window.addEventListener('scroll', () => {
        const scroll = window.scrollY;
        if (window.innerWidth < 800) return;

        if (scroll > prevScroll && !hidden) {
            header.classList.add('hide');
            hidden = true;
            scrolledUp = 0;
        } else {
            if (hidden && scroll < prevScroll)
                scrolledUp += prevScroll - scroll;
            else
                scrolledUp = 0;

            if (hidden && (scrolledUp > 50 || scroll === 0)) {
                header.classList.remove('hide');
                hidden = false;
            }
        }

        prevScroll = scroll;
    }, { passive: true });
}

/* Слайдер фотоотчёта на странице «О нас» */
function initSlider() {
    const sliders = document.querySelectorAll('.slider');
    if (!sliders.length) return;

    sliders.forEach((slider) => {
        const slides = slider.querySelectorAll('.slide');
        const wrapper = slider.querySelector('.slider-wrapper');
        const prevButton = slider.querySelector('.button-prev');
        const nextButton = slider.querySelector('.button-next');
        const counter = slider.querySelector('.slider-counter');

        if (slides.length < 2 || !wrapper || !prevButton || !nextButton) return;

        let width = slides[0].scrollWidth;
        let activeSlide = 0;

        const render = () => {
            if (counter)
                counter.innerHTML = `<p><span class="red">${activeSlide + 1}</span>&nbsp;/&nbsp;${slides.length}</p>`;
            wrapper.style.transform = `translate3d(-${width * activeSlide}px, 0, 0)`;
        };

        prevButton.addEventListener('click', () => {
            activeSlide--;
            if (activeSlide < 0) activeSlide = slides.length - 1;
            render();
        });

        nextButton.addEventListener('click', () => {
            activeSlide++;
            if (activeSlide > slides.length - 1) activeSlide = 0;
            render();
        });

        window.addEventListener('resize', () => {
            width = slides[0].scrollWidth;
            render();
        });

        render();
    });
}

/* Слайдер спикеров на главной: бесконечная лента из трёх копий ряда.
   На десктопе едет по горизонтали, на мобильных — по вертикали */
function initLongSlider() {
    const sliders = document.querySelectorAll('.long-slider');
    if (!sliders.length) return;

    sliders.forEach((slider) => {
        const wrapper = slider.querySelector('.long-slider-wrapper');
        const prevButton = slider.querySelector('.button-prev');
        const nextButton = slider.querySelector('.button-next');
        const slides = slider.querySelectorAll('.long-slide');

        if (!wrapper || !prevButton || !nextButton || slides.length < 2) return;

        const rowHTML = wrapper.innerHTML;
        let width = slides[0].scrollWidth;
        let height = slides[0].scrollHeight;
        let activeSlide = 0;

        // три копии ряда: уезжаем за край — мгновенно перескакиваем к двойнику
        wrapper.innerHTML = rowHTML + rowHTML + rowHTML;

        const isDesktop = () => window.innerWidth > 800;

        const place = (slide, animate = true) => {
            if (!animate) wrapper.classList.add('no-animation');
            wrapper.style.transform = isDesktop()
                ? `translate3d(-${width * slide}px, 0, 0)`
                : `translate3d(0, -${height * slide}px, 0)`;
            if (!animate) void wrapper.offsetHeight; // reflow, чтобы прыжок применился сразу
            wrapper.classList.remove('no-animation');
        };

        prevButton.addEventListener('click', () => {
            activeSlide--;

            if (activeSlide < 0) {
                activeSlide = slides.length - 1;
                place(activeSlide + 1, false); // прыжок к двойнику без анимации
            }

            place(activeSlide);
        });

        nextButton.addEventListener('click', () => {
            activeSlide++;

            if (activeSlide > 2 * slides.length - 1) {
                activeSlide = slides.length;
                place(activeSlide - 1, false);
            }

            place(activeSlide);
        });

        window.addEventListener('resize', () => {
            width = slides[activeSlide % slides.length].scrollWidth;
            height = slides[activeSlide % slides.length].scrollHeight;
        });
    });
}

/* Бегущие строки: тиражируем содержимое до ширины окна, пересчитываем на ресайз */
function initMarquee() {
    const blocks = document.querySelectorAll('.marquee-block, .no-padding-marquee-block');
    if (!blocks.length) return;

    const rows = [];

    blocks.forEach((block) => {
        block.querySelectorAll('.marquee, .marquee-left').forEach((row) => {
            const initialHTML = row.innerHTML;
            rows.push({ row, initialHTML });
        });
    });

    const fill = () => {
        rows.forEach(({ row, initialHTML }) => {
            row.innerHTML = initialHTML;

            const wrapper = row.querySelector('.wrapper');
            if (!wrapper) return;

            const copies = Math.ceil(window.innerWidth / wrapper.clientWidth) + 1;
            let extended = '';
            for (let i = 0; i <= copies; i++) extended += initialHTML;
            row.innerHTML = extended;
        });
    };

    fill();
    window.addEventListener('resize', fill);
}

/* Параллакс теней логотипов на первом экране */
function initHeroParallax() {
    const top = document.querySelector('.top');
    const shadowRdclr = document.querySelector('.RDCLR-shadow');
    const shadowHome = document.querySelector('.HOME-shadow');
    if (!top || (!shadowRdclr && !shadowHome) || REDUCED_MOTION) return;

    let left = 0;
    let topOffset = 0;
    let targetLeft = 0;
    let targetTop = 0;

    top.addEventListener('mousemove', (event) => {
        const centerX = window.innerWidth / 2;
        const centerY = top.clientHeight / 2;

        const kh = window.innerWidth >= 1440 ? -17 : -11;
        const kv = window.innerWidth >= 1440 ? -11 : -6;

        targetLeft = kh * Math.tanh((event.clientX - centerX) / 500);
        targetTop = kv * Math.tanh((event.clientY - centerY) / 50);
    });

    (function animate() {
        left += (targetLeft - left) / 20;
        topOffset += (targetTop - topOffset) / 20;

        const transform = `translateY(${topOffset}px) translateX(${left}px)`;
        if (shadowHome) shadowHome.style.transform = transform;
        if (shadowRdclr) shadowRdclr.style.transform = transform;

        requestAnimationFrame(animate);
    })();
}

/* Направления на главной: красная тень иконки тянется за курсором,
   иконка слегка приподнимается навстречу. Смещения пишем в CSS-переменные,
   filter/transform читает их в style.css */
function initDirections() {
    const directions = document.querySelectorAll('.directions .direction');
    if (!directions.length || REDUCED_MOTION) return;

    const IDLE = { sx: 6, sy: 6, ix: 0, iy: 0 };
    const items = [];

    directions.forEach((direction) => {
        const img = direction.querySelector('img');
        if (!img) return;

        const item = { img, current: { ...IDLE }, target: { ...IDLE } };
        items.push(item);

        direction.addEventListener('mousemove',((event) => {
            const rect = direction.getBoundingClientRect();
            const relX = (event.clientX - rect.left) / rect.width - 0.5;
            const relY = (event.clientY - rect.top) / rect.height - 0.5;

            // тень отклоняется от курсора, иконка — к курсору
            item.target.sx = IDLE.sx - relX * 24;
            item.target.sy = IDLE.sy - relY * 24;
            item.target.ix = relX * 8;
            item.target.iy = relY * 8;
        }), { passive: true });

        direction.addEventListener('mouseleave', () => {
            item.target.sx = IDLE.sx;
            item.target.sy = IDLE.sy;
            item.target.ix = IDLE.ix;
            item.target.iy = IDLE.iy;
        });
    });

    (function animate() {
        items.forEach(({ img, current, target }) => {
            let settled = true;

            for (const key of ['sx', 'sy', 'ix', 'iy']) {
                current[key] += (target[key] - current[key]) / 12;
                if (Math.abs(target[key] - current[key]) > 0.05) settled = false;
            }

            if (!settled) {
                img.style.setProperty('--sx', `${current.sx.toFixed(2)}px`);
                img.style.setProperty('--sy', `${current.sy.toFixed(2)}px`);
                img.style.setProperty('--ix', `${current.ix.toFixed(2)}px`);
                img.style.setProperty('--iy', `${current.iy.toFixed(2)}px`);
            }
        });

        requestAnimationFrame(animate);
    })();
}

/* Валидация формы записи и попап успеха */
function initForm() {
    const popup = document.querySelector('.popup');
    const messageField = document.querySelector('.message-text');
    const overlay = document.querySelector('.overlay');
    const closeButton = document.querySelector('.popup-close');

    if (!popup || !messageField || !overlay) return;

    const closePopup = () => {
        document.documentElement.classList.remove('popup-active');
        popup.setAttribute('aria-hidden', 'true');
    };

    const openPopup = () => {
        document.documentElement.classList.add('popup-active');
        popup.setAttribute('aria-hidden', 'false');
    };

    overlay.addEventListener('click', closePopup);
    if (closeButton) closeButton.addEventListener('click', closePopup);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closePopup();
    });

    document.querySelectorAll('form').forEach((form) => {
        const elements = form.elements;
        if (!elements) return;

        const flagError = (el) => {
            el.classList.add('error');
            el.addEventListener('change', () => el.classList.remove('error'), { once: true });
        };

        const validate = () => {
            let valid = true;

            if (form.status && form.status.selectedIndex === 0) {
                flagError(form.querySelector('.select'));
                valid = false;
            }

            for (const el of elements) {
                // textarea не проверяем: необязательное поле
                if (el.type === 'email' || el.type === 'tel' || el.type === 'text') {
                    if (!el.value.trim()) {
                        flagError(el);
                        valid = false;
                    }
                }

                if (el.type === 'checkbox' && !el.checked) {
                    flagError(form.querySelector('.checkbox'));
                    valid = false;
                }
            }

            return valid;
        };

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            if (!validate()) return;

            messageField.innerHTML = `
            <h2 class="black">Поздравляем!</h2>
            <p>Вы записались на&nbsp;RDCLR.HOME</p>`;
            openPopup();
        });
    });
}

/* Showreel: вставляем YouTube только по клику */
function initReel() {
    document.querySelectorAll('.reel').forEach((reel) => {
        let loaded = false;

        const embed = () => {
            if (loaded) return;

            reel.innerHTML = `<iframe width="${reel.clientWidth}" height="${reel.clientHeight}"
                src="https://www.youtube.com/embed/d-DXr4cPLI4?autoplay=1"
                title="Red Collar showreel"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>`;
            loaded = true;
        };

        reel.addEventListener('click', embed);
        reel.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                embed();
            }
        });

        window.addEventListener('resize', () => {
            const iframe = reel.querySelector('iframe');
            if (!iframe) return;

            iframe.width = reel.clientWidth;
            iframe.height = reel.clientHeight;
        });
    });
}

/* Кнопка «заполнить заявку» в карточке лекции скроллит к форме */
function initCardScroll() {
    const target = document.querySelector('#signup');
    if (!target) return;

    document.querySelectorAll('.card button').forEach((button) => {
        button.addEventListener('click', () => {
            target.scrollIntoView({
                behavior: REDUCED_MOTION ? 'auto' : 'smooth'
            });
        });
    });
}

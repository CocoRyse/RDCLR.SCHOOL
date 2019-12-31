'use strict';

window.addEventListener('DOMContentLoaded', function () {
    let button = document.querySelector('button');
    let menu = document.querySelector('nav');
    let action = false;

    button.addEventListener('click', function () {
        if (action === false) {
            if (menu) menu.classList.add('active');
            if (button) button.classList.add('active');
            document.documentElement.classList.add('active');
            action = true;
        } else {
            if (menu) menu.classList.remove('active');
            if (button) button.classList.remove('active');
            document.documentElement.classList.remove('active');
            action = false;
        }
    });
});

window.addEventListener('DOMContentLoaded', function () {
    let header = document.querySelector('header');
    let prevScroll = pageYOffset;
    let scroll = pageYOffset;
    let hidden = false;

    let scrolledDown = 0;

    window.addEventListener('scroll', function () {
        if (!header)
            return;

        if (window.innerWidth < 800) return;

        scroll = pageYOffset;

        if ((header) && !hidden)
            header.classList.remove('hide');

        if ((scroll - prevScroll > 0) && !hidden) {
            header.classList.add('hide');
            hidden = true;
            prevScroll = scroll;
            scrolledDown = 0;
        } else {
            if (hidden && (scroll - prevScroll < 0))
                scrolledDown += scroll - prevScroll;
            else
                scrolledDown = 0;

            if ((scrolledDown < -50) && hidden) {
                header.classList.remove('hide');
                hidden = false;
                prevScroll = scroll
            }
        }
        if (hidden && pageYOffset === 0) {
            header.classList.remove('hide');
            hidden = false;
            prevScroll = scroll
        }

        prevScroll = scroll
    });
});

window.addEventListener('DOMContentLoaded', function () {
    const sliders = document.querySelectorAll('.slider');

    for (let i = 0; i < sliders.length; i++) {
        createSlider(sliders[i]);
    }

    function createSlider(slider) {
        const slides = slider.querySelectorAll('.slide');

        if (slides.length < 2) return;

        let wrapper = slider.querySelector('.slider-wrapper');
        const prevButton = slider.querySelector('.button-prev');
        const nextButton = slider.querySelector('.button-next');
        const sliderCounter = slider.querySelector('.slider-counter');

        if (!prevButton && !nextButton) return;

        let width = 0;

        function resize() {
            // width = slider.scrollWidth;
            width = slides[0].scrollWidth;
        }

        resize();

        let activeSlide = 0;

        slides[activeSlide].classList.add('active');

        // let wrapperHtml = wrapper.innerHTML;

        if (sliderCounter) sliderCounter.innerHTML = `<p><span class="red">${activeSlide + 1}</span>&nbsp;/&nbsp;${slides.length}</p>`;

        if (prevButton) prevButton.addEventListener('click', function () {

            activeSlide--;

            if (activeSlide < 1) activeSlide = slides.length - 1;

            if (sliderCounter) sliderCounter.innerHTML = `<p><span class="red">${activeSlide + 1}</span>&nbsp;/&nbsp;${slides.length}</p>`;

            wrapper.style.transform = `translate3d(-${width * activeSlide}px, 0, 0)`;
        });

        if (nextButton) nextButton.addEventListener('click', function () {

            activeSlide++;

            if (activeSlide > slides.length - 1) activeSlide = 0;

            if (sliderCounter) sliderCounter.innerHTML = `<p><span class="red">${activeSlide + 1}</span>&nbsp;/&nbsp;${slides.length}</p>`;

            wrapper.style.transform = `translate3d(-${width * activeSlide}px, 0, 0)`;
        });

        window.addEventListener('resize', resize);
    }
});

window.addEventListener('DOMContentLoaded', function () {
    let marqueeBlocks = document.querySelectorAll('.marquee-block');
    for (let i = 0; i < marqueeBlocks.length; i++) {
        createMarqueeBlock(marqueeBlocks[i]);
    }
    let noPaddingMarqueeBlocks = document.querySelectorAll('.no-padding-marquee-block');
    for (let i = 0; i < marqueeBlocks.length; i++) {
        createMarqueeBlock(noPaddingMarqueeBlocks[i]);
    }

    function createMarqueeBlock(block) {
        if (!block) return;

        let divs = block.querySelectorAll('div');

        let width = 0;

        let count = 1;

        function resize() {
            width = window.innerWidth;

            // if (block)
                // block.style.width = `${width}px`;
        }

        resize();


        for (let i = 0; i < divs.length; i++) {
            createMarqueeDiv(divs[i]);
        }

        function createMarqueeDiv(div) {
            if (!div) return;

            document.addEventListener('resize', resize);

            const innerHTML = div.innerHTML;

            function recount() {
                let wrapperWidth = 100;

                const wrapper = div.querySelector('.wrapper');
                if (wrapper)
                    wrapperWidth = wrapper.clientWidth;

                count = width / wrapperWidth + 1;

                div.innerHTML = innerHTML;

                let extender = '';
                for (let i = 0; i < count; i++)
                    extender += div.innerHTML;

                div.innerHTML = extender;
            }

            recount();


            window.addEventListener('resize', recount);
        }

        window.addEventListener('resize', resize);
    }
});

window.addEventListener('DOMContentLoaded', function () {
    let tops = document.querySelectorAll('.top');
    for (let i = 0; i < tops.length; i++) {
        createTop(tops[i]);
    }

    function createTop(top) {
        if (!top) return;

        let shadowRdclr = document.querySelector('.RDCLR-shadow');
        let shadowHome = document.querySelector('.HOME-shadow');

        let left = 0;
        let ttop = 0;

        let nLeft = 0;
        let nTop = 0;

        function animate() {
            left += (nLeft - left) / 20;
            ttop += (nTop - ttop) / 20;

            if (shadowHome) {
                shadowHome.style.transform = 'translateY(' + ttop + 'px)' +
                    ' translateX(' + left + 'px)';
            }

            if (shadowRdclr) {
                shadowRdclr.style.transform = 'translateY(' + ttop + 'px)' +
                    ' translateX(' + left + 'px)';
            }

            requestAnimationFrame(animate);
        }

        top.addEventListener('mousemove', function (event) {
            let centerX = window.innerWidth / 2;
            let centerY = top.clientHeight / 2;

            let kh;
            let kv;

            if (window.innerWidth >= 1440) {
                kh = -17;
                kv = -11;
            } else {
                kh = -11;
                kv = -6;
            }

            nLeft = kh * Math.tanh((event.clientX - centerX) / 500);
            nTop = kv * Math.tanh((event.clientY - centerY) / 50);
        });

        animate();
    }
});

window.addEventListener('DOMContentLoaded', function () {
    function createValidate() {
        const forms = document.querySelectorAll('form');
        const messageField = document.querySelector('.message-text');
        const overlay = document.querySelector('.overlay');
        const button = document.querySelector('.popup-close');

        if (!messageField || !overlay) return;

        overlay.addEventListener('click', function () {
            document.documentElement.classList.remove('popup-active');
            // по хорошему нельзя вешать классы на html, так как это может спровоцировать перерисовку всей страницы
        });

        if (button)
            button.addEventListener('click', function () {
                document.documentElement.classList.remove('popup-active');
            });

        Array.from(forms).forEach(form => createForm(form, messageField));
    }

    createValidate();

    function createForm(form, mess) {
        const action = form.action;
        const elements = form.elements;

        if (!action || !elements) return;

        function validate() {
            let result = true;

            if (form.status.selectedIndex === 0) {
                let el = form.querySelector('.select');
                el.classList.add('error');
                el.addEventListener('change', function () {
                    el.classList.remove('error');
                });
                result = false;
            }

            for (let i = 0; i < elements.length; i++) {
                let el = elements[i];

                // if (el.dataset.required) continue;

                if (el.type === 'email' ||
                    el.type === 'tel' ||
                    el.type === 'text') {
                    // textarea не валидирую, потому что логично, что это не обязательное поле и его можно оставить пустым
                    if (!el.value) {
                        el.classList.add('error');
                        el.addEventListener('change', function () {
                            el.classList.remove('error');
                        });
                        result = false;
                    }
                    console.log(el.value);
                }
                if (el.type === 'checkbox')
                    if (!el.checked) {
                        let checkbox = form.querySelector('.checkbox');
                        checkbox.classList.add('error');
                        el.addEventListener('change', function () {
                            checkbox.classList.remove('error');
                        });
                        result = false;
                    }
            }
            // дата атрибуты очень удобная шутка, которые доступные в объекте датасет
            return result;
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault(); // отменяет стандартное поведение элемента
            const success = `
            <h2 class="black">Поздравляем!</h2>
            <p>Вы записались на&nbsp;RDCLR.HOME</p>`;

            const lose = `
            <h2>Ошибка!</h2>
            <p class="red">Проверьте корректность вводимых данных</p>`;

            if (!validate()) {
                // document.documentElement.classList.add('popup-active');
                // mess.innerHTML = lose;
                return;
            }

            document.documentElement.classList.add('popup-active');
            mess.innerHTML = success;
        })
    }
});

window.addEventListener('DOMContentLoaded', function () {
    function createReel(reel) {
        if (!reel) return;

        let clicked = false;

        reel.addEventListener('click', function () {
            if (clicked) return;

            reel.innerHTML = `<iframe width="${reel.clientWidth}" height="${reel.clientHeight}" src="https://www.youtube.com/embed/d-DXr4cPLI4" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            clicked = true;
        });


        function resize() {
            let iframe = reel.querySelector('iframe');

            if (!iframe) return;

            iframe.width = reel.clientWidth;
            iframe.height = reel.clientHeight;
        }

        window.addEventListener('resize', resize);
    }

    let reels = document.querySelectorAll('.reel');
    for (let i = 0; i < reels.length; i++)
        createReel(reels[i]);

    function createCard(card) {
        if (!card) return;

        let button = card.querySelector('button');

        if (!button) return;

        button.addEventListener('click', function () {
            window.scrollTo(0, window.innerWidth < 800 ? 6700 : 5800);
        })
    }

    let cards = document.querySelectorAll('.card');
    for (let i = 0; i < cards.length; i++)
        createCard(cards[i]);
});

// сочный слайдер с главной
window.addEventListener('DOMContentLoaded', function () {
    let sliders = document.querySelectorAll('.long-slider');
    for (let i = 0; i < sliders.length; i++)
        createSlider(sliders[i]);

    function createSlider(slider) {
        if (!slider) return;

        let nextButton = slider.querySelector('.button-next');
        let prevButton = slider.querySelector('.button-prev');
        let wrapper = slider.querySelector('.long-slider-wrapper');
        let slides = slider.querySelectorAll('.long-slide');

        if (!nextButton && !prevButton || !slides) return;

        const wrapperHTML = wrapper.innerHTML;

        let width = 0;
        let activeSlide = 0;

        function resize() {
            // width = slider.scrollWidth;
            width = slides[activeSlide].scrollWidth;
        }

        resize();
        wrapper.innerHTML = wrapperHTML + wrapperHTML + wrapperHTML;

        if (prevButton) prevButton.addEventListener('click', function () {

            activeSlide--;

            if (activeSlide < 0) {
                activeSlide = slides.length - 1;
                wrapper.classList.add('no-animation');

                wrapper.style.transform = `translate3d(-${width * (activeSlide + 1)}px, 0, 0)`;

                wrapper.offsetHeight;
                wrapper.classList.remove('no-animation');
            }

            wrapper.style.transform =  `translate3d(-${width * activeSlide}px, 0, 0)`;
        });

        if (nextButton) nextButton.addEventListener('click', function () {

            activeSlide++;

            if (activeSlide > 2 * slides.length - 1) {
                activeSlide = slides.length;
                wrapper.classList.add('no-animation');

                wrapper.style.transform = `translate3d(-${width * (activeSlide - 1)}px, 0, 0)`;

                wrapper.offsetHeight;
                wrapper.classList.remove('no-animation');
            }

            wrapper.style.transform =  `translate3d(-${width * activeSlide}px, 0, 0)`;
        });

        window.addEventListener('resize', resize);
    }
});

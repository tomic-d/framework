divhunt.AddonReady('transforms', (transforms) => 
{
    transforms.ItemAdd({
        id: 'swiper',
        icon: 'swipe',
        name: 'Swiper',
        description: 'Touch-enabled slider/carousel component. Create image galleries and content sliders with swipe gestures.',
        js: [
            'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js'
        ],
        css: [
            'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css'
        ],
        config: {
            'slides-per-view': ['number', 3],
            'space-between': ['number', 20],
            'loop': ['boolean', false],
            'autoplay': ['boolean|object', false],
            'navigation': ['boolean', true],
            'pagination': ['boolean', true],
            'speed': ['number', 300],
            'grab-cursor': ['boolean', true],
            'free-mode': ['boolean', false]
        },
        code: function(data, item, compile, node, identifier)
        {
            this.setup = () => 
            {
                node.classList.add('swiper');

                const children = Array.from(node.children);
                const wrapper = document.createElement('div');

                wrapper.className = 'swiper-wrapper';

                children.forEach(child =>
                {
                    child.classList.add('swiper-slide');
                    wrapper.appendChild(child);
                });

                node.appendChild(wrapper);
            };

            this.navigation = () =>
            {
                if(!data.navigation.value)
                {
                    return;
                }

                const prev = document.createElement('div');
                const next = document.createElement('div');

                prev.className = 'swiper-button-prev';
                next.className = 'swiper-button-next';

                node.appendChild(prev);
                node.appendChild(next);
            };

            this.pagination = () =>
            {
                if(!data.pagination.value)
                {
                    return;
                }

                const pagination = document.createElement('div');

                pagination.className = 'swiper-pagination';

                node.appendChild(pagination);
            };

            this.config = () =>
            {
                const slidesPerView = data['slides-per-view'].value;
                const spaceBetween = data['space-between'].value;

                const config = {
                    slidesPerView: 1,
                    spaceBetween: spaceBetween,
                    speed: data['speed'].value,
                    loop: data['loop'].value,
                    grabCursor: data['grab-cursor'].value,
                    cssMode: false,
                    allowTouchMove: true,
                    touchRatio: 1,
                    resistance: true,
                    resistanceRatio: 0.85,
                    breakpoints: {
                        640: { slidesPerView: Math.min(2, slidesPerView), spaceBetween: spaceBetween },
                        1024: { slidesPerView: Math.min(3, slidesPerView), spaceBetween: spaceBetween },
                        1280: { slidesPerView: slidesPerView, spaceBetween: spaceBetween }
                    }
                };

                if(data['free-mode'].value)
                {
                    config.freeMode = {
                        enabled: true,
                        sticky: false
                    };
                }

                if(data['autoplay'].value)
                {
                    config.autoplay = typeof data['autoplay'].value === 'object'
                        ? data['autoplay'].value
                        : { delay: 3000 };
                }

                if(data['navigation'].value)
                {
                    config.navigation = {
                        nextEl: node.querySelector('.swiper-button-next'),
                        prevEl: node.querySelector('.swiper-button-prev'),
                    };
                }

                if(data['pagination'].value)
                {
                    config.pagination = {
                        el: node.querySelector('.swiper-pagination'),
                        clickable: true,
                    };
                }

                return config;
            };

            this.setup();
            this.navigation();
            this.pagination();

            setTimeout(() =>
            {
                new Swiper(node, this.config());
            }, 0);
        }
    });
});
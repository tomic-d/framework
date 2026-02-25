transforms.ItemAdd({
    id: 'typed',
    icon: 'keyboard',
    name: 'Typed',
    description: 'Typewriter text animation effect. Automatically types and deletes text with customizable speed.',
    js: [
        'https://cdn.jsdelivr.net/npm/typed.js@2.1.0/dist/typed.umd.js'
    ],
    config: {
        'strings': ['array', []],
        'type-speed': ['number', 50],
        'back-speed': ['number', 30],
        'start-delay': ['number', 0],
        'back-delay': ['number', 700],
        'loop': ['boolean', false],
        'loop-count': ['number', 0],
        'show-cursor': ['boolean', true],
        'cursor-char': ['string', '|'],
        'auto-insert-css': ['boolean', true],
        'shuffle': ['boolean', false],
        'smart-backspace': ['boolean', true],
        'fade-out': ['boolean', false],
        'fade-out-delay': ['number', 500],
        'content-type': ['string', 'html']
    },
    code: function(data, node, transformer)
    {
        const id = 'typed-' + onetype.Generate(8);

        this.setup = () =>
        {
            node.classList.add('typed');
            node.classList.add(id);

            const strings = data['strings'];
            const children = Array.from(node.children);

            const stringsArray = [];

            if(strings && strings.length > 0)
            {
                stringsArray.push(...strings);
            }
            else if(children.length > 0)
            {
                children.forEach(child =>
                {
                    stringsArray.push(child.innerHTML);
                });

                node.innerHTML = '';
            }
            else
            {
                const existingText = node.textContent || node.innerHTML;
                if(existingText.trim())
                {
                    stringsArray.push(existingText);
                    node.innerHTML = '';
                }
            }

            if(stringsArray.length === 0)
            {
                stringsArray.push('Type your text here...');
            }

            this.strings = stringsArray;

            const element = document.createElement('span');
            element.className = 'typed-element';
            node.appendChild(element);
        };

        this.styles = () =>
        {
            if(!data['auto-insert-css'])
            {
                return;
            }

            const style = document.createElement('style');

            style.textContent = `
                .typed-${id} {
                    display: inline-block;
                }
                .typed-${id} .typed-cursor {
                    opacity: 1;
                    animation: typedjsBlink 0.7s infinite;
                    -webkit-animation: typedjsBlink 0.7s infinite;
                    animation: typedjsBlink 0.7s infinite;
                }
                @keyframes typedjsBlink {
                    50% { opacity: 0.0; }
                }
                @-webkit-keyframes typedjsBlink {
                    0% { opacity: 1; }
                    50% { opacity: 0.0; }
                    100% { opacity: 1; }
                }
                .typed-${id} .typed-fade-out {
                    opacity: 0;
                    transition: opacity 0.25s;
                }
            `;

            document.head.appendChild(style);
        };

        this.config = () =>
        {
            const config = {
                strings: this.strings,
                typeSpeed: data['type-speed'],
                backSpeed: data['back-speed'],
                startDelay: data['start-delay'],
                backDelay: data['back-delay'],
                loop: data['loop'],
                showCursor: data['show-cursor'],
                cursorChar: data['cursor-char'],
                autoInsertCss: false,
                shuffle: data['shuffle'],
                smartBackspace: data['smart-backspace'],
                contentType: data['content-type']
            };

            if(data['loop-count'] > 0)
            {
                config.loopCount = data['loop-count'];
            }

            if(data['fade-out'])
            {
                config.fadeOut = true;
                config.fadeOutClass = 'typed-fade-out';
                config.fadeOutDelay = data['fade-out-delay'];
            }

            return config;
        };

        this.initialize = () =>
        {
            setTimeout(() =>
            {
                const element = node.querySelector('.typed-element');

                if(!element)
                {
                    return;
                }

                const typedInstance = new Typed(element, this.config());

                node._typedInstance = typedInstance;

                node._typedControl = {
                    start: () => typedInstance.start(),
                    stop: () => typedInstance.stop(),
                    toggle: () => typedInstance.toggle(),
                    destroy: () => typedInstance.destroy(),
                    reset: () => typedInstance.reset()
                };
            }, 0);
        };

        this.setup();
        this.styles();
        this.initialize();
    }
});

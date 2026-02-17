divhunt.AddonReady('transforms', (transforms) =>
{
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
        code: function(data, item, compile, node, identifier)
        {
            this.setup = () =>
            {
                node.classList.add('typed');
                node.classList.add('typed-' + identifier);

                const strings = data['strings'].value;
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
                if(!data['auto-insert-css'].value)
                {
                    return;
                }

                const style = document.createElement('style');

                style.textContent = `
                    .typed-${identifier} {
                        display: inline-block;
                    }
                    .typed-${identifier} .typed-cursor {
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
                    .typed-${identifier} .typed-fade-out {
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
                    typeSpeed: data['type-speed'].value,
                    backSpeed: data['back-speed'].value,
                    startDelay: data['start-delay'].value,
                    backDelay: data['back-delay'].value,
                    loop: data['loop'].value,
                    showCursor: data['show-cursor'].value,
                    cursorChar: data['cursor-char'].value,
                    autoInsertCss: false,
                    shuffle: data['shuffle'].value,
                    smartBackspace: data['smart-backspace'].value,
                    contentType: data['content-type'].value
                };

                if(data['loop-count'].value > 0)
                {
                    config.loopCount = data['loop-count'].value;
                }

                if(data['fade-out'].value)
                {
                    config.fadeOut = true;
                    config.fadeOutClass = 'typed-fade-out';
                    config.fadeOutDelay = data['fade-out-delay'].value;
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
});
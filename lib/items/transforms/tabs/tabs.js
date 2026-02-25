transforms.ItemAdd({
    id: 'tabs',
    icon: 'tab',
    name: 'Tabs',
    description: 'Tabbed interface component for organizing content. Switch between multiple panels with navigation controls.',
    config: {
        'position': ['string', 'top'],
        'alignment': ['string', 'left'],
        'active-tab': ['number', 0],
        'animation': ['string', 'fade'],
        'animation-duration': ['number', 300],
        'autoplay': ['boolean', true],
        'autoplay-interval': ['number', 5000],
        'autoplay-pause-on-hover': ['boolean', true],
        'show-indicators': ['boolean', false],
        'vertical': ['boolean', true],
        'closeable': ['boolean', true],
        'scrollable': ['boolean', true]
    },
    code: function(data, node, transformer)
    {
        const id = 'tabs-' + onetype.Generate(8);

        this.setup = () =>
        {
            node.classList.add('tabs');
            node.classList.add(id);
            node.classList.add('tabs-position-' + data['position']);

            const children = Array.from(node.children);
            const navigation = document.createElement('div');
            const content = document.createElement('div');

            navigation.className = 'tabs-navigation';
            content.className = 'tabs-content';

            if(data['vertical'])
            {
                node.classList.add('tabs-vertical');
            }

            if(data['alignment'])
            {
                navigation.classList.add('tabs-align-' + data['alignment']);
            }

            children.forEach((child, index) =>
            {
                const title = child.getAttribute('title') || child.getAttribute('data-title') || `Tab ${index + 1}`;
                const tabButton = document.createElement('button');
                const tabPane = document.createElement('div');

                tabButton.className = 'tab-button';
                tabButton.textContent = title;
                tabButton.setAttribute('data-tab-index', index);

                tabPane.className = 'tab-pane';
                tabPane.setAttribute('data-tab-index', index);

                while(child.firstChild)
                {
                    tabPane.appendChild(child.firstChild);
                }

                navigation.appendChild(tabButton);
                content.appendChild(tabPane);
            });

            node.innerHTML = '';

            if(data['position'] === 'bottom')
            {
                node.appendChild(content);
                node.appendChild(navigation);
            }
            else
            {
                node.appendChild(navigation);
                node.appendChild(content);
            }
        };

        this.closeable = () =>
        {
            if(!data['closeable'])
            {
                return;
            }

            const buttons = node.querySelectorAll('.tab-button');

            buttons.forEach(button =>
            {
                const closeButton = document.createElement('span');
                closeButton.className = 'tab-close';
                closeButton.innerHTML = '×';

                closeButton.addEventListener('click', (event) =>
                {
                    event.stopPropagation();
                    const index = parseInt(button.getAttribute('data-tab-index'));
                    this.removeTab(index);
                });

                button.appendChild(closeButton);
            });
        };

        this.indicators = () =>
        {
            if(!data['show-indicators'])
            {
                return;
            }

            const indicators = document.createElement('div');
            indicators.className = 'tabs-indicators';

            const buttons = node.querySelectorAll('.tab-button');

            buttons.forEach((button, index) =>
            {
                const indicator = document.createElement('span');
                indicator.className = 'tab-indicator';
                indicator.setAttribute('data-tab-index', index);

                indicator.addEventListener('click', () =>
                {
                    this.switchTab(index);
                });

                indicators.appendChild(indicator);
            });

            node.appendChild(indicators);
        };

        this.styles = () =>
        {
            const duration = data['animation-duration'];
            const animation = data['animation'];
            const style = document.createElement('style');

            let animationStyles = '';

            if(animation === 'fade')
            {
                animationStyles = `
                    .tabs-${id} .tab-pane {
                        opacity: 0;
                        transition: opacity ${duration}ms ease-in-out;
                    }
                    .tabs-${id} .tab-pane.active {
                        opacity: 1;
                    }
                `;
            }
            else if(animation === 'slide')
            {
                animationStyles = `
                    .tabs-${id} .tab-pane {
                        transform: translateX(20px);
                        opacity: 0;
                        transition: transform ${duration}ms ease, opacity ${duration}ms ease;
                    }
                    .tabs-${id} .tab-pane.active {
                        transform: translateX(0);
                        opacity: 1;
                    }
                `;
            }
            else
            {
                animationStyles = `
                    .tabs-${id} .tab-pane {
                        display: none;
                    }
                    .tabs-${id} .tab-pane.active {
                        display: block;
                    }
                `;
            }

            style.textContent = `
                .tabs-${id} {
                    display: flex;
                    flex-direction: column;
                }
                .tabs-${id}.tabs-vertical {
                    flex-direction: row;
                }
                .tabs-${id} .tabs-navigation {
                    display: flex;
                    gap: 8px;
                    position: relative;
                }
                .tabs-${id}.tabs-vertical .tabs-navigation {
                    flex-direction: column;
                    min-width: 200px;
                }
                .tabs-${id} .tabs-navigation.tabs-align-center {
                    justify-content: center;
                }
                .tabs-${id} .tabs-navigation.tabs-align-right {
                    justify-content: flex-end;
                }
                .tabs-${id} .tab-button {
                    padding: 10px 20px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    transition: all ${duration}ms ease;
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .tabs-${id} .tab-button.active {
                    background: rgba(0, 0, 0, 0.1);
                }
                .tabs-${id} .tab-button:hover {
                    background: rgba(0, 0, 0, 0.05);
                }
                .tabs-${id} .tab-close {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    border-radius: 50%;
                    transition: all ${duration}ms ease;
                }
                .tabs-${id} .tab-close:hover {
                    background: rgba(255, 0, 0, 0.1);
                    color: red;
                }
                .tabs-${id} .tabs-content {
                    position: relative;
                    flex: 1;
                }
                ${animationStyles}
                .tabs-${id} .tabs-content .tab-pane {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                .tabs-${id} .tabs-indicators {
                    display: flex;
                    gap: 6px;
                    justify-content: center;
                    padding: 10px;
                }
                .tabs-${id} .tab-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: rgba(0, 0, 0, 0.3);
                    cursor: pointer;
                    transition: all ${duration}ms ease;
                }
                .tabs-${id} .tab-indicator.active {
                    background: rgba(0, 0, 0, 0.8);
                    transform: scale(1.2);
                }
                .tabs-${id}.tabs-position-bottom {
                    flex-direction: column-reverse;
                }
                .tabs-${id}.tabs-vertical.tabs-position-right {
                    flex-direction: row-reverse;
                }
            `;

            if(data['scrollable'])
            {
                style.textContent += `
                    .tabs-${id} .tabs-navigation {
                        overflow-x: auto;
                        scrollbar-width: thin;
                    }
                    .tabs-${id}.tabs-vertical .tabs-navigation {
                        overflow-x: visible;
                        overflow-y: auto;
                    }
                `;
            }

            document.head.appendChild(style);
        };

        this.switchTab = (index) =>
        {
            const buttons = node.querySelectorAll('.tab-button');
            const panes = node.querySelectorAll('.tab-pane');
            const indicators = node.querySelectorAll('.tab-indicator');

            buttons.forEach((button, buttonIndex) =>
            {
                if(buttonIndex === index)
                {
                    button.classList.add('active');
                }
                else
                {
                    button.classList.remove('active');
                }
            });

            panes.forEach((pane, paneIndex) =>
            {
                if(paneIndex === index)
                {
                    pane.classList.add('active');
                }
                else
                {
                    pane.classList.remove('active');
                }
            });

            indicators.forEach((indicator, indicatorIndex) =>
            {
                if(indicatorIndex === index)
                {
                    indicator.classList.add('active');
                }
                else
                {
                    indicator.classList.remove('active');
                }
            });

            this.currentTab = index;
        };

        this.removeTab = (index) =>
        {
            const buttons = node.querySelectorAll('.tab-button');
            const panes = node.querySelectorAll('.tab-pane');
            const indicators = node.querySelectorAll('.tab-indicator');

            if(buttons.length <= 1)
            {
                return;
            }

            buttons[index].remove();
            panes[index].remove();

            if(indicators.length)
            {
                indicators[index].remove();
            }

            const remainingButtons = node.querySelectorAll('.tab-button');
            const remainingPanes = node.querySelectorAll('.tab-pane');
            const remainingIndicators = node.querySelectorAll('.tab-indicator');

            remainingButtons.forEach((button, newIndex) =>
            {
                button.setAttribute('data-tab-index', newIndex);
            });

            remainingPanes.forEach((pane, newIndex) =>
            {
                pane.setAttribute('data-tab-index', newIndex);
            });

            remainingIndicators.forEach((indicator, newIndex) =>
            {
                indicator.setAttribute('data-tab-index', newIndex);
            });

            if(this.currentTab === index)
            {
                this.switchTab(Math.max(0, index - 1));
            }
            else if(this.currentTab > index)
            {
                this.currentTab--;
            }
        };

        this.autoplay = () =>
        {
            if(!data['autoplay'])
            {
                return;
            }

            const interval = data['autoplay-interval'];
            const pauseOnHover = data['autoplay-pause-on-hover'];

            let autoplayTimer = null;

            const startAutoplay = () =>
            {
                autoplayTimer = setInterval(() =>
                {
                    const buttons = node.querySelectorAll('.tab-button');
                    const nextIndex = (this.currentTab + 1) % buttons.length;
                    this.switchTab(nextIndex);
                }, interval);
            };

            const stopAutoplay = () =>
            {
                if(autoplayTimer)
                {
                    clearInterval(autoplayTimer);
                    autoplayTimer = null;
                }
            };

            if(pauseOnHover)
            {
                node.addEventListener('mouseenter', stopAutoplay);
                node.addEventListener('mouseleave', startAutoplay);
            }

            startAutoplay();

            node._tabsAutoplay = {
                start: startAutoplay,
                stop: stopAutoplay
            };
        };

        this.events = () =>
        {
            const buttons = node.querySelectorAll('.tab-button');

            buttons.forEach(button =>
            {
                button.addEventListener('click', () =>
                {
                    const index = parseInt(button.getAttribute('data-tab-index'));
                    this.switchTab(index);
                });
            });
        };

        this.initialize = () =>
        {
            const activeIndex = Math.max(0, Math.min(data['active-tab'], node.querySelectorAll('.tab-button').length - 1));
            this.currentTab = activeIndex;
            this.switchTab(activeIndex);
        };

        this.setup();
        this.closeable();
        this.indicators();
        this.styles();
        this.events();
        this.initialize();
        this.autoplay();
    }
});

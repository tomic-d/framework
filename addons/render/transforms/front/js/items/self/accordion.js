divhunt.AddonReady('transforms', (transforms) =>
{
    transforms.ItemAdd({
        id: 'accordion',
        icon: 'expand_more',
        name: 'Accordion',
        description: 'Collapsible accordion component with multiple items. Supports single or multiple open panels with smooth animations.',
        config: {
            'multiple': ['boolean', false],
            'first-open': ['boolean', true],
            'animation-duration': ['number', 300],
            'icon': ['boolean', true],
            'icon-position': ['string', 'right']
        },
        code: function(data, item, compile, node, identifier)
        {
            this.setup = () =>
            {
                node.classList.add('accordion');
                node.classList.add('accordion-' + identifier);

                const children = Array.from(node.children);
                const items = [];

                for(let i = 0; i < children.length; i += 2)
                {
                    const header = children[i];
                    const content = children[i + 1];

                    if(!header || !content)
                    {
                        continue;
                    }

                    const wrapper = document.createElement('div');
                    const headerWrapper = document.createElement('div');
                    const contentWrapper = document.createElement('div');

                    wrapper.className = 'accordion-item';
                    headerWrapper.className = 'accordion-header';
                    contentWrapper.className = 'accordion-content';

                    headerWrapper.appendChild(header);
                    contentWrapper.appendChild(content);

                    wrapper.appendChild(headerWrapper);
                    wrapper.appendChild(contentWrapper);

                    items.push(wrapper);
                }

                node.innerHTML = '';
                items.forEach(item => node.appendChild(item));
            };

            this.icons = () =>
            {
                if(!data['icon'].value)
                {
                    return;
                }

                const headers = node.querySelectorAll('.accordion-header');

                headers.forEach(header =>
                {
                    const icon = document.createElement('span');
                    icon.className = 'accordion-icon';
                    icon.innerHTML = '▼';

                    if(data['icon-position'].value === 'left')
                    {
                        header.insertBefore(icon, header.firstChild);
                    }
                    else
                    {
                        header.appendChild(icon);
                    }
                });
            };

            this.styles = () =>
            {
                const duration = data['animation-duration'].value;
                const style = document.createElement('style');

                style.textContent = `
                    .accordion-${identifier} .accordion-content {
                        max-height: 0;
                        overflow: hidden;
                        transition: max-height ${duration}ms ease-in-out;
                    }
                    .accordion-${identifier} .accordion-item.active .accordion-content {
                        max-height: 2000px;
                    }
                    .accordion-${identifier} .accordion-header {
                        cursor: pointer;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .accordion-${identifier} .accordion-icon {
                        transition: transform ${duration}ms ease;
                        display: inline-block;
                    }
                    .accordion-${identifier} .accordion-item.active .accordion-icon {
                        transform: rotate(180deg);
                    }
                `;

                document.head.appendChild(style);
            };

            this.toggle = (item) =>
            {
                const isActive = item.classList.contains('active');
                const content = item.querySelector('.accordion-content');

                if(!data['multiple'].value)
                {
                    const items = node.querySelectorAll('.accordion-item');
                    items.forEach(otherItem =>
                    {
                        if(otherItem !== item)
                        {
                            otherItem.classList.remove('active');
                        }
                    });
                }

                if(isActive)
                {
                    item.classList.remove('active');
                }
                else
                {
                    item.classList.add('active');
                }
            };

            this.events = () =>
            {
                const headers = node.querySelectorAll('.accordion-header');

                headers.forEach(header =>
                {
                    header.addEventListener('click', () =>
                    {
                        const item = header.parentElement;
                        this.toggle(item);
                    });
                });
            };

            this.initialize = () =>
            {
                if(data['first-open'].value)
                {
                    const firstItem = node.querySelector('.accordion-item');
                    if(firstItem)
                    {
                        firstItem.classList.add('active');
                    }
                }
            };

            this.setup();
            this.icons();
            this.styles();
            this.events();
            this.initialize();
        }
    });
});
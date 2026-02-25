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
    code: function(data, node, transformer)
    {
        const id = 'accordion-' + onetype.Generate(8);

        this.setup = () =>
        {
            node.classList.add('accordion');
            node.classList.add(id);

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
            if(!data['icon'])
            {
                return;
            }

            const headers = node.querySelectorAll('.accordion-header');

            headers.forEach(header =>
            {
                const icon = document.createElement('span');
                icon.className = 'accordion-icon';
                icon.innerHTML = '▼';

                if(data['icon-position'] === 'left')
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
            const duration = data['animation-duration'];
            const style = document.createElement('style');

            style.textContent = `
                .${id} .accordion-content {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height ${duration}ms ease-in-out;
                }
                .${id} .accordion-item.active .accordion-content {
                    max-height: 2000px;
                }
                .${id} .accordion-header {
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .${id} .accordion-icon {
                    transition: transform ${duration}ms ease;
                    display: inline-block;
                }
                .${id} .accordion-item.active .accordion-icon {
                    transform: rotate(180deg);
                }
            `;

            document.head.appendChild(style);
        };

        this.toggle = (item) =>
        {
            const isActive = item.classList.contains('active');

            if(!data['multiple'])
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
            if(data['first-open'])
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

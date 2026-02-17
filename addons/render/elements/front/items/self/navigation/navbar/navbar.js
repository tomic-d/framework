import elements from '#elements/load.js';

elements.ItemAdd({
    id: 'navbar',
    icon: 'menu',
    name: 'Navbar',
    description: 'Navigation bar component with logo, menu items, and action button. Fully responsive with mobile menu support.',
    category: 'Navigation',
    author: 'Divhunt',
    config: {
        variant: {
            type: 'array',
            value: ['bg-2', 'border-bottom'],
            options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border-bottom']
        },
        container: {
            type: 'string',
            value: 'full',
            options: ['none', 's', 'm', 'l', 'full']
        },
        size: {
            type: 'string',
            value: 'm',
            options: ['s', 'm', 'l']
        },
        onMenuClick: {
            type: 'function'
        }
    },
    render: function()
    {
        this.leftMenus = navbar.Fn('get', 'left');
        this.middleMenus = navbar.Fn('get', 'middle');
        this.rightMenus = navbar.Fn('get', 'right');

        const update = () =>
        {
            this.leftMenus = navbar.Fn('get', 'left');
            this.middleMenus = navbar.Fn('get', 'middle');
            this.rightMenus = navbar.Fn('get', 'right');
        };

        navbar.ItemOn('added', update, 'navbar');
        navbar.ItemOn('removed', update, 'navbar');
        navbar.ItemOn('modified', update, 'navbar');

        this.handleMenuClick = (item) =>
        {
            navbar.Fn('active', item.id);

            if (this.onMenuClick)
            {
                this.onMenuClick({ item });
            }
        };

        this.containerClass = () =>
        {
            if (this.container === 'none')
            {
                return '';
            }

            return `dh-container-${this.container}`;
        };

        return `
            <nav class="holder" :variant="variant.join(' ')" :size="size">
                <div :class="containerClass()">
                    <div class="left">
                        <slot name="left:start"></slot>
                        <div class="menu" dh-if="leftMenus.length > 0">
                            <e-menu dh-for="menu in leftMenus"
                                :icon="menu.icon"
                                :label="menu.label"
                                :href="menu.href"
                                :active="menu.active"
                                :variant="menu.variant"
                                :onClick="() => handleMenuClick(menu)">
                            </e-menu>
                        </div>
                        <slot name="left:end"></slot>
                    </div>

                    <div class="middle">
                        <slot name="middle:start"></slot>
                        <div class="menu" dh-if="middleMenus.length > 0">
                            <e-menu dh-for="menu in middleMenus"
                                :icon="menu.icon"
                                :label="menu.label"
                                :href="menu.href"
                                :active="menu.active"
                                :variant="menu.variant"
                                :onClick="() => handleMenuClick(menu)">
                            </e-menu>
                        </div>
                        <slot name="middle:end"></slot>
                    </div>

                    <div class="right">
                        <slot name="right:start"></slot>
                        <div class="menu" dh-if="rightMenus.length > 0">
                            <e-menu dh-for="menu in rightMenus"
                                :icon="menu.icon"
                                :label="menu.label"
                                :href="menu.href"
                                :active="menu.active"
                                :variant="menu.variant"
                                :onClick="() => handleMenuClick(menu)">
                            </e-menu>
                        </div>
                        <slot name="right:end"></slot>
                    </div>
                </div>
            </nav>
        `;
    }
});

import elements from '#elements/load.js';

elements.ItemAdd({
    id: 'sidebar',
    icon: 'menu',
    name: 'Sidebar',
    description: 'Collapsible sidebar navigation with header, grouped menu items, nested menus, and footer. Supports expanded and collapsed states.',
    category: 'Navigation',
    author: 'Divhunt',
    config: {
        variant: {
            type: 'array',
            value: ['bg-2', 'size-full'],
            options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border-full', 'border-left', 'border-right', 'radius-s', 'radius-m', 'radius-l', 'size-s', 'size-m', 'size-l', 'size-full']
        },
        groups: {
            type: 'array',
            value: []
        },
        collapsed: {
            type: 'boolean',
            value: false
        },
        onMenuClick: {
            type: 'function'
        }
    },
    render: function()
    {
        const filterGroups = (allGroups) =>
        {
            if (!this.groups || this.groups.length === 0)
            {
                return allGroups;
            }

            return allGroups.filter(group => this.groups.includes(group.id));
        };

        this.filteredGroups = filterGroups(sidebar.Fn('groups'));

        const update = () =>
        {
            this.filteredGroups = filterGroups(sidebar.Fn('groups'));
        };

        sidebar.ItemOn('added', update, 'sidebar');
        sidebar.ItemOn('removed', update, 'sidebar');
        sidebar.ItemOn('modified', update, 'sidebar');

        this.handleMenuClick = (item) =>
        {
            sidebar.Fn('active', item.id);

            if (this.onMenuClick)
            {
                this.onMenuClick({ item });
            }
        };

        return `
            <div class="holder" :variant="variant.join(' ')" :collapsed="collapsed">
                <slot name="top"></slot>

                <nav class="content">
                    <slot name="content"></slot>

                    <div dh-for="group in filteredGroups" class="group">
                        <label dh-if="group.label">{{ group.label }}</label>
                        <div class="items">
                            <a dh-for="item in group.items" :href="item.href" class="item" :active="item.active" dh-click="handleMenuClick(item)">
                                <i>{{ item.icon }}</i>
                                <span>{{ item.label }}</span>
                            </a>
                        </div>
                    </div>
                </nav>

                <footer>
                    <slot name="bottom"></slot>
                </footer>
            </div>
        `;
    }
});

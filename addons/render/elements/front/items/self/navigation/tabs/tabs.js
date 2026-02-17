import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'tabs',
	icon: 'tab',
	name: 'Tabs',
	description: 'Tab navigation component with support for icons, badges, and active state management.',
	category: 'Navigation',
	author: 'Divhunt',
	config: {
		variant: {
			type: 'array',
			value: ['border-bottom'],
			options: ['horizontal', 'vertical', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'border-bottom', 'border-full', 'radius-s', 'radius-m', 'radius-l']
		},
		size: {
			type: 'string',
			value: 'm',
			options: ['s', 'm', 'l']
		},
		onClick: {
			type: 'function'
		}
	},
	render: function()
	{
		this.items = tabs.Fn('get');

		const update = () =>
		{
			this.items = tabs.Fn('get');
		};

		tabs.ItemOn('added', update, 'tabs');
		tabs.ItemOn('removed', update, 'tabs');
		tabs.ItemOn('modified', update, 'tabs');

		this.handleTabClick = (item) =>
		{
			if(item.disabled)
			{
				return;
			}

			this.items.forEach(tab =>
			{
				tabs.Item(tab.id).Set('active', tab.id === item.id);
			});

			if(this.onClick)
			{
				this.onClick(tabs.Item(item.id));
			}
		};

		return `
			<div class="holder" :variant="variant.join(' ')" :size="size">
				<slot name="start"></slot>
				<div class="items" dh-if="items.length > 0">
					<div dh-for="item in items">
						<div
							class="item"
							:active="item.active ? 'true' : 'false'"
							:disabled="item.disabled ? 'true' : 'false'"
							dh-click="() => handleTabClick(item)">
							<i dh-if="item.icon" class="icon">{{ item.icon }}</i>
							<span dh-if="item.label" class="label">{{ item.label }}</span>
							<span dh-if="item.badge" class="badge">{{ item.badge }}</span>
						</div>
					</div>
				</div>
				<slot name="end"></slot>
			</div>
		`;
	}
});

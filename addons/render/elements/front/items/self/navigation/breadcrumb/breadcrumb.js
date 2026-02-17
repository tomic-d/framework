import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'breadcrumb',
	icon: 'arrow_forward',
	name: 'Breadcrumb',
	description: 'Breadcrumb navigation component for displaying current page hierarchy.',
	category: 'Navigation',
	author: 'Divhunt',
	config: {
		variant: {
			type: 'array',
			value: [],
			options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border']
		},
		size: {
			type: 'string',
			value: 'm',
			options: ['s', 'm', 'l']
		}
	},
	render: function()
	{
		this.items = breadcrumb.Fn('get');

		const update = () =>
		{
			this.items = breadcrumb.Fn('get');
		};

		breadcrumb.ItemOn('added', update, 'breadcrumb');
		breadcrumb.ItemOn('removed', update, 'breadcrumb');
		breadcrumb.ItemOn('modified', update, 'breadcrumb');

		return `
			<div class="holder" :variant="variant.join(' ')" :size="size">
				<slot name="start"></slot>
				<div class="items" dh-if="items.length > 0">
					<e-menu dh-for="item in items"
						:icon="item.icon"
						:label="item.label"
						:href="item.href"
						:active="item.active"
						:variant="item.variant">
					</e-menu>
				</div>
				<slot name="end"></slot>
			</div>
		`;
	}
});

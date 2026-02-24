import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'tabs',
	icon: 'tab',
	name: 'Tabs',
	description: 'Pill-style tab switcher with optional icons.',
	category: 'Global',
	author: 'OneType',
	config: {
		active: {
			type: 'string',
			value: ''
		},
		items: {
			type: 'array',
			value: []
		}
	},
	render: function()
	{
		return `
			<div class="holder">
				<a ot-for="item in items" :class="'tab' + (active === item.id ? ' active' : '')" :href="item.href">
					<i ot-if="item.icon">{{ item.icon }}</i>
					<span>{{ item.label }}</span>
				</a>
			</div>
		`;
	}
});

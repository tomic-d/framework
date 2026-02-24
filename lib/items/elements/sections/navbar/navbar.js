import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'navbar',
	icon: 'menu',
	name: 'Navbar',
	description: 'Top navigation bar with logo and links.',
	category: 'Section',
	author: 'OneType',
	config: {
		items: {
			type: 'array',
			value: [
				{ icon: 'widgets', label: 'Transforms', href: '/transforms', position: 'left' },
				{ icon: 'payments', label: 'Pricing', href: '/pricing', position: 'left' },
				{ icon: 'menu_book', label: 'Docs', href: 'https://docs.onetype.ai/transforms', position: 'left' },
				{ icon: 'code', label: 'GitHub', href: 'https://github.com/nicely-gg/transforms', position: 'right' },
				{ icon: 'arrow_forward', label: 'Get Started', href: '/get-started', position: 'right' }
			]
		}
	},
	render: function()
	{
		this.left = this.items.filter(i => i.position === 'left');
		this.right = this.items.filter(i => i.position === 'right');

		return `
			<nav class="holder">
				<a class="logo" href="/">
					<img class="logo-icon" src="https://global.divhunt.com/bd8ffd2fc9cf3a7e81b3326ac63a7cfe_4406.svg" alt="OneType" />
				</a>
				<div class="tabs">
					<a ot-for="item in left" class="tab" :href="item.href"><i>{{ item.icon }}</i> {{ item.label }}</a>
				</div>
				<div class="right">
					<a ot-for="item in right" class="tab" :href="item.href"><i>{{ item.icon }}</i> {{ item.label }}</a>
				</div>
			</nav>
		`;
	}
});

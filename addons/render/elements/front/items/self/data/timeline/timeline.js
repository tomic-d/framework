import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'timeline',
	icon: 'timeline',
	name: 'Timeline',
	description: 'Vertical timeline for displaying events, history, or progress.',
	category: 'Data',
	author: 'Divhunt',
	config: {
		items: {
			type: 'array',
			value: [
				{
					icon: 'check_circle',
					title: 'Project Started',
					description: 'Initial project setup and planning completed',
					date: 'Jan 15, 2024'
				},
				{
					icon: 'code',
					title: 'Development Phase',
					description: 'Core features implemented and tested',
					date: 'Feb 20, 2024'
				},
				{
					icon: 'rocket_launch',
					title: 'Launch',
					description: 'Product successfully launched to production',
					date: 'Mar 10, 2024'
				}
			]
		},
		variant: {
			type: 'array',
			value: ['brand'],
			options: ['brand', 'blue', 'red', 'orange', 'green', 'alternate']
		}
	},
	render: function()
	{
		return `
			<div class="holder" :variant="variant.join(' ')">
				<div dh-for="item in items" class="item">
					<div class="marker">
						<i class="icon">{{ item.icon }}</i>
					</div>
					<div class="content">
						<h4 class="title">{{ item.title }}</h4>
						<p dh-if="item.description" class="description">{{ item.description }}</p>
						<span dh-if="item.date" class="date">{{ item.date }}</span>
					</div>
				</div>
			</div>
		`;
	}
});

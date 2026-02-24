import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'heading',
	icon: 'title',
	name: 'Heading',
	description: 'Page heading with title and description.',
	category: 'Global',
	author: 'OneType',
	config: {
		icon: {
			type: 'string',
			value: ''
		},
		title: {
			type: 'string',
			value: 'Title'
		},
		description: {
			type: 'string',
			value: ''
		},
		align: {
			type: 'string',
			value: 'left',
			options: ['left', 'center', 'right']
		},
		size: {
			type: 'string',
			value: '',
			options: ['s', 'm', 'l']
		},
		variant: {
			type: 'string',
			value: ''
		}
	},
	render: function()
	{
		this.classes = 'holder ' + this.align + (this.variant ? ' ' + this.variant : '') + (this.size ? ' size-' + this.size : '');

		return `
			<div :class="classes">
				<i ot-if="icon" class="icon">{{ icon }}</i>
				<h2 ot-if="variant !== 'page'" class="title">{{ title }}</h2>
				<h1 ot-if="variant === 'page'" class="title">{{ title }}</h1>
				<p ot-if="description" class="description">{{ description }}</p>
			</div>
		`;
	}
});

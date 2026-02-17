import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'rating',
	icon: 'star',
	name: 'Rating',
	description: 'Star rating input with interactive and readonly modes.',
	category: 'Form',
	author: 'Divhunt',
	config: {
		value: {
			type: 'number',
			value: 3
		},
		max: {
			type: 'number',
			value: 5
		},
		readonly: {
			type: 'boolean',
			value: false
		},
		variant: {
			type: 'array',
			value: ['brand', 'size-m'],
			options: ['brand', 'blue', 'red', 'orange', 'green', 'size-s', 'size-m', 'size-l']
		},
		onChange: {
			type: 'function'
		}
	},
	render: function()
	{
		this.hover = null;

		this.getStars = () =>
		{
			const stars = [];
			for (let i = 0; i < this.max; i++)
			{
				stars.push(i);
			}
			return stars;
		};

		this.isFilled = (index) =>
		{
			return this.hover !== null ? index <= this.hover : index < this.value;
		};

		this.handleClick = (index) =>
		{
			if (this.readonly) return;
			this.value = index + 1;
			if (this.onChange)
			{
				this.onChange(this.value);
			}
		};

		this.handleMouseEnter = (index) =>
		{
			if (this.readonly) return;
			this.hover = index;
		};

		this.handleMouseLeave = () =>
		{
			if (this.readonly) return;
			this.hover = null;
		};

		return `
			<div
				class="holder"
				:variant="variant.join(' ') + (readonly ? ' readonly' : '')"
				dh-mouse-leave="handleMouseLeave"
			>
				<i
					dh-for="index in getStars()"
					:class="'star' + (isFilled(index) ? ' filled' : '')"
					dh-click="() => handleClick(index)"
					dh-mouse-enter="() => handleMouseEnter(index)"
				>star</i>
			</div>
		`;
	}
});

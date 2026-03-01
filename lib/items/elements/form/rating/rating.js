onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-rating',
		icon: 'star',
		name: 'Rating',
		description: 'Star rating with interactive and readonly modes.',
		category: 'Form',
		author: 'OneType',
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
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
			this.hover = null;

			this.stars = () =>
			{
				const result = [];
				for (let i = 0; i < this.max; i++)
				{
					result.push(i);
				}
				return result;
			};

			this.filled = (index) =>
			{
				return this.hover !== null ? index <= this.hover : index < this.value;
			};

			this.select = (index) =>
			{
				if (this.readonly) return;
				this.value = index + 1;
				if (this._change)
				{
					this._change(this.value);
				}
			};

			this.enter = (index) =>
			{
				if (this.readonly) return;
				this.hover = index;
			};

			this.leave = () =>
			{
				if (this.readonly) return;
				this.hover = null;
			};

			return `
				<div :class="'holder ' + variant.join(' ') + (readonly ? ' readonly' : '')" ot-mouse-leave="leave">
					<i
						ot-for="index in stars()"
						:class="'star' + (filled(index) ? ' filled' : '')"
						ot-click="() => select(index)"
						ot-mouse-enter="() => enter(index)"
					>star</i>
				</div>
			`;
		}
	});
});

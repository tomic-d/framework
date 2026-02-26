onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-tags',
		icon: 'label',
		name: 'Tags',
		description: 'Filter tags with active state.',
		category: 'Global',
		author: 'OneType',
		config: {
			items: {
				type: 'array',
				value: ['All']
			},
			active: {
				type: 'string',
				value: 'All'
			},
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
			this.normalized = () =>
			{
				return this.items.map(item => typeof item === 'string' ? { label: item } : item);
			};

			this.select = (tag) =>
			{
				this.active = tag;

				if(this._change)
				{
					this._change(tag);
				}
			};

			return `
				<div class="holder">
					<button
						ot-for="tag in normalized()"
						:class="'tag' + (tag.label === active ? ' active' : '')"
						ot-click="select(tag.label)"
					><span ot-if="tag.color" :class="'dot dot-' + tag.color"></span>{{ tag.label }}</button>
				</div>
			`;
		}
	});
});

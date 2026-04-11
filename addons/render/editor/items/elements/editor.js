onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'editor',
		icon: 'edit_note',
		name: 'Block Editor',
		description: 'Block-based content editor.',
		category: 'Form',
		config: {
			value: {
				type: 'array',
				value: []
			},
			placeholder: {
				type: 'string',
				value: 'Type something...'
			},
			readonly: {
				type: 'boolean',
				value: false
			},
			variant: {
				type: 'array',
				value: [],
				options: ['compact', 'bordered']
			},
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
			const addon = onetype.AddonGet('editor');

			this.blocks = [];

			this.getValue = () =>
			{
				return this.blocks.map(block => ({
					type: block.type,
					data: Object.assign({}, block.data),
					children: block.children || []
				}));
			};

			this.OnReady(() =>
			{
				if(this.value && this.value.length)
				{
					this.value.forEach(block =>
					{
						addon.Fn('block.add', this, block.type, null, Object.assign({}, block.data));
					});
				}
				else
				{
					addon.Fn('block.add', this, 'paragraph', null, {});
				}
			});

			return /* html */ `
				<div :class="'ot-editor ' + variant.join(' ')">
					<div class="ot-editor-blocks"></div>
					<div class="ot-editor-placeholder">{{ placeholder }}</div>
				</div>
			`;
		}
	});
});

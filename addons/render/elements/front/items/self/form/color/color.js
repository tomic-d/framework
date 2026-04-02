onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-color',
		icon: 'palette',
		name: 'Color',
		description: 'Color picker with swatch preview and hex input.',
		category: 'Form',
		author: 'OneType',
		config: {
			value: {
				type: 'string',
				value: '#E27055'
			},
			name: {
				type: 'string',
				value: ''
			},
			placeholder: {
				type: 'string',
				value: 'transparent'
			},
			disabled: {
				type: 'boolean',
				value: false
			},
			variant: {
				type: 'array',
				value: ['bg-2', 'border', 'size-m'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'transparent', 'border', 'size-s', 'size-m', 'size-l']
			},
			_input: {
				type: 'function'
			},
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
			this.pick = ({ event, value }) =>
			{
				this.value = value;

				if (this._input)
				{
					this._input({ event, value });
				}
			};

			this.commit = ({ event, value }) =>
			{
				this.value = value;

				if (this._change)
				{
					this._change({ event, value });
				}
			};

			this.input = ({ event, value }) =>
			{
				let hex = value.trim();

				if (hex && hex.charAt(0) !== '#')
				{
					hex = '#' + hex;
				}

				this.value = hex;

				if (this._change)
				{
					this._change({ event, value: hex });
				}
			};

			this.open = ({ event }) =>
			{
				if (this.disabled)
				{
					return;
				}

				event.target.closest('.holder').querySelector('.native').click();
			};

			this.clear = () =>
			{
				this.value = '';

				if (this._change)
				{
					this._change({ event: null, value: '' });
				}
			};

			return `
				<div :class="'holder ' + variant.join(' ')">
					<input type="hidden" :name="name" :value="value" />
					<button class="swatch" :style="'background: ' + (value || 'transparent')" ot-click="open" :disabled="disabled">
						<input class="native" type="color" :value="value" ot-input="pick" ot-change="commit" tabindex="-1" />
					</button>
					<input
						class="input"
						type="text"
						:value="value"
						:placeholder="placeholder"
						:disabled="disabled"
						maxlength="7"
						autocomplete="off"
						spellcheck="false"
						ot-change="input"
					/>
					<button ot-if="value && !disabled" class="clear" ot-click.stop="clear">
						<i>close</i>
					</button>
				</div>
			`;
		}
	});
});

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
				value: '#000000'
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
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
			this.pick = (event, ctx) =>
			{
				const hex = ctx.value;

				this.value = hex;
				this.Update();

				if (this._change)
				{
					this._change(hex);
				}
			};

			this.input = (event, ctx) =>
			{
				let hex = ctx.value.trim();

				if (hex && hex.charAt(0) !== '#')
				{
					hex = '#' + hex;
				}

				this.value = hex;
				this.Update();

				if (this._change)
				{
					this._change(hex);
				}
			};

			this.open = (event) =>
			{
				if (this.disabled)
				{
					return;
				}

				event.target.closest('.holder').querySelector('.native').click();
			};

			return `
				<div :class="'holder ' + variant.join(' ')">
					<input type="hidden" :name="name" :value="value" />
					<button class="swatch" :style="'background: ' + value" ot-click="open" :disabled="disabled">
						<input class="native" type="color" :value="value" ot-input="pick" tabindex="-1" />
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
				</div>
			`;
		}
	});
});

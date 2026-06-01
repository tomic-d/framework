onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'variable-chip',
		icon: 'data_object',
		name: 'Variable Chip',
		description: 'Compact chip representing a dynamic expression bound to a form value.',
		category: 'Variable',
		config:
		{
			value:
			{
				type: 'string',
				value: '',
				description: 'Full expression with wrapping braces.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Chip size.'
			},
			disabled:
			{
				type: 'boolean',
				value: false,
				description: 'Disabled state.'
			},
			_edit:
			{
				type: 'function',
				description: 'Edit handler. Opens the variable builder.'
			},
			_clear:
			{
				type: 'function',
				description: 'Clear handler. Removes the expression.'
			}
		},
		render: function()
		{
			/* ===== HELPERS ===== */

			this.expression = () =>
			{
				const match = /^\{\{\s*([\s\S]*?)\s*\}\}$/.exec(String(this.value || '').trim());

				return match ? match[1] : '';
			};

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', 'size-' + this.size];

				if(this.disabled)
				{
					list.push('disabled');
				}

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.handleEdit = () =>
			{
				if(this.disabled)
				{
					return;
				}

				if(this._edit)
				{
					this._edit();
				}
			};

			this.handleClear = () =>
			{
				if(this.disabled)
				{
					return;
				}

				if(this._clear)
				{
					this._clear();
				}
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<i class="icon">data_object</i>
					<span class="text">{{ expression() }}</span>
					<button
						ot-if="!disabled"
						type="button"
						class="action edit"
						ot-click.stop="handleEdit"
						:ot-tooltip="{ text: 'Edit expression', position: { x: 'center', y: 'top' } }"
					>
						<i>edit</i>
					</button>
					<button
						ot-if="!disabled"
						type="button"
						class="action clear"
						ot-click.stop="handleClear"
						:ot-tooltip="{ text: 'Remove expression', position: { x: 'center', y: 'top' } }"
					>
						<i>close</i>
					</button>
				</div>
			`;
		}
	});
});

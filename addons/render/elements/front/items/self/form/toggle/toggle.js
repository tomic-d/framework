onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-toggle',
		icon: 'toggle_on',
		name: 'Toggle',
		description: 'On/off switch with label, description and color variants.',
		category: 'Form',
		config:
		{
			label:
			{
				type: 'string',
				value: '',
				description: 'Toggle label.'
			},
			description:
			{
				type: 'string',
				value: '',
				description: 'Helper text below label.'
			},
			name:
			{
				type: 'string',
				value: '',
				description: 'Form field name.'
			},
			value:
			{
				type: 'boolean',
				value: false,
				description: 'Checked state.'
			},
			color:
			{
				type: 'string',
				value: 'brand',
				options: ['brand', 'blue', 'red', 'orange', 'green'],
				description: 'Active track color.'
			},
			background:
			{
				type: 'string',
				value: 'bg-3',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Inactive track background.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Toggle size.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['reverse', 'border'],
				description: 'Visual modifiers.'
			},
			disabled:
			{
				type: 'boolean',
				value: false,
				description: 'Disabled state.'
			},
			_change:
			{
				type: 'function',
				description: 'Change handler. Receives { event, value }.'
			},
			variables:
			{
				type: 'object',
				value: {},
				description: 'Available variables to set the value via the variable builder modal.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.Compute(() =>
			{
				this.hasInfo = !!this.label || !!this.description;
			});

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.color, this.background, 'size-' + this.size];

				if(this.value)
				{
					list.push('active');
				}

				if(this.variant.includes('reverse'))
				{
					list.push('reverse');
				}

				if(this.variant.includes('border'))
				{
					list.push('border');
				}

				if(this.disabled)
				{
					list.push('disabled');
				}

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.toggle = ({ event }) =>
			{
				event.preventDefault();

				if(this.disabled)
				{
					return;
				}

				this.value = !this.value;

				if(this._change)
				{
					this._change({ event, value: this.value });
				}
			};

			/* ===== VARIABLES ===== */

			this.hasVariables = () =>
			{
				return this.variables && typeof this.variables === 'object' && Object.keys(this.variables).length > 0;
			};

			this.isExpression = () =>
			{
				return typeof this.value === 'string' && /^\{\{\s*[\s\S]+\s*\}\}$/.test(this.value.trim());
			};

			this.openVariableBuilder = () =>
			{
				const modalId = 'modal-var-builder-' + Date.now();
				const currentValue = typeof this.value === 'string' ? this.value : '';

				const initial = (() =>
				{
					const m = /^\{\{\s*([\s\S]*?)\s*\}\}$/.exec(String(currentValue).trim());
					return m ? m[1] : '';
				})();

				const onSave = ({ expression }) =>
				{
					const wrapped = '{{ ' + expression + ' }}';
					this.value = wrapped;

					if(this._change)
					{
						this._change({ event: null, value: wrapped });
					}

					$ot.float.close(modalId);
					this.Update();
				};

				const onCancel = () =>
				{
					$ot.float.close(modalId);
				};

				const variables = this.variables;

				$ot.float.modal(function()
				{
					this.variables = variables;
					this.initial = initial;
					this.onSave = onSave;
					this.onCancel = onCancel;

					return /* html */ `<e-variable-builder :variables="variables" :value="initial" :_save="onSave" :_cancel="onCancel"></e-variable-builder>`;
				}, { id: modalId });
			};

			this.clearExpression = () =>
			{
				this.value = false;

				if(this._change)
				{
					this._change({ event: null, value: false });
				}

				this.Update();
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div ot-if="isExpression()" class="expression">
					<e-variable-chip
						:value="value"
						:size="size"
						:disabled="disabled"
						:_edit="openVariableBuilder"
						:_clear="clearExpression"
					></e-variable-chip>
				</div>

				<label ot-if="!isExpression()" :class="classes()" ot-click="toggle">
					<input
						type="checkbox"
						:name="name"
						:checked="value"
						:disabled="disabled"
					/>
					<span class="track">
						<span class="thumb"></span>
					</span>
					<span ot-if="hasInfo" class="info">
						<span ot-if="label" class="label">{{ label }}</span>
						<span ot-if="description" class="desc">{{ description }}</span>
					</span>
					<button
						ot-if="hasVariables() && !disabled"
						type="button"
						class="variable-btn"
						ot-click.stop="openVariableBuilder"
						:ot-tooltip="{ text: 'Insert variable', position: { x: 'center', y: 'top' } }"
					>
						<i>data_object</i>
					</button>
				</label>
			`;
		}
	});
});

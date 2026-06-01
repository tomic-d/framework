onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-radio',
		icon: 'radio_button_checked',
		name: 'Radio',
		description: 'Radio button with label, description, icon, count and color variants.',
		category: 'Form',
		config:
		{
			label:
			{
				type: 'string',
				value: '',
				description: 'Primary label.'
			},
			description:
			{
				type: 'string',
				value: '',
				description: 'Secondary description below label.'
			},
			icon:
			{
				type: 'string',
				value: '',
				description: 'Icon between mark and label.'
			},
			count:
			{
				type: 'string|number',
				description: 'Count badge at the end.'
			},
			name:
			{
				type: 'string',
				value: '',
				description: 'Group name for mutual exclusion.'
			},
			option:
			{
				type: 'string',
				value: '',
				description: 'Value sent to the group.'
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
				value: '',
				options: ['', 'brand', 'blue', 'red', 'orange', 'green'],
				description: 'Checked accent color.'
			},
			background:
			{
				type: 'string',
				value: 'bg-1',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'transparent'],
				description: 'Mark background depth.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Mark size.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['border', 'reverse'],
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
			_click:
			{
				type: 'function',
				description: 'Click handler. Receives { event, value }.'
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
				this.hasIcon = !!this.icon;
				this.hasCount = this.count !== undefined && this.count !== null && this.count !== '';
			});

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.background, 'size-' + this.size];

				if(this.color)
				{
					list.push('color-' + this.color);
				}

				if(this.variant.includes('border'))
				{
					list.push('border');
				}

				if(this.variant.includes('reverse'))
				{
					list.push('reverse');
				}

				if(this.disabled)
				{
					list.push('disabled');
				}

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.handle = ({ event }) =>
			{
				if(this.disabled)
				{
					return;
				}

				this.value = event.target.checked;

				if(this._change)
				{
					this._change({ event, value: this.value });
				}
			};

			this.click = ({ event }) =>
			{
				if(this.disabled)
				{
					return;
				}

				if(this._click)
				{
					this._click({ event, value: this.value });
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

					$ot.modal.close(modalId);
					this.Update();
				};

				const onCancel = () =>
				{
					$ot.modal.close(modalId);
				};

				const variables = this.variables;

				$ot.modal(function()
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

				<label ot-if="!isExpression()" :class="classes()">
					<input
						type="radio"
						:name="name"
						:value="option"
						:checked="value"
						:disabled="disabled"
						ot-change="handle"
						ot-click="click"
					/>
					<span class="mark"></span>
					<i ot-if="hasIcon" class="icon">{{ icon }}</i>
					<span ot-if="hasInfo" class="info">
						<span ot-if="label" class="label">{{ label }}</span>
						<span ot-if="description" class="description">{{ description }}</span>
					</span>
					<span ot-if="hasCount" class="count">{{ count }}</span>
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

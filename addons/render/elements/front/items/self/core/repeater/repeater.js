onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'core-repeater',
		icon: 'repeat',
		name: 'Repeater',
		description: 'Repeatable rows with reorder, duplicate, numbered rows and empty state.',
		category: 'Core',
		config:
		{
			value:
			{
				type: 'array',
				value: [],
				each: { type: 'object' },
				description: 'Row data array.'
			},
			fields:
			{
				type: 'array',
				value: [],
				each:
				{
					type: 'object',
					config:
					{
						key:
						{
							type: 'string',
							description: 'Data key in row object.'
						},
						label:
						{
							type: 'string',
							description: 'Field label shown above input.'
						},
						description:
						{
							type: 'string',
							description: 'Helper text below label.'
						},
						element:
						{
							type: 'string',
							description: 'Element id without e- prefix.'
						},
						properties:
						{
							type: 'object',
							description: 'Props passed to element.'
						},
						default:
						{
							type: 'string',
							description: 'Default value for new rows.'
						}
					}
				},
				description: 'Field definitions.'
			},
			orientation:
			{
				type: 'string',
				value: 'horizontal',
				options: ['horizontal', 'vertical'],
				description: 'Field layout inside each row.'
			},
			add:
			{
				type: 'string',
				value: 'Add',
				description: 'Add button label.'
			},
			addPosition:
			{
				type: 'string',
				value: 'bottom',
				options: ['top', 'bottom', 'both'],
				description: 'Add button placement.'
			},
			save:
			{
				type: 'string',
				value: '',
				description: 'Save button label. Empty hides button.'
			},
			empty:
			{
				type: 'string',
				value: 'No items yet',
				description: 'Empty state text.'
			},
			emptyIcon:
			{
				type: 'string',
				value: 'inbox',
				description: 'Empty state icon.'
			},
			min:
			{
				type: 'number',
				description: 'Minimum row count.'
			},
			max:
			{
				type: 'number',
				description: 'Maximum row count.'
			},
			draggable:
			{
				type: 'boolean',
				value: true,
				description: 'Show reorder arrows.'
			},
			numbered:
			{
				type: 'boolean',
				value: false,
				description: 'Show row numbers.'
			},
			duplicable:
			{
				type: 'boolean',
				value: false,
				description: 'Show duplicate button.'
			},
			disabled:
			{
				type: 'boolean',
				value: false,
				description: 'Disable all interaction.'
			},
			background:
			{
				type: 'string',
				value: 'bg-2',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Row background depth.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Row padding size.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['border'],
				description: 'Visual modifiers.'
			},
			actions:
			{
				type: 'array',
				value: [],
				each:
				{
					type: 'object',
					config:
					{
						id:      ['string'],
						icon:    ['string'],
						tooltip: ['string'],
						danger:  ['boolean', false],
						_click:  ['function']
					}
				},
				description: 'Custom per-row actions rendered before duplicate and remove.'
			},
			_change:
			{
				type: 'function',
				description: 'Change handler. Receives { value }.'
			},
			_save:
			{
				type: 'function',
				description: 'Save handler. Receives { value }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.Compute(() =>
			{
				this.hasSave = !!this.save;
			});

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.background, this.orientation, 'size-' + this.size];

				this.variant.forEach(v => list.push(v));

				if(this.disabled)
				{
					list.push('disabled');
				}

				return list.join(' ');
			};

			/* ===== HELPERS ===== */

			this.defaults = () =>
			{
				const row = {};

				this.fields.forEach(field =>
				{
					row[field.key] = field.default !== undefined ? field.default : '';
				});

				return row;
			};

			this.canAdd = () =>
			{
				if(this.disabled)
				{
					return false;
				}

				if(this.max > 0 && this.value.length >= this.max)
				{
					return false;
				}

				return true;
			};

			this.canRemove = () =>
			{
				if(this.disabled)
				{
					return false;
				}

				if(this.min > 0 && this.value.length <= this.min)
				{
					return false;
				}

				return true;
			};

			/* ===== HANDLERS ===== */

			this.emit = () =>
			{
				if(this._change)
				{
					this._change({ value: this.value });
				}
			};

			this.append = () =>
			{
				if(!this.canAdd())
				{
					return;
				}

				this.value.push(this.defaults());
				this.Update();
				this.emit();
			};

			this.prepend = () =>
			{
				if(!this.canAdd())
				{
					return;
				}

				this.value.unshift(this.defaults());
				this.Update();
				this.emit();
			};

			this.remove = (index) =>
			{
				if(!this.canRemove())
				{
					return;
				}

				this.value.splice(index, 1);
				this.Update();
				this.emit();
			};

			this.duplicate = (index) =>
			{
				if(!this.canAdd())
				{
					return;
				}

				const copy = JSON.parse(JSON.stringify(this.value[index]));
				this.value.splice(index + 1, 0, copy);
				this.Update();
				this.emit();
			};

			this.up = (index) =>
			{
				if(index === 0 || this.disabled)
				{
					return;
				}

				const row = this.value.splice(index, 1)[0];
				this.value.splice(index - 1, 0, row);
				this.Update();
				this.emit();
			};

			this.down = (index) =>
			{
				if(index >= this.value.length - 1 || this.disabled)
				{
					return;
				}

				const row = this.value.splice(index, 1)[0];
				this.value.splice(index + 1, 0, row);
				this.Update();
				this.emit();
			};

			this.change = (index, key, data) =>
			{
				this.value[index][key] = data.value;
				this.emit();
			};

			this.submit = () =>
			{
				if(this._save)
				{
					this._save({ value: this.value });
				}
			};

			/* ===== RENDER ===== */

			const fieldTemplate = this.fields.map(field =>
			{
				const tag = 'e-' + field.element;
				const props = field.properties || {};

				let attrs = '';

				Object.keys(props).forEach(key =>
				{
					const val = props[key];

					if(typeof val === 'function')
					{
						const ref = '__fn_' + field.key + '_' + key;
						this[ref] = val;
						attrs += ` :${key}="${ref}"`;
					}
					else if(typeof val === 'string')
					{
						attrs += ` ${key}="${val}"`;
					}
					else
					{
						attrs += ` :${key}='${JSON.stringify(val)}'`;
					}
				});

				const label = field.label
					? `<div class="field-info">
						<span class="field-label">${field.label}</span>
						${field.description ? `<span class="field-description">${field.description}</span>` : ''}
					</div>`
					: '';

				return `
					<div class="field">
						${label}
						<${tag} :value="row['${field.key}']" :_change="(data) => change(row_index, '${field.key}', data)"${attrs}></${tag}>
					</div>
				`;
			}).join('');

			return /* html */ `
				<div :class="classes()">
					<div ot-if="addPosition === 'top' || addPosition === 'both'" class="footer top">
						<span ot-if="max" class="counter">{{ value.length }} / {{ max }}</span>
						<span ot-if="!max" class="counter">{{ value.length }} items</span>
						<e-form-button
							ot-if="canAdd()"
							:text="add"
							icon="add"
							:_click="prepend"
							background="bg-1"
							size="s"
						></e-form-button>
					</div>

					<div ot-if="value.length" class="rows">
						<div ot-for="row, row_index in value" class="row">
							<div ot-if="draggable && !disabled" class="reorder">
								<button
									type="button"
									class="action"
									:disabled="row_index === 0"
									ot-click="() => up(row_index)"
									:ot-tooltip="{ text: 'Move up', position: { x: 'center', y: 'top' } }"
								>
									<i>keyboard_arrow_up</i>
								</button>
								<button
									type="button"
									class="action"
									:disabled="row_index === value.length - 1"
									ot-click="() => down(row_index)"
									:ot-tooltip="{ text: 'Move down', position: { x: 'center', y: 'top' } }"
								>
									<i>keyboard_arrow_down</i>
								</button>
							</div>

							<div ot-if="numbered" class="number">{{ row_index + 1 }}</div>

							<div class="fields">
								${fieldTemplate}
							</div>

							<div ot-if="!disabled" class="actions">
								<button
									ot-for="action in actions"
									type="button"
									:class="'action' + (action.danger ? ' danger' : '')"
									ot-click="() => action._click({ row, index: row_index })"
									:ot-tooltip="action.tooltip ? { text: action.tooltip, position: { x: 'center', y: 'top' } } : null"
								>
									<i>{{ action.icon }}</i>
								</button>
								<button
									ot-if="duplicable && canAdd()"
									type="button"
									class="action"
									ot-click="() => duplicate(row_index)"
									:ot-tooltip="{ text: 'Duplicate', position: { x: 'center', y: 'top' } }"
								>
									<i>content_copy</i>
								</button>
								<button
									ot-if="canRemove()"
									type="button"
									class="action danger"
									ot-click="() => remove(row_index)"
									:ot-tooltip="{ text: 'Remove', position: { x: 'center', y: 'top' } }"
								>
									<i>close</i>
								</button>
							</div>
						</div>
					</div>

					<div ot-if="!value.length" class="empty">
						<div class="empty-icon"><i>{{ emptyIcon }}</i></div>
						<span class="empty-text">{{ empty }}</span>
						<e-form-button
							ot-if="!disabled && canAdd()"
							:text="add"
							icon="add"
							:_click="append"
							color="brand"
						></e-form-button>
					</div>

					<div ot-if="value.length && (addPosition === 'bottom' || addPosition === 'both')" class="footer bottom">
						<span ot-if="max" class="counter">{{ value.length }} / {{ max }}</span>
						<span ot-if="!max" class="counter">{{ value.length }} items</span>
						<div class="footer-actions">
							<e-form-button
								ot-if="canAdd()"
								:text="add"
								icon="add"
								:_click="append"
								background="bg-1"
								size="s"
							></e-form-button>
							<e-form-button
								ot-if="hasSave"
								:text="save"
								:_click="submit"
								color="brand"
								size="s"
							></e-form-button>
						</div>
					</div>
				</div>
			`;
		}
	});
});

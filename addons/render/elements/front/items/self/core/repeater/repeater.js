onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'core-repeater',
		icon: 'repeat',
		name: 'Repeater',
		description: 'Premium repeatable rows with drag reorder, duplicate, numbered rows, orientation modes and rich empty state.',
		category: 'Core',
		author: 'OneType',
		config: {
			value: {
				type: 'array',
				value: [],
				each: {
					type: 'object'
				}
			},
			fields: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						key: { type: 'string' },
						label: { type: 'string' },
						description: { type: 'string' },
						element: { type: 'string' },
						properties: { type: 'object' },
						default: { type: 'string' }
					}
				}
			},
			orientation: {
				type: 'string',
				value: 'horizontal',
				options: ['horizontal', 'vertical']
			},
			add: {
				type: 'string',
				value: 'Add'
			},
			addPosition: {
				type: 'string',
				value: 'bottom',
				options: ['top', 'bottom', 'both']
			},
			save: {
				type: 'string'
			},
			empty: {
				type: 'string',
				value: 'No items yet'
			},
			emptyIcon: {
				type: 'string',
				value: 'inbox'
			},
			min: {
				type: 'number'
			},
			max: {
				type: 'number'
			},
			draggable: {
				type: 'boolean',
				value: true
			},
			numbered: {
				type: 'boolean'
			},
			duplicable: {
				type: 'boolean'
			},
			disabled: {
				type: 'boolean'
			},
			variant: {
				type: 'array',
				value: ['bg-2', 'size-m'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'size-s', 'size-m', 'size-l']
			},
			_change: {
				type: 'function'
			},
			_save: {
				type: 'function'
			}
		},
		render: function()
		{
			this.defaults = () =>
			{
				const row = {};

				this.fields.forEach((field) =>
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

			this.submit = () =>
			{
				if(this._save)
				{
					this._save({ value: this.value });
				}
			};

			this.change = (index, key, data) =>
			{
				this.value[index][key] = data.value;
				this.emit();
			};

			// Build field columns — each field is an element with two-way binding

			const fieldTemplate = this.fields.map((field) =>
			{
				const tag = 'e-' + field.element;
				const props = field.properties || {};

				let attrs = '';

				Object.keys(props).forEach((key) =>
				{
					const val = props[key];

					if(typeof val === 'string')
					{
						attrs += ` ${key}="${val}"`;
					}
					else
					{
						attrs += ` :${key}='${JSON.stringify(val)}'`;
					}
				});

				const labelBlock = field.label
					? `
						<div class="field-info">
							<span class="field-label">${field.label}</span>
							${field.description ? `<span class="field-description">${field.description}</span>` : ''}
						</div>
					`
					: '';

				return `
					<div class="field">
						${labelBlock}
						<${tag} :value="row['${field.key}']" :_change="(data) => change(row_index, '${field.key}', data)"${attrs}></${tag}>
					</div>
				`;
			}).join('');

			return /* html */ `
				<div :class="'holder ' + orientation + ' ' + variant.join(' ') + (disabled ? ' disabled' : '')">
					<div ot-if="addPosition === 'top' || addPosition === 'both'" class="footer top">
						<span ot-if="max" class="counter">{{ value.length }} / {{ max }}</span>
						<span ot-if="!max" class="counter">{{ value.length }} items</span>
						<e-form-button
							ot-if="canAdd()"
							:text="add"
							icon="add"
							:_click="prepend"
							:variant="['bg-1', 'border', 'size-s']"
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
							:variant="['brand', 'size-m']"
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
								:variant="['bg-1', 'border', 'size-s']"
							></e-form-button>
							<e-form-button
								ot-if="save"
								:text="save"
								:_click="submit"
								:variant="['brand', 'size-s']"
							></e-form-button>
						</div>
					</div>
				</div>
			`;
		}
	});
});

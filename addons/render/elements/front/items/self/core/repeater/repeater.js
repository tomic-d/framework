onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'core-repeater',
		icon: 'repeat',
		name: 'Repeater',
		description: 'Repeatable rows of fields with add, remove, and reorder.',
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
						key: { type: 'string', value: '' },
						label: { type: 'string', value: '' },
						element: { type: 'string', value: '' },
						properties: { type: 'object', value: {} },
						default: { type: 'string', value: '' }
					}
				}
			},
			add: {
				type: 'string',
				value: 'Add'
			},
			save: {
				type: 'string',
				value: ''
			},
			max: {
				type: 'number',
				value: 0
			},
			disabled: {
				type: 'boolean',
				value: false
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
			// Helpers

			this.defaults = () =>
			{
				const row = {};

				this.fields.forEach((field) =>
				{
					row[field.key] = field.default !== undefined ? field.default : '';
				});

				return row;
			};

			this.allowed = () =>
			{
				if (this.disabled)
				{
					return false;
				}

				if (this.max > 0 && this.value.length >= this.max)
				{
					return false;
				}

				return true;
			};

			this.emit = () =>
			{
				if (this._change)
				{
					this._change({ value: this.value });
				}
			};

			// Actions

			this.append = () =>
			{
				if (!this.allowed())
				{
					return;
				}

				this.value.push(this.defaults());
				this.Update();
				this.emit();
			};

			this.remove = (index) =>
			{
				if (this.disabled)
				{
					return;
				}

				this.value.splice(index, 1);
				this.Update();
				this.emit();
			};

			this.up = (index) =>
			{
				if (index === 0)
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
				if (index >= this.value.length - 1)
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
				if (this._save)
				{
					this._save({ value: this.value });
				}
			};

			// Field change

			this.change = (index, key, data) =>
			{
				this.value[index][key] = data.value;
				this.emit();
			};

			// Build field elements

			const columns = this.fields.map((field) =>
			{
				const tag = 'e-' + field.element;
				const props = field.properties || {};

				let attrs = '';

				Object.keys(props).forEach((key) =>
				{
					const val = props[key];

					if (typeof val === 'string')
					{
						attrs += ` ${key}="${val}"`;
					}
					else
					{
						attrs += ` :${key}='${JSON.stringify(val)}'`;
					}
				});

				const label = field.label
					? `<span class="label">${field.label}</span>`
					: '';

				return `<div class="column">${label}<${tag} #class="field" :value="row['${field.key}']" :_change="(data) => change(row_index, '${field.key}', data)"${attrs}></${tag}></div>`;
			}).join('');

			return `
				<div :class="'holder ' + variant.join(' ')">
					<div ot-if="value.length" class="rows">
						<div ot-for="row, row_index in value" class="row">
							<div class="fields">
								${columns}
							</div>
							<div ot-if="!disabled" class="actions">
								<i ot-if="row_index > 0" class="action" ot-click="() => up(row_index)">arrow_upward</i>
								<i ot-if="row_index < value.length - 1" class="action" ot-click="() => down(row_index)">arrow_downward</i>
								<i class="action remove" ot-click="() => remove(row_index)">close</i>
							</div>
						</div>
					</div>
					<div ot-if="!value.length" class="empty">
						<span>No items</span>
					</div>
					<div class="footer">
						<e-form-button ot-if="allowed()" :text="add" icon="add" :_click="append" :variant="['bg-2', 'border', 'size-s']"></e-form-button>
						<e-form-button ot-if="save" :text="save" :_click="submit" :variant="['brand', 'size-s']"></e-form-button>
					</div>
				</div>
			`;
		}
	});
});

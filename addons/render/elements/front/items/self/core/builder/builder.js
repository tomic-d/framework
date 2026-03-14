onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'core-builder',
		icon: 'dashboard_customize',
		name: 'Builder',
		description: 'Config-driven form builder with sections, conditions, and any element.',
		category: 'Core',
		author: 'OneType',
		config: {
			values: {
				type: 'object',
				value: {}
			},
			sections: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						title: { type: 'string', value: '' },
						collapsed: { type: 'boolean', value: false },
						condition: { type: 'function' },
						fields: {
							type: 'array',
							value: [],
							each: {
								type: 'object',
								config: {
									key: { type: 'string', value: '' },
									label: { type: 'string', value: '' },
									description: { type: 'string', value: '' },
									position: { type: 'string', value: 'top' },
									element: { type: 'string', value: '' },
									properties: { type: 'object', value: {} },
									condition: { type: 'function' }
								}
							}
						}
					}
				}
			},
			save: {
				type: 'string',
				value: ''
			},
			disabled: {
				type: 'boolean',
				value: false
			},
			variant: {
				type: 'array',
				value: ['size-m'],
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
			// State

			this.collapsed = {};

			this.sections.forEach((section, index) =>
			{
				if (section.collapsed)
				{
					this.collapsed[index] = true;
				}
			});

			// Helpers

			this.visible = (condition) =>
			{
				if (!condition)
				{
					return true;
				}

				return condition(this.values);
			};

			this.val = (key) =>
			{
				if (!this.values)
				{
					return null;
				}

				return this.values[key];
			};

			// Actions

			this.toggle = (index) =>
			{
				this.collapsed[index] = !this.collapsed[index];
				this.Update();
			};

			this.change = (key, data) =>
			{
				this.values[key] = data.value;
				this.Update();

				if (this._change)
				{
					this._change({ key, value: data.value });
				}
			};

			this.submit = () =>
			{
				if (this._save)
				{
					this._save({ value: this.values });
				}
			};

			// Build sections

			const html = this.sections.map((section, sectionIndex) =>
			{
				// Section condition

				const sectionCondition = section.condition
					? `ot-if="visible(sections[${sectionIndex}].condition)"`
					: '';

				// Section header

				const header = section.title
					? `
						<div class="header" ot-click="() => toggle(${sectionIndex})">
							<span class="title">{{ sections[${sectionIndex}].title }}</span>
							<i :class="'chevron' + (collapsed[${sectionIndex}] ? ' collapsed' : '')">expand_more</i>
						</div>
					`
					: '';

				// Fields

				const fields = section.fields.map((field, fieldIndex) =>
				{
					const tag = 'e-' + field.element;
					const props = field.properties || {};
					const position = field.position || 'top';

					// Build properties attributes

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

					// Element tag

					const element = `<${tag} :value="val('${field.key}')" :_change="(data) => change('${field.key}', data)"${attrs}></${tag}>`;

					// Label

					const label = field.label
						? `<span class="label">{{ sections[${sectionIndex}].fields[${fieldIndex}].label }}</span>`
						: '';

					// Description

					const description = field.description
						? `<span class="description">{{ sections[${sectionIndex}].fields[${fieldIndex}].description }}</span>`
						: '';

					// Field condition

					const fieldCondition = field.condition
						? `ot-if="visible(sections[${sectionIndex}].fields[${fieldIndex}].condition)"`
						: '';

					// Position layout

					if (position === 'left')
					{
						return `
							<div class="field left" ${fieldCondition}>
								<div class="info">
									${label}
									${description}
								</div>
								<div class="control">
									${element}
								</div>
							</div>
						`;
					}

					return `
						<div class="field top" ${fieldCondition}>
							<div class="info">
								${label}
								${description}
							</div>
							${element}
						</div>
					`;
				}).join('');

				return `
					<div class="section" ${sectionCondition}>
						${header}
						<div ot-if="!collapsed[${sectionIndex}]" class="fields">
							${fields}
						</div>
					</div>
				`;
			}).join('');

			return `
				<div :class="'holder ' + variant.join(' ')">
					${html}
					<div ot-if="save" class="footer">
						<e-form-button :text="save" :_click="submit" :disabled="disabled" :variant="['brand', 'size-s']"></e-form-button>
					</div>
				</div>
			`;
		}
	});
});

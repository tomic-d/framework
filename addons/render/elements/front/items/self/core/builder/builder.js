onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'core-builder',
		icon: 'dashboard_customize',
		name: 'Builder',
		description: 'Config-driven form builder with steps, sections, grid columns, conditions and reusable form-section / form-field elements.',
		category: 'Core',
		author: 'OneType',
		config: {
			values: {
				type: 'object',
				value: {}
			},
			steps: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						id: { type: 'string' },
						label: { type: 'string' },
						description: { type: 'string' },
						icon: { type: 'string' },
						sections: { type: 'array', value: [] }
					}
				}
			},
			sections: {
				type: 'array',
				value: [],
				each: {
					type: 'object'
				}
			},
			save: {
				type: 'string'
			},
			saveVariant: {
				type: 'array',
				value: ['brand', 'size-m']
			},
			disabled: {
				type: 'boolean'
			},
			variant: {
				type: 'array',
				value: ['size-m'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'clean', 'size-s', 'size-m', 'size-l']
			},
			_input: {
				type: 'function'
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
			// Step state

			this.hasSteps = this.steps.length > 0;
			this.activeStep = this.hasSteps ? this.steps[0].id : '';

			// Current sections depend on step or flat sections

			this.currentSections = () =>
			{
				if(this.hasSteps)
				{
					const step = this.steps.find(s => s.id === this.activeStep) || this.steps[0];
					return step.sections || [];
				}

				return this.sections;
			};

			// Detect conditions — if any exist we re-render on change

			this.hasConditions = (() =>
			{
				const scan = (sections) =>
				{
					for(const section of sections)
					{
						if(section.condition)
						{
							return true;
						}

						if(section.fields)
						{
							for(const field of section.fields)
							{
								if(field.condition)
								{
									return true;
								}
							}
						}
					}

					return false;
				};

				if(this.hasSteps)
				{
					for(const step of this.steps)
					{
						if(scan(step.sections || []))
						{
							return true;
						}
					}

					return false;
				}

				return scan(this.sections);
			})();

			// Helpers

			this.visible = (condition) =>
			{
				if(!condition)
				{
					return true;
				}

				return condition(this.values);
			};

			this.val = (key) =>
			{
				if(!this.values)
				{
					return null;
				}

				return this.values[key];
			};

			// Actions

			this.selectStep = ({ value }) =>
			{
				this.activeStep = value;
			};

			this.input = (key, data) =>
			{
				this.values[key] = data.value;

				if(this.hasConditions)
				{
					this.Update();
				}

				if(this._input)
				{
					this._input({ key, value: data.value });
				}
			};

			this.change = (key, data) =>
			{
				this.values[key] = data.value;

				if(this.hasConditions)
				{
					this.Update();
				}

				if(this._change)
				{
					this._change({ key, value: data.value });
				}
			};

			this.submit = () =>
			{
				if(this._save)
				{
					this._save({ value: this.values });
				}
			};

			// Escape attr value safely

			const escape = (value) =>
			{
				return String(value).replace(/&/g, '&amp;').replace(/'/g, '&#39;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			};

			// Build field element tag with properties

			const buildField = (field, sectionIndex, fieldIndex, scope) =>
			{
				const tag = 'e-' + field.element;
				const props = field.properties || {};
				const span = field.span || 1;

				let attrs = '';

				Object.keys(props).forEach((key) =>
				{
					const value = props[key];

					if(typeof value === 'string')
					{
						attrs += ` ${key}="${escape(value)}"`;
					}
					else
					{
						attrs += ` :${key}='${escape(JSON.stringify(value))}'`;
					}
				});

				const input = `
					<${tag}
						:value="val('${field.key}')"
						:_input="(data) => input('${field.key}', data)"
						:_change="(data) => change('${field.key}', data)"
						${attrs}
					></${tag}>
				`;

				const fieldCondition = field.condition
					? `ot-if="visible(${scope}[${sectionIndex}].fields[${fieldIndex}].condition)"`
					: '';

				const fieldVariant = field.variant ? JSON.stringify(field.variant) : JSON.stringify(['size-m']);

				return `
					<e-form-field
						${fieldCondition}
						#class="field"
						#style="grid-column: span ${span};"
						label="${escape(field.label || '')}"
						description="${escape(field.description || '')}"
						hint="${escape(field.hint || '')}"
						:required="${field.required ? 'true' : 'false'}"
						orientation="${field.orientation || 'horizontal'}"
						:variant='${escape(fieldVariant)}'
					>
						<div slot="input">
							${input}
						</div>
					</e-form-field>
				`;
			};

			// Build a single section

			const buildSection = (section, sectionIndex, scope) =>
			{
				const columns = section.columns || 1;
				const fields = (section.fields || []).map((field, fieldIndex) => buildField(field, sectionIndex, fieldIndex, scope)).join('');

				const sectionCondition = section.condition
					? `ot-if="visible(${scope}[${sectionIndex}].condition)"`
					: '';

				const sectionVariant = section.variant ? JSON.stringify(section.variant) : JSON.stringify(['clean']);

				return `
					<e-form-section
						${sectionCondition}
						eyebrow="${escape(section.eyebrow || '')}"
						icon="${escape(section.icon || '')}"
						title="${escape(section.title || '')}"
						description="${escape(section.description || '')}"
						:collapsible="${section.collapsible ? 'true' : 'false'}"
						:collapsed="${section.collapsed ? 'true' : 'false'}"
						:variant='${escape(sectionVariant)}'
					>
						<div slot="content">
							<div class="grid" style="grid-template-columns: repeat(${columns}, minmax(0, 1fr));">
								${fields}
							</div>
						</div>
					</e-form-section>
				`;
			};

			// Build all sections for current step (or flat)

			let sectionsHtml = '';

			if(this.hasSteps)
			{
				sectionsHtml = this.steps.map((step, stepIndex) =>
				{
					const sections = (step.sections || []).map((section, sectionIndex) => buildSection(section, sectionIndex, `steps[${stepIndex}].sections`)).join('');

					return `
						<div ot-if="activeStep === '${step.id}'" class="step-panel">
							${sections}
						</div>
					`;
				}).join('');
			}
			else
			{
				sectionsHtml = this.sections.map((section, sectionIndex) => buildSection(section, sectionIndex, 'sections')).join('');
			}

			return /* html */ `
				<div :class="'holder ' + variant.join(' ') + (hasSteps ? ' has-steps' : '')">
					<e-navigation-steps
						ot-if="hasSteps"
						#class="steps"
						:items="steps"
						:active="activeStep"
						orientation="vertical"
						:variant="['bg-1', 'border', 'connected', 'size-m']"
						:_change="selectStep"
					></e-navigation-steps>

					<div class="main">
						<div class="sections">
							${sectionsHtml}
						</div>
						<div ot-if="save" class="footer">
							<e-form-button
								:text="save"
								:_click="submit"
								:disabled="disabled"
								:variant="saveVariant"
							></e-form-button>
						</div>
					</div>
				</div>
			`;
		}
	});
});

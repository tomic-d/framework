onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'core-builder',
		icon: 'dashboard_customize',
		name: 'Builder',
		description: 'Config-driven form builder with steps, sections, grid and conditions.',
		category: 'Core',
		config:
		{
			values:
			{
				type: 'object',
				value: {},
				description: 'Form data keyed by field key.'
			},
			steps:
			{
				type: 'array',
				value: [],
				each:
				{
					type: 'object',
					config:
					{
						id:
						{
							type: 'string',
							description: 'Step identifier.'
						},
						label:
						{
							type: 'string',
							description: 'Step label.'
						},
						description:
						{
							type: 'string',
							description: 'Step description.'
						},
						icon:
						{
							type: 'string',
							description: 'Step icon.'
						},
						sections:
						{
							type: 'array',
							value: [],
							description: 'Sections for this step.'
						}
					}
				},
				description: 'Wizard steps. Each contains sections.'
			},
			sections:
			{
				type: 'array',
				value: [],
				each: { type: 'object' },
				description: 'Flat sections when no steps.'
			},
			save:
			{
				type: 'string',
				value: '',
				description: 'Save button label. Empty hides button.'
			},
			disabled:
			{
				type: 'boolean',
				value: false,
				description: 'Disable save button.'
			},
			background:
			{
				type: 'string',
				value: '',
				options: ['', 'bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Container background depth.'
			},
			border:
			{
				type: 'boolean',
				value: false,
				description: 'Container border.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Section spacing.'
			},
			_input:
			{
				type: 'function',
				description: 'Input handler. Receives { key, value }.'
			},
			_change:
			{
				type: 'function',
				description: 'Change handler. Receives { key, value }.'
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

			this.hasSteps = this.steps.length > 0;
			this.activeStep = this.hasSteps ? this.steps[0].id : '';
			this.hasSave = !!this.save;

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

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', 'size-' + this.size];

				if(this.background)
				{
					list.push(this.background);
				}

				if(this.border)
				{
					list.push('border');
				}

				if(this.hasSteps)
				{
					list.push('has-steps');
				}

				return list.join(' ');
			};

			/* ===== HELPERS ===== */

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

			/* ===== HANDLERS ===== */

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

			/* ===== RENDER ===== */

			const escape = (value) =>
			{
				return elements.Fn('type.escape', value);
			};

			const buildField = (field, sectionIndex, fieldIndex, scope) =>
			{
				const tag = 'e-' + field.element;
				const props = field.properties || {};
				const span = field.span || 1;

				let attrs = '';

				Object.keys(props).forEach(key =>
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

				const condition = field.condition
					? `ot-if="visible(${scope}[${sectionIndex}].fields[${fieldIndex}].condition)"`
					: '';

				return `
					<e-form-field
						${condition}
						#class="field"
						#style="grid-column: span ${span};"
						label="${escape(field.label || '')}"
						description="${escape(field.description || '')}"
						hint="${escape(field.hint || '')}"
						:required="${field.required ? 'true' : 'false'}"
						orientation="${field.orientation || 'horizontal'}"
					>
						<div slot="input">
							${input}
						</div>
					</e-form-field>
				`;
			};

			const buildSection = (section, sectionIndex, scope) =>
			{
				const columns = section.columns || 1;
				const fields = (section.fields || []).map((field, fieldIndex) => buildField(field, sectionIndex, fieldIndex, scope)).join('');

				const condition = section.condition
					? `ot-if="visible(${scope}[${sectionIndex}].condition)"`
					: '';

				const background = section.background || '';
				const sectionVariant = (section.border !== false) ? "['border']" : '[]';

				return `
					<e-form-section
						${condition}
						eyebrow="${escape(section.eyebrow || '')}"
						icon="${escape(section.icon || '')}"
						title="${escape(section.title || '')}"
						description="${escape(section.description || '')}"
						:collapsible="${section.collapsible ? 'true' : 'false'}"
						:collapsed="${section.collapsed ? 'true' : 'false'}"
						background="${background}"
						:variant="${sectionVariant}"
					>
						<div slot="content">
							<div class="grid" style="grid-template-columns: repeat(${columns}, minmax(0, 1fr));">
								${fields}
							</div>
						</div>
					</e-form-section>
				`;
			};

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
				<div :class="classes()">
					<div ot-if="hasSteps" class="steps">
						<e-navigation-steps
							:items="steps"
							:active="activeStep"
							orientation="vertical"
							background="bg-1"
							:variant="['border', 'connected']"
							:_change="selectStep"
						></e-navigation-steps>
					</div>

					<div class="main">
						<div class="sections">
							${sectionsHtml}
						</div>
						<div ot-if="hasSave" class="footer">
							<e-form-button
								:text="save"
								:_click="submit"
								:disabled="disabled"
								color="brand"
							></e-form-button>
						</div>
					</div>
				</div>
			`;
		}
	});
});

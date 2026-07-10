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
				type: 'array|object',
				value: [],
				description: 'Row data. Array for manual mode, or { each, as, template } for iteration over a variable expression.'
			},
			iterable:
			{
				type: 'boolean',
				value: false,
				description: 'Allow binding the repeater to a variable expression (array). Shows a bind action in the editor.'
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
				options: ['bg-1', 'bg-2', 'bg-3'],
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
			},
			variables:
			{
				type: 'object',
				value: {},
				description: 'Available variables propagated to every row field that supports the variable builder.'
			}
		},
		render: function()
		{
			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.background, this.orientation, 'size-' + this.size];

				this.variant.forEach(v => list.push(v));

				if(this.disabled)
				{
					list.push('disabled');
				}

				if(this.isIterable)
				{
					list.push('iterating');
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

			this.computeRows = () =>
			{
				const value = this.value;

				if(value && !Array.isArray(value) && typeof value === 'object' && typeof value.each === 'string')
				{
					const match = /^\{\{\s*([\s\S]*?)\s*\}\}$/.exec(value.each.trim());
					const expression = match ? match[1] : value.each;
					const as = value.as || 'item';
					const template = value.template || {};

					let source;

					try
					{
						source = onetype.Function(expression, this.variables || {}, false);
					}
					catch(error)
					{
						source = null;
					}

					if(!Array.isArray(source))
					{
						return [];
					}

					return source.map((item, index) =>
					{
						const scope = { ...(this.variables || {}), [as]: item, index };
						const rendered = {};

						for(const [key, raw] of Object.entries(template))
						{
							rendered[key] = this.resolveValue(raw, scope);
						}

						return rendered;
					});
				}

				return Array.isArray(value) ? value : [];
			};

			this.resolveValue = (value, scope) =>
			{
				if(typeof value === 'string')
				{
					const match = /^\{\{\s*([\s\S]*?)\s*\}\}$/.exec(value);

					if(match)
					{
						try
						{
							const result = onetype.Function(match[1], scope, false);
							return result === undefined ? '' : result;
						}
						catch(error)
						{
							return '';
						}
					}

					if(value.indexOf('{{') === -1)
					{
						return value;
					}

					return value.replace(/\{\{\s*([\s\S]*?)\s*\}\}/g, (_, expression) =>
					{
						try
						{
							const result = onetype.Function(expression, scope, false);

							if(result === null || result === undefined) return '';
							if(typeof result === 'object') return JSON.stringify(result);

							return String(result);
						}
						catch(error)
						{
							return '';
						}
					});
				}

				if(Array.isArray(value))
				{
					return value.map(item => this.resolveValue(item, scope));
				}

				if(value && typeof value === 'object')
				{
					const output = {};

					for(const [key, child] of Object.entries(value))
					{
						output[key] = this.resolveValue(child, scope);
					}

					return output;
				}

				return value;
			};

			this.canAdd = () =>
			{
				if(this.disabled || this.isIterable)
				{
					return false;
				}

				if(this.max > 0 && Array.isArray(this.value) && this.value.length >= this.max)
				{
					return false;
				}

				return true;
			};

			this.canRemove = () =>
			{
				if(this.disabled || this.isIterable)
				{
					return false;
				}

				if(this.min > 0 && Array.isArray(this.value) && this.value.length <= this.min)
				{
					return false;
				}

				return true;
			};

			this.canReorder = () =>
			{
				return !this.disabled && !this.isIterable && this.draggable;
			};

			/* ===== STATE ===== */

			this.Compute(() =>
			{
				this.hasSave    = !!this.save;
				this.isIterable = !!(this.value && !Array.isArray(this.value) && typeof this.value === 'object' && typeof this.value.each === 'string');
				this.rows       = this.computeRows();
			});

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

			/* ===== ITERATION BINDING ===== */

			this.hasVariables = () =>
			{
				return this.variables && typeof this.variables === 'object' && Object.keys(this.variables).length > 0;
			};

			this.iterationLabel = () =>
			{
				if(!this.isIterable) return '';

				const each = String(this.value.each || '').trim();
				const match = /^\{\{\s*([\s\S]*?)\s*\}\}$/.exec(each);

				return match ? match[1] : each;
			};

			this.iterationCount = () =>
			{
				return this.rows ? this.rows.length : 0;
			};

			this.templateRow = () =>
			{
				if(!this.isIterable) return {};

				return this.value.template || {};
			};

			this.templateVariables = () =>
			{
				if(!this.isIterable) return this.variables || {};

				const as = this.value.as || 'item';
				const source = this.rows && this.rows.length > 0 ? this.rows[0] : null;
				const sample = source ? source : (() =>
				{
					const stub = {};

					for(const field of this.fields)
					{
						stub[field.key] = '';
					}

					return stub;
				})();

				return { ...(this.variables || {}), [as]: sample };
			};

			this.changeTemplate = (key, data) =>
			{
				if(!this.isIterable) return;

				const next = { ...this.value };

				next.template = { ...(next.template || {}), [key]: data.value };

				this.value = next;

				if(this._change)
				{
					this._change({ value: this.value });
				}

				this.Update();
			};

			this.bindToVariable = () =>
			{
				if(this.disabled)
				{
					return;
				}

				const modalId = 'modal-var-builder-' + Date.now();
				const current = this.value && typeof this.value === 'object' && !Array.isArray(this.value)
					? (this.value.each || '')
					: '';

				const initial = (() =>
				{
					const m = /^\{\{\s*([\s\S]*?)\s*\}\}$/.exec(String(current).trim());
					return m ? m[1] : '';
				})();

				const defaults = this.defaults();
				const template = {};

				for(const key of Object.keys(defaults))
				{
					template[key] = '{{ item.' + key + ' }}';
				}

				const onSave = ({ expression }) =>
				{
					this.value = {
						each:     '{{ ' + expression + ' }}',
						as:       'item',
						template: template
					};

					if(this._change)
					{
						this._change({ value: this.value });
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

			this.unbindVariable = () =>
			{
				if(this.disabled)
				{
					return;
				}

				this.value = [];

				if(this._change)
				{
					this._change({ value: this.value });
				}

				this.Update();
			};

			/* ===== RENDER ===== */

			const buildFieldAttrs = (field) =>
			{
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

				return attrs;
			};

			const buildFieldLabel = (field) =>
			{
				if(!field.label) return '';

				return `<div class="field-info">
					<span class="field-label">${field.label}</span>
					${field.description ? `<span class="field-description">${field.description}</span>` : ''}
				</div>`;
			};

			const fieldTemplate = this.fields.map(field =>
			{
				const tag   = 'e-' + field.element;
				const attrs = buildFieldAttrs(field);
				const label = buildFieldLabel(field);

				return `
					<div class="field">
						${label}
						<${tag} :value="row['${field.key}']" :variables="variables" :_change="(data) => change(row_index, '${field.key}', data)"${attrs}></${tag}>
					</div>
				`;
			}).join('');

			const templateFieldTemplate = this.fields.map(field =>
			{
				const tag   = 'e-' + field.element;
				const attrs = buildFieldAttrs(field);
				const label = buildFieldLabel(field);

				return `
					<div class="field">
						${label}
						<${tag} :value="templateRow()['${field.key}']" :variables="templateVariables()" :_change="(data) => changeTemplate('${field.key}', data)"${attrs}></${tag}>
					</div>
				`;
			}).join('');

			return /* html */ `
				<div :class="classes()">
					<div ot-if="isIterable" class="iteration">
						<div class="iteration-chip">
							<i class="iteration-icon">repeat</i>
							<div class="iteration-text">
								<span class="iteration-label">Bound to variable</span>
								<span class="iteration-expression">{{ iterationLabel() }}</span>
							</div>
							<span class="iteration-count">{{ iterationCount() }} item{{ iterationCount() === 1 ? '' : 's' }}</span>
							<button
								ot-if="!disabled"
								type="button"
								class="iteration-action"
								ot-click.stop="bindToVariable"
								:ot-tooltip="{ text: 'Change expression', position: { x: 'center', y: 'top' } }"
							>
								<i>edit</i>
							</button>
							<button
								ot-if="!disabled"
								type="button"
								class="iteration-action danger"
								ot-click.stop="unbindVariable"
								:ot-tooltip="{ text: 'Unbind', position: { x: 'center', y: 'top' } }"
							>
								<i>close</i>
							</button>
						</div>

						<div class="iteration-template">
							<div class="iteration-template-head">
								<i>auto_awesome</i>
								<span class="iteration-template-label">Template</span>
								<span class="iteration-template-hint">applied to each item — use <code>item.field</code></span>
							</div>
							<div class="fields">
								${templateFieldTemplate}
							</div>
						</div>

						<div ot-if="rows.length" class="iteration-preview">
							<div class="iteration-preview-head">
								<i>visibility</i>
								<span>Preview ({{ rows.length }} item{{ rows.length === 1 ? '' : 's' }})</span>
							</div>
							<div ot-for="row, row_index in rows" class="iteration-row">
								<span class="iteration-row-index">{{ row_index + 1 }}</span>
								<span class="iteration-row-text">{{ JSON.stringify(row) }}</span>
							</div>
						</div>

						<div ot-if="!rows.length" class="iteration-empty">
							<i>info</i>
							<span>Expression returned an empty array.</span>
						</div>
					</div>

					<div ot-if="!isIterable && (addPosition === 'top' || addPosition === 'both')" class="footer top">
						<span ot-if="max" class="counter">{{ rows.length }} / {{ max }}</span>
						<span ot-if="!max" class="counter">{{ rows.length }} items</span>
						<e-form-button
							ot-if="canAdd()"
							:text="add"
							icon="add"
							:_click="prepend"
							background="bg-1"
							size="s"
						></e-form-button>
					</div>

					<div ot-if="!isIterable && rows.length" class="rows">
						<div ot-for="row, row_index in rows" class="row">
							<div ot-if="canReorder()" class="reorder">
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
									:disabled="row_index === rows.length - 1"
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

					<div ot-if="!isIterable && !rows.length" class="empty">
						<div class="empty-icon"><i>{{ emptyIcon }}</i></div>
						<span class="empty-text">{{ empty }}</span>
						<div class="empty-actions">
							<e-form-button
								ot-if="!disabled && canAdd()"
								:text="add"
								icon="add"
								:_click="append"
								color="brand"
							></e-form-button>
							<e-form-button
								ot-if="!disabled && iterable && hasVariables()"
								text="Bind to variable"
								icon="data_object"
								background="bg-2"
								:_click="bindToVariable"
							></e-form-button>
						</div>
					</div>

					<div ot-if="!isIterable && rows.length && (addPosition === 'bottom' || addPosition === 'both')" class="footer bottom">
						<span ot-if="max" class="counter">{{ rows.length }} / {{ max }}</span>
						<span ot-if="!max" class="counter">{{ rows.length }} items</span>
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
								ot-if="!disabled && iterable && hasVariables()"
								text="Bind"
								icon="data_object"
								background="bg-1"
								size="s"
								:_click="bindToVariable"
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

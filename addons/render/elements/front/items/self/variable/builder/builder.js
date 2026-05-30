onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'variable-builder',
		icon: 'data_object',
		name: 'Variable Builder',
		description: 'Build a JavaScript expression with available variables and live preview.',
		category: 'Variable',
		config:
		{
			variables:
			{
				type: 'object',
				value: {},
				description: 'Map of available variable definitions (key → { type, label, description, config, each }).'
			},
			value:
			{
				type: 'string',
				value: '',
				description: 'Initial expression to edit.'
			},
			_save:
			{
				type: 'function',
				description: 'Save handler. Receives { expression }.'
			},
			_cancel:
			{
				type: 'function',
				description: 'Cancel handler.'
			}
		},
		render: function()
		{
			this.expression = this.value || '';
			this.preview = '';
			this.error = '';

			/* ===== SAMPLE DATA ===== */

			const sampleFor = (spec) =>
			{
				const def  = spec && typeof spec === 'object' ? spec : { type: String(spec) };
				const type = def.type || 'string';

				if(def.value !== undefined && def.value !== null)
				{
					return def.value;
				}

				if(type === 'string') return 'Sample text';
				if(type === 'number') return 123;
				if(type === 'boolean') return true;
				if(type === 'date') return new Date().toISOString().slice(0, 10);

				if(type === 'array')
				{
					const each = def.each;

					if(each && each.config)
					{
						const item = {};

						for(const [k, v] of Object.entries(each.config))
						{
							item[k] = sampleFor(v);
						}

						return [item, item];
					}

					if(each)
					{
						return [sampleFor(each), sampleFor(each)];
					}

					return [];
				}

				if(type === 'object' && def.config)
				{
					const obj = {};

					for(const [k, v] of Object.entries(def.config))
					{
						obj[k] = sampleFor(v);
					}

					return obj;
				}

				return null;
			};

			this.sampleContext = {};

			for(const [k, v] of Object.entries(this.variables || {}))
			{
				this.sampleContext[k] = sampleFor(v);
			}

			/* ===== FLATTEN VARIABLES ===== */

			const flatten = (variables, prefix) =>
			{
				const result = [];

				for(const [key, spec] of Object.entries(variables || {}))
				{
					const def  = spec && typeof spec === 'object' ? spec : { type: String(spec) };
					const type = def.type || 'string';
					const path = prefix ? prefix + '.' + key : key;
					const label = def.label || key;

					result.push({
						path,
						label,
						description: def.description || '',
						type
					});

					if(type === 'object' && def.config)
					{
						result.push(...flatten(def.config, path));
					}

					if(type === 'array' && def.each && def.each.config)
					{
						const itemPath = path + '[0]';

						result.push({
							path:        itemPath,
							label:       label + ' (item)',
							description: 'First item of array',
							type:        'object'
						});

						result.push(...flatten(def.each.config, itemPath));
					}
				}

				return result;
			};

			this.flatList = flatten(this.variables);

			/* ===== PREVIEW ===== */

			this.updatePreview = () =>
			{
				if(!this.expression || !this.expression.trim())
				{
					this.preview = '';
					this.error = '';
					return;
				}

				try
				{
					const result = onetype.Function(this.expression, this.sampleContext, false);

					if(result === null || result === undefined)
					{
						this.preview = String(result);
					}
					else if(typeof result === 'object')
					{
						this.preview = JSON.stringify(result, null, 2);
					}
					else
					{
						this.preview = String(result);
					}

					this.error = '';
				}
				catch(error)
				{
					this.preview = '';
					this.error = error.message || String(error);
				}
			};

			this.updatePreview();

			/* ===== HANDLERS ===== */

			this.handleChange = (event) =>
			{
				this.expression = event && event.target ? event.target.value : '';
				this.updatePreview();
				this.Update();
			};

			this.insertVariable = (item) =>
			{
				const textarea = this.Element.querySelector('textarea');

				if(!textarea)
				{
					this.expression = (this.expression || '') + item.path;
				}
				else
				{
					const start = textarea.selectionStart || 0;
					const end   = textarea.selectionEnd   || 0;
					const before = this.expression.slice(0, start);
					const after  = this.expression.slice(end);

					this.expression = before + item.path + after;

					setTimeout(() =>
					{
						textarea.focus();
						const pos = start + item.path.length;
						textarea.setSelectionRange(pos, pos);
					}, 0);
				}

				this.updatePreview();
				this.Update();
			};

			this.handleQuery = (event) =>
			{
				this.query = (event && event.target ? event.target.value : '').toLowerCase();
				this.Update();
			};

			this.filteredList = () =>
			{
				if(!this.query)
				{
					return this.flatList;
				}

				return this.flatList.filter(item =>
				{
					return item.path.toLowerCase().includes(this.query) ||
					       item.label.toLowerCase().includes(this.query);
				});
			};

			this.handleSave = () =>
			{
				if(this._save)
				{
					this._save({ expression: this.expression.trim() });
				}
			};

			this.handleCancel = () =>
			{
				if(this._cancel)
				{
					this._cancel();
				}
			};

			this.query = '';

			return /* html */ `
				<div class="holder">
					<header class="head">
						<i class="head-icon">data_object</i>
						<div class="head-text">
							<span class="head-eyebrow">Expression</span>
							<span class="head-title">Variable Builder</span>
						</div>
						<button class="head-close" type="button" ot-click="handleCancel"><i>close</i></button>
					</header>

					<div class="body">
						<div class="left">
							<div class="left-head">
								<span class="left-label">Available variables</span>
								<span ot-if="flatList.length" class="left-count">{{ flatList.length }}</span>
							</div>

							<div ot-if="flatList.length > 6" class="left-search">
								<i>search</i>
								<input type="text" placeholder="Search variables…" :value="query" ot-input="handleQuery" />
							</div>

							<div class="left-list">
								<button
									ot-for="item in filteredList()"
									type="button"
									class="var-item"
									ot-click="() => insertVariable(item)"
									:title="item.description || item.path"
								>
									<span class="var-name">{{ item.path }}</span>
									<span ot-if="item.label && item.label !== item.path" class="var-label">{{ item.label }}</span>
									<span class="var-type">{{ item.type }}</span>
								</button>
							</div>

							<div ot-if="!filteredList().length" class="left-empty">No variables.</div>
						</div>

						<div class="right">
							<div class="field">
								<span class="field-label">Expression</span>
								<textarea
									class="expr"
									placeholder="Write any JavaScript expression. Click a variable on the left to insert."
									ot-input="handleChange"
								>{{ expression }}</textarea>
								<span class="field-hint">Will be wrapped in <code>{{ '{{ ... }}' }}</code> when inserted.</span>
							</div>

							<div class="field">
								<span class="field-label">Preview</span>
								<div ot-if="error" class="preview error">
									<i>error</i>
									<span>{{ error }}</span>
								</div>
								<div ot-if="!error && expression" class="preview ok">
									<i>check_circle</i>
									<pre>{{ preview }}</pre>
								</div>
								<div ot-if="!expression" class="preview empty">
									<i>info</i>
									<span>Start typing an expression to see preview.</span>
								</div>
							</div>
						</div>
					</div>

					<footer class="foot">
						<e-form-button
							text="Cancel"
							background="bg-2"
							size="m"
							:_click="handleCancel"
						></e-form-button>
						<e-form-button
							text="Insert"
							icon="check"
							color="brand"
							size="m"
							:disabled="!!error || !expression.trim()"
							:_click="handleSave"
						></e-form-button>
					</footer>
				</div>
			`;
		}
	});
});

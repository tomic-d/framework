onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'variable-builder',
		icon: 'data_object',
		name: 'Variable Builder',
		description: 'Build a JavaScript expression from real values with live preview.',
		category: 'Variable',
		config:
		{
			variables:
			{
				type: 'object',
				value: {},
				description: 'Real values object. Structure and types are auto-detected.'
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
			/* ===== STATE ===== */

			this.expression = this.value || '';
			this.preview    = '';
			this.error      = '';
			this.query      = '';
			this.expanded   = new Set();
			this.activePath = '';

			/* ===== HELPERS ===== */

			const detect = (value) =>
			{
				if(value === null || value === undefined)
				{
					return 'null';
				}

				if(Array.isArray(value))
				{
					return 'array';
				}

				if(value instanceof Date)
				{
					return 'date';
				}

				const type = typeof value;

				if(type === 'string')
				{
					if(/^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?)?$/.test(value))
					{
						return 'date';
					}

					return 'string';
				}

				if(type === 'number' || type === 'boolean' || type === 'function')
				{
					return type;
				}

				return 'object';
			};

			const humanize = (key) =>
			{
				return String(key)
					.replace(/[_-]/g, ' ')
					.replace(/([a-z])([A-Z])/g, '$1 $2')
					.replace(/^./, c => c.toUpperCase());
			};

			const truncate = (text, length) =>
			{
				const string = String(text);

				if(string.length <= length)
				{
					return string;
				}

				return string.slice(0, length) + '…';
			};

			const summary = (value, type) =>
			{
				if(type === 'null')    return value === null ? 'null' : 'undefined';
				if(type === 'string')  return '"' + truncate(value, 32) + '"';
				if(type === 'number')  return String(value);
				if(type === 'boolean') return value ? 'true' : 'false';
				if(type === 'date')    return value instanceof Date ? value.toISOString().slice(0, 10) : truncate(value, 20);
				if(type === 'array')   return '[' + value.length + ' item' + (value.length === 1 ? '' : 's') + ']';
				if(type === 'object')  return '{' + Object.keys(value).length + ' key' + (Object.keys(value).length === 1 ? '' : 's') + '}';

				return '';
			};

			/* ===== TREE ===== */

			const buildTree = (values, prefix, depth) =>
			{
				const nodes = [];

				if(depth > 8)
				{
					return nodes;
				}

				for(const [key, value] of Object.entries(values || {}))
				{
					if(typeof value === 'function')
					{
						continue;
					}

					const path     = prefix ? prefix + '.' + key : key;
					const label    = humanize(key);
					const type     = detect(value);
					const expand   = type === 'object' && value && Object.keys(value).length > 0;
					const children = expand ? buildTree(value, path, depth + 1) : [];

					nodes.push({
						path,
						key,
						label,
						type,
						depth,
						preview: summary(value, type),
						expandable: expand,
						children
					});
				}

				return nodes;
			};

			this.tree = buildTree(this.variables || {}, '', 0);

			/* Auto-expand top level */

			for(const node of this.tree)
			{
				if(node.expandable)
				{
					this.expanded.add(node.path);
				}
			}

			/* ===== FLATTEN (visible) ===== */

			this.visible = () =>
			{
				const query = this.query.toLowerCase();
				const match = (node) =>
				{
					if(!query) return true;
					if(node.path.toLowerCase().includes(query)) return true;
					if(node.label.toLowerCase().includes(query)) return true;
					return false;
				};

				const hasMatchDeep = (node) =>
				{
					if(match(node)) return true;

					for(const child of node.children)
					{
						if(hasMatchDeep(child)) return true;
					}

					return false;
				};

				const walk = (nodes, output) =>
				{
					for(const node of nodes)
					{
						const visibleByQuery = query ? hasMatchDeep(node) : true;

						if(!visibleByQuery)
						{
							continue;
						}

						output.push(node);

						const open = query ? hasMatchDeep(node) : this.expanded.has(node.path);

						if(node.expandable && open)
						{
							walk(node.children, output);
						}
					}

					return output;
				};

				return walk(this.tree, []);
			};

			this.visibleCount = () =>
			{
				const count = (nodes) =>
				{
					let total = 0;

					for(const node of nodes)
					{
						total += 1;
						total += count(node.children);
					}

					return total;
				};

				return count(this.tree);
			};

			/* ===== QUICK INSERTS ===== */

			this.quickInserts = () =>
			{
				if(!this.activePath)
				{
					return [];
				}

				const node = (() =>
				{
					const find = (nodes) =>
					{
						for(const item of nodes)
						{
							if(item.path === this.activePath) return item;

							const inner = find(item.children);

							if(inner) return inner;
						}

						return null;
					};

					return find(this.tree);
				})();

				if(!node)
				{
					return [];
				}

				if(node.type === 'array')
				{
					return [
						{ label: 'length',    insert: '.length' },
						{ label: 'join …',    insert: ".join(', ')" },
						{ label: 'first',     insert: '[0]' },
						{ label: 'map name',  insert: ".map(x => x.name).join(', ')" }
					];
				}

				if(node.type === 'string')
				{
					return [
						{ label: 'upper',     insert: '.toUpperCase()' },
						{ label: 'lower',     insert: '.toLowerCase()' },
						{ label: 'trim',      insert: '.trim()' },
						{ label: 'truncate',  insert: ".slice(0, 50) + '…'" }
					];
				}

				if(node.type === 'number')
				{
					return [
						{ label: 'round',     insert: 'Math.round(' + this.activePath + ')', replace: true },
						{ label: '2 decimal', insert: '.toFixed(2)' },
						{ label: 'absolute',  insert: 'Math.abs(' + this.activePath + ')', replace: true }
					];
				}

				if(node.type === 'date')
				{
					return [
						{ label: 'date',      insert: 'new Date(' + this.activePath + ').toLocaleDateString()', replace: true },
						{ label: 'time',      insert: 'new Date(' + this.activePath + ').toLocaleTimeString()', replace: true },
						{ label: 'year',      insert: 'new Date(' + this.activePath + ').getFullYear()', replace: true }
					];
				}

				return [];
			};

			/* ===== PREVIEW ===== */

			this.updatePreview = () =>
			{
				if(!this.expression || !this.expression.trim())
				{
					this.preview = '';
					this.error   = '';
					return;
				}

				try
				{
					const result = onetype.Function(this.expression, this.variables || {}, false);

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
					this.error   = error.message || String(error);
				}
			};

			this.updatePreview();

			/* ===== HANDLERS ===== */

			this.toggle = (path) =>
			{
				if(this.expanded.has(path))
				{
					this.expanded.delete(path);
				}
				else
				{
					this.expanded.add(path);
				}

				this.Update();
			};

			this.pick = (node) =>
			{
				if(node.expandable)
				{
					this.toggle(node.path);
					this.activePath = node.path;
					return;
				}

				this.expression = node.path;
				this.activePath = node.path;
				this.updatePreview();
				this.Update();
			};

			this.quick = (item) =>
			{
				if(item.replace)
				{
					this.expression = item.insert;
				}
				else
				{
					this.expression = (this.expression || '') + item.insert;
				}

				this.updatePreview();
				this.Update();
			};

			this.handleChange = (event) =>
			{
				this.expression = event && event.target ? event.target.value : '';
				this.updatePreview();
				this.Update();
			};

			this.handleQuery = (event) =>
			{
				this.query = event && event.target ? event.target.value : '';
				this.Update();
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

			/* ===== CLASSES ===== */

			this.nodeClass = (node) =>
			{
				const classes = ['node', 'type-' + node.type];

				if(node.expandable) classes.push('expandable');
				if(this.expanded.has(node.path)) classes.push('expanded');
				if(this.activePath === node.path) classes.push('active');

				return classes.join(' ');
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div class="box">
					<header class="head">
						<div class="head-icon"><i>data_object</i></div>
						<div class="head-text">
							<span class="head-eyebrow">Expression</span>
							<span class="head-title">Variable Builder</span>
						</div>
						<button type="button" class="head-close" ot-click="handleCancel">
							<i>close</i>
						</button>
					</header>

					<div class="body">
						<aside class="picker">
							<div class="picker-head">
								<span class="picker-label">Variables</span>
								<span class="picker-count">{{ visibleCount() }}</span>
							</div>

							<div class="picker-search">
								<i>search</i>
								<input
									type="text"
									placeholder="Search…"
									:value="query"
									ot-input="handleQuery"
								/>
							</div>

							<div class="picker-tree">
								<button
									ot-for="node in visible()"
									type="button"
									:class="nodeClass(node)"
									:style="'--depth: ' + node.depth"
									ot-click="() => pick(node)"
									:title="node.path"
								>
									<span class="node-chevron">
										<i ot-if="node.expandable">chevron_right</i>
									</span>
									<span class="node-key">{{ node.key }}</span>
									<span class="node-preview">{{ node.preview }}</span>
									<span class="node-type">{{ node.type }}</span>
								</button>

								<div ot-if="!visible().length" class="picker-empty">
									<i>search_off</i>
									<span>No matches</span>
								</div>
							</div>
						</aside>

						<section class="editor">
							<div class="editor-field">
								<label class="editor-label">Expression</label>
								<textarea
									class="editor-area"
									placeholder="Click a variable or write any JavaScript. e.g. user.name + ' — ' + site.name"
									ot-input="handleChange"
								>{{ expression }}</textarea>
								<span class="editor-hint">
									Wrapped as <code>&#123;&#123; expression &#125;&#125;</code> when inserted.
								</span>
							</div>

							<div ot-if="quickInserts().length" class="editor-quick">
								<span class="editor-quick-label">Quick</span>
								<button
									ot-for="item in quickInserts()"
									type="button"
									class="editor-quick-item"
									ot-click="() => quick(item)"
								>{{ item.label }}</button>
							</div>

							<div class="editor-field">
								<label class="editor-label">Preview</label>

								<div ot-if="error" class="editor-preview error">
									<i>error</i>
									<span>{{ error }}</span>
								</div>

								<div ot-if="!error && expression" class="editor-preview ok">
									<i>check_circle</i>
									<pre>{{ preview }}</pre>
								</div>

								<div ot-if="!expression" class="editor-preview empty">
									<i>info</i>
									<span>Type an expression to see the result.</span>
								</div>
							</div>
						</section>
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

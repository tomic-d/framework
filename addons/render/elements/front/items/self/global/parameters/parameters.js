onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-parameters',
		icon: 'list',
		name: 'Parameters',
		description: 'Parameter list with types, defaults, enums, badges and nested children.',
		category: 'Global',
		config:
		{
			items:
			{
				type: 'array',
				value: [],
				description: 'Parameter items.',
				each:
				{
					type: 'object',
					config:
					{
						name:
						{
							type: 'string',
							description: 'Parameter name.'
						},
						type:
						{
							type: 'string',
							description: 'Type label (string, number, object, etc).'
						},
						required:
						{
							type: 'boolean',
							description: 'Show required badge.'
						},
						deprecated:
						{
							type: 'boolean',
							description: 'Show deprecated badge and strike name.'
						},
						since:
						{
							type: 'string',
							description: 'Version badge.'
						},
						default:
						{
							type: 'string|number|boolean',
							description: 'Default value display.'
						},
						description:
						{
							type: 'string',
							description: 'Parameter description.'
						},
						options:
						{
							type: 'array',
							description: 'Allowed enum values.'
						},
						children:
						{
							type: 'array',
							description: 'Nested child parameters.'
						}
					}
				}
			},
			tone:
			{
				type: 'string',
				value: 'rows',
				options: ['rows', 'compact', 'cards'],
				description: 'Layout style.'
			},
			background:
			{
				type: 'string',
				value: '',
				options: ['', 'bg-1', 'bg-2', 'bg-3'],
				description: 'Background depth.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Padding and typography scale.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['border', 'border-top', 'border-right', 'border-bottom', 'border-left'],
				description: 'Border modifiers.'
			}
		},
		render: function()
		{
			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.tone, 'size-' + this.size];

				if(this.background)
				{
					list.push(this.background);
				}

				this.variant.forEach(v => list.push(v));

				return list.join(' ');
			};

			/* ===== HELPERS ===== */

			this.escape = (value) =>
			{
				return elements.Fn('type.escape', value);
			};

			this.formatDefault = (value) =>
			{
				if(value === null || value === undefined || value === '')
				{
					return '';
				}

				if(typeof value === 'string')
				{
					return '&quot;' + this.escape(value) + '&quot;';
				}

				return String(value);
			};

			/* ===== RENDER ITEM ===== */

			this.renderItem = (item, depth) =>
			{
				const hasDefault = item.default !== undefined && item.default !== null && item.default !== '';
				const hasOptions = item.options && item.options.length > 0;
				const hasChildren = item.children && item.children.length > 0;

				/* Head */

				let head = '<div class="head">';
				head += '<span class="name">' + this.escape(item.name || '') + '</span>';

				if(item.type)
				{
					head += '<span class="type">' + this.escape(item.type) + '</span>';
				}

				if(item.required)
				{
					head += '<span class="badge required">required</span>';
				}

				if(item.deprecated)
				{
					head += '<span class="badge deprecated">deprecated</span>';
				}

				if(item.since)
				{
					head += '<span class="badge since">' + this.escape(item.since) + '</span>';
				}

				head += '</div>';

				/* Description */

				const description = item.description
					? '<div class="description">' + item.description + '</div>'
					: '';

				/* Default */

				const defaultRow = hasDefault
					? '<div class="meta"><span class="label">Default</span><code class="mono">' + this.formatDefault(item.default) + '</code></div>'
					: '';

				/* Options */

				const optionsRow = hasOptions
					? '<div class="meta"><span class="label">Options</span><span class="options">'
						+ item.options.map(o => '<code class="mono">' + this.escape(o) + '</code>').join('')
						+ '</span></div>'
					: '';

				/* Children */

				const children = hasChildren
					? '<div class="children">' + item.children.map(c => this.renderItem(c, depth + 1)).join('') + '</div>'
					: '';

				/* Param */

				return '<div class="param' + (item.deprecated ? ' deprecated' : '') + '" data-depth="' + depth + '">'
					+ head
					+ description
					+ defaultRow
					+ optionsRow
					+ children
					+ '</div>';
			};

			/* ===== RENDER ===== */

			this.Compute(() =>
			{
				this.html = this.items.map(item => this.renderItem(item, 0)).join('');
			});

			return /* html */ `
				<div :class="classes()">
					<div class="list" ot-html="html"></div>
				</div>
			`;
		}
	});
});

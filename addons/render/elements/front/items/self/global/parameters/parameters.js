onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-parameters',
		icon: 'list',
		name: 'Parameters',
		description: 'Rich parameter list with types, defaults, enums, nested properties and multiple styles.',
		category: 'Global',
		author: 'OneType',
		config: {
			items: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						name: { type: 'string' },
						type: { type: 'string' },
						required: { type: 'boolean' },
						deprecated: { type: 'boolean' },
						since: { type: 'string' },
						default: { type: 'string|number|boolean' },
						description: { type: 'string' },
						options: { type: 'array' },
						children: { type: 'array' }
					}
				}
			},
			variant: {
				type: 'array',
				value: ['rows', 'size-m'],
				options: ['rows', 'compact', 'cards', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'size-s', 'size-m', 'size-l']
			}
		},
		render: function()
		{
			const styles = ['rows', 'compact', 'cards'];
			const hasStyle = this.variant.some(v => styles.includes(v));

			if(!hasStyle)
			{
				this.variant = ['rows', ...this.variant];
			}

			this.formatDefault = (value) =>
			{
				if(value === null || value === undefined || value === '')
				{
					return '';
				}

				if(typeof value === 'string')
				{
					return '"' + value + '"';
				}

				return String(value);
			};

			this.renderItem = (item, depth) =>
			{
				const hasDefault = item.default !== undefined && item.default !== null && item.default !== '';
				const hasOptions = item.options && item.options.length > 0;
				const hasChildren = item.children && item.children.length > 0;
				const hasDescription = !!item.description;

				const typeBadge = item.type ? '<span class="type">' + item.type + '</span>' : '';
				const requiredBadge = item.required ? '<span class="badge required">required</span>' : '';
				const deprecatedBadge = item.deprecated ? '<span class="badge deprecated">deprecated</span>' : '';
				const sinceBadge = item.since ? '<span class="badge since">' + item.since + '</span>' : '';

				const head = '<div class="head">'
					+ '<span class="name">' + (item.name || '') + '</span>'
					+ typeBadge
					+ requiredBadge
					+ deprecatedBadge
					+ sinceBadge
					+ '</div>';

				const description = hasDescription
					? '<div class="description">' + item.description + '</div>'
					: '';

				const defaultRow = hasDefault
					? '<div class="meta"><span class="meta-label">Default</span><code class="mono">' + this.formatDefault(item.default) + '</code></div>'
					: '';

				const optionsRow = hasOptions
					? '<div class="meta"><span class="meta-label">Options</span><span class="options">'
						+ item.options.map(o => '<code class="mono">' + o + '</code>').join('')
					+ '</span></div>'
					: '';

				const childrenList = hasChildren
					? '<div class="children">' + item.children.map(c => this.renderItem(c, depth + 1)).join('') + '</div>'
					: '';

				return '<div class="param' + (item.deprecated ? ' is-deprecated' : '') + '" data-depth="' + depth + '">'
					+ head
					+ description
					+ defaultRow
					+ optionsRow
					+ childrenList
				+ '</div>';
			};

			this.html = this.items.map(item => this.renderItem(item, 0)).join('');

			return /* html */ `
				<div :class="'holder ' + variant.join(' ')">
					<div class="list" ot-html="html"></div>
				</div>
			`;
		}
	});
});

onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'cards-info',
		icon: 'info',
		name: 'Info Card',
		description: 'Flexible information card with header, status, rows, fields, stats, tags, notice and action slot.',
		category: 'Cards',
		author: 'OneType',
		config: {
			icon: {
				type: 'string'
			},
			title: {
				type: 'string'
			},
			description: {
				type: 'string'
			},
			badge: {
				type: 'string'
			},
			status: {
				type: 'object',
				config: {
					label: { type: 'string' },
					color: { type: 'string', options: ['brand', 'blue', 'red', 'orange', 'green'] }
				}
			},
			rows: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						label: { type: 'string' },
						value: { type: 'string|number' },
						icon: { type: 'string' },
						color: { type: 'string', options: ['brand', 'blue', 'red', 'orange', 'green'] }
					}
				}
			},
			fields: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						label: { type: 'string' },
						name: { type: 'string' },
						element: { type: 'string', value: 'form-input' },
						properties: { type: 'object', value: {} }
					}
				}
			},
			stats: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						value: { type: 'string|number' },
						label: { type: 'string' },
						icon: { type: 'string' },
						color: { type: 'string', options: ['brand', 'blue', 'red', 'orange', 'green'] }
					}
				}
			},
			tags: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						label: { type: 'string' },
						icon: { type: 'string' },
						color: { type: 'string', options: ['brand', 'blue', 'red', 'orange', 'green'] }
					}
				}
			},
			notice: {
				type: 'object',
				config: {
					icon: { type: 'string' },
					text: { type: 'string' },
					color: { type: 'string', options: ['brand', 'blue', 'red', 'orange', 'green'] }
				}
			},
			variant: {
				type: 'array',
				value: ['bg-1', 'border', 'size-m'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'compact', 'size-s', 'size-m', 'size-l']
			}
		},
		render: function()
		{
			this.hasHeader = !!this.title || !!this.icon || !!this.badge;
			this.hasStatus = this.status && this.status.label;
			this.hasRows = this.rows && this.rows.length > 0;
			this.hasFields = this.fields && this.fields.length > 0;
			this.hasStats = this.stats && this.stats.length > 0;
			this.hasTags = this.tags && this.tags.length > 0;
			this.hasNotice = this.notice && this.notice.text;
			this.hasActions = !!this.Slots.actions;
			this.hasDefault = !!this.Slots.default;

			this.fieldsHtml = this.fields.map(field =>
			{
				const element = field.element || 'form-input';
				const props = field.properties || {};
				const attrs = Object.entries(props).map(([key, value]) =>
				{
					if(typeof value === 'string')
					{
						return key + '="' + value + '"';
					}

					return ':' + key + '=\'' + JSON.stringify(value) + '\'';
				}).join(' ');

				return '<div class="field">'
					+ (field.label ? '<div class="field-label">' + field.label + '</div>' : '')
					+ '<e-' + element + ' name="' + (field.name || '') + '" ' + attrs + '></e-' + element + '>'
				+ '</div>';
			}).join('');

			return /* html */ `
				<div :class="'holder ' + variant.join(' ')">
					<div ot-if="hasHeader" class="header">
						<div ot-if="icon" class="icon"><i>{{ icon }}</i></div>
						<div class="text">
							<h4 ot-if="title" class="title">{{ title }}</h4>
							<p ot-if="description" class="description">{{ description }}</p>
						</div>
						<span ot-if="badge" class="badge">{{ badge }}</span>
					</div>

					<div ot-if="hasStatus" :class="'status color-' + (status.color || 'green')">
						<span class="status-dot"></span>
						<span class="status-label">{{ status.label }}</span>
					</div>

					<div ot-if="hasStats" class="stats">
						<div
							ot-for="stat in stats"
							:class="'stat' + (stat.color ? ' color-' + stat.color : '')"
						>
							<i ot-if="stat.icon" class="stat-icon">{{ stat.icon }}</i>
							<div class="stat-text">
								<span class="stat-value">{{ stat.value }}</span>
								<span class="stat-label">{{ stat.label }}</span>
							</div>
						</div>
					</div>

					<div ot-if="hasRows" class="rows">
						<div
							ot-for="row in rows"
							:class="'row' + (row.color ? ' color-' + row.color : '')"
						>
							<div class="row-label">
								<i ot-if="row.icon">{{ row.icon }}</i>
								<span>{{ row.label }}</span>
							</div>
							<span class="row-value">{{ row.value }}</span>
						</div>
					</div>

					<div ot-if="hasTags" class="tags">
						<span
							ot-for="tag in tags"
							:class="'tag' + (tag.color ? ' color-' + tag.color : '')"
						>
							<i ot-if="tag.icon">{{ tag.icon }}</i>
							<span>{{ tag.label }}</span>
						</span>
					</div>

					<div ot-if="hasFields" class="fields">
						<span ot-html="fieldsHtml"></span>
					</div>

					<div ot-if="hasNotice" :class="'notice color-' + (notice.color || 'blue')">
						<i ot-if="notice.icon">{{ notice.icon }}</i>
						<span>{{ notice.text }}</span>
					</div>

					<div ot-if="hasDefault" class="body">
						<slot></slot>
					</div>

					<div ot-if="hasActions" class="actions">
						<slot name="actions"></slot>
					</div>
				</div>
			`;
		}
	});
});

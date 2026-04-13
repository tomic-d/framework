onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'cards-info',
		icon: 'info',
		name: 'Info Card',
		description: 'Information card with header, status, rows, stats, tags, notice and action slots.',
		category: 'Cards',
		config:
		{
			icon:
			{
				type: 'string',
				value: '',
				description: 'Header icon name.'
			},
			title:
			{
				type: 'string',
				value: '',
				description: 'Card title.'
			},
			description:
			{
				type: 'string',
				value: '',
				description: 'Card description below title.'
			},
			badge:
			{
				type: 'string',
				value: '',
				description: 'Header badge label.'
			},
			status:
			{
				type: 'object',
				config:
				{
					label:
					{
						type: 'string',
						description: 'Status text.'
					},
					color:
					{
						type: 'string',
						options: ['brand', 'blue', 'red', 'orange', 'green'],
						description: 'Status color.'
					}
				},
				description: 'Animated status pill.'
			},
			rows:
			{
				type: 'array',
				value: [],
				each:
				{
					type: 'object',
					config:
					{
						label:
						{
							type: 'string',
							description: 'Row label.'
						},
						value:
						{
							type: 'string|number',
							description: 'Row value.'
						},
						icon:
						{
							type: 'string',
							description: 'Row icon.'
						},
						color:
						{
							type: 'string',
							options: ['brand', 'blue', 'red', 'orange', 'green'],
							description: 'Value accent color.'
						}
					}
				},
				description: 'Label-value rows with icons.'
			},
			stats:
			{
				type: 'array',
				value: [],
				each:
				{
					type: 'object',
					config:
					{
						value:
						{
							type: 'string|number',
							description: 'Stat value.'
						},
						label:
						{
							type: 'string',
							description: 'Stat label.'
						},
						icon:
						{
							type: 'string',
							description: 'Stat icon.'
						},
						color:
						{
							type: 'string',
							options: ['brand', 'blue', 'red', 'orange', 'green'],
							description: 'Icon box color.'
						}
					}
				},
				description: 'Auto-fit stat grid.'
			},
			tags:
			{
				type: 'array',
				value: [],
				each:
				{
					type: 'object',
					config:
					{
						label:
						{
							type: 'string',
							description: 'Tag label.'
						},
						icon:
						{
							type: 'string',
							description: 'Tag icon.'
						},
						color:
						{
							type: 'string',
							options: ['brand', 'blue', 'red', 'orange', 'green'],
							description: 'Tag color.'
						}
					}
				},
				description: 'Colored pill tags.'
			},
			notice:
			{
				type: 'object',
				config:
				{
					icon:
					{
						type: 'string',
						description: 'Notice icon.'
					},
					text:
					{
						type: 'string',
						description: 'Notice text.'
					},
					color:
					{
						type: 'string',
						options: ['brand', 'blue', 'red', 'orange', 'green'],
						description: 'Notice color.'
					}
				},
				description: 'Inline notice at bottom.'
			},
			background:
			{
				type: 'string',
				value: 'bg-1',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Background depth.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Card size.'
			},
			variant:
			{
				type: 'array',
				value: ['border'],
				each: { type: 'string' },
				options: ['border'],
				description: 'Visual modifiers.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.hasActions = !!this.Slots.actions;
			this.hasBody = !!this.Slots.default;

			this.Compute(() =>
			{
				this.hasHeader = !!this.title || !!this.icon || !!this.badge;
				this.hasStatus = this.status && this.status.label;
				this.hasStats = this.stats && this.stats.length > 0;
				this.hasRows = this.rows && this.rows.length > 0;
				this.hasTags = this.tags && this.tags.length > 0;
				this.hasNotice = this.notice && this.notice.text;

				this.rows = (this.rows || []).map(row =>
				{
					if(row.type)
					{
						return {
							...row,
							html: elements.Fn('type.render', row, row.item || {})
						};
					}

					return row;
				});
			});

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.background, 'size-' + this.size];

				this.variant.forEach(v => list.push(v));

				return list.join(' ');
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<div ot-if="hasHeader" class="header">
						<div ot-if="icon" class="icon"><i>{{ icon }}</i></div>
						<div class="text">
							<h4 ot-if="title" class="title">{{ title }}</h4>
							<p ot-if="description" class="description">{{ description }}</p>
						</div>
						<span ot-if="badge" class="badge">{{ badge }}</span>
					</div>

					<div ot-if="hasStatus" :class="'status color-' + (status.color || 'green')">
						<span class="dot"></span>
						<span class="label">{{ status.label }}</span>
					</div>

					<div ot-if="hasStats" class="stats">
						<div
							ot-for="stat in stats"
							:class="'stat' + (stat.color ? ' color-' + stat.color : '')"
						>
							<i ot-if="stat.icon" class="stat-icon">{{ stat.icon }}</i>
							<div class="stat-text">
								<span class="value">{{ stat.value }}</span>
								<span class="label">{{ stat.label }}</span>
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
							<span ot-if="row.html" class="row-value" ot-html="row.html"></span>
							<span ot-if="!row.html" class="row-value">{{ row.value }}</span>
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

					<div ot-if="hasNotice" :class="'notice color-' + (notice.color || 'blue')">
						<i ot-if="notice.icon">{{ notice.icon }}</i>
						<span>{{ notice.text }}</span>
					</div>

					<div ot-if="hasBody" class="body">
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

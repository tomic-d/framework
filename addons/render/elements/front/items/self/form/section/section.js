onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-section',
		icon: 'view_agenda',
		name: 'Section',
		description: 'Form section with eyebrow, icon, title, description, collapsible state and actions slot.',
		category: 'Form',
		config:
		{
			eyebrow:
			{
				type: 'string',
				value: '',
				description: 'Uppercase label above title.'
			},
			icon:
			{
				type: 'string',
				value: '',
				description: 'Leading icon in brand-tinted box.'
			},
			title:
			{
				type: 'string',
				value: '',
				description: 'Section title.'
			},
			description:
			{
				type: 'string',
				value: '',
				description: 'Helper text below title.'
			},
			collapsible:
			{
				type: 'boolean',
				value: false,
				description: 'Enable expand/collapse toggle.'
			},
			collapsed:
			{
				type: 'boolean',
				value: false,
				description: 'Start collapsed.'
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
				description: 'Section size.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['border', 'clean', 'padded'],
				description: 'Visual modifiers.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.Compute(() =>
			{
				this.hasHeader = !!this.title || !!this.description || !!this.eyebrow || !!this.icon || !!this.Slots.actions;
				this.hasActions = !!this.Slots.actions;
				this.isCollapsible = !!this.collapsible && !!this.title;
			});

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', 'size-' + this.size];

				if(this.background)
				{
					list.push(this.background);
				}

				if(this.variant.includes('border'))
				{
					list.push('border');
				}

				if(this.variant.includes('clean'))
				{
					list.push('clean');
				}

				if(this.variant.includes('padded'))
				{
					list.push('padded');
				}

				if(this.isCollapsible)
				{
					list.push('collapsible');
				}

				if(this.collapsed)
				{
					list.push('collapsed');
				}

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.toggle = () =>
			{
				if(!this.isCollapsible)
				{
					return;
				}

				this.collapsed = !this.collapsed;
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<section :class="classes()">
					<header ot-if="hasHeader" class="head">
						<div class="head-main" ot-click="toggle">
							<div ot-if="icon" class="icon"><i>{{ icon }}</i></div>
							<div class="text">
								<div ot-if="eyebrow" class="eyebrow">{{ eyebrow }}</div>
								<h3 ot-if="title" class="title">{{ title }}</h3>
								<p ot-if="description" class="description">{{ description }}</p>
							</div>
							<i ot-if="isCollapsible" class="chevron">expand_more</i>
						</div>
						<div ot-if="hasActions" class="actions">
							<slot name="actions"></slot>
						</div>
					</header>
					<div ot-if="!collapsed" class="content">
						<slot name="content"></slot>
					</div>
				</section>
			`;
		}
	});
});

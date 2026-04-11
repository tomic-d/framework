onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-section',
		icon: 'view_agenda',
		name: 'Form Section',
		description: 'Form section with eyebrow, icon, title, description, collapsible state and actions slot.',
		category: 'Form',
		author: 'OneType',
		config: {
			eyebrow: {
				type: 'string'
			},
			icon: {
				type: 'string'
			},
			title: {
				type: 'string'
			},
			description: {
				type: 'string'
			},
			collapsible: {
				type: 'boolean'
			},
			collapsed: {
				type: 'boolean'
			},
			variant: {
				type: 'array',
				value: ['size-m'],
				options: [
					'bg-1', 'bg-2', 'bg-3', 'bg-4',
					'border',
					'clean',
					'size-s', 'size-m', 'size-l'
				]
			}
		},
		render: function()
		{
			this.hasHeader = !!this.title || !!this.description || !!this.eyebrow || !!this.icon || !!this.Slots.actions;
			this.hasActions = !!this.Slots.actions;
			this.isCollapsible = !!this.collapsible && !!this.title;

			this.toggle = () =>
			{
				if(!this.isCollapsible)
				{
					return;
				}

				this.collapsed = !this.collapsed;
			};

			return /* html */ `
				<section :class="'holder ' + variant.join(' ') + (collapsed ? ' collapsed' : '') + (isCollapsible ? ' collapsible' : '')">
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

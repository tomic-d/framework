onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-markdown',
		icon: 'article',
		name: 'Markdown',
		description: 'Markdown renderer with premium typography and collapsible read more.',
		category: 'Global',
		config:
		{
			content:
			{
				type: 'string',
				value: '',
				description: 'Markdown string to render.'
			},
			collapsible:
			{
				type: 'boolean',
				value: false,
				description: 'Enable read more toggle.'
			},
			maxHeight:
			{
				type: 'number',
				value: 200,
				description: 'Collapsed max height in pixels.'
			},
			expanded:
			{
				type: 'boolean',
				value: false,
				description: 'Start expanded when collapsible.'
			},
			background:
			{
				type: 'string',
				value: '',
				options: ['', 'bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Background depth with padding.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['border'],
				description: 'Visual modifiers.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.Compute(() =>
			{
				this.html = this.content ? onetype.Markdown(this.content) : '';
			});

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box'];

				if(this.background)
				{
					list.push(this.background);
				}

				if(this.variant.includes('border'))
				{
					list.push('border');
				}

				if(this.collapsible)
				{
					list.push('collapsible');
				}

				if(this.expanded)
				{
					list.push('expanded');
				}

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.toggle = () =>
			{
				this.expanded = !this.expanded;
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<article :class="classes()">
					<div
						class="body"
						:style="collapsible && !expanded ? 'max-height: ' + maxHeight + 'px' : ''"
					>
						<div class="prose"><span ot-html="html"></span></div>
					</div>
					<div ot-if="collapsible && !expanded" class="fade"></div>
					<button ot-if="collapsible" type="button" class="toggle" ot-click="toggle">
						<i>{{ expanded ? 'expand_less' : 'expand_more' }}</i>
						<span>{{ expanded ? 'Show less' : 'Read more' }}</span>
					</button>
				</article>
			`;
		}
	});
});

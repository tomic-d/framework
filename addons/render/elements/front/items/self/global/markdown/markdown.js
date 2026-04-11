onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-markdown',
		icon: 'article',
		name: 'Markdown',
		description: 'Markdown renderer with premium typography and optional collapsible read more.',
		category: 'Global',
		author: 'OneType',
		config: {
			content: {
				type: 'string'
			},
			collapsible: {
				type: 'boolean'
			},
			maxHeight: {
				type: 'number',
				value: 200
			},
			expanded: {
				type: 'boolean'
			},
			variant: {
				type: 'array',
				value: [],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'size-s', 'size-m', 'size-l']
			}
		},
		render: function()
		{
			this.html = this.content ? onetype.Markdown(this.content) : '';

			this.toggle = () =>
			{
				this.expanded = !this.expanded;
			};

			return /* html */ `
				<article :class="'holder ' + variant.join(' ') + (collapsible ? ' collapsible' : '') + (expanded ? ' expanded' : '')">
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

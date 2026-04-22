onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-markdown',
		icon: 'article',
		name: 'Markdown',
		description: 'Markdown renderer with premium typography, code blocks via global-code, collapsible read more.',
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
			},
			codeBackground:
			{
				type: 'string',
				value: 'bg-2',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Background for code blocks.'
			},
			codeSize:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Size for code blocks.'
			},
			codeLines:
			{
				type: 'boolean',
				value: true,
				description: 'Show line numbers in code blocks.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.Compute(() =>
			{
				const parts = (this.content || '').split(/```(\w*)\n([\s\S]*?)```/g);

				this.segments = [];

				for(let i = 0; i < parts.length; i += 3)
				{
					const text = parts[i];
					const language = parts[i + 1];
					const source = parts[i + 2];

					if(text && text.trim())
					{
						this.segments.push({ type: 'html', content: onetype.Markdown(text) });
					}

					if(source !== undefined)
					{
						this.segments.push({ type: 'code', language: language || 'text', source: source.replace(/^\n+|\n+$/g, '') });
					}
				}
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
						<div class="prose">
							<div ot-for="segment in segments" class="segment">
								<div ot-if="segment.type === 'html'" ot-html="segment.content"></div>
								<e-global-code
									ot-if="segment.type === 'code'"
									:source="segment.source"
									:language="segment.language"
									:lines="codeLines"
									:background="codeBackground"
									:size="codeSize"
								></e-global-code>
							</div>
						</div>
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

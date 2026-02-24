onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'sections-hero',
		icon: 'star',
		name: 'Hero',
		description: 'Hero section with badge, heading, description, and CTA buttons.',
		category: 'Component',
		author: 'OneType',
		config: {
			badge: {
				type: 'string',
				value: 'Interactive HTML Components'
			},
			title: {
				type: 'string',
				value: 'One tag.'
			},
			highlight: {
				type: 'string',
				value: 'Zero config.'
			},
			description: {
				type: 'string',
				value: 'Drop a custom HTML tag, get an interactive component. Swiper, tabs, accordion, modal — works on any platform. No build tools, no JavaScript required.'
			},
			buttons: {
				type: 'array',
				value: [
					{ text: 'Get Started', icon: 'arrow_forward', href: '#get-started', variant: 'brand' },
					{ text: 'View on GitHub', icon: 'code', href: 'https://github.com/nicely-gg/transforms', variant: 'ghost border' }
				]
			}
		},
		render: function()
		{
			return `
				<div class="holder">
					<div ot-if="badge" class="badge"><i>widgets</i> {{ badge }}</div>
					<h1 class="title">{{ title }}<br><span class="highlight">{{ highlight }}</span></h1>
					<p ot-if="description" class="description">{{ description }}</p>
					<div ot-if="buttons.length" class="buttons">
						<e-button ot-for="btn in buttons" :text="btn.text" :icon="btn.icon" :href="btn.href" :variant="[btn.variant, 'size-m']"></e-button>
					</div>
					<div class="trust">
						<span class="trust-item"><i>check_circle</i> Works everywhere</span>
						<span class="trust-item"><i>check_circle</i> Zero dependencies</span>
						<span class="trust-item"><i>check_circle</i> Free tier available</span>
					</div>
				</div>
			`;
		}
	});
});

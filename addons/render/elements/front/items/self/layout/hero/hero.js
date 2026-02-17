import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'hero',
	icon: 'web',
	name: 'Hero',
	description: 'Hero section with headline, subtext, CTAs, and trust indicators for landing pages.',
	category: 'Layout',
	author: 'Divhunt',
	config: {
		badge: {
			type: 'string',
			value: 'New Release'
		},
		title: {
			type: 'string',
			value: 'Build faster with'
		},
		highlight: {
			type: 'string',
			value: 'Divhunt'
		},
		description: {
			type: 'string',
			value: 'The all-in-one platform for building modern web applications. Ship products faster with our intuitive tools and components.'
		},
		buttons: {
			type: 'array',
			value: [
				{ text: 'Get Started', variant: ['brand', 'size-m'] },
				{ text: 'Learn More', variant: ['border', 'size-m'] }
			],
			each: {
				type: 'object',
				config: {
					text: { type: 'string', value: 'Button' },
					href: { type: 'string', value: '' },
					variant: { type: 'array', value: ['brand', 'size-m'] }
				}
			}
		},
		stats: {
			type: 'array',
			value: [
				{ value: '10K+', label: 'Active Users', icon: 'group' },
				{ value: '99.9%', label: 'Uptime', icon: 'check_circle' },
				{ value: '24/7', label: 'Support', icon: 'support_agent' }
			],
			each: {
				type: 'object',
				config: {
					value: { type: 'string', value: '100' },
					label: { type: 'string', value: 'Label' },
					icon: { type: 'string', value: '' }
				}
			}
		},
		variant: {
			type: 'array',
			value: ['center', 'size-m'],
			options: ['left', 'center', 'right', 'size-s', 'size-m', 'size-l', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'border']
		}
	},
	render: function()
	{
		return `
			<div class="holder" :variant="variant.join(' ')">
				<slot name="top"></slot>
				<div class="content">
					<e-tag dh-if="badge" :text="badge" :variant="['border', 'size-s']"></e-tag>
					<h1>{{ title }}<span dh-if="highlight">{{ highlight }}</span></h1>
					<p dh-if="description">{{ description }}</p>
					<div dh-if="buttons.length" class="actions">
						<e-button dh-for="button in buttons" :text="button.text" :href="button.href" :variant="button.variant"></e-button>
					</div>
					<div dh-if="stats.length" class="stats">
						<div dh-for="stat in stats" class="stat">
							<i dh-if="stat.icon">{{ stat.icon }}</i>
							<strong>{{ stat.value }}</strong>
							<span>{{ stat.label }}</span>
						</div>
					</div>
				</div>
				<slot name="bottom"></slot>
			</div>
		`;
	}
});

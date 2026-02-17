import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'footer',
	icon: 'view_agenda',
	name: 'Footer',
	description: 'Rich footer with brand info, multiple link columns, newsletter signup, social links, legal text, and payment badges. Enterprise-grade responsive layout.',
	category: 'Navigation',
	author: 'Divhunt',
	config: {
		logo: {
			type: 'string',
			value: 'Divhunt'
		},
		tagline: {
			type: 'string',
			value: 'Build websites and applications faster with our powerful platform.'
		},
		email: {
			type: 'string',
			value: 'support@divhunt.com'
		},
		phone: {
			type: 'string',
			value: '+1 (555) 123-4567'
		},
		address: {
			type: 'string',
			value: '123 Tech Street, San Francisco, CA 94105'
		},
		copyright: {
			type: 'string',
			value: '© 2026 Divhunt. All rights reserved.'
		},
		variant: {
			type: 'array',
			value: ['bg-2', 'border', 'size-s'],
			options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'brand', 'size-s', 'size-m', 'size-l']
		},
		container: {
			type: 'string',
			value: 'm',
			options: ['none', 's', 'm', 'l', 'full']
		}
	},
	render: function()
	{
		this.columns = footer.Fn('columns');
		this.socials = footer.Fn('get', { type: 'social' });
		this.badges = footer.Fn('get', { type: 'badge' });

		const update = () =>
		{
			this.columns = footer.Fn('columns');
			this.socials = footer.Fn('get', { type: 'social' });
			this.badges = footer.Fn('get', { type: 'badge' });
		};

		footer.ItemOn('added', update, 'footer');
		footer.ItemOn('removed', update, 'footer');
		footer.ItemOn('modified', update, 'footer');

		this.containerClass = () =>
		{
			if (this.container === 'none')
			{
				return '';
			}

			return `dh-container-${this.container}`;
		};

		return `
			<footer class="holder" :variant="variant.join(' ')">
				<slot name="top"></slot>

				<div :class="containerClass()">
					<div class="main">
						<div class="brand">
							<h3>{{ logo }}</h3>
							<p class="tagline">{{ tagline }}</p>
							<div class="contact">
								<a dh-if="email" :href="'mailto:' + email" class="item">
									<i>mail</i>
									<span>{{ email }}</span>
								</a>
								<a dh-if="phone" :href="'tel:' + phone" class="item">
									<i>phone</i>
									<span>{{ phone }}</span>
								</a>
								<div dh-if="address" class="item">
									<i>location_on</i>
									<span>{{ address }}</span>
								</div>
							</div>
						</div>

						<div class="columns">
							<div dh-for="column in columns" class="column">
								<h6>{{ column.label }}</h6>
								<a dh-for="link in column.links" :href="link.href">
									{{ link.label }}
								</a>
							</div>
						</div>

						<slot name="newsletter"></slot>
					</div>

					<div class="divider"></div>

					<div class="bottom">
						<div class="left">
							<span class="copyright">{{ copyright }}</span>
							<div dh-if="badges.length > 0" class="badges">
								<div dh-for="badge in badges" class="badge">
									<i>{{ badge.icon }}</i>
									<span>{{ badge.label }}</span>
								</div>
							</div>
						</div>

						<div dh-if="socials.length > 0" class="socials">
							<a dh-for="social in socials"
							   :href="social.href"
							   :title="social.label"
							   target="_blank"
							   rel="noopener">
								<i>{{ social.icon }}</i>
							</a>
						</div>
					</div>
				</div>

				<slot name="bottom"></slot>
			</footer>
		`;
	}
});

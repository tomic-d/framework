onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'sections-footer',
		icon: 'dock_to_bottom',
		name: 'Footer',
		description: 'Site footer with logo, link columns, integrations, trust badges, and copyright.',
		category: 'Section',
		author: 'OneType',
		config: {
			columns: {
				type: 'array',
				value: [
					{
						title: 'Product',
						links: [
							{ label: 'Transforms', href: '/#transforms' },
							{ label: 'Features', href: '/#features' },
							{ label: 'Pricing', href: '/pricing' },
							{ label: 'Changelog', href: '/changelog' }
						]
					},
					{
						title: 'Resources',
						links: [
							{ label: 'Documentation', href: 'https://docs.onetype.ai/transforms' },
							{ label: 'GitHub', href: 'https://github.com/nicely-gg/transforms' },
							{ label: 'npm', href: 'https://www.npmjs.com/package/@nicely-gg/transforms' },
							{ label: 'Contact', href: 'https://onetype.ai/contact' }
						]
					},
					{
						title: 'Legal',
						links: [
							{ label: 'Terms of Service', href: 'https://onetype.ai/legal/terms' },
							{ label: 'Privacy Policy', href: 'https://onetype.ai/legal/privacy' },
							{ label: 'Cookie Policy', href: 'https://onetype.ai/legal/cookies' },
							{ label: 'Developer Agreement', href: 'https://onetype.ai/legal/developer' },
							{ label: 'Data Processing', href: 'https://onetype.ai/legal/dpa' },
							{ label: 'Acceptable Use', href: 'https://onetype.ai/legal/aup' },
							{ label: 'Subprocessors', href: 'https://onetype.ai/legal/subprocessors' }
						]
					}
				]
			},
			platforms: {
				type: 'array',
				value: [
					{ icon: 'language', label: 'Any HTML' },
					{ icon: 'web', label: 'Webflow' },
					{ icon: 'design_services', label: 'Framer' },
					{ icon: 'article', label: 'WordPress' },
					{ icon: 'shopping_cart', label: 'Shopify' },
					{ icon: 'storefront', label: 'Squarespace' }
				]
			},
			badges: {
				type: 'array',
				value: [
					{ icon: 'code_off', label: 'Zero Dependencies' },
					{ icon: 'speed', label: 'Lazy Loaded' },
					{ icon: 'devices', label: 'All Platforms' },
					{ icon: 'open_in_new', label: 'Open Source Core' },
					{ icon: 'verified', label: 'Web Components' }
				]
			}
		},
		render: function()
		{
			this.year = new Date().getFullYear();

			return `
				<footer class="holder">
					<div class="inner">
						<div class="brand">
							<a class="logo" href="/">
								<img class="logo-icon" src="https://global.divhunt.com/bd8ffd2fc9cf3a7e81b3326ac63a7cfe_4406.svg" alt="OneType" />
							</a>
							<p class="tagline">Custom HTML tags that become interactive components. One script, one tag — works on any platform.</p>
							<div class="integrations">
								<div class="integrations-list">
									<div ot-for="item in platforms" class="integration">
										<i>{{ item.icon }}</i>
										<span>{{ item.label }}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="columns">
							<div ot-for="col in columns" class="column">
								<h4 class="column-title">{{ col.title }}</h4>
								<a ot-for="link in col.links" class="link" :href="link.href">{{ link.label }}</a>
							</div>
						</div>
					</div>
					<div class="badges">
						<div ot-for="badge in badges" class="badge">
							<i>{{ badge.icon }}</i>
							<span>{{ badge.label }}</span>
						</div>
					</div>
					<div class="bottom">
						<span class="copyright">&copy; {{ year }} OneType. All rights reserved.</span>
					</div>
				</footer>
			`;
		}
	});
});

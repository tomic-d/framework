onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-button',
		icon: 'smart_button',
		name: 'Button',
		description: 'Premium button with icons, loading state, full variant and color system.',
		category: 'Form',
		author: 'OneType',
		config: {
			text: {
				type: 'string',
				value: 'Button'
			},
			icon: {
				type: 'string'
			},
			iconRight: {
				type: 'string'
			},
			href: {
				type: 'string'
			},
			target: {
				type: 'string',
				options: ['_blank', '_self', '_parent', '_top']
			},
			type: {
				type: 'string',
				value: 'button',
				options: ['button', 'submit', 'reset']
			},
			disabled: {
				type: 'boolean'
			},
			loading: {
				type: 'boolean'
			},
			variant: {
				type: 'array',
				value: ['brand', 'size-m'],
				options: [
					'brand', 'blue', 'red', 'orange', 'green', 'dark',
					'soft-brand', 'soft-blue', 'soft-red', 'soft-orange', 'soft-green',
					'outline-brand', 'outline-blue', 'outline-red', 'outline-orange', 'outline-green',
					'bg-1', 'bg-2', 'bg-3', 'bg-4',
					'ghost', 'glass', 'border', 'transparent', 'link',
					'size-s', 'size-m', 'size-l',
					'full', 'icon-only', 'rounded'
				]
			},
			_click: {
				type: 'function'
			}
		},
		render: function()
		{
			this.isIconOnly = this.variant.includes('icon-only');
			this.hasText = !!this.text && !this.isIconOnly;

			this.handle = (event) =>
			{
				if(this.disabled || this.loading)
				{
					return;
				}

				if(this._click)
				{
					this._click({ event });
				}
			};

			const content = /* html */ `
				<span ot-if="loading" class="spinner"><i>progress_activity</i></span>
				<span ot-if="!loading" class="content">
					<i ot-if="icon" class="left">{{ icon }}</i>
					<span ot-if="hasText" class="text">{{ text }}</span>
					<i ot-if="iconRight" class="right">{{ iconRight }}</i>
				</span>
			`;

			if(this.href)
			{
				return /* html */ `
					<a
						:class="'holder ' + variant.join(' ') + (disabled ? ' disabled' : '') + (loading ? ' loading' : '')"
						:href="href"
						:target="target"
						ot-click="handle"
					>
						${content}
					</a>
				`;
			}

			return /* html */ `
				<button
					:class="'holder ' + variant.join(' ') + (disabled ? ' disabled' : '') + (loading ? ' loading' : '')"
					:type="type"
					:disabled="disabled"
					ot-click="handle"
				>
					${content}
				</button>
			`;
		}
	});
});

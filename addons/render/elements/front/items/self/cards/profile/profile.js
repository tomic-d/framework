import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'card-profile',
	icon: 'person',
	name: 'Card Profile',
	description: 'Profile card with avatar, name, role, status indicator, stats, and badge.',
	category: 'Cards',
	author: 'Divhunt',
	config: {
		avatar: {
			type: 'string',
			value: ''
		},
		name: {
			type: 'string',
			value: 'Sarah Johnson'
		},
		role: {
			type: 'string',
			value: 'Senior Product Designer'
		},
		badge: {
			type: 'string',
			value: 'Pro'
		},
		status: {
			type: 'string',
			value: 'online',
			options: ['', 'online', 'offline', 'away', 'busy']
		},
		stats: {
			type: 'array',
			value: [
				{ label: 'Projects', value: '48' },
				{ label: 'Followers', value: '2.4k' },
				{ label: 'Following', value: '186' }
			],
			each: {
				type: 'object',
				config: {
					label: { type: 'string', value: '' },
					value: { type: 'string', value: '' }
				}
			}
		},
		variant: {
			type: 'array',
			value: ['bg-2', 'border', 'size-m'],
			options: ['border', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'brand', 'blue', 'red', 'orange', 'green', 'size-s', 'size-m', 'size-l', 'horizontal']
		},
		onClick: {
			type: 'function'
		}
	},
	render: function()
	{
		this.handleClick = () =>
		{
			if (this.onClick)
			{
				this.onClick();
			}
		};

		this.getInitials = () =>
		{
			if (!this.name) return '';
			return this.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
		};

		return `
			<div class="holder" :variant="variant.join(' ')" dh-click="handleClick">
				<div class="header">
					<div class="avatar" :status="status">
						<img dh-if="avatar" :src="avatar" :alt="name">
						<span dh-if="!avatar && name">{{ getInitials() }}</span>
					</div>
					<e-tag dh-if="badge" :text="badge" :variant="['brand', 'size-s']"></e-tag>
				</div>
				<div class="content">
					<strong>{{ name }}</strong>
					<span dh-if="role">{{ role }}</span>
				</div>
				<div dh-if="stats.length" class="stats">
					<div dh-for="stat in stats" class="stat">
						<strong>{{ stat.value }}</strong>
						<span>{{ stat.label }}</span>
					</div>
				</div>
				<slot name="actions"></slot>
			</div>
		`;
	}
});

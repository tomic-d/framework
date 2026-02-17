import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'card-media',
	icon: 'image',
	name: 'Card Media',
	description: 'Media card with image, title, description, tags, and author metadata.',
	category: 'Cards',
	author: 'Divhunt',
	config: {
		src: {
			type: 'string',
			value: 'https://placehold.co/600x400'
		},
		alt: {
			type: 'string',
			value: 'Featured Image'
		},
		ratio: {
			type: 'string',
			value: '16/9',
			options: ['1/1', '4/3', '16/9', '21/9']
		},
		badge: {
			type: 'string',
			value: 'Featured'
		},
		title: {
			type: 'string',
			value: 'Getting Started with Modern Web Development'
		},
		description: {
			type: 'string',
			value: 'Learn the fundamentals of building fast, responsive web applications using the latest tools and techniques.'
		},
		tags: {
			type: 'array',
			value: ['Development', 'Tutorial', 'Web'],
			each: {
				type: 'string'
			}
		},
		author: {
			type: 'object',
			value: {
				name: 'Jane Smith',
				avatar: ''
			},
			config: {
				name: { type: 'string', value: '' },
				avatar: { type: 'string', value: '' }
			}
		},
		date: {
			type: 'string',
			value: 'Jan 15, 2026'
		},
		readTime: {
			type: 'string',
			value: '5 min read'
		},
		variant: {
			type: 'array',
			value: ['bg-2', 'border', 'size-m'],
			options: ['border', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'brand', 'blue', 'red', 'orange', 'green', 'size-s', 'size-m', 'size-l']
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
			if (!this.author?.name) return '';
			return this.author.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
		};

		return `
			<div class="holder" :variant="variant.join(' ')" dh-click="handleClick">
				<div dh-if="src" class="media" :style="'aspect-ratio: ' + ratio">
					<img :src="src" :alt="alt">
					<e-tag dh-if="badge" :text="badge" :variant="['bg-2', 'size-s']"></e-tag>
					<slot name="overlay"></slot>
				</div>
				<div class="content">
					<div dh-if="tags.length" class="tags">
						<e-tag dh-for="tag in tags" :text="tag" :variant="['transparent', 'size-s']"></e-tag>
					</div>
					<h3 dh-if="title">{{ title }}</h3>
					<p dh-if="description">{{ description }}</p>
				</div>
				<div dh-if="author?.name || date || readTime" class="meta">
					<div dh-if="author?.name" class="author">
						<div class="avatar">
							<img dh-if="author.avatar" :src="author.avatar" :alt="author.name">
							<span dh-if="!author.avatar">{{ getInitials() }}</span>
						</div>
						<span>{{ author.name }}</span>
					</div>
					<span dh-if="date">{{ date }}</span>
					<span dh-if="readTime">{{ readTime }}</span>
				</div>
				<slot name="footer"></slot>
			</div>
		`;
	}
});

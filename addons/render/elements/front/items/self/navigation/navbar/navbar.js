onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'navigation-navbar',
		icon: 'menu',
		name: 'Navbar',
		description: 'Top navigation bar with links, dropdowns, user menu, breadcrumbs, scroll behaviors and mobile drawer.',
		category: 'Navigation',
		config:
		{
			logo:
			{
				type: 'string',
				value: '',
				description: 'Logo image URL.'
			},
			logoAlt:
			{
				type: 'string',
				value: 'Logo',
				description: 'Logo alt text.'
			},
			brandHref:
			{
				type: 'string',
				value: '/',
				description: 'Logo click destination.'
			},
			items:
			{
				type: 'array',
				value: [],
				description: 'Nav links.',
				each:
				{
					type: 'object',
					config:
					{
						id: { type: 'string' },
						icon: { type: 'string' },
						label: { type: 'string' },
						description: { type: 'string' },
						href: { type: 'string' },
						target: { type: 'string' },
						position: { type: 'string', value: 'left', options: ['left', 'right'] },
						match: { type: 'string|array' },
						badge: { type: 'string|number' },
						disabled: { type: 'boolean' },
						children: { type: 'array', value: [] }
					}
				}
			},
			crumbs:
			{
				type: 'array',
				value: [],
				description: 'Breadcrumb trail. Replaces logo.',
				each:
				{
					type: 'object',
					config:
					{
						icon: { type: 'string' },
						label: { type: 'string' },
						href: { type: 'string' }
					}
				}
			},
			user:
			{
				type: 'object',
				value: null,
				description: 'User object for avatar trigger.',
				config:
				{
					name: { type: 'string' },
					email: { type: 'string' },
					avatar: { type: 'string' },
					role: { type: 'string' }
				}
			},
			userMenu:
			{
				type: 'array',
				value: [],
				description: 'Dropdown items for user menu.',
				each:
				{
					type: 'object',
					config:
					{
						icon: { type: 'string' },
						label: { type: 'string' },
						href: { type: 'string' },
						separator: { type: 'boolean' }
					}
				}
			},
			notifications:
			{
				type: 'number',
				value: 0,
				description: 'Unread notification count.'
			},
			notificationsHref:
			{
				type: 'string',
				value: '',
				description: 'Notifications link.'
			},
			sticky:
			{
				type: 'boolean',
				value: true,
				description: 'Stick to top on scroll.'
			},
			scrollHide:
			{
				type: 'boolean',
				value: false,
				description: 'Hide on scroll down, show on scroll up.'
			},
			shrinkOnScroll:
			{
				type: 'boolean',
				value: true,
				description: 'Reduce bar height after scroll.'
			},
			blur:
			{
				type: 'boolean',
				value: false,
				description: 'Glassmorphism backdrop blur.'
			},
			background:
			{
				type: 'string',
				value: 'bg-1',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Background depth.'
			},
			variant:
			{
				type: 'array',
				value: ['border'],
				each: { type: 'string' },
				options: ['border', 'clean'],
				description: 'Visual modifiers.'
			},
			_search:
			{
				type: 'function',
				description: 'Search callback. Receives query string.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			const path = onetype.RouteCurrent();

			const isActive = (item) =>
			{
				if(!item.href && !item.match)
				{
					return false;
				}

				if(item.match)
				{
					const patterns = Array.isArray(item.match) ? item.match : [item.match];
					return patterns.some(pattern => onetype.RouteMatch(pattern, path).match);
				}

				if(item.href === '/')
				{
					return path === '/';
				}

				return path.startsWith(item.href);
			};

			const annotate = (item) => ({
				...item,
				active: isActive(item),
				hasChildren: item.children && item.children.length > 0
			});

			this.left = this.items.filter(item => (item.position || 'left') === 'left').map(annotate);
			this.right = this.items.filter(item => item.position === 'right').map(annotate);
			this.all = [...this.left, ...this.right];

			this.hasBanner = !!this.Slots.banner;
			this.hasActions = !!this.Slots.actions;
			this.hasLogo = !!this.logo;
			this.hasCrumbs = this.crumbs && this.crumbs.length > 0;
			this.hasUser = !!this.user;
			this.hasNotifications = !!this.notificationsHref || this.notifications > 0;
			this.hasUserMenu = this.hasUser && this.userMenu && this.userMenu.length > 0;

			this.open = false;
			this.hidden = false;
			this.shrunk = false;

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.background];

				if(this.variant.includes('border'))
				{
					list.push('border');
				}

				if(this.variant.includes('clean'))
				{
					list.push('clean');
				}

				if(this.sticky)
				{
					list.push('sticky');
				}

				if(this.blur)
				{
					list.push('blur');
				}

				if(this.hidden)
				{
					list.push('hidden');
				}

				if(this.shrunk)
				{
					list.push('shrunk');
				}

				if(this.open)
				{
					list.push('open');
				}

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.toggleMobile = () =>
			{
				this.open = !this.open;
			};

			this.closeMobile = () =>
			{
				this.open = false;
			};

			this.openDropdown = (event, item) =>
			{
				if(!item.hasChildren)
				{
					return;
				}

				const target = event.currentTarget;
				const children = item.children;

				$ot.popup(target, function()
				{
					this.children = children;

					this.go = (href) =>
					{
						if(href)
						{
							$ot.page(href);
							$ot.close();
						}
					};

					return /* html */ `
						<div class="navbar-dropdown">
							<a
								ot-for="child in children"
								:href="child.href || 'javascript:void(0)'"
								:target="child.target || null"
								class="dropdown-item"
								ot-click="() => go(child.href)"
							>
								<div ot-if="child.icon" class="dropdown-icon">
									<i>{{ child.icon }}</i>
								</div>
								<div class="dropdown-text">
									<span class="dropdown-label">{{ child.label }}</span>
									<span ot-if="child.description" class="dropdown-description">{{ child.description }}</span>
								</div>
							</a>
						</div>
					`;
				}, {
					id: 'navbar-dropdown-' + (item.id || item.label),
					position: { x: 'center', y: 'bottom' },
					offset: { x: 0, y: 8 }
				});
			};

			this.openUserMenu = (event) =>
			{
				if(!this.hasUserMenu)
				{
					return;
				}

				const target = event.currentTarget;
				const user = this.user;
				const menu = this.userMenu;

				$ot.popup(target, function()
				{
					this.user = user;
					this.menu = menu;

					this.go = (href) =>
					{
						if(href)
						{
							$ot.page(href);
							$ot.close();
						}
					};

					return /* html */ `
						<div class="navbar-user-menu">
							<div class="user-head">
								<div ot-if="user.avatar" class="user-avatar">
									<img :src="user.avatar" :alt="user.name || ''" />
								</div>
								<div ot-if="!user.avatar" class="user-avatar user-avatar-fallback">
									<i>person</i>
								</div>
								<div class="user-text">
									<span ot-if="user.name" class="user-name">{{ user.name }}</span>
									<span ot-if="user.email" class="user-email">{{ user.email }}</span>
								</div>
							</div>
							<div class="user-menu-list">
								<div ot-for="entry in menu">
									<div ot-if="entry.separator" class="user-menu-separator"></div>
									<a
										ot-if="!entry.separator"
										:href="entry.href || 'javascript:void(0)'"
										class="user-menu-item"
										ot-click="() => go(entry.href)"
									>
										<i ot-if="entry.icon">{{ entry.icon }}</i>
										<span>{{ entry.label }}</span>
									</a>
								</div>
							</div>
						</div>
					`;
				}, {
					id: 'navbar-user-menu',
					position: { x: 'right-in', y: 'bottom' },
					offset: { x: 0, y: 8 }
				});
			};

			/* ===== LIFECYCLE ===== */

			this.OnReady(() =>
			{
				if(!this.scrollHide && !this.shrinkOnScroll)
				{
					return;
				}

				let lastY = window.scrollY;
				const threshold = 8;
				const shrinkAt = 20;

				this.onScroll = () =>
				{
					const y = window.scrollY;

					if(this.shrinkOnScroll)
					{
						this.shrunk = y > shrinkAt;
					}

					if(this.scrollHide)
					{
						if(y < 60)
						{
							this.hidden = false;
						}
						else if(Math.abs(y - lastY) > threshold)
						{
							this.hidden = y > lastY;
						}
					}

					lastY = y;
				};

				window.addEventListener('scroll', this.onScroll, { passive: true });
			});

			this.OnDestroy(() =>
			{
				if(this.onScroll)
				{
					window.removeEventListener('scroll', this.onScroll);
				}
			});

			/* ===== RENDER ===== */

			return /* html */ `
				<header :class="classes()">
					<div ot-if="hasBanner" class="banner">
						<slot name="banner"></slot>
					</div>

					<div class="bar">
						<div class="section left">
							<a ot-if="hasLogo && !hasCrumbs" class="brand" :href="brandHref">
								<img class="brand-logo" :src="logo" :alt="logoAlt" />
							</a>

							<nav ot-if="hasCrumbs" class="crumbs" aria-label="Breadcrumb">
								<a
									ot-for="crumb, index in crumbs"
									:href="crumb.href || 'javascript:void(0)'"
									class="crumb"
								>
									<i ot-if="crumb.icon">{{ crumb.icon }}</i>
									<span ot-if="crumb.label">{{ crumb.label }}</span>
								</a>
							</nav>

							<nav ot-if="left.length" class="nav left-nav">
								<div ot-for="item in left">
									<a
										:class="'nav-item' + (item.active ? ' active' : '') + (item.disabled ? ' disabled' : '') + (item.hasChildren ? ' has-children' : '')"
										:href="item.href || 'javascript:void(0)'"
										:target="item.target || null"
										ot-click="({ event }) => item.hasChildren && openDropdown(event, item)"
									>
										<i ot-if="item.icon">{{ item.icon }}</i>
										<span ot-if="item.label">{{ item.label }}</span>
										<span ot-if="item.badge != null" class="nav-badge">{{ item.badge }}</span>
										<i ot-if="item.hasChildren" class="nav-chevron">expand_more</i>
									</a>
								</div>
							</nav>
						</div>

						<div class="section right">
							<nav ot-if="right.length" class="nav right-nav">
								<div ot-for="item in right">
									<a
										:class="'nav-item' + (item.active ? ' active' : '') + (item.disabled ? ' disabled' : '') + (item.hasChildren ? ' has-children' : '')"
										:href="item.href || 'javascript:void(0)'"
										:target="item.target || null"
										ot-click="({ event }) => item.hasChildren && openDropdown(event, item)"
									>
										<i ot-if="item.icon">{{ item.icon }}</i>
										<span ot-if="item.label">{{ item.label }}</span>
										<span ot-if="item.badge != null" class="nav-badge">{{ item.badge }}</span>
										<i ot-if="item.hasChildren" class="nav-chevron">expand_more</i>
									</a>
								</div>
							</nav>

							<div ot-if="hasActions" class="actions">
								<slot name="actions"></slot>
							</div>

							<a
								ot-if="hasNotifications"
								class="bell"
								:href="notificationsHref || 'javascript:void(0)'"
							>
								<i>notifications</i>
								<span ot-if="notifications > 0" class="bell-badge">{{ notifications > 99 ? '99+' : notifications }}</span>
							</a>

							<button
								ot-if="hasUser"
								type="button"
								class="user-trigger"
								ot-click="openUserMenu"
							>
								<div ot-if="user.avatar" class="user-avatar-small">
									<img :src="user.avatar" :alt="user.name || ''" />
								</div>
								<div ot-if="!user.avatar" class="user-avatar-small user-avatar-fallback">
									<i>person</i>
								</div>
								<div ot-if="hasUserMenu" class="user-chevron">
									<i>expand_more</i>
								</div>
							</button>
						</div>

						<button class="burger" type="button" ot-click="toggleMobile" :aria-expanded="open">
							<i>{{ open ? 'close' : 'menu' }}</i>
						</button>
					</div>

					<div ot-if="open" class="drawer">
						<div ot-if="hasUser" class="drawer-user">
							<div ot-if="user.avatar" class="drawer-user-avatar">
								<img :src="user.avatar" :alt="user.name || ''" />
							</div>
							<div ot-if="!user.avatar" class="drawer-user-avatar drawer-user-avatar-fallback">
								<i>person</i>
							</div>
							<div class="drawer-user-text">
								<span ot-if="user.name" class="drawer-user-name">{{ user.name }}</span>
								<span ot-if="user.email" class="drawer-user-email">{{ user.email }}</span>
							</div>
						</div>

						<nav class="drawer-nav">
							<div ot-for="item in all">
								<a
									ot-if="!item.hasChildren"
									:class="'drawer-item' + (item.active ? ' active' : '') + (item.disabled ? ' disabled' : '')"
									:href="item.href || 'javascript:void(0)'"
									:target="item.target || null"
									ot-click="closeMobile"
								>
									<i ot-if="item.icon">{{ item.icon }}</i>
									<span>{{ item.label }}</span>
									<span ot-if="item.badge != null" class="drawer-badge">{{ item.badge }}</span>
								</a>

								<div ot-if="item.hasChildren" class="drawer-group">
									<div class="drawer-group-head">
										<i ot-if="item.icon">{{ item.icon }}</i>
										<span>{{ item.label }}</span>
									</div>
									<a
										ot-for="child in item.children"
										:href="child.href || 'javascript:void(0)'"
										class="drawer-child"
										ot-click="closeMobile"
									>
										<i ot-if="child.icon">{{ child.icon }}</i>
										<span>{{ child.label }}</span>
									</a>
								</div>
							</div>
						</nav>

						<div ot-if="hasUserMenu" class="drawer-user-menu">
							<div ot-for="entry in userMenu">
								<div ot-if="entry.separator" class="drawer-separator"></div>
								<a
									ot-if="!entry.separator"
									:href="entry.href || 'javascript:void(0)'"
									class="drawer-item"
									ot-click="closeMobile"
								>
									<i ot-if="entry.icon">{{ entry.icon }}</i>
									<span>{{ entry.label }}</span>
								</a>
							</div>
						</div>
					</div>
				</header>
			`;
		}
	});
});

const OneTypeObserver =
{
	ObserverStart()
	{
		if(this.environment !== 'front')
		{
			return;
		}

		this.observer =
		{
			mutation: null,
			visibility: null,
			resize: null
		};

		const start = () =>
		{
			this.observer.mutation = new MutationObserver((mutations) =>
			{
				for(const mutation of mutations)
				{
					for(const node of mutation.addedNodes)
					{
						if(node.nodeType !== 1)
						{
							continue;
						}

						this.ObserverNode(node, 'add');
						this.ObserverWalk(node, 'add');
					}

					for(const node of mutation.removedNodes)
					{
						if(node.nodeType !== 1)
						{
							continue;
						}

						if(node.isConnected)
						{
							continue;
						}

						this.ObserverNode(node, 'remove');
						this.ObserverWalk(node, 'remove');
					}
				}
			});

			this.observer.mutation.observe(document.body, { childList: true, subtree: true });

			this.observer.visibility = new IntersectionObserver((entries) =>
			{
				for(const entry of entries)
				{
					if(entry.isIntersecting && entry.target.__visible)
					{
						entry.target.__visible(entry);
					}
				}
			}, { threshold: 0.1 });

			this.observer.resize = new ResizeObserver((entries) =>
			{
				for(const entry of entries)
				{
					if(entry.target.__resize)
					{
						entry.target.__resize(entry);
					}
				}
			});
		};

		if(document.readyState === 'loading')
		{
			document.addEventListener('DOMContentLoaded', start);
		}
		else
		{
			start();
		}
	},

	ObserverNode(node, type)
	{
		this.Emit('@dom.' + type, node);

		if(type === 'add' && node.__add)
		{
			node.__add();
		}

		if(type === 'remove')
		{
			if(node.__remove)
			{
				node.__remove();
			}

			this.ObserverUnvisible(node);
			this.ObserverUnresize(node);
			this.ObserverUnscroll(node);
			this.ObserverUnhover(node);
			this.ObserverUnclick(node);
		}
	},

	ObserverWalk(node, type)
	{
		if(!node.hasChildNodes())
		{
			return;
		}

		for(let i = 0; i < node.childNodes.length; i++)
		{
			const child = node.childNodes[i];

			if(child.nodeType !== 1)
			{
				continue;
			}

			this.ObserverNode(child, type);
			this.ObserverWalk(child, type);
		}
	},

	ObserverVisible(element, callback)
	{
		if(!this.observer || !this.observer.visibility)
		{
			return;
		}

		element.__visible = callback;
		this.observer.visibility.observe(element);
	},

	ObserverUnvisible(element)
	{
		if(!this.observer || !this.observer.visibility)
		{
			return;
		}

		delete element.__visible;
		this.observer.visibility.unobserve(element);
	},

	ObserverResize(element, callback)
	{
		if(!this.observer || !this.observer.resize)
		{
			return;
		}

		element.__resize = callback;
		this.observer.resize.observe(element);
	},

	ObserverUnresize(element)
	{
		if(!this.observer || !this.observer.resize)
		{
			return;
		}

		delete element.__resize;
		this.observer.resize.unobserve(element);
	},

	ObserverScroll(element, callback)
	{
		if(!this.observer)
		{
			return;
		}

		if(!this.observer.scroll)
		{
			this.observer.scroll = new Set();
			this.observer.scrollPrevious = window.scrollY;
			this.observer.scrollTimestamp = Date.now();

			window.addEventListener('scroll', () =>
			{
				const now = Date.now();
				const current = window.scrollY;
				const delta = now - this.observer.scrollTimestamp;
				const direction = current >= this.observer.scrollPrevious ? 'down' : 'up';
				const speed = delta > 0 ? Math.abs(current - this.observer.scrollPrevious) / (delta / 1000) : 0;
				const height = window.innerHeight;

				for(const node of this.observer.scroll)
				{
					if(!node.__scroll)
					{
						continue;
					}

					const rect = node.getBoundingClientRect();
					const visible = rect.bottom > 0 && rect.top < height;

					if(!visible)
					{
						continue;
					}

					node.__scroll({
						progress: Math.min(1, Math.max(0, (height - rect.top) / (height + rect.height))),
						direction: direction,
						speed: speed,
						top: rect.top,
						bottom: height - rect.bottom,
						visible: true
					});
				}

				this.observer.scrollPrevious = current;
				this.observer.scrollTimestamp = now;
			}, { passive: true });
		}

		element.__scroll = callback;
		this.observer.scroll.add(element);
	},

	ObserverUnscroll(element)
	{
		if(!this.observer || !this.observer.scroll)
		{
			return;
		}

		delete element.__scroll;
		this.observer.scroll.delete(element);
	},

	ObserverHover(element, callback, offset = 0)
	{
		if(!this.observer)
		{
			return;
		}

		if(!this.observer.hover)
		{
			this.observer.hover = new Set();

			document.addEventListener('mousemove', (event) =>
			{
				for(const node of this.observer.hover)
				{
					if(!node.__hover)
					{
						continue;
					}

					const rect = node.getBoundingClientRect();
					const pad = node.__hoverOffset;
					const inside = event.clientX >= rect.left - pad && event.clientX <= rect.right + pad && event.clientY >= rect.top - pad && event.clientY <= rect.bottom + pad;

					if(inside || node.__hoverActive)
					{
						node.__hover({
							active: inside,
							enter: inside && !node.__hoverActive,
							leave: !inside && node.__hoverActive,
							x: (event.clientX - rect.left) / rect.width,
							y: (event.clientY - rect.top) / rect.height
						});

						node.__hoverActive = inside;
					}
				}
			}, { passive: true });
		}

		element.__hover = callback;
		element.__hoverActive = false;
		element.__hoverOffset = offset;
		this.observer.hover.add(element);
	},

	ObserverUnhover(element)
	{
		if(!this.observer || !this.observer.hover)
		{
			return;
		}

		delete element.__hover;
		delete element.__hoverActive;
		delete element.__hoverOffset;
		this.observer.hover.delete(element);
	},

	ObserverClick(element, callback)
	{
		if(!this.observer)
		{
			return;
		}

		if(!this.observer.click)
		{
			this.observer.click = new Set();

			document.addEventListener('click', (event) =>
			{
				for(const node of this.observer.click)
				{
					if(!node.__click)
					{
						continue;
					}

					const rect = node.getBoundingClientRect();
					const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;

					if(inside)
					{
						node.__click({
							x: (event.clientX - rect.left) / rect.width,
							y: (event.clientY - rect.top) / rect.height
						});
					}
				}
			});
		}

		element.__click = callback;
		this.observer.click.add(element);
	},

	ObserverUnclick(element)
	{
		if(!this.observer || !this.observer.click)
		{
			return;
		}

		delete element.__click;
		this.observer.click.delete(element);
	}
};

export default OneTypeObserver;

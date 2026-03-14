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

		if(type === 'remove' && node.__remove)
		{
			node.__remove();
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
	}
};

export default OneTypeObserver;

const OneTypeDOM =
{
	DOMCreate(html)
	{
		const wrapper = document.createElement('div');

		wrapper.innerHTML = html.trim();

		if(wrapper.childNodes.length === 1)
		{
			return wrapper.firstChild;
		}

		const fragment = document.createDocumentFragment();

		while(wrapper.firstChild)
		{
			fragment.appendChild(wrapper.firstChild);
		}

		return fragment;
	},

	DOMKey(node)
	{
		if(node.nodeType !== Node.ELEMENT_NODE)
		{
			return null;
		}

		return node.__otExternal?.key || node.getAttribute('ot-key') || null;
	},

	DOMChildren(node, significant)
	{
		return Array.from(node.childNodes).filter(child => significant || child.nodeType !== Node.TEXT_NODE || child.textContent.trim());
	},

	DOMSignificant(node)
	{
		while(node && node.nodeType === Node.TEXT_NODE && !node.textContent.trim())
		{
			node = node.nextSibling;
		}

		return node;
	},

	DOMReplace(current, target)
	{
		if(current.parentNode)
		{
			current.parentNode.replaceChild(target, current);
		}

		return target;
	},

	DOMPatch(current, target)
	{
		if(current === target || !current || !target)
		{
			return current || target;
		}

		if(this.DOMExternal(current, target))
		{
			return current;
		}

		if(target.__otExternal || current.nodeType !== target.nodeType || current.nodeName !== target.nodeName)
		{
			return this.DOMReplace(current, target);
		}

		if(current.nodeType === Node.TEXT_NODE)
		{
			if(current.textContent !== target.textContent)
			{
				current.textContent = target.textContent;
			}

			return current;
		}

		if(current.nodeType === Node.ELEMENT_NODE)
		{
			this.DOMPatchAttributes(current, target);

			if(!current.hasAttribute('ot-skip'))
			{
				this.DOMPatchChildren(current, target);
			}

			this.DOMPatchHandlers(current, target);
		}

		return current;
	},

	DOMExternal(current, target)
	{
		if(!current.__otExternal || !target.__otExternal)
		{
			return false;
		}

		const a = current.__otExternal;
		const b = target.__otExternal;

		if(a.name !== b.name || a.key !== b.key)
		{
			return false;
		}

		let hadSlots = false;

		if(a.render && b.render)
		{
			hadSlots = Object.keys(b.render.Slots || {}).length > 0;
			a.render.SetSlots(b.render.Slots);
		}

		if(a.render && b.data)
		{
			a.render.UpdateData(b.data);
		}

		/* The fresh tree lost to the recycled one and never enters the DOM,
		   so the removal observer can't reach it - destroy its renders here. */

		if(current !== target)
		{
			this.DOMDiscard(target);
		}

		if(hadSlots && a.render && a.render.State.ready && !a.render.State.rendering && !a.render.UpdateFrame)
		{
			a.render.UpdateFrame = requestAnimationFrame(() =>
			{
				a.render.UpdateFrame = null;
				a.render.Update();
			});
		}

		return true;
	},

	DOMDiscard(node)
	{
		this.DOMWalk(node, (child) =>
		{
			const render = child.__otRender;

			if(render && !render.State.mounted && !render.State.destroyed)
			{
				render.Destroy();
			}
		});
	},

	DOMPatchAttributes(current, target)
	{
		for(const attr of target.attributes)
		{
			if(current.getAttribute(attr.name) !== attr.value)
			{
				current.setAttribute(attr.name, attr.value);
			}
		}

		for(let i = current.attributes.length - 1; i >= 0; i--)
		{
			const name = current.attributes[i].name;

			if(!target.hasAttribute(name))
			{
				current.removeAttribute(name);
			}
		}

		if(current.nodeName === 'INPUT' || current.nodeName === 'TEXTAREA' || current.nodeName === 'SELECT')
		{
			if('checked' in target && current.checked !== target.checked)
			{
				current.checked = target.checked;
			}

			if('value' in target && current.value !== target.value)
			{
				current.value = target.value;
			}

			if(current.nodeName === 'SELECT' && current.selectedIndex !== target.selectedIndex)
			{
				current.selectedIndex = target.selectedIndex;
			}
		}
	},

	DOMPatchChildren(current, target)
	{
		const significant = current.nodeName === 'PRE' || !!(current.closest && current.closest('pre'));
		const children = this.DOMChildren(current, significant);
		const targets = this.DOMChildren(target, significant);
		const keyed = new Map();
		const free = [];

		for(const child of children)
		{
			const key = this.DOMKey(child);

			if(key)
			{
				if(!keyed.has(key))
				{
					keyed.set(key, []);
				}

				keyed.get(key).push(child);
			}
			else
			{
				free.push(child);
			}
		}

		let cursor = 0;
		const sequence = [];

		for(const goal of targets)
		{
			const key = this.DOMKey(goal);
			let match = null;

			if(key)
			{
				const queue = keyed.get(key);

				if(queue && queue.length)
				{
					match = queue.shift();
				}
			}
			else
			{
				while(cursor < free.length && free[cursor] === null)
				{
					cursor++;
				}

				if(cursor < free.length)
				{
					match = free[cursor];
					free[cursor] = null;
					cursor++;
				}
			}

			sequence.push(match ? this.DOMPatch(match, goal) : goal);
		}

		const survivors = new Set(sequence);

		for(const child of children)
		{
			if(!survivors.has(child) && child.parentNode === current)
			{
				current.removeChild(child);
			}
		}

		let anchor = null;

		for(let i = sequence.length - 1; i >= 0; i--)
		{
			const node = sequence[i];

			if(node.parentNode !== current || (significant ? node.nextSibling : this.DOMSignificant(node.nextSibling)) !== anchor)
			{
				current.insertBefore(node, anchor);
			}

			anchor = node;
		}
	},

	DOMScrollCapture(root)
	{
		const scrolls = [];

		this.DOMWalk(root, (node) =>
		{
			if(node.nodeType === Node.ELEMENT_NODE && (node.scrollTop || node.scrollLeft))
			{
				scrolls.push({ root, node, path: this.DOMPath(root, node), top: node.scrollTop, left: node.scrollLeft });
			}
		});

		return scrolls;
	},

	DOMScrollRestore(scrolls)
	{
		for(const scroll of scrolls)
		{
			let node = scroll.node;

			if(!node.isConnected && scroll.path)
			{
				node = this.DOMResolve(scroll.root, scroll.path);
			}

			if(!node || node.nodeType !== Node.ELEMENT_NODE)
			{
				continue;
			}

			if(node.scrollTop !== scroll.top)
			{
				node.scrollTop = scroll.top;
			}

			if(node.scrollLeft !== scroll.left)
			{
				node.scrollLeft = scroll.left;
			}
		}
	},

	DOMPath(root, node)
	{
		const path = [];

		while(node && node !== root)
		{
			const parent = node.parentNode;

			if(!parent)
			{
				return null;
			}

			path.unshift(Array.prototype.indexOf.call(parent.childNodes, node));
			node = parent;
		}

		return path;
	},

	DOMResolve(root, path)
	{
		let node = root;

		for(const index of path)
		{
			node = node && node.childNodes ? node.childNodes[index] : null;
		}

		return node;
	},

	DOMPatchHandlers(current, target)
	{
		for(const key in target)
		{
			if(key.startsWith('ot') && typeof target[key] === 'function')
			{
				current[key] = target[key];
			}
		}
	},

	DOMWalk(element, callback, depth = 0)
	{
		if(callback(element, depth) === false)
		{
			return;
		}

		if(element.childNodes)
		{
			for(let i = 0; i < element.childNodes.length; i++)
			{
				this.DOMWalk(element.childNodes[i], callback, depth + 1);
			}
		}
	}
};

export default OneTypeDOM;

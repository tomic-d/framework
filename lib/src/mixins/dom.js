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

	DOMChildren(node)
	{
		return Array.from(node.childNodes).filter(child => child.nodeType !== Node.TEXT_NODE || child.textContent.trim());
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
		const children = this.DOMChildren(current);
		const targets = this.DOMChildren(target);
		const map = new Map();

		for(const child of children)
		{
			const key = this.DOMKey(child);

			if(key)
			{
				if(!map.has(key))
				{
					map.set(key, []);
				}

				map.get(key).push(child);
			}
		}

		const length = Math.max(children.length, targets.length);

		for(let i = 0; i < length; i++)
		{
			const child = children[i];
			const goal = targets[i];

			if(!goal)
			{
				current.removeChild(child);
				continue;
			}

			if(!child)
			{
				current.appendChild(goal);
				continue;
			}

			const key = this.DOMKey(goal);
			const queue = key && map.get(key);
			const match = queue?.length ? queue.shift() : null;

			if(match && match !== child)
			{
				current.insertBefore(match, child);
				this.DOMPatch(match, goal);
			}
			else
			{
				this.DOMPatch(child, goal);
			}
		}
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

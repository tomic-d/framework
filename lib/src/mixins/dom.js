const DivhuntDOM =
{
    DOMCreate(html)
    {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html.trim();

        let element;

        if(wrapper.childNodes.length === 1)
        {
            element = wrapper.firstChild;
        }
        else
        {
            element = document.createDocumentFragment();
            
            while(wrapper.firstChild)
            {
                element.appendChild(wrapper.firstChild);
            }
        }

        return element;
    },
    
    DOMPatch(current, target)
    {
        if(current === target)
        {
            return current;
        }

        if(!current || !target)
        {
            return target;
        }

        const shouldReplace = current.nodeType !== target.nodeType || (current.nodeType === Node.ELEMENT_NODE && current.nodeName.toUpperCase() !== target.nodeName.toUpperCase());

        if(shouldReplace)
        {
            if(current.parentNode)
            {
                current.parentNode.replaceChild(target, current);
                return target;
            }

            return target;
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
            const isInput = current.nodeName === 'INPUT' || current.nodeName === 'TEXTAREA' || current.nodeName === 'SELECT';
            const savedValue = isInput ? current.value : null;

            this.DOMPatchAttributes(current, target);
            this.DOMPatchChildren(current, target);

            if(isInput && savedValue !== null && !target.hasAttribute('value'))
            {
                current.value = savedValue;
            }

            for(const key in target)
            {
                if(key.startsWith('dh') && typeof target[key] === 'function')
                {
                    current[key] = target[key];
                }
            }
        }

        return current;
    },
    
    DOMPatchAttributes(current, target)
    {
        for(let i = 0; i < target.attributes.length; i++)
        {
            const attr = target.attributes[i];

            if(current.getAttribute(attr.name) !== attr.value)
            {
                current.setAttribute(attr.name, attr.value);
            }
        }

        for(let i = current.attributes.length - 1; i >= 0; i--)
        {
            const attr = current.attributes[i];

            if(!target.hasAttribute(attr.name))
            {
                current.removeAttribute(attr.name);
            }
        }
    },

    DOMPatchChildren(current, target)
    {
        const isWhitespace = (node) => node.nodeType === Node.TEXT_NODE && !node.textContent.trim();

        const currentChildren = Array.from(current.childNodes).filter(n => !isWhitespace(n));
        const targetChildren = Array.from(target.childNodes).filter(n => !isWhitespace(n));

        const getKey = (node) => node.nodeType === Node.ELEMENT_NODE && node.getAttribute('dh-key');
        const hasKeys = targetChildren.some(n => getKey(n));

        const currentByKey = hasKeys ? new Map() : null;

        if(currentByKey)
        {
            currentChildren.forEach(child =>
            {
                const key = getKey(child);

                if(key)
                {
                    currentByKey.set(key, child);
                }
            });
        }

        const maxLength = Math.max(currentChildren.length, targetChildren.length);

        for(let i = 0; i < maxLength; i++)
        {
            const targetChild = targetChildren[i];
            let currentChild = currentChildren[i];

            if(!targetChild)
            {
                current.removeChild(currentChild);
                continue;
            }

            if(!currentChild)
            {
                current.appendChild(targetChild);
                continue;
            }

            const targetKey = targetChild && getKey(targetChild);
            const match = targetKey && currentByKey && currentByKey.get(targetKey);

            if(match && match !== currentChild)
            {
                current.insertBefore(match, currentChild);
                this.DOMPatch(match, targetChild);
            }
            else
            {
                this.DOMPatch(currentChild, targetChild);
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
    },

    DOMObserve(element, options = {}, callback)
    {
        const observer = new MutationObserver(mutations =>
        {
            callback && callback(mutations);
        });

        observer.observe(element, {
            childList: options.children !== false,
            attributes: options.attributes !== false,
            characterData: options.text !== false,
            subtree: options.subtree !== false,
            attributeOldValue: options.attributeOldValue !== false,
            characterDataOldValue: options.textOldValue !== false
        });

        return observer;
    }
};

export default DivhuntDOM;
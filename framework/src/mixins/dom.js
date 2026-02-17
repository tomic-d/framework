// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

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
            this.DOMPatchAttributes(current, target);
            this.DOMPatchChildren(current, target);

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
        const currentChildren = Array.from(current.childNodes);
        const targetChildren = Array.from(target.childNodes);

        const maxLength = Math.max(currentChildren.length, targetChildren.length);

        for(let i = 0; i < maxLength; i++)
        {
            const currentChild = currentChildren[i];
            const targetChild = targetChildren[i];

            if(!targetChild)
            {
                current.removeChild(currentChild);
            }
            else if(!currentChild)
            {
                current.appendChild(targetChild);
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
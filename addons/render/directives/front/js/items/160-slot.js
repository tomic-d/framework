directives.ItemAdd({
    id: 'dh-slot',
    icon: 'input',
    name: 'Slot',
    description: 'Insert slot content. Supports DOM elements and render instances.',
    category: 'content',
    trigger: 'node',
    order: 160,
    tag: 'slot',
    attributes: {
        'name': ['string']
    },
    code: function(data, item, compile, node, id)
    {
        const name = data['name']?.value || 'default';
        const slot = item.Slots[name];

        if (slot && slot.Element)
        {
            node.replaceWith(slot.Element);
        }
        else if (slot && slot.html && slot.data)
        {
            const compiled = item.Compile(slot.html, slot.data);
            node.replaceWith(compiled.element);
        }
        else
        {
            node.remove();
        }
    }
});
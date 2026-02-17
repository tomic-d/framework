import html from '#html/addon.js';

html.Fn('render', function(context = {})
{
    this.methods.init = () =>
    {
        const sections = { head: [], body: [] };
        const sortedItems = this.methods.getSortedItems();

        sortedItems.forEach(item => this.methods.processItem(item, sections));

        if (typeof context.head === 'function') sections.head.push(context.head());
        if (typeof context.body === 'function') sections.body.push(context.body());

        return this.methods.buildHTML(sections);
    };

    this.methods.getSortedItems = () =>
    {
        return Object.values(this.Items()).sort((a, b) =>
            (a.Get('priority') || 0) - (b.Get('priority') || 0)
        );
    };

    this.methods.processItem = (item, sections) =>
    {
        const position = item.Get('position').toLowerCase();
        const content = item.Fn('render');

        if (content && sections[position])
        {
            sections[position].push(content);
        }
    };

    this.methods.resolveAttributeValue = (item, attrName, value, visited = new Set()) =>
    {
        if (value !== 'inherit')
        {
            return value;
        }

        if (visited.has(item.Get('id')))
        {
            return undefined;
        }

        visited.add(item.Get('id'));

        const parentId = item.Get('parent');

        if (!parentId)
        {
            return undefined;
        }

        const parentItem = this.ItemGet(parentId);

        if (!parentItem)
        {
            return undefined;
        }

        const parentAttrs = parentItem.Get('attributes');
        const parentValue = parentAttrs[attrName];

        return this.methods.resolveAttributeValue(parentItem, attrName, parentValue, visited);
    };

    this.methods.buildHTML = (sections) =>
    {
        return `<!DOCTYPE html>
<html lang="en">
    <head>
        ${sections.head.join('')}
    </head>

    <body>
        ${sections.body.join('')}
    </body>
</html>`;
    };

    return this.methods.init();
});

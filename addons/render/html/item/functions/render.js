import html from '#html/addon.js';
import tags from '#tags/load.js';

html.Fn('item.render', function(item)
{
    this.methods.init = () =>
    {
        const tag = tags.ItemGet(item.Get('tag'));

        if (!tag)
        {
            return '';
        }

        return this.methods.element(item, tag);
    };

    this.methods.element = (item, tag) =>
    {
        const parts = [];

        parts.push('<');
        parts.push(tag.Get('id'));
        parts.push(this.methods.attributes(item));
        parts.push('>');

        if (tag.Get('closeable'))
        {
            const content = item.Get('content');

            if (content)
            {
                parts.push(content);
            }
            
            parts.push('</');
            parts.push(tag.Get('id'));
            parts.push('>');
        }

        return parts.join('');
    };

    this.methods.attributes = (item) =>
    {
        const attrs = item.Get('attributes');
        const parts = [];

        Object.entries(attrs).forEach(([key, value]) =>
        {
            parts.push(' ');
            parts.push(this.divhunt.StringSanitize(key));
            
            if (value !== null && value !== undefined && value !== '')
            {
                parts.push('="');
                parts.push(this.divhunt.StringSanitize(value));
                parts.push('"');
            }
        });

        return parts.join('');
    };

    return this.methods.init();
});
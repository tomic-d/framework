import tags from '#tags/addon.js';

tags.Fn('groups', function()
{
    return {
        'text-inline': ['a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'em', 'i', 'img', 'kbd', 'mark', 'q', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'del', 'ins'],
        'form': ['input', 'textarea', 'select', 'option', 'optgroup', 'form', 'button', 'label', 'fieldset', 'legend', 'datalist', 'output'],
        'block': ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'ul', 'ol', 'li', 'table', 'section', 'article', 'aside', 'nav', 'header', 'footer', 'main', 'figure'],
        'table': ['table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col'],
        'media': ['img', 'video', 'audio', 'source', 'track', 'embed', 'iframe'],
        'void': ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']
    };
});

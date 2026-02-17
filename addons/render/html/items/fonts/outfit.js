import html from '#html/addon.js';

html.Item({
    id: 'font-outfit',
    tag: 'link',
    position: 'head',
    priority: -40,
    attributes: {
        href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap',
        rel: 'stylesheet'
    }
});
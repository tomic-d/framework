pages.Item({
    id: 'home',
    route: '/',
    title: 'dh-command test',
    grid: {
        template: '"content"',
        columns: '1fr',
        rows: '1fr'
    },
    areas: {
        content: function()
        {
            return `
                1
                {{ global.user.name }}

                <h1>dh-command test</h1>
                <dh-command-submit command="test" :api="true" bind="test" :data='{"name": "dejan"}'>
                    <input name="name" placeholder="Name"/>
                    <button type="submit">Send</button>
                    <p dh-if="test.loading">Loading...</p>
                    <p dh-if="test.error">Error: {{test.error}}</p>
                    <div dh-if="test.response">dsas<dh-page route="/2"></dh-page></div>
                </dh-command-submit>
            `;
        }
    }
});


pages.Item({
    id: 'hom2e',
    route: '/2',
    title: 'dh-command test',
    grid: {
        template: '"content"',
        columns: '1fr',
        rows: '1fr'
    },
    areas: {
        content: function()
        {
            return `
                2
                <h1>dh-command test</h1>
                <dh-command-submit command="test" :api="true" bind="test" :data='{"name": "dejan"}'>
                    <input name="name" placeholder="Name"/>
                    <button type="submit">Send</button>
                    <p dh-if="test.loading">Loading...</p>
                    <p dh-if="test.error">Error: {{test.error}}</p>
                    <div dh-if="test.response">dsas<dh-page route="/"></dh-page></div>
                </dh-command-submit>
            `;
        }
    }
});

pages.Item({
    id: 'home',
    route: '/',
    title: 'ot-command test',
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
                {{ state.user }}

                <h1>ot-command test</h1>
                <ot-command-submit command="test" :api="true" bind="test" :data='{"name": "dejan"}'>
                    <input name="name" placeholder="Name"/>
                    <button type="submit">Send</button>
                    <p ot-if="test.loading">Loading...</p>
                    <p ot-if="test.error">Error: {{test.error}}</p>
                    <div ot-if="test.response">dsas<ot-page route="/2"></ot-page></div>
                </ot-command-submit>
            `;
        }
    }
});


pages.Item({
    id: 'hom2e',
    route: '/2',
    title: 'ot-command test',
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
                <h1>ot-command test</h1>
                <ot-command-submit command="test" :api="true" bind="test" :data='{"name": "dejan"}'>
                    <input name="name" placeholder="Name"/>
                    <button type="submit">Send</button>
                    <p ot-if="test.loading">Loading...</p>
                    <p ot-if="test.error">Error: {{test.error}}</p>
                    <div ot-if="test.response">dsas<ot-page route="/"></ot-page></div>
                </ot-command-submit>
            `;
        }
    }
});

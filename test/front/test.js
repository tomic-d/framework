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
                {{ name }}
                <h1>dh-command test</h1>
                <dh-command command="test" :api="true" bind="test" :data='{"name": "dejan"}'>
                    <input name="name" placeholder="Name"/>
                    <button type="submit">Send</button>
                    <p dh-if="test.loading">Loading...</p>
                    <p dh-if="test.error">Error: {{test.error}}</p>
                    <p dh-if="test.response">{{test.response.message}}</p>
                </dh-command>
            `;
        }
    }
});

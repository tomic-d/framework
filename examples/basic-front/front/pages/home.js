pages.Item({
    id: 'home',
    route: '/',
    title: 'OneType Framework',
    areas: {
        main: function()
        {
            return `
                <div class="hero">
                    <h1>Hello from OneType Framework</h1>
                    <p>A minimal full-stack JavaScript framework.</p>
                </div>
            `;
        }
    }
});

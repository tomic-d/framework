pages.Item({
    id: 'home',
    route: '/',
    title: 'Divhunt Framework',
    areas: {
        main: function()
        {
            return `
                <div class="hero">
                    <h1>Hello from Divhunt Framework</h1>
                    <p>A minimal full-stack JavaScript framework.</p>
                </div>
            `;
        }
    }
});

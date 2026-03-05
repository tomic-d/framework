elements.Fn('runtime', function()
{
	this.methods.render = () =>
	{
		elements.Render('body', () =>
		{
			return document.body.outerHTML;
		});

		const render = elements.Render('body', window);
		document.body.replaceChildren(...render.Element.children);
	};

	if(document.readyState === 'loading')
	{
		document.addEventListener('DOMContentLoaded', () =>
		{
			this.methods.render();
		});
	}
	else
	{
		this.methods.render();
	}
});

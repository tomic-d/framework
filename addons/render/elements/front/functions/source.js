elements.Fn('source', function(render, callback)
{
	render.normalize = (list) =>
	{
		return list.map((option) =>
		{
			if(typeof option === 'object' && option !== null)
			{
				const label = option.label ? option.label : (option.title ? option.title : (option.name ? option.name : String(option.value)));

				return { ...option, label };
			}

			return { label: String(option), value: option };
		});
	};

	render.sourced = typeof callback() === 'function';
	render.results = [];
	render.known = {};
	render.loading = false;

	if(!render.sourced)
	{
		return render;
	}

	const refresh = () =>
	{
		if(render.State.ready && !render.State.rendering)
		{
			render.Update();
		}
	};

	const fetch = async (query) =>
	{
		render.loading = true;
		refresh();

		try
		{
			const result = await callback().call(render, query ? query : '', 'search');

			render.results = render.normalize(Array.isArray(result) ? result : []);

			for(const option of render.results)
			{
				render.known[option.value] = option;
			}
		}
		catch(error)
		{
			render.results = [];
		}

		render.loading = false;
		refresh();
	};

	render.search = onetype.HelperDebounce((query) => fetch(query), 300);

	render.resolve = async (values) =>
	{
		const missing = values.filter((value) => !(value in render.known));

		if(!missing.length)
		{
			return;
		}

		for(const value of missing)
		{
			render.known[value] = { label: String(value), value };
		}

		try
		{
			const result = await callback().call(render, missing, 'selected');

			for(const option of render.normalize(Array.isArray(result) ? result : []))
			{
				render.known[option.value] = option;
			}
		}
		catch(error)
		{
		}

		refresh();
	};

	render.find = (value) =>
	{
		return render.known[value] ? render.known[value] : render.results.find((option) => option.value === value);
	};

	render.OnInit(() => fetch(''));

	return render;
});

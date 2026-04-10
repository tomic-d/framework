onetype.AddonReady('directives', function(directives)
{
	directives.ItemAdd({
		id: 'ot-form',
		icon: 'send',
		name: 'Form',
		description: 'Submit form data to endpoint or callback and bind response to component data.',
		category: 'data',
		trigger: 'node',
		order: 660,
		strict: false,
		tag: 'ot-form',
		attributes: {
			'post': ['string'],
			'get': ['string'],
			'endpoint': ['string'],
			'bind': ['string', 'form'],
			'method': ['string'],
			'redirect': ['string'],
			'_submit': ['function'],
			'_success': ['function'],
			'_error': ['function'],
			'reset': ['boolean', false],
			'stop': ['boolean', false],
			'data': ['object', {}]
		},
		code: function(data, item, compile, node, identifier)
		{
			const config = {};
			const methods = {};

			methods.init = () =>
			{
				methods.config();
				methods.state();
				methods.element();
				methods.handler();
			};

			methods.config = () =>
			{
				const post = data['post']?.value;
				const get = data['get']?.value;

				config.endpoint = post || get || data['endpoint']?.value || '';
				config.bind = data['bind']?.value || 'form';
				config.method = get ? 'GET' : (data['method']?.value || 'POST').toUpperCase();
				config.redirect = data['redirect']?.value;
				config.onSubmit = data['_submit']?.value;
				config.onSuccess = data['_success']?.value;
				config.onError = data['_error']?.value;
				config.reset = data['reset']?.value || false;
				config.stop = data['stop']?.value || false;
				config.data = data['data']?.value || {};
			};

			methods.state = () =>
			{
				if(!compile.data[config.bind])
				{
					compile.data[config.bind] = {
						data: null,
						message: null,
						code: null,
						loading: false
					};
				}
			};

			methods.element = () =>
			{
				config.form = document.createElement('form');
				config.form.setAttribute('autocomplete', 'off');

				while(node.firstChild)
				{
					config.form.appendChild(node.firstChild);
				}

				node.appendChild(config.form);

				if(config.data && typeof config.data === 'object' && Object.keys(config.data).length)
				{
					Object.assign(compile.data, config.data);
					requestAnimationFrame(() => onetype.FormSet(config.form, config.data));
				}
			};

			methods.handler = () =>
			{
				config.form.otForm = async (event) =>
				{
					event.preventDefault();

					if(config.stop)
					{
						event.stopPropagation();
					}

					const form = event.target.closest('form') || event.target;

					await methods.submit(form);
				};
			};

			methods.submit = async (form) =>
			{
				const state = compile.data[config.bind];

				if(state.loading)
				{
					return;
				}

				const formData = onetype.FormGet(form);
				const submitData = Object.assign({}, config.data, formData);

				if(config.onSubmit)
				{
					const result = await config.onSubmit(submitData);

					if(result === false)
					{
						compile.data.Update();
						return;
					}
				}

				if(!config.endpoint)
				{
					state.data = submitData;
					config.onSuccess && await config.onSuccess(submitData);
					config.reset && form.reset();
					compile.data.Update();
					return;
				}

				state.loading = true;
				state.message = null;
				state.code = null;
				compile.data.Update();

				try
				{
					const url = config.endpoint.startsWith('/') ? config.endpoint : '/' + config.endpoint;

					const response = await fetch(url, {
						method: config.method,
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(submitData)
					});

					const result = await response.json();

					state.data = result.data || null;
					state.message = result.message || null;
					state.code = result.code || response.status;
					state.loading = false;

					if(!response.ok)
					{
						config.onError && config.onError(state);
						compile.data.Update();
						return;
					}

					config.reset && form.reset();

					if(config.redirect)
					{
						onetype.AddonGet('pages')?.Fn('change', null, config.redirect);
						return;
					}

					config.onSuccess && config.onSuccess(state);
				}
				catch(error)
				{
					state.data = null;
					state.message = error.message;
					state.code = 0;
					state.loading = false;

					config.onError && config.onError(state);
				}
				finally
				{
					compile.data.Update();
				}
			};

			methods.init();
		}
	});

	document.addEventListener('submit', function(event)
	{
		const node = event.target;

		if('otForm' in node)
		{
			node.otForm(event);
		}
	});
});

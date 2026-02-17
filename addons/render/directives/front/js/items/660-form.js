import directives from '#directives/addon.js';

directives.ItemAdd({
	id: 'dh-form',
	icon: 'send',
	name: 'Form',
	description: 'Submit form data to endpoint and bind response to component data',
	category: 'data',
	trigger: 'node',
	order: 660,
	tag: 'dh-form',
	attributes: {
		'post': ['string'],
		'get': ['string'],
		'endpoint': ['string'],
		'url': ['string'],
		'bind': ['string'],
		'method': ['string'],
		'redirect': ['string'],
		'on-success': ['string'],
		'on-error': ['string'],
		'reset': ['boolean'],
		'stop': ['boolean'],
		'data': ['string']
	},
	code: function(data, item, compile, node, identifier)
	{
		const divhunt = item.GetDivhunt();
		const config = {};
		const methods = {};

		methods.init = () =>
		{
			methods.config();
			methods.state();
			methods.element();
			methods.compile();
			methods.handler();
		};

		methods.config = () =>
		{
			const post = data['post']?.value;
			const get = data['get']?.value;

			config.endpoint = post || get || data['endpoint']?.value || data['url']?.value || '';
			config.bind = data['bind']?.value || 'form';
			config.method = get ? 'GET' : (data['method']?.value || 'POST').toUpperCase();
			config.redirect = data['redirect']?.value;
			config.onSuccess = data['on-success']?.value;
			config.onError = data['on-error']?.value;
			config.reset = data['reset']?.value || false;
			config.stop = data['stop']?.value || false;
			config.data = methods.parseData();
			config.url = methods.normalizeUrl(config.endpoint);
		};

		methods.parseData = () =>
		{
			const dataAttr = data['data']?.value;

			if(!dataAttr)
			{
				return {};
			}

			try
			{
				return JSON.parse(dataAttr);
			}
			catch(e)
			{
				return divhunt.Function(dataAttr, compile.data, false) || {};
			}
		};

		methods.normalizeUrl = (endpoint) =>
		{
			if(/^https?:\/\//.test(endpoint))
			{
				return endpoint;
			}

			return endpoint.startsWith('/') ? endpoint : '/' + endpoint;
		};

		methods.state = () =>
		{
			if(!compile.data[config.bind])
			{
				compile.data[config.bind] = {
					response: null,
					error: null,
					loading: false
				};
			}
		};

		methods.element = () =>
		{
			config.html = node.innerHTML;
			config.form = document.createElement('form');
			config.form.setAttribute('autocomplete', 'off');

			const reserved = ['endpoint', 'url', 'bind', 'method', 'on-success', 'on-error', 'reset', 'stop', 'data', 'redirect', 'post', 'get'];

			Array.from(node.attributes).forEach(attr =>
			{
				if(!reserved.includes(attr.name))
				{
					config.form.setAttribute(attr.name, attr.value);
				}
			});
		};

		methods.compile = () =>
		{
			const compiled = item.Compile(config.html, compile.data);

			while(compiled.element.firstChild)
			{
				config.form.appendChild(compiled.element.firstChild);
			}

			node.replaceWith(config.form);
			compile.children = false;
		};

		methods.handler = () =>
		{
			config.form.dhForm = async (event) =>
			{
				event.preventDefault();

				if(config.stop)
				{
					event.stopPropagation();
				}

				await methods.submit();
			};
		};

		methods.submit = async () =>
		{
			const state = compile.data[config.bind];

			state.loading = true;
			state.error = null;

			try
			{
				const formData = methods.extract();
				const submitData = Object.assign({}, formData, config.data);
				const response = await methods.fetch(submitData);

				state.response = response.data !== undefined ? response.data : response;
				state.error = null;
				state.loading = false;

				methods.success();
			}
			catch(err)
			{
				state.response = null;
				state.error = err.message;
				state.loading = false;

				methods.error(err);
			}
			finally
			{
				compile.data.Update();
			}
		};

		methods.extract = () =>
		{
			const formData = {};
			const inputs = config.form.querySelectorAll('input[name], textarea[name], select[name]');

			inputs.forEach(input =>
			{
				const name = input.getAttribute('name');

				if(!name)
				{
					return;
				}

				if(input.type === 'checkbox')
				{
					formData[name] = input.checked;
				}
				else if(input.type === 'radio')
				{
					if(input.checked)
					{
						formData[name] = input.value;
					}
				}
				else
				{
					formData[name] = input.value;
				}
			});

			return formData;
		};

		methods.fetch = async (data) =>
		{
			const response = await fetch(config.url, {
				method: config.method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});

			if(!response.ok)
			{
				throw new Error(`HTTP ${response.status}`);
			}

			return response.json();
		};

		methods.success = () =>
		{
			if(config.reset)
			{
				config.form.reset();
			}

			if(config.redirect)
			{
				pages.Fn('change', config.redirect, {}, { path: true });
				return;
			}

			if(config.onSuccess)
			{
				const callback = divhunt.Function(config.onSuccess, compile.data, false);

				if(typeof callback === 'function')
				{
					callback(compile.data[config.bind].response);
				}
			}

			divhunt.Emit('form.success', {
				bind: config.bind,
				response: compile.data[config.bind].response
			});
		};

		methods.error = (err) =>
		{
			console.error('Form submit error:', err);

			if(config.onError)
			{
				const callback = divhunt.Function(config.onError, compile.data, false);

				if(typeof callback === 'function')
				{
					callback(err.message);
				}
			}

			divhunt.Emit('form.error', {
				bind: config.bind,
				error: err.message
			});
		};

		methods.init();
	}
});

divhunt.AddonReady('directives', function()
{
	document.addEventListener('submit', function(event)
	{
		const node = event.target;

		if('dhForm' in node)
		{
			node.dhForm(event);
		}
	});
});

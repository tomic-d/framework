import directives from '#directives/addon.js';

directives.ItemAdd({
	id: 'dh-fetch',
	icon: 'cloud_download',
	name: 'Fetch',
	description: 'Fetch data from URL or endpoint and bind to component data',
	category: 'data',
	trigger: 'node',
	order: 650,
	tag: 'dh-fetch',
	attributes: {
		'get': ['string'],
		'endpoint': ['string'],
		'url': ['string'],
		'bind': ['string'],
		'params': ['string'],
		'on-success': ['string'],
		'on-error': ['string']
	},
	code: function(data, item, compile, node, identifier)
	{
		const divhunt = item.GetDivhunt();
		const config = {};
		const methods = {};

		methods.init = () =>
		{
			methods.config();

			if(methods.fetched())
			{
				return;
			}

			methods.state();
			methods.execute();
		};

		methods.config = () =>
		{
			const get = node.getAttribute('get');

			config.endpoint = get || node.getAttribute('endpoint') || node.getAttribute('url') || '';
			config.bind = node.getAttribute('bind') || 'fetch';
			config.onSuccess = node.getAttribute('on-success');
			config.onError = node.getAttribute('on-error');
			config.params = methods.parseParams();
			config.url = methods.buildUrl();
			config.html = node.innerHTML;
		};

		methods.parseParams = () =>
		{
			const paramsAttr = node.getAttribute('params');

			if(!paramsAttr)
			{
				return {};
			}

			try
			{
				return JSON.parse(paramsAttr);
			}
			catch(e)
			{
				return divhunt.Function(paramsAttr, compile.data, false) || {};
			}
		};

		methods.buildUrl = () =>
		{
			let url = config.endpoint;

			if(!/^https?:\/\//.test(url))
			{
				url = url.startsWith('/') ? url : '/' + url;
			}

			if(Object.keys(config.params).length > 0)
			{
				const query = Object.entries(config.params)
					.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
					.join('&');

				url += (url.includes('?') ? '&' : '?') + query;
			}

			return url;
		};

		methods.fetched = () =>
		{
			return compile.data[config.bind] && compile.data[config.bind].fetched;
		};

		methods.state = () =>
		{
			compile.data[config.bind] = {
				response: null,
				error: null,
				loading: true,
				success: false,
				fetched: true
			};

			node.innerHTML = '';
			compile.children = false;
		};

		methods.execute = () =>
		{
			fetch(config.url)
				.then(methods.response)
				.then(methods.success)
				.catch(methods.error)
				.finally(methods.complete);
		};

		methods.response = (response) =>
		{
			if(!response.ok)
			{
				throw new Error(`HTTP ${response.status}`);
			}

			return response.json();
		};

		methods.success = (result) =>
		{
			const state = compile.data[config.bind];

			state.response = result.data !== undefined ? result.data : result;
			state.error = null;
			state.loading = false;
			state.success = true;

			if(config.onSuccess)
			{
				const callback = divhunt.Function(config.onSuccess, compile.data, false);

				if(typeof callback === 'function')
				{
					callback(state.response);
				}
			}
		};

		methods.error = (err) =>
		{
			const state = compile.data[config.bind];

			state.response = null;
			state.error = err.message;
			state.loading = false;
			state.success = false;

			console.error('Fetch error:', err);

			if(config.onError)
			{
				const callback = divhunt.Function(config.onError, compile.data, false);

				if(typeof callback === 'function')
				{
					callback(err.message);
				}
			}
		};

		methods.complete = () =>
		{
			const compiled = item.Compile(config.html, compile.data);
			const fragment = document.createDocumentFragment();

			while(compiled.element.firstChild)
			{
				fragment.appendChild(compiled.element.firstChild);
			}

			node.replaceWith(fragment);
			compile.data.Update();
		};

		methods.init();
	}
});

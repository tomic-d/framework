directives.ItemAdd({
	id: 'dh-command-submit',
	icon: 'terminal',
	name: 'Command Submit',
	description: 'Submit form data to a command via commands.Fn',
	category: 'data',
	trigger: 'node',
	order: 665,
	strict: false,
	tag: 'dh-command-submit',
	attributes: {
		'command': ['string', null, true],
		'bind': ['string', 'command'],
		'_success': ['function'],
		'_error': ['function'],
		'reset': ['boolean', false],
		'stop': ['boolean', false],
		'data': ['object', {}],
		'api': ['boolean', false]
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

		methods.config = () =>
		{
			config.command = data['command'].value;
			config.bind = data['bind'].value;
			config.onSuccess = data['_success'].value;
			config.onError = data['_error'].value;
			config.reset = data['reset'].value;
			config.stop = data['stop'].value;
			config.data = data['data'].value;
			config.api = data['api'].value;
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
			divhunt.FormSet(config.form, config.data);
		};

		methods.handler = () =>
		{
			config.form.dhCommandSubmit = async (event) =>
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
			compile.data[config.bind];

			if(compile.data[config.bind].loading)
			{
				return;
			}

			compile.data[config.bind].loading = true;
			compile.data[config.bind].error = null;

			console.log(compile.data[config.bind]);

			compile.data.Update();

			try
			{
				const formData = divhunt.FormGet(config.form);
				const result = config.api
					? await commands.Fn('api', config.command, formData)
					: await commands.Fn('run', config.command, formData);

				compile.data[config.bind].response = result;
				compile.data[config.bind].error    = null;
				compile.data[config.bind].loading  = false;

				config.reset && config.form.reset();
				config.onSuccess && config.onSuccess(compile.data[config.bind]);
			}
			catch(error)
			{
				compile.data[config.bind].response = null;
				compile.data[config.bind].error    = error.message;
				compile.data[config.bind].loading  = false;

				config.onError && config.onError(compile.data[config.bind]);
			}
			finally
			{
				compile.data.Update();
			}
		};

		methods.init();
	}
});

divhunt.AddonReady('directives', function()
{
	document.addEventListener('submit', function(event)
	{
		let node = event.target;

		while(node && node !== document)
		{
			if('dhCommandSubmit' in node)
			{
				node.dhCommandSubmit(event);
				break;
			}

			node = node.parentNode;
		}
	});
});

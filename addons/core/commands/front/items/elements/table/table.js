divhunt.AddonReady('elements', (elements) => 
{
	elements.ItemAdd({
		id: 'command-table',
		icon: 'terminal',
		name: 'Command Table',
		description: 'Table that auto-generates columns and fetches data from a command.',
		category: 'Display',
		author: 'Divhunt',
		config: {
			command: {
				type: 'string',
				value: 'commands:get:many'
			},
			key: {
				type: 'string',
				value: 'commands'
			},
			params: {
				type: 'object',
				value: {}
			},
			variant: {
				type: 'array',
				value: ['border', 'hover', 'size-m'],
				options: ['border', 'bg-1', 'bg-2', 'bg-3', 'striped', 'compact', 'hover', 'size-s', 'size-m', 'size-l']
			},
			sortable: {
				type: 'boolean',
				value: false
			},
			onRowClick: {
				type: 'function'
			},
			onLoad: {
				type: 'function'
			},
			onError: {
				type: 'function'
			}
		},
		render: function()
		{
			this.columns = [];
			this.rows = [];
			this.loading = true;
			this.error = null;

			// Helpers
			this.label = (key) =>
			{
				return key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
			};

			// Schema parsing
			this.parse = (schema) =>
			{
				if (!schema)
				{
					return { valid: false, columns: [] };
				}

				const target = this.key
					? schema[this.key]
					: Object.values(schema).find(f => f?.type === 'array');

				if (!target || target.type !== 'array')
				{
					return { valid: false, columns: [] };
				}

				const config = target.each?.config || target.config || {};
				const columns = [];

				for (const [id, field] of Object.entries(config))
				{
					const type = Array.isArray(field) ? field[0] : field?.type;

					if (type && type !== 'object' && type !== 'array')
					{
						columns.push({ id, label: this.label(id) });
					}
				}

				return { valid: true, columns };
			};

			// Data extraction
			this.extract = (data) =>
			{
				if (!data)
				{
					return [];
				}

				if (this.key)
				{
					return Array.isArray(data[this.key]) ? data[this.key] : [];
				}

				if (Array.isArray(data))
				{
					return data;
				}

				for (const value of Object.values(data))
				{
					if (Array.isArray(value))
					{
						return value;
					}
				}

				return [];
			};

			// API calls
			this.fetch = async (url, options = {}) =>
			{
				const response = await fetch(url, options);
				return response.json();
			};

			this.info = async () =>
			{
				const data = await this.fetch('/api/commands/' + encodeURIComponent(this.command));

				if (data.code !== 200)
				{
					throw new Error(data.message || 'Command not found');
				}

				if (!data.data.command.exposed)
				{
					throw new Error('Command is not exposed');
				}

				return data.data.command;
			};

			this.run = async () =>
			{
				const response = await this.fetch('/api/commands/run', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id: this.command, in: this.params || {} })
				});

				if (response.code !== 200)
				{
					throw new Error(response.message || 'Command failed');
				}

				return response.data;
			};

			// Local command
			this.local = async () =>
			{
				const commands = divhunt.Addon('commands');
				const command = commands.ItemGet(this.command);

				if (!command)
				{
					return null;
				}

				const schema = command.Get('out');
				const parsed = this.parse(schema);

				if (!parsed.valid)
				{
					throw new Error('Command does not return array data');
				}

				this.columns = parsed.columns;

				const result = await command.Fn('run', this.params || {});

				return result;
			};

			// Remote command
			this.remote = async () =>
			{
				const command = await this.info();
				const schema = command.data.out;
				const parsed = this.parse(schema);

				if (!parsed.valid)
				{
					throw new Error('Command does not return array data');
				}

				this.columns = parsed.columns;

				const result = await this.run();

				return result;
			};

			// Main loader
			this.load = async () =>
			{
				if (!this.command)
				{
					this.error = 'No command specified';
					this.loading = false;
					return;
				}

				try
				{
					const result = await this.local() || await this.remote();

					this.rows = this.extract(result?.data);
					this.loading = false;

					if (this.onLoad)
					{
						this.onLoad({ columns: this.columns, rows: this.rows });
					}
				}
				catch (err)
				{
					this.error = err.message;
					this.loading = false;

					if (this.onError)
					{
						this.onError({ error: err.message });
					}
				}
			};

			this.load();

			return `
				<div class="holder">
					<e-loader dh-if="loading"></e-loader>
					<div dh-if="error" class="error">{{ error }}</div>
					<e-table
						dh-if="!loading && !error"
						:columns="columns"
						:rows="rows"
						:variant="variant"
						:sortable="sortable"
						:onRowClick="onRowClick"
					></e-table>
				</div>
			`;
		}
	});
})
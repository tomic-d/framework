import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'properties',
	icon: 'list_alt',
	name: 'Properties',
	description: 'Displays a list of properties with name, type, default value, and options.',
	category: 'Data',
	author: 'Divhunt',
	config: {
		config: {
			type: 'object',
			value: {}
		},
		variant: {
			type: 'array',
			value: ['bg-1', 'border'],
			options: ['bg-1', 'bg-2', 'bg-3', 'border', 'size-s', 'size-m']
		},
		_change: {
			type: 'function'
		}
	},
	render: function()
	{
		if(!this.initialized)
		{
			this.initialized = true;
			this.config = divhunt.DataConfig(this.config);
			this.state = divhunt.DataDefine({}, this.config);
		}

		this.items = Object.entries(this.config).map(([name, definition]) =>
		{
			return {name, ...definition};
		});

		this.isMultiple = (item) =>
		{
			return Array.isArray(item.value);
		};

		this.formatValue = (value) =>
		{
			if(value === undefined || value === null)
			{
				return '—';
			}

			if(typeof value === 'boolean')
			{
				return value ? 'true' : 'false';
			}

			if(Array.isArray(value))
			{
				return JSON.stringify(value);
			}

			if(typeof value === 'object')
			{
				return JSON.stringify(value);
			}

			return String(value);
		};

		this.isActive = (item, option) =>
		{
			const value = this.state[item.name];

			if(Array.isArray(value))
			{
				return value.includes(option);
			}

			return value === option;
		};

		this.isEditable = (item) =>
		{
			return (item.type === 'string' || item.type === 'number') && !item.options;
		};

		this.getValue = (item) =>
		{
			const value = this.state[item.name];
			return value !== undefined && value !== null ? String(value) : '';
		};

		this.onInput = (item, e) =>
		{
			let value = e.target.innerText;

			if(item.type === 'number')
			{
				value = value === '' ? undefined : Number(value);
			}

			this.config[item.name].value = value || undefined;
			this.state = divhunt.DataDefine({}, this.config);

			if(this._change)
			{
				this._change({ ...this.state });
			}
		};

		this.toggle = (item, option) =>
		{
			if(this.isMultiple(item))
			{
				const current = this.state[item.name] || [];

				if(current.includes(option))
				{
					this.config[item.name].value = current.filter(v => v !== option);
				}
				else
				{
					this.config[item.name].value = [...current, option];
				}
			}
			else
			{
				const current = this.state[item.name];
				this.config[item.name].value = current === option ? undefined : option;
			}

			this.state = divhunt.DataDefine({}, this.config);

			if(this._change)
			{
				this._change({ ...this.state });
			}
		};

		return `
			<div class="holder" :variant="variant.join(' ')">
				<div dh-for="item in items" class="item">
					<div class="head">
						<span class="name">{{ item.name }}</span>
						<span class="type">{{ item.type }}</span>
						<span dh-if="item.required" class="required">required</span>
						<span dh-if="!isEditable(item) && item.value !== undefined" class="default">{{ formatValue(item.value) }}</span>
						<span dh-if="isEditable(item)" class="default editable" contenteditable="true" dh-change="(e) => onInput(item, e)">{{ getValue(item) }}</span>
					</div>
					<div dh-if="item.description" class="description">{{ item.description }}</div>
					<div dh-if="item.options && item.options.length" class="options">
						<span dh-for="option in item.options" class="option" :active="isActive(item, option)" dh-click="() => toggle(item, option)">{{ option }}</span>
					</div>
				</div>
			</div>
		`;
	}
});

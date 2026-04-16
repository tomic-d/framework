database.Fn('batch', function(type, data)
{
	this.methods.queue = () =>
	{
		return this.StoreGet('queue') || [];
	};

	this.methods.push = (entry) =>
	{
		const queue = this.methods.queue();
		queue.push(entry);
		this.StoreSet('queue', queue);
	};

	this.methods.flush = () =>
	{
		const batch = this.methods.queue().splice(0);
		this.StoreSet('scheduled', false);

		if(batch.length === 1)
		{
			this.methods.single(batch[0]);
		}
		else
		{
			this.methods.multi(batch);
		}
	};

	this.methods.single = async (entry) =>
	{
		try
		{
			const response = await fetch('/api/database/' + entry.type, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(entry.data)
			});

			const result = await response.json();
			entry.resolve({ data: result.data, message: result.message, code: result.code });
		}
		catch(error)
		{
			entry.resolve({ data: null, message: error.message, code: 500 });
		}
	};

	this.methods.multi = async (batch) =>
	{
		try
		{
			const response = await fetch('/api/database/batch', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					operations: batch.map(entry => ({ type: entry.type, data: entry.data }))
				})
			});

			const result = await response.json();

			if(result.code !== 200 || !result.data?.results)
			{
				batch.forEach(entry => entry.resolve({ data: null, message: result.message || 'Batch failed.', code: result.code || 500 }));
				return;
			}

			batch.forEach((entry, index) =>
			{
				const item = result.data.results[index];

				if(!item)
				{
					entry.resolve({ data: null, message: 'No response.', code: 500 });
				}
				else
				{
					entry.resolve({ data: item.data, message: item.message, code: item.code });
				}
			});
		}
		catch(error)
		{
			batch.forEach(entry => entry.resolve({ data: null, message: error.message, code: 500 }));
		}
	};

	this.methods.schedule = () =>
	{
		if(this.StoreGet('scheduled'))
		{
			return;
		}

		this.StoreSet('scheduled', true);
		queueMicrotask(() => this.methods.flush());
	};

	return new Promise((resolve) =>
	{
		this.methods.push({ type, data, resolve });
		this.methods.schedule();
	});
});

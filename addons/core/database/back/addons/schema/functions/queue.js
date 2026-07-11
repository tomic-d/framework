import schema from '../addon.js';

/* Chain a run so DDL applies one at a time, in registration order. The chain is
   what database.Fn('ready') awaits. */

schema.Fn('queue', function(addon, connection)
{
	const chain = (this.StoreGet('chain') || Promise.resolve()).then(() => schema.Fn('run', addon, connection));

	chain.catch(() => {});

	this.StoreSet('chain', chain);
});

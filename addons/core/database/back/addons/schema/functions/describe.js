import schema from '../addon.js';

/* Let pg parse the declared lines itself: build a scratch table from the full
   body and read back exact types, defaults and NOT NULL flags. A regular table
   (not temp — pg forbids temp tables referencing permanent ones) created and
   dropped inside the run transaction, so it is never visible; the advisory lock
   in run keeps the name collision-free. */

schema.Fn('describe', async function(trx, body)
{
	await trx.raw(`CREATE TABLE _onetype_describe (${body.join(', ')})`);

	const columns = await schema.Fn('columns', trx, '_onetype_describe');

	await trx.raw(`DROP TABLE _onetype_describe`);

	return columns;
});

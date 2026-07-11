import { resolve } from 'path';
process.loadEnvFile(resolve(import.meta.dirname, '..', 'sites-app', '.env'));

import onetype from '#framework/load.js';
import database from '#database/load.js';

database.Item({
	id: 'primary',
	hostname: process.env.DB_HOSTNAME,
	username: process.env.DB_USERNAME,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD
});

const author = onetype.Addon('author', (author) =>
{
    author.Table('author');

    author.Field('id', ['number']);
    author.Field('name', ['string']);

    author.Schema('id bigserial primary key');
    author.Schema('name text');
});

const blog = onetype.Addon('blog', (blog) =>
{
    blog.Table('blog');

    blog.Field('id', ['number']);
    blog.Field('slug', ['string']);
    blog.Field('title', ['string']);
    blog.Field('author_id', ['number']);

    blog.Schema('id bigserial primary key');
    blog.Schema('slug varchar(255)');
    blog.Schema('title text');
    blog.Schema('author_id bigint references author(id) on delete cascade');
    blog.Schema('unique (slug)');
});

/* auto-run already synced everything queued above */
await database.Fn('ready');

const knex = database.ItemGet('primary').Get('connection');

const columns = async () => (await knex.raw(`
    select column_name, data_type from information_schema.columns
    where table_schema = current_schema() and table_name = 'blog'`)).rows;

console.log('═══ SYNCED ═══');
console.dir(await columns());

/* break the real blog table, rerun, watch it heal:
   - drop a schema column  → re-added
   - add an unknown column → dropped
   - change a column type  → altered back */
await knex.raw('ALTER TABLE blog DROP COLUMN title');
await knex.raw('ALTER TABLE blog ADD COLUMN legacy text');
await knex.raw('ALTER TABLE blog ALTER COLUMN slug TYPE text');

await blog.SchemaRun();

console.log('\n═══ HEALED ═══');
console.dir(await columns());

await knex.destroy();
process.exit(0);

import { resolve } from 'path';
process.loadEnvFile(resolve(import.meta.dirname, '..', 'sites-app', '.env'));

import onetype from '#framework/load.js';
import database from '#database/load.js';

database.Item({
	id: 'primary',
	client: 'pg',
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
});

const blog = onetype.Addon('blog', (blog) =>
{
    blog.Table('blog');

    blog.Field('id', ['number']);
    blog.Field('slug', ['string']);
    blog.Field('title', ['string']);
    blog.Field('author_id', ['number']);

    blog.Sync((options) =>
    {
        options.Unique('slug');
        options.Relation('author_id', 'author', { onDelete: 'CASCADE' });
    });
});

const knex = database.ItemGet('primary').Get('connection');

/* fresh tables, both addons synced (FK target must exist) */
await knex.schema.dropTableIfExists('blog');
await knex.schema.dropTableIfExists('author');
await author.SyncRun();
await blog.SyncRun();

/* now break the real blog table so the next plan has something in every group:
   - drop a schema column  → shows up in columns.add
   - add an unknown column → shows up in columns.extra
   - drop the FK           → shows up in relations
   - store a json column as text → shows up in columns.mismatched (if any json field) */
await knex.schema.alterTable('blog', (table) =>
{
    table.dropColumn('title');         // schema wants it back → columns.add
    table.string('legacy');            // not in schema        → columns.extra
    table.dropForeign('author_id', 'blog_author_id_foreign'); // → relations
});

console.log('═══ SCHEMA (live database state) ═══');
console.dir(await blog.SyncSchema(), { depth: null });

console.log('\n═══ PLAN (what is out of sync) ═══');
console.dir(await blog.SyncPlan(), { depth: null });

await knex.destroy();
process.exit(0);
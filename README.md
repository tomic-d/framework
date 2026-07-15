# OneType

A full-stack JavaScript framework built entirely from scratch. No React, no Vue, no Express, no ORM. One abstraction runs the whole stack.

Most apps are glued together from a dozen libraries that were never meant to work as one. OneType is the opposite: one idea, the addon, spans the database, the server and the browser. You describe what something is once, and you get the table, the validated API, the events and the live, reactive frontend from that single definition.

Built and maintained by Dejan Tomic. It powers real production services, including iamdejan.com, which runs on it end to end.

## The one idea

Define an addon once:

```js
const posts = onetype.Addon('posts', (addon) =>
{
	addon.Table('posts');

	addon.Field('id', ['number']);
	addon.Field('title', ['string', null, true]);
	addon.Field('slug', ['string', null, true]);
	addon.Field('views', ['number', 0]);
	addon.Field('created_at', { type: 'string', metadata: { cast: 'date' } });

	addon.Schema('id bigserial primary key');
	addon.Schema('title varchar(255) not null');
	addon.Schema('slug varchar(255) not null');
	addon.Schema('views bigint not null default 0');
	addon.Schema('created_at timestamptz not null default now()');
	addon.Schema('unique (slug)');
	addon.Schema('index (created_at)');
});
```

From that single definition you automatically get:

- a PostgreSQL table, created and kept in sync on every boot: missing columns are added, changed types are migrated, dropped columns are removed, indexes are ensured. The definition is the migration.
- validation on every write, driven by the field types
- an item layer with events around add, modify and remove
- a query builder scoped to the addon
- the same addon, items and functions available in the browser

No schema files, no migration folders, no wiring the backend to the frontend by hand. The definition is the wiring.

## From a row to a pixel

The whole stack in five small steps, all real code.

### 1. Query it

```js
const recent = await posts.Find()
	.filter('deleted_at', null, 'NULL')
	.sort('created_at', 'DESC')
	.page(1)
	.limit(20)
	.many();

const post = await posts.Find().filter('slug', 'hello-world').one();
const total = await posts.Find().count();
```

Create and update go through items, so events and validation always fire:

```js
const item = posts.Item({ title: 'Hello world', slug: 'hello-world' });

await item.Create();
await item.Set('views', item.Get('views') + 1) && item.Update();
```

### 2. Expose it

A command is a complete action: typed input, typed output, guard conditions and resolve messages. One flag makes it an HTTP endpoint.

```js
commands.Item({
	id: 'posts:list',
	exposed: true,
	method: 'GET',
	endpoint: '/api/posts',
	description: 'Lists the newest posts, paginated.',
	in: {
		page: {
			type: 'number',
			value: 1,
			description: 'Page to fetch.'
		}
	},
	out: {
		items: {
			type: 'array',
			each: { type: 'object', config: 'posts.post' },
			description: 'Posts, newest first.'
		}
	},
	condition: function()
	{
		if(!this.http.state.user)
		{
			return 'Sign in to read posts.';
		}
	},
	callback: async function(properties, resolve)
	{
		const items = await posts.Find()
			.sort('created_at', 'DESC')
			.page(properties.page)
			.limit(20)
			.many();

		resolve({ items: items.map((item) => item.GetData()) }, 'Here you go.');
	}
});
```

Input is validated against `in` before your callback runs. Output is validated against `out` after it. `condition` runs before everything and a returned string becomes a 403. Bad requests never reach your logic.

### 3. Call it from the browser

The same command API exists on the front. The third argument routes the call over HTTP:

```js
const result = await $ot.command('posts:list', { page: 1 }, true);

console.log(result.data.items, result.message, result.code);
```

### 4. Render it, reactively

The rendering engine is built from scratch: proxy-based reactivity, directives and DOM patching that preserves focus, scroll and inputs. This is the React you do not need.

```js
elements.ItemAdd({
	id: 'posts-list',
	name: 'Posts',
	render: function()
	{
		this.items = [];
		this.query = '';
		this.loading = true;

		this.Compute(() =>
		{
			this.visible = this.items.filter((post) => post.title.toLowerCase().includes(this.query.toLowerCase()));
		});

		this.load = async () =>
		{
			const result = await $ot.command('posts:list', { page: 1 }, true);

			this.items = result.data.items;
			this.loading = false;
		};

		this.OnReady(() => this.load());

		return `
			<input ot-input="({ value }) => query = value" placeholder="Search posts..." />

			<div ot-if="loading">Loading...</div>

			<ul ot-if="!loading">
				<li ot-for="post in visible" :ot-key="post.id" ot-click="() => open(post)">
					{{ post.title }} <span>{{ post.views }} views</span>
				</li>
			</ul>

			<p ot-if="!loading && !visible.length">Nothing matches "{{ query }}".</p>
		`;
	}
});
```

Assign to `this` and the DOM updates. No setState, no hooks, no dependency arrays. `Compute` re-runs when anything it reads changes. Typing in the input filters the list live.

### 5. Give it a page

```js
pages.Item({
	id: 'post',
	route: ['/posts', '/posts/:slug'],
	title: 'Posts',
	areas: {
		content: function()
		{
			return `<e-posts-list></e-posts-list>`;
		}
	}
});
```

Routes support parameters and lists of patterns. Navigation patches the DOM in place.

## Reactivity, closer up

```js
render: function()
{
	this.count = 0;

	this.double = () => this.count * 2;

	this.On('posts:created', () => this.count++);

	this.OnMounted(() => console.log('in the DOM'));
	this.OnDestroy(() => console.log('cleaned up, listeners included'));

	return `
		<button ot-click="() => count++">Clicked {{ count }} times, double is {{ double() }}</button>
	`;
}
```

The directive set covers real apps without leaving the template: `ot-if`, `ot-show`, `ot-for` with keyed recycling, `ot-click` and friends with modifiers, `ot-input`, `ot-change`, `:attribute` binding, `ot-html`, `ot-node` for mounting raw render trees, `ot-command` for wiring a button straight to a command, and `ot-command-submit` for posting a whole form to a command with loading and error state bound for you:

```html
<ot-command-submit command="auth:login" :api="true" :_success="done">
	<input name="email" type="email" />
	<input name="password" type="password" />
	<button type="submit" :disabled="command.loading">Sign in</button>
	<p ot-if="command.error">{{ command.error }}</p>
</ot-command-submit>
```

## Pipelines

Multi-step domain logic with declared inputs, outputs and per-step contracts. Steps compose, validate and report as one unit:

```js
onetype.Pipeline('auth:register', {
	description: 'Create a team and its first user, then issue a session.',
	in: {
		name: { type: 'string', required: true },
		email: { type: 'string', required: true },
		password: { type: 'string', required: true }
	},
	out: {
		user: { type: 'object', config: 'workspace.user' },
		token: { type: 'string', required: true }
	}
})

.Join('guard', 10, {
	callback: async function({ email }, resolve)
	{
		if(await users.Find().filter('email', email).count())
		{
			return resolve(null, 'A user with this email already exists.', 400);
		}
	}
})

.Join('user', 20, {
	callback: async function({ name, email, password })
	{
		const user = users.Item({ name, email, password: await auth.Fn('password.hash', password) });

		await user.Create();

		return { user: user.Get(['id', 'name', 'email']) };
	}
});

const result = await onetype.PipelineRun('auth:register', { name, email, password });
```

Every step's output feeds the next step's input. A failed step stops the run with a message and a code, and executed steps get a rollback hook.

## Events and middleware

Everything that happens is observable, and everything important is interceptable:

```js
onetype.EmitOn('@addon.item.added', (item) => console.log(item.addon.GetName(), 'grew'));

onetype.MiddlewareIntercept('servers.http.request', async (middleware) =>
{
	middleware.value.state.user = await auth.Fn('session', cookie);

	await middleware.next();
});
```

Registered emitters and middlewares carry descriptions and typed payload schemas, so the system is self-documenting down to the event level.

## Named schemas

Define a shape once, reference it by name everywhere: command outputs, pipeline contracts, nested configs.

```js
onetype.DataSchema('workspace.user', {
	id: { type: 'number', description: 'Unique user id.' },
	name: { type: 'string', description: 'Display name.' },
	email: { type: 'string', description: 'Sign in email.' }
});

out: {
	user: { type: 'object', config: 'workspace.user' }
}
```

## What's inside

Everything a real product needs, written from zero and unified under the addon model:

| Area | What it gives you |
| --- | --- |
| Database | Own ORM over SQLite, MySQL and PostgreSQL, with schema sync, query builder, relations and versioned history |
| Servers | HTTP and gRPC servers and clients, built in |
| Render | A reactive rendering engine with directives: components, reactivity and DOM patching from scratch |
| Commands | Typed, exposable API endpoints with input and output validation and guard conditions |
| Pipelines | Multi-step domain logic with contracts, tracing and rollback hooks |
| Queue | Background task queues |
| Assets | An asset pipeline that bundles the front from plain folders |
| AI | An agents module for building on top of LLMs |
| Services | Cloudflare, Playwright and other integrations |

The same abstraction spans the database, the server and the browser. That is what makes it isomorphic: one mental model from the SQL row to the rendered pixel.

## Why it exists

I wanted to build entire products alone, at speed, without fighting the seams between someone else's ORM, someone else's router and someone else's view layer. So I built the layer underneath all of them. It let one person ship and run production software, including a web builder with 30,000+ users, that would normally take a team and a stack of dependencies.

## Run

```
npm install @onetype/framework
```

```js
import onetype from '@onetype/framework';
import '@onetype/framework/commands';
import '@onetype/framework/database';
```

Requires Node.js >= 18.

## License

MIT

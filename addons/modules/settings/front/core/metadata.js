import settings from '../addon.js';

settings.Metadata('title', 'Settings');
settings.Metadata('description', 'Centralized, persistent UI and app state.');
settings.Metadata('overview', `
## Settings

Settings hold the UI and application state in one place. Things like the active app, the current mode, panel sizes or theme. Instead of scattering these across random state keys, they live here, get persisted to the browser, and come back when the page reloads.

Each setting is an item with a value, a default, a type, and a persist flag:

\`\`\`js
settings.Item({
	id: 'workspace.app',
	default: 'builder',
	type: 'string',
	persist: true
});
\`\`\`

### Reading and writing

\`\`\`js
settings.Fn('set', 'workspace.app', 'forms');
settings.Fn('get', 'workspace.app');
\`\`\`

Calling set updates the value, saves it if the setting is persisted, and fires settings.change.

### How it works

Only items with persist set to true are written to local storage. On document ready the stored values load back in, and settings.change fires for each one. To react, listen to settings.change with its id and value and handle the keys you care about.
`.trim());

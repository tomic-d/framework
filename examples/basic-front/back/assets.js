import assets from 'divhunt/assets';

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

assets.Fn('import', ['framework', 'commands', 'pages']);

assets.Item({ type: 'js', order: 10, path: resolve(root, 'front') });
assets.Item({ type: 'css', order: 10, path: resolve(root, 'front') });

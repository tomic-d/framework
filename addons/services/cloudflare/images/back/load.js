import images from '#cloudflare-images/addon.js';

/* Expose */
import '#cloudflare-images/expose.js';

/* Functions */
import '#cloudflare-images/functions/api.js';
import '#cloudflare-images/functions/meta.js';
import '#cloudflare-images/functions/meta/detect.js';
import '#cloudflare-images/functions/meta/dimensions/png.js';
import '#cloudflare-images/functions/meta/dimensions/jpeg.js';
import '#cloudflare-images/functions/meta/dimensions/gif.js';
import '#cloudflare-images/functions/meta/dimensions/webp.js';

/* Commands */
import '#cloudflare-images/items/commands/upload.js';
import '#cloudflare-images/items/commands/delete.js';
import '#cloudflare-images/items/commands/list.js';
import '#cloudflare-images/items/commands/get.js';

export default images;

import onetype from '#framework/load.js';
import pages from './addon.js';

onetype.$ot.page = function(route, parameters = {})
{
	return pages.Fn('change', route, parameters, { path: true });
};

export default pages;

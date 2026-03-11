import onetype from '#framework/load.js';
import pages from './addon.js';

onetype.$ot.page = function(route, parameters = {})
{
	return pages.Fn('change', null, route, parameters);
};

export default pages;

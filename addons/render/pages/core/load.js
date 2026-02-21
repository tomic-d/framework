import divhunt from '#framework/load.js';
import pages from './addon.js';

divhunt.$dh.page = function(route, parameters = {})
{
	return pages.Fn('change', route, parameters, { path: true });
};

export default pages;

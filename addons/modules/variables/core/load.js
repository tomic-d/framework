import onetype from '#framework/load.js';
import variables from '#variables/core/addon.js';

import '#variables/core/item/catch/add.js';

import '#variables/core/functions/process.js';

onetype.$ot.var = function(string)
{
    return variables.Fn('process', string);
};

export default variables;

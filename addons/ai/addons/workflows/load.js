import ai from '#ai/addon.js';

/* Emitters */
import '#ai/addons/workflows/core/emitters/start.js';
import '#ai/addons/workflows/core/emitters/plan.js';
import '#ai/addons/workflows/core/emitters/step.js';
import '#ai/addons/workflows/core/emitters/task.js';
import '#ai/addons/workflows/core/emitters/done.js';


/* Functions */
import '#ai/addons/workflows/item/functions/utils/emit.js';
import '#ai/addons/workflows/item/functions/utils/history.js';
import '#ai/addons/workflows/item/functions/utils/state.js';

import '#ai/addons/workflows/item/functions/agents/tasks.js';
import '#ai/addons/workflows/item/functions/agents/next.js';
import '#ai/addons/workflows/item/functions/agents/summary.js';
import '#ai/addons/workflows/item/functions/agents/execute.js';

import '#ai/addons/workflows/item/functions/modes/action.js';
import '#ai/addons/workflows/item/functions/run.js';

export default ai.workflows;

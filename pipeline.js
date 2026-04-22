import onetype from './lib/load.js';

function log(label, data)
{
    console.log('\n─── ' + label + ' ───');
    console.log(JSON.stringify(data, null, 2));
}

/* Test 1: Happy path */

const happy = onetype.Pipeline('happy',
{
    description: 'Happy path test',
    in:  { user: ['string', '', true] },
    out: { user: ['string'], validated: ['boolean'], deployed: ['boolean'], selfRan: ['boolean'] },
    callback: async (properties, resolve) =>
    {
        console.log('SELF callback ran, properties.user =', properties.user);
        resolve({selfRan: true}, 'Self done', 200);
    },
    commit:   async (properties) => console.log('SELF commit'),
    rollback: async (properties, err) => console.log('SELF rollback')
});

happy.Join('validate', 10,
{
    callback: async (properties, resolve) =>
    {
        console.log('validate callback ran, properties.user =', properties.user);
        resolve({validated: true}, 'Validated', 200);
    },
    commit:   async (properties) => console.log('validate commit'),
    rollback: async (properties, err) => console.log('validate rollback', err.message)
});

happy.Join('deploy', 20,
{
    callback: async (properties, resolve) =>
    {
        console.log('deploy callback ran, properties.validated =', properties.validated);
        resolve({deployed: true}, 'Deployed', 200);
    },
    commit:   async (properties) => console.log('deploy commit'),
    rollback: async (properties, err) => console.log('deploy rollback', err.message)
});

const result1 = await onetype.PipelineRun('happy', {user: 'alice'});
log('HAPPY RESULT', result1);

/* Test 2: Fail in second join */

const fail = onetype.Pipeline('fail', {in: {}, out: {}});

fail.Join('step-one', 10,
{
    callback: async (properties, resolve) => resolve({a: 1}, 'OK', 200),
    commit:   async () => console.log('step-one commit (should NOT run)'),
    rollback: async (properties, err) => console.log('step-one rollback ran')
});

fail.Join('step-two', 20,
{
    callback: async (properties, resolve) => resolve(null, 'Something broke', 500),
    commit:   async () => console.log('step-two commit (should NOT run)'),
    rollback: async (properties, err) => console.log('step-two rollback ran')
});

fail.Join('step-three', 30,
{
    callback: async (properties, resolve) => resolve({c: 3}, 'OK', 200),
    commit:   async () => console.log('step-three commit (should NOT run)'),
    rollback: async (properties, err) => console.log('step-three rollback ran')
});

const result2 = await onetype.PipelineRun('fail', {});
log('FAIL RESULT', result2);

/* Test 3: Throw inside callback */

const thrown = onetype.Pipeline('thrown', {in: {}, out: {}});

thrown.Join('boom', 10,
{
    callback: async (properties, resolve) =>
    {
        throw onetype.Error(400, 'Blew up.');
    },
    rollback: async (properties, err) => console.log('boom rollback ran, error code =', err.code)
});

const result3 = await onetype.PipelineRun('thrown', {});
log('THROWN RESULT', result3);

/* Test 4: Invalid input */

const invalid = onetype.Pipeline('invalid',
{
    in:  { email: ['string', '', true] },
    out: {}
});

invalid.Join('never', 10,
{
    callback: async (properties, resolve) => { console.log('SHOULD NOT RUN'); resolve(null, 'OK', 200); }
});

const result4 = await onetype.PipelineRun('invalid', {});
log('INVALID INPUT RESULT', result4);

/* Test 5: Events */

console.log('\n─── EVENT HOOKS ───');

onetype.EmitOn('@pipeline.add',      (p) => console.log('[event] add', p.name));
onetype.EmitOn('@pipeline.run',      (p, r) => console.log('[event] run', p.name, 'code', r.code));
onetype.EmitOn('@pipeline.commit',   (p, r) => console.log('[event] commit', p.name));
onetype.EmitOn('@pipeline.rollback', (p, r, e) => console.log('[event] rollback', p.name, 'join', e.join));
onetype.EmitOn('@pipeline.join',     (p, j) => console.log('[event] join', p.name, j.name));

const events = onetype.Pipeline('events', {in: {}, out: {}});

events.Join('e1', 10,
{
    callback: async (properties, resolve) => resolve({x: 1}, 'OK', 200),
    commit:   async () => {}
});

await onetype.PipelineRun('events', {});

/* Test: requires (presence check) */

console.log('\n─── REQUIRES TEST ───');

const arr = onetype.Pipeline('arr-test', {in: {}, out: {}});

arr.Join('a', 10, {
    callback: (properties) => ({server: {id: 1}, related: {install: true}})
});

arr.Join('b', 20, {
    requires: ['server', 'related'],
    callback: (properties) => console.log('[b] got server:', !!properties.server, 'related:', !!properties.related)
});

arr.Join('c', 30, {
    requires: ['missing_key'],
    callback: () => console.log('[c] SHOULD NOT RUN')
});

const arrResult = await onetype.PipelineRun('arr-test', {});
console.log('code:', arrResult.code, 'message:', arrResult.message);

/* Test: this.stop() — early success exit */

console.log('\n─── STOP TEST ───');

const stopPipe = onetype.Pipeline('stop-test', {in: {}, out: {}});

stopPipe.Join('a', 10, {
    callback: async function(properties, resolve)
    {
        console.log('[a] ran');
        resolve({a: 1});
    }
});

stopPipe.Join('b', 20, {
    callback: async function(properties, resolve)
    {
        console.log('[b] stopping');
        this.stop();
        resolve({b: 2});
    },
    commit: async () => console.log('[b commit] ran'),
    rollback: async () => console.log('[b rollback] ran — SHOULD NOT')
});

stopPipe.Join('c', 30, {
    callback: async () => console.log('[c] SHOULD NOT RUN'),
    commit: async () => console.log('[c commit] SHOULD NOT RUN')
});

const stopResult = await onetype.PipelineRun('stop-test', {});
console.log('code:', stopResult.code, 'data:', stopResult.data);

/* Test: Listeners */

console.log('\n─── LISTENERS TEST ───');

const listened = onetype.Pipeline('listened', {in: {}, out: {}});

listened.Join('step-a', 10, {
    callback: async (properties, resolve) => resolve({a: 1})
});

listened.Join('step-b', 20, {
    callback: async (properties, resolve) => resolve({b: 2})
});

listened.OnJoin((properties, join, entry) =>
{
    console.log('[live] join fired:', entry.step + '/' + entry.total, join.name, 'time:', entry.time);
});

listened.OnCommit((properties) =>
{
    console.log('[live] commit fired, properties:', properties);
});

listened.OnRollback((properties, error) =>
{
    console.log('[live] rollback fired, error:', error.message);
});

console.log('running listened...');
await onetype.PipelineRun('listened', {});

/* Test: Listeners on fail */

console.log('\n─── LISTENERS FAIL TEST ───');

const listenedFail = onetype.Pipeline('listened-fail', {in: {}, out: {}});

listenedFail.Join('step-a', 10, {
    callback: async (properties, resolve) => resolve({a: 1})
});

listenedFail.Join('step-b', 20, {
    callback: async (properties, resolve) => resolve(null, 'boom', 500)
});

listenedFail.OnJoin((properties, join, entry) =>
{
    console.log('[live fail] join fired:', join.name, 'code:', entry.result.code, 'message:', entry.result.message);
});

listenedFail.OnRollback((properties, error) =>
{
    console.log('[live fail] rollback listener fired — join that failed:', error.join);
});

listenedFail.OnCommit(() =>
{
    console.log('[live fail] commit fired — SHOULD NOT');
});

await onetype.PipelineRun('listened-fail', {});

/* Give listeners time to fire (they are fire-and-forget) */
await new Promise(r => setTimeout(r, 50));

/* Test 6: When (skip) */

console.log('\n─── WHEN TEST ───');

const whenPipe = onetype.Pipeline('when-test', {in: {}, out: {}});

whenPipe.Join('always', 10, {
    callback: async (properties, resolve) => { console.log('[always] ran'); resolve({a: 1}); }
});

whenPipe.Join('maybe', 20, {
    when: function(properties) { return properties.a === 999; },
    callback: async (properties, resolve) => { console.log('[maybe] RAN — WRONG'); resolve({b: 2}); }
});

whenPipe.Join('after', 30, {
    callback: async (properties, resolve) => { console.log('[after] ran, a=', properties.a, 'b=', properties.b); resolve({c: 3}); }
});

const whenResult = await onetype.PipelineRun('when-test', {});
console.log('trace joins:', whenResult.trace.joins.map(j => `${j.name}${j.skipped ? ' (skipped)' : ''}`));

/* Test 7: Timeout */

console.log('\n─── TIMEOUT TEST ───');

const timeoutPipe = onetype.Pipeline('timeout-test', {timeout: 200, in: {}, out: {}});

timeoutPipe.Join('slow', 10, {
    callback: async (properties, resolve) =>
    {
        console.log('[slow] starting 500ms sleep');
        await new Promise(r => setTimeout(r, 500));
        console.log('[slow] finished (should not log if timeout works)');
        resolve({done: true});
    },
    rollback: async () => console.log('[slow rollback]')
});

const timeoutResult = await onetype.PipelineRun('timeout-test', {});
console.log('code:', timeoutResult.code, 'message:', timeoutResult.message);

/* Test 8: this.id + this.log() + running */

console.log('\n─── RUNNING / this.id / this.log() ───');

const logged = onetype.Pipeline('logged', {in: {}, out: {}});

logged.Join('step', 10, {
    callback: async function(properties, resolve)
    {
        console.log('[step] this.id.trace =', this.id.trace, 'root =', this.id.root, 'parent =', this.id.parent);
        this.log('started');
        this.log('processing item 1');
        this.log('processing item 2');
        this.log('done');
        console.log('running registry has:', Object.keys(onetype.PipelineRunning()).length);
        resolve({ok: true});
    }
});

const loggedResult = await onetype.PipelineRun('logged', {});
console.log('running registry AFTER:', Object.keys(onetype.PipelineRunning()).length);
console.log('logs from trace:', loggedResult.trace.joins[0].logs);

/* Test 9: Lock */

console.log('\n─── LOCK TEST ───');

const locked = onetype.Pipeline('locked', {in: {}, out: {}});

locked.Join('slow', 10,
{
    callback: async (properties, resolve) =>
    {
        console.log('[' + properties.id + '] start at', Date.now() % 10000);
        await new Promise(r => setTimeout(r, 100));
        console.log('[' + properties.id + '] end at',   Date.now() % 10000);
        resolve(null, 'OK', 200);
    }
});

const t0 = Date.now();

const [a, b, c] = await Promise.all(
[
    onetype.PipelineRun('locked', {id: 'A'}, {lock: 'server-1'}),
    onetype.PipelineRun('locked', {id: 'B'}, {lock: 'server-1'}),
    onetype.PipelineRun('locked', {id: 'C'}, {lock: 'server-2'})
]);

console.log('total elapsed:', Date.now() - t0, 'ms (expect ~200 — A+B serial, C parallel)');

/* Test: Pipeline.Test() and RunTests */

console.log('\n─── PIPELINE TESTS TEST ───');

const calc = onetype.Pipeline('calc', {
    in:  { a: ['number', 0], b: ['number', 0] },
    out: { sum: ['number'] }
});

calc.Join('add', 10, {
    callback: (properties, resolve) =>
    {
        if(properties.a < 0)
        {
            return resolve(null, 'Negative not allowed.', 400);
        }

        resolve({sum: properties.a + properties.b});
    }
});

calc.Test('basic addition', {
    properties: {a: 2, b: 3},
    out: {sum: ['number', 5]}
});

calc.Test('zero case', {
    properties: {a: 0, b: 0},
    code: 200
});

calc.Test('negative fails', {
    properties: {a: -1, b: 5},
    code: 400
});

calc.Test('wrong expected code', {
    properties: {a: 1, b: 2},
    code: 404            /* wrong on purpose */
});

const testsResult = await onetype.PipelineRunTests('calc');
console.log('passed:', testsResult.passed, '/', testsResult.total, '(' + testsResult.percent + '%)');
testsResult.results.forEach(r =>
{
    console.log(' -', r.passed ? 'PASS' : 'FAIL', r.name, 'code=' + r.code);
});

/* Test 10: Nested pipelines — trace/parent/root propagation */

console.log('\n─── NESTED TRACE TEST ───');

const inner = onetype.Pipeline('inner', {in: {}, out: {}});

inner.Join('step', 10, {
    callback: async function(properties, resolve)
    {
        console.log('[inner] trace =', this.id.trace, 'parent =', this.id.parent, 'root =', this.id.root);
        resolve({inner: true});
    }
});

const outer = onetype.Pipeline('outer', {in: {}, out: {}});

outer.Join('step', 10, {
    callback: async function(properties, resolve)
    {
        console.log('[outer] trace =', this.id.trace, 'parent =', this.id.parent, 'root =', this.id.root);

        await this.Pipeline('inner', {});

        resolve({outer: true});
    }
});

await onetype.PipelineRun('outer', {});

/* Test 11: Nested running registry — child appears under root */

console.log('\n─── NESTED REGISTRY TEST ───');

const child = onetype.Pipeline('child', {in: {}, out: {}});

child.Join('step', 10, {
    callback: async function(properties, resolve)
    {
        const running = onetype.PipelineRunning();
        const keys    = Object.keys(running);

        console.log('[child] running roots =', keys.length);

        if(keys.length === 1)
        {
            const root = running[keys[0]];

            console.log('[child] root pipeline =', root.pipeline, 'children =', root.children.length);

            if(root.children.length > 0)
            {
                console.log('[child] child pipeline =', root.children[0].pipeline);
            }
        }

        const found = onetype.PipelineRunningFind(this.id.trace);

        console.log('[child] find by trace =', found ? found.pipeline : null);

        resolve({});
    }
});

const parent = onetype.Pipeline('parent', {in: {}, out: {}});

parent.Join('step', 10, {
    callback: async function(properties, resolve)
    {
        await this.Pipeline('child', {});
        resolve({});
    }
});

await onetype.PipelineRun('parent', {});

/* Test 12: Nested must skip own wrap */

console.log('\n─── NESTED WRAP SKIP TEST ───');

let outerWrapRan = 0;
let innerWrapRan = 0;

const outerWrap = onetype.Pipeline('outer-wrap', {
    wrap: (run) =>
    {
        outerWrapRan++;
        return run({tx: 'outer'});
    },
    in: {}, out: {}
});

outerWrap.Join('step', 10, {
    callback: async function(properties, resolve)
    {
        console.log('[outer-wrap] wrap =', properties, 'context.wrap =', this.wrap);
        await this.Pipeline('inner-wrap', {});
        resolve({});
    }
});

const innerWrap = onetype.Pipeline('inner-wrap', {
    wrap: (run) =>
    {
        innerWrapRan++;
        return run({tx: 'inner'});
    },
    in: {}, out: {}
});

innerWrap.Join('step', 10, {
    callback: async function(properties, resolve)
    {
        console.log('[inner-wrap] context.wrap =', this.wrap);
        resolve({});
    }
});

await onetype.PipelineRun('outer-wrap', {});

console.log('outer wrap ran:', outerWrapRan, '(expect 1) | inner wrap ran:', innerWrapRan, '(expect 0 — nested inherits parent tx)');

process.exit(0);

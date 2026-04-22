/* Paste this into browser console */

(async () =>
{
    console.clear();
    console.log('%c─── PIPELINE BROWSER TEST ───', 'color: cyan; font-weight: bold');

    /* ── Register pipeline ── */

    onetype.Pipeline('demo', {
        description: 'Browser demo pipeline',
        timeout: 5000,
        in: {
            user: ['string', '', true],
            env:  {type: 'string', value: 'dev', options: ['dev', 'staging', 'prod']}
        },
        out: {
            user:      ['string'],
            env:       ['string'],
            validated: ['boolean'],
            processed: ['boolean'],
            notified:  ['boolean']
        }
    })
    .Join('validate', 10, {
        description: 'Check user exists.',
        out: {validated: ['boolean']},
        callback: async function(properties, resolve)
        {
            this.log('checking user ' + properties.user);

            if(properties.user === 'missing')
            {
                return resolve(null, 'User not found.', 404);
            }

            resolve({validated: true});
        },
        rollback: async () => console.log('[validate rollback]')
    })
    .Join('process', 20, {
        description: 'Heavy work.',
        requires: ['validated'],
        out: {processed: ['boolean']},
        callback: async function(properties, resolve)
        {
            this.log('processing started');
            await new Promise(r => setTimeout(r, 50));
            this.log('processing done');

            if(properties.user === 'broken')
            {
                throw onetype.Error(500, 'Processing failed.');
            }

            resolve({processed: true});
        },
        commit:   async () => console.log('[process commit]'),
        rollback: async () => console.log('[process rollback]')
    })
    .Join('notify', 30, {
        description: 'Send notification (only prod).',
        when: function(properties) { return properties.env === 'prod'; },
        out: {notified: ['boolean']},
        callback: async (properties, resolve) =>
        {
            console.log('[notify] sending for', properties.env);
            resolve({notified: true});
        }
    });

    /* ── Listeners ── */

    const demo = onetype.PipelineGet('demo');

    demo.OnJoin((properties, join, entry) =>
    {
        console.log('[live] ' + entry.step + '/' + entry.total, join.name, 'code=' + entry.result.code, 'time=' + entry.time + 'ms');
    });

    demo.OnCommit(() => console.log('%c[live] commit', 'color: lime'));
    demo.OnRollback((properties, error) => console.log('%c[live] rollback: ' + error.message, 'color: orange'));

    /* ── Declare tests ── */

    demo
    .Test('happy dev', {
        description: 'Valid user in dev, notify skipped.',
        properties: {user: 'alice', env: 'dev'},
        code: 200,
        out: {validated: ['boolean', true], processed: ['boolean', true]}
    })
    .Test('happy prod', {
        description: 'Valid user in prod, notify runs.',
        properties: {user: 'alice', env: 'prod'},
        code: 200,
        out: {notified: ['boolean', true]}
    })
    .Test('missing user', {
        description: 'Missing user returns 404.',
        properties: {user: 'missing', env: 'dev'},
        code: 404
    })
    .Test('broken user', {
        description: 'Broken user throws 500.',
        properties: {user: 'broken', env: 'dev'},
        code: 500
    })
    .Test('invalid env', {
        description: 'Random env fails validation.',
        properties: {user: 'alice', env: 'random'},
        code: 400
    })
    .Test('expected wrong', {
        description: 'On purpose wrong expected code to show fail.',
        properties: {user: 'alice', env: 'dev'},
        code: 418
    });

    /* ── Run individual test ── */

    console.log('\n%c1. RunTest — happy dev', 'color: cyan');
    const t1 = await demo.RunTest('happy dev');
    console.log('passed:', t1.passed, 'code:', t1.code);

    /* ── Run all tests on this pipeline ── */

    console.log('\n%c2. RunTests — demo', 'color: cyan');
    const s1 = await demo.RunTests();
    console.log('passed:', s1.passed + '/' + s1.total, '(' + s1.percent + '%)');
    s1.results.forEach(r => console.log(' ', r.passed ? '✓' : '✗', r.name, 'code=' + r.code));

    /* ── Run ALL pipeline tests (demo + any others registered) ── */

    console.log('\n%c3. PipelineTests — all pipelines', 'color: cyan');
    const all = await onetype.PipelineTests();
    console.log('total:', all.passed + '/' + all.total, '(' + all.percent + '%)');

    all.pipelines.forEach(pipeline =>
    {
        console.log('\n', pipeline.name, '—', pipeline.passed + '/' + pipeline.total, '(' + pipeline.percent + '%)');

        pipeline.results.forEach(r =>
        {
            console.log(' ', r.passed ? '✓' : '✗', r.name, 'code=' + r.code);

            if(!r.passed)
            {
                console.log('    ', r.message);
            }
        });
    });

    /* ── $ot.pipeline shortcut ── */

    console.log('\n%c4. $ot.pipeline shortcut', 'color: cyan');

    try
    {
        const data = await $ot.pipeline('demo', {user: 'alice', env: 'dev'});
        console.log('ok:', data);
    }
    catch(e)
    {
        console.log('threw:', e.code, e.message);
    }

    try
    {
        await $ot.pipeline('demo', {user: 'missing', env: 'dev'});
    }
    catch(e)
    {
        console.log('threw on missing:', e.code, e.message);
    }

    /* ── Schema ── */

    console.log('\n%c5. Schema', 'color: cyan');
    console.log(onetype.PipelineSchema('demo'));

    /* ── Running registry during run ── */

    console.log('\n%c6. PipelineRunning mid-flight', 'color: cyan');

    const slowPromise = onetype.PipelineRun('demo', {user: 'alice', env: 'dev'});
    await new Promise(r => setTimeout(r, 20));
    console.log('active:', Object.keys(onetype.PipelineRunning()).length);
    await slowPromise;
    console.log('after finish:', Object.keys(onetype.PipelineRunning()).length);

    console.log('\n%c─── DONE ───', 'color: cyan; font-weight: bold');
})();

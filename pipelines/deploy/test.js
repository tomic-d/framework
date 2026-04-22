import onetype from '../../lib/load.js';
import './pipeline.js';

function log(label, result)
{
    console.log('\n═══ ' + label + ' ═══');
    console.log('code:', result.code);
    console.log('message:', result.message);
    console.log('time:', result.time);
    console.log('data:', result.data);
}

/* Happy path */

console.log('─── HAPPY ───');
log('happy', await onetype.PipelineRun('deploy', {server: 'prod-1', build: 'app-1.2.3.tar', version: '1.2.3'}));

/* Fail at validate (404) */

console.log('\n─── VALIDATE FAILS ───');
log('validate-fail', await onetype.PipelineRun('deploy', {server: 'missing', build: 'app.tar', version: '1.0.0'}));

/* Fail at activate (throw) */

console.log('\n─── ACTIVATE THROWS ───');
log('activate-throw', await onetype.PipelineRun('deploy', {server: 'prod-1', build: 'app.tar', version: 'broken'}));

/* Lock — same server can only run one deploy at a time */

console.log('\n─── LOCK: two deploys same server ───');
const t0 = Date.now();

await Promise.all(
[
    onetype.PipelineRun('deploy', {server: 'prod-1', build: 'a.tar', version: '1'}, {lock: 'prod-1'}),
    onetype.PipelineRun('deploy', {server: 'prod-1', build: 'b.tar', version: '2'}, {lock: 'prod-1'})
]);

console.log('elapsed:', Date.now() - t0, 'ms  (expect ~200 — two sequential 100ms runs)');

process.exit(0);

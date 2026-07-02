import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTaskBody, verdictToString } from '../packages/components/nodes/tools/LoopQuest/core.ts';

test('buildTaskBody defaults to gate + swiper and shapes payload', () => {
  const body = buildTaskBody({ content: 'ship it?' }, { module: 'swiper', mode: 'gate' });
  assert.equal(body['module'], 'swiper');
  assert.equal(body['mode'], 'gate');
  assert.deepEqual(body['payload'], { content: 'ship it?', body: 'ship it?' });
  assert.equal(body['source'], 'flowise');
});

test('buildTaskBody carries grounding fields + gate timeout', () => {
  const body = buildTaskBody(
    { content: 'x', claim: 'Flood is covered.', source: 'Policy excludes flood.' },
    { module: 'grounding', mode: 'gate', timeoutSeconds: 3600, onTimeout: 'escalate' }
  );
  assert.deepEqual(body['payload'], { content: 'x', body: 'x', claim: 'Flood is covered.', source: 'Policy excludes flood.' });
  assert.equal(body['timeout_seconds'], 3600);
  assert.equal(body['on_timeout'], 'escalate');
});

test('verdictToString: pending returns null, resolved returns a string', () => {
  assert.equal(verdictToString({ status: 'pending' }), null);
  assert.match(verdictToString({ status: 'reviewed', verdict: true }) ?? '', /APPROVED/);
  assert.match(verdictToString({ status: 'reviewed', verdict: false, verdict_reason: 'PII leak' }) ?? '', /FLAGGED.*PII leak/);
  assert.match(verdictToString({ status: 'reviewed', verdict: true, timed_out: true }) ?? '', /auto-resolved on timeout/);
  assert.match(verdictToString({ status: 'escalated' }) ?? '', /ESCALATED/);
});

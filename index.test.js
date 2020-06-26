let postcss = require('postcss');

let plugin = require('./');

async function run (input, output, opts) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0)
}

it('changes vh', async () => {
  await run(
    'a{ height: 10vh; color: #FF10GG; }',
    'a{ height: 10vh; height: calc(var(--vh, 1vh) * 10); color: #FF10GG; }',
    {}
  )
});

it('does not have any change in priority', async () => {
  await run(
    'a{ height: 100px; height: 10vh; color: #FF10GG; }',
    'a{ height: 100px; height: 10vh; height: calc(var(--vh, 1vh) * 10); ' +
    'color: #FF10GG; }',
    {}
  )
});

it('does not override any following height declaration', async () => {
  await run(
    'a{ height: 10vh; height: 100px; }',
    'a{ height: 10vh; height: calc(var(--vh, 1vh) * 10); height: 100px; }',
    {}
  )
});

it('works in another calc', async () => {
  await run(
    'a{ height: calc(10vh - 100px); }',
    'a{ height: calc(10vh - 100px); ' +
    'height: calc(calc(var(--vh, 1vh) * 10) - 100px); }',
    {}
  )
});

it('multiple vh in one declaration', async () => {
  await run(
    'a{ height: calc(10vh * 3 + 20vh);}',
    'a{ height: calc(10vh * 3 + 20vh); ' +
    'height: calc(calc(var(--vh, 1vh) * 10) * 3 + calc(var(--vh, 1vh) * 20));}',
    {}
  )
});

it('does not have any effect on parsed', async () => {
  await run(
    'a{ height: calc(var(--vh, 1vh) * 10); color: #FF10GG; }',
    'a{ height: calc(var(--vh, 1vh) * 10); color: #FF10GG; }',
    {}
  )
});

it('does not affect !important directive', async () => {
  await run(
    'a{ ' +
    ' height: 10vh !important; ' +
    ' max-height: 20vh ! important; ' +
    ' color: #FF10GG; ' +
    '}',
    'a{ ' +
    ' height: 10vh !important; ' +
    ' height: calc(var(--vh, 1vh) * 10) !important; ' +
    ' max-height: 20vh ! important; ' +
    ' max-height: calc(var(--vh, 1vh) * 20) ! important; ' +
    ' color: #FF10GG; ' +
    '}',
    {}
  )
});

it('custom variable conf', async () => {
  await run(
    'a{ height: 10vh; color: #FF10GG; }',
    'a{ height: 10vh; height: calc(var(--uu, 1vh) * 10); color: #FF10GG; }',
    { variable: 'uu' }
  )
});

it('does not affect !important directive with custom variable', async () => {
  await run(
    'a{ ' +
    ' height: 10vh !important; ' +
    ' max-height: 20vh ! important; ' +
    ' color: #FF10GG; ' +
    '}',
    'a{ ' +
    ' height: 10vh !important; ' +
    ' height: calc(var(--someVariablePoints, 1vh) * 10) !important; ' +
    ' max-height: 20vh ! important; ' +
    ' max-height: calc(var(--someVariablePoints, 1vh) * 20) ! important; ' +
    ' color: #FF10GG; ' +
    '}',
    { variable: 'someVariablePoints' }
  )
});

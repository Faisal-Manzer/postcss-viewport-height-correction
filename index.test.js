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
    'a{ height: 10vh; color: #FF10GG; height: calc(var(--vh, 1vh) * 10); }',
    {}
  )
});

it('does not have any change in priority', async () => {
  await run(
    'a{ height: 100px; height: 10vh; color: #FF10GG; }',
    'a{ height: 100px; height: 10vh; ' +
    'color: #FF10GG; height: calc(var(--vh, 1vh) * 10); }',
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

let postcss = require('postcss');

module.exports =
  postcss.plugin('postcss-viewport-height-correction', () => {
    let finderRegex = /([0-9.]+)vh/g;
    let excludeRegex = /var\(--vh,\s*1vh\)/;
    let replaceBy = 'calc(var(--vh, 1vh) * $1)';

    return function (root) {
      /* Rules are the CSS Block */
      root.walkRules(rule => {
        /* Decls are the properties inside */
        rule.walkDecls(decl => {
          let value = decl.value;

          // Checking that declaration has `vh` and is not corrected.
          let isMatch = value.match(finderRegex) !== null;
          let isPreParsed = value.match(excludeRegex) === null;
          if (isMatch && isPreParsed) {
            let correctedViewport = value.replace(finderRegex, replaceBy);

            // Appending because we want to preserve
            // the main property for fallback
            rule.insertAfter(
              decl,
              {
                prop: decl.prop,
                value: correctedViewport
              }
            );
          }
        })
      })
    }
  });

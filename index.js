let postcss = require('postcss');

module.exports =
  postcss.plugin(
    'postcss-viewport-height-correction',
    ({ variable = 'vh' } = {}) => {
      let finderRegex = /(-?[0-9.]+)vh/g;
      // eslint-disable-next-line security/detect-non-literal-regexp
      let excludeRegex = new RegExp(
        `var\\(--${ variable },\\s*1vh\\)`
      );
      let replaceBy = `calc(var(--${ variable }, 1vh) * $1)`;

      return function (root) {
      /* Rules are the CSS Block */
        root.walkRules(rule => {
        /* Decls are the properties inside */
          rule.walkDecls(decl => {
            let value = decl.value;
            let isImportant = decl.important;

            // Checking that declaration has `vh` and is not corrected.
            let isMatch = value.match(finderRegex) !== null;
            let isPreParsed = value.match(excludeRegex) !== null;
            if (isMatch && !isPreParsed) {
              let correctedViewport = value.replace(finderRegex, replaceBy);

              if (isImportant) {
                correctedViewport += decl.raws.important || ' !important';
              }

              // Insert because we want to preserve
              // the main property for fallback and its precedence
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

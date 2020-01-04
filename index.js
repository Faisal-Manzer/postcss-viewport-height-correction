let postcss = require('postcss')

const finderRegex = /([0-9.]+)vh/;
const excludeRegex = /--vh/;
const replaceBy = 'calc(var(--vh, 1vh) * $1)';


module.exports = postcss.plugin('postcss-viewport-height-correction', (opts = { }) => {

  opts = opts || {};

    return function (root, result) {

        /* Rules are the CSS Block */
        root.walkRules(function (rule) {

            /* Decls are the properties inside */
            rule.walkDecls(function (decl) {
                const value = decl.value;

                // Checking that declaration has `vh` and is not corrcted.
                if (value.match(finderRegex) !== null && value.match(excludeRegex) === null) {
                    const correctedViewport = value.replace(finderRegex, replaceBy);

                    // Appending because we want to preserve the main property for fallback
                    rule.append({
                        prop: decl.prop,
                        value: correctedViewport
                    })
                }
            });
        });
    };
})

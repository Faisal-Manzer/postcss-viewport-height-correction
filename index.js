module.exports = ({ variable = "vh" } = {}) => {
  let finderRegex = /(-?[0-9.]+)vh/g;
  let excludeRegex = new RegExp(`var\\(--${variable},\\s*1vh\\)`);
  let replaceBy = `calc(var(--${variable}, 1vh) * $1)`;

  return {
    postcssPlugin: "postcss-viewport-height-correction",
    Declaration(decl) {
      let value = decl.value;
      let isImportant = decl.important;

      // Checking that declaration has `vh` and is not corrected.
      let isMatch = value.match(finderRegex) !== null;
      let isPreParsed = value.match(excludeRegex) !== null;
      if (isMatch && !isPreParsed) {
        let correctedViewport = value.replace(finderRegex, replaceBy);

        if (isImportant) {
          correctedViewport += decl.raws.important || " !important";
        }

        // Insert because we want to preserve
        // the main property for fallback and its precedence
        decl.after({
          prop: decl.prop,
          value: correctedViewport,
        });
      }
    },
  };
};

module.exports.postcss = true;

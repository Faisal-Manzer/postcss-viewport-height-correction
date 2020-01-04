# PostCSS Viewport Height Correction

[PostCSS] plugin to correct viewport height value `vh` to real viewport height as stated by CSS Tricks in article https://css-tricks.com/the-trick-to-viewport-units-on-mobile/.

[PostCSS]: https://github.com/postcss/postcss

```css
.foo {
    /* Input example */
    height: 100vh;
}
```

```css
.foo {
  /* Output example */
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
}
```

## Usage

Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you already use PostCSS, add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-viewport-height-correction'),
    require('autoprefixer')
  ]
}
```

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

[official docs]: https://github.com/postcss/postcss#usage

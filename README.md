Enketo Website
================

Install prerequisites with `npm install`. You may need to install `pug-cli`, `node-sass` and `browserify` globally or add to PATH. 

Build with `npm run build` and serve from /public.


## Develop

Start in development mode on [http://localhost:8080](http://localhost:8080) with `npm run develop`.

Try to use markdown where you can, to make it more enjoyable to add and edit text (use :md filter). 

When adding a link, see if it is already included in /src/js/navigation.json and if so refer to them like this: `primary.About.OpenRosa` or `sites['enketo-api']`. In HTML _primary_ links should be wrapped in the globally available `interpolate()` function. In markdown, interpolation happens automatically.

## Feedback?

Feedback and contributions are welcome, even if it's just a spelling error. Please [open an issue](https://github.com/enketo/enketo-website/issues/new) or send a PR.


## Acknowledgements

<a href="https://www.netlify.com">
  <img src="https://www.netlify.com/img/global/badges/netlify-light.svg">
</a>

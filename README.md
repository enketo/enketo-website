Enketo Website
================

## Prerequisites

NodeJS 6+

## Build

Install prerequisites with `npm install`. Build with `npm run build` and serve from /public.

## Develop

Start in development mode on [http://localhost:8080](http://localhost:8080) with `npm run develop` (first run `npm run build` once).

Try to use markdown where you can, to make it more enjoyable to add and edit text (use :md filter). 

When adding a link, see if it is already included in /src/js/navigation.json and if so refer to them like this: `primary.About.OpenRosa` or `sites['enketo-api']`. In HTML _primary_ links should be wrapped in the globally available `interpolate()` function. In markdown, interpolation happens automatically.

## Feedback?

Feedback and contributions are welcome, even if it's just a spelling error. Please [open an issue](https://github.com/enketo/enketo-website/issues/new) or send a PR.

## License

See [LICENSE.md](./LICENSE.md). Images, graphic design, and branding used in this repository does not fall under in this license.

## Acknowledgements

<a href="https://www.netlify.com">
  <img src="https://www.netlify.com/img/global/badges/netlify-light.svg">
</a>

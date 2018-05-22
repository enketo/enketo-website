'use strict';

const navigation = require( '../src/js/navigation' );
const interpolate = require( './interpolate' );
const hljs = require( 'highlight.js' );
const marked = require( 'marked' );
const sass = require( 'node-sass' );
const pkg = require( '../package' );
const pug = require( 'pug' );
const renderer = new marked.Renderer();
const mime = require( 'mime-types' );

// Replace icon references
const replaceIcons = ( text ) => text.replace( ':check:', '<span class="icon icon-check"></span>' ).replace( ':question:', '<span class="icon icon-question"></span>' );

// Replace navigation.json references
const lookupNavItem = ( keyStr ) => {
    return keyStr.replace( /(primary|sites)(\.|\[).+/, ( match ) => {
        let item = navigation;
        const props = match.split( /\s*\.|\[\s*&quot;|&quot;\s*\]|\[\s*&#39;|&#39;\s*\]\s*/ );

        props.forEach( ( prop ) => {
            if ( prop ) {
                item = item && typeof item[ prop ] !== 'undefined' ? item[ prop ] : null;
            }
        } );

        if ( typeof item === 'undefined' || item === null ) {
            throw new Error( 'Trouble finding link: ' + match );
        }

        return interpolate( item );
    } );
};

// add highlightClass on wrapping <pre> (this is a missing feature is setOptions is used: https://github.com/chjj/marked/pull/418)
renderer.code = ( code, language ) => `<pre><code class="hljs ${language}">${hljs.highlightAuto(code, ['xml']).value}</code></pre>`;

// replace heading renderer to avoid automatic id insertion
renderer.heading = ( text, level ) => '<h' + level + '>' + text + '</h' + level + '>';

// replace references to navigation.json in link hrefs, e.g. site['enketo-api'] or primary.About.OpenRosa
renderer.link = ( href, title, text ) => `<a href="${lookupNavItem( href )}"${title ? ` title="${title}"` : ''}>${text}</a>`;

// support :check: and :question: in table-cells, removes flags.align support as we don't need it.
renderer.tablecell = ( content, flags ) => {
    let type = flags.header ? 'th' : 'td';
    return `<${type}>${replaceIcons(content)}</${type}>\n`;
};

// call pug img() mixin
renderer.image = ( href, title, text ) => {
    const pugTxt = `include src/templates/mixins-img
+img('${href}','${text}')`;
    return pug.render( pugTxt, { filename: 'mixins-img.pug', mime } );
};

module.exports = {
    filters: {
        md: text => marked( text, { renderer: renderer } ),
        scss: text => sass.renderSync( { data: text, outputStyle: 'compact', includePaths: [ 'src/scss' ] } ).css.toString(),
    },
    pretty: false,
    primary: navigation.primary,
    sites: navigation.sites,
    interpolate,
    UA: pkg.ua,
    mime,
};
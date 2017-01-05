'use strict';

let navigation = require( './navigation' );
let interpolate = require( './interpolate' );
let hljs = require( 'highlight.js' );
let marked = require( 'marked' );
let pkg = require( '../../package' );
let renderer = new marked.Renderer();
let lookupNavItem;
let replaceIcons;

// add highlightClass on wrapping <pre> (this is a missing feature is setOptions is used: https://github.com/chjj/marked/pull/418)
renderer.code = ( code, language ) => `<pre><code class="hljs ${language}">${hljs.highlightAuto(code, ['xml']).value}</code></pre>`;

// replace heading renderer to avoid automatic id insertion
renderer.heading = ( text, level ) => '<h' + level + '>' + text + '</h' + level + '>';

// replace references to navigation.json in link hrefs, e.g. site['enketo-api'] or primary.About.OpenRosa
renderer.link = ( href, title, text ) => `<a href="${lookupNavItem( href )}"${title ? ` title="${title}"` : ''}>${text}</a>`;

// support :check: and :question: in table-cells, removes flags.align support as we don't need it.
renderer.tablecell = (content, flags) => {
    let type = flags.header ? 'th' : 'td';
    return `<${type}>${replaceIcons(content)}</${type}>\n`;
};

replaceIcons = (text) => text.replace(':check:', '<span class="icon icon-check"></span>').replace(':question:', '<span class="icon icon-question"></span>');

// Replace navigation.json references
lookupNavItem = ( keyStr ) => {
    return keyStr.replace( /(primary|sites)(\.|\[).+/, ( match ) => {
        let item = navigation;
        let props = match.split(   /\s*\.|\[\s*&quot;|&quot;\s*\]|\[\s*&#39;|&#39;\s*\]\s*/ );

        props.forEach( ( prop ) => {
            if (prop) {
                item = item && item[ prop ] ? item[ prop ] : null;
            }
        } );

        if (!item) {
            throw new Error('Trouble finding link: ' + match);
        }

        return interpolate( item );
    } );
}

module.exports = {
    filters: {
        md: function( text, options ) {
            return marked( text, {
                renderer: renderer
            } );
        },
        'samplify': function( text, options ) {
            let result = '';
            let arr = JSON.parse( text );
            let l = arr.length;
            let srcLink;

            // prepend beforeLast and last, append first and second
            [ arr[ l - 2 ], arr[ l - 1 ] ].concat( arr ).concat( [ arr[ 0 ], arr[ 1 ] ] ).forEach( function( item, index ) {
                srcLink = item.src ? `<p><a href="${item.src}">source</a></p>` : '';
                result +=
                    `<li class="samples__list__item">
                        <section class="samples__list__item__main">
                            <h5><span>${item.title}</span><button class="samples__list__item__info-btn button-icon-only"><i class="icon icon-info-circle"></i></button></h5>
                            <a href="${item.live}" style="background-image: url(${item.img});"></a>
                        </section>
                        <aside class="samples__list__item__details">
                            <p>${item.desc}</p>
                            <p>Author: ${item.auth}</p>
                            ${srcLink}
                        </aside>
                    </li>`;
            } );

            return result;
        }
    },
    pretty: true,
    primary: navigation.primary,
    sites: navigation.sites,
    interpolate: interpolate,
    UA: pkg.ua
};

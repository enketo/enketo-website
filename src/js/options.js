'use strict';

let navigation = require( './navigation' );
let interpolate = require( './interpolate' );
let pkg = require( '../../package' );

module.exports = {
    filters: {
        'interpolate': function( text, options ) {
            return text.replace( /\(\s*((primary|sites)(\.|\[)[^\)]+)\s*\)/gm, ( match, p1 ) => {
                let item = navigation;
                let props = p1.split( /\s*\.|\[\s*/ );

                props.forEach( ( prop ) => {
                    // in case property is in this.['property'] style
                    prop = prop.replace( /['"](.+)['"]\]/, ( match, p1 ) => p1 );
                    item = item && item[ prop ] ? item[ prop ] : null;
                } );

                if ( item ) {
                    match = match.replace( p1, interpolate( item ) );
                }

                return match;
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

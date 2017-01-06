'use strict';

const navigation = require( '../src/js/navigation' );
const interpolate = require( './interpolate' );
const fs = require( 'fs' );
const path = require( 'path' );
const sitemapPath = path.join( process.cwd(), '/public/sitemap.xml' );

let content;
let extractUrls;
let add;
let getUrl;
let toSitemapUrl;
let inDomain;
let urls;

extractUrls = ( obj, urls ) => {
    let key;
    // TODO: in ES6 default can be defined above
    urls = ( typeof urls !== 'undefined' ) ? urls : [];
    for ( key in obj ) {
        if ( typeof obj[ key ] === 'string' ) {
            add( getUrl( obj[ key ] ), urls );
        } else if ( typeof obj[ key ] === 'object' ) {
            if ( obj[ key ]._self ) {
                add( getUrl( obj[ key ]._self ), urls );
            }
            extractUrls( obj[ key ], urls );
        }
    }

    return urls;
}

add = ( item, arr ) => arr.indexOf( item ) === -1 && inDomain( item ) ? arr.push( item ) : arr;

getUrl = ( url ) => interpolate( url );

inDomain = ( url ) => url.indexOf( navigation.sites[ 'enketo-main' ].substring( 8 ) ) !== -1;

toSitemapUrl = ( url ) => `
    <url>
        <loc>${url}</loc>
    </url>`;

urls = extractUrls( navigation.primary ).concat( [ navigation.sites[ 'enketo-api' ] ] );

content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\
${urls.map( toSitemapUrl ).join( '' )}
</urlset>`;

fs.writeFile( sitemapPath, content, {}, function() {
    console.log( 'done' );
} );

'use strict';

const navigation = require( '../src/js/navigation' );
const interpolate = require( './interpolate' );
const fs = require( 'fs' );
const path = require( 'path' );
const sitemapPath = path.join( process.cwd(), '/public/sitemap.xml' );

const getUrl = ( url ) => interpolate( url );

const inDomain = ( url ) => url.indexOf( navigation.sites[ 'enketo-main' ].substring( 8 ) ) !== -1;

const add = ( item, arr ) => arr.indexOf( item ) === -1 && inDomain( item ) ? arr.push( item ) : arr;

const extractUrls = ( obj, urls = [] ) => {
    for ( let key in obj ) {
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
};

const toSitemapUrl = ( url ) => `
    <url>
        <loc>${url}</loc>
    </url>`;

const urls = extractUrls( navigation.primary ).concat( [ navigation.sites[ 'enketo-api' ] ] );

const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\
${urls.map( toSitemapUrl ).join( '' )}
</urlset>`;

fs.writeFile( sitemapPath, content, {}, () => console.log( 'done' ) );
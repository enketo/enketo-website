'use strict';
let navigation = require( './navigation' );

module.exports = ( text ) => {
    if ( typeof text === 'string' ) {
        for ( let key in navigation.sites ) {
            text = text.replace( new RegExp( '#{\\s?' + key + '\\s?}', 'gi' ), navigation.sites[ key ] );
        }
        if ( text && text.indexOf( '#' ) === -1 && text.indexOf( '?' ) === -1 && text.lastIndexOf( '/' ) !== text.length - 1 ) {
            text += '/';
        }
    }
    return text;
};

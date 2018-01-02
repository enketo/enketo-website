'use strict';
const navigation = require( '../src/js/navigation' );

module.exports = (text = '') => {
    for ( let key in navigation.sites ) {
        text = text.replace( new RegExp( '#{\\s?' + key + '\\s?}', 'gi' ), navigation.sites[ key ] );
    }
    if ( !text.includes( '#' ) && !text.includes( '?' ) && !(/\/$/.test(text)) ) {
        text += '/';
    }
    return text;
};

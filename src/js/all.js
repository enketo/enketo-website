'use strict';

import 'babel-polyfill';
import 'details-polyfill-es6';

/**
 * Adds listeners to a NodeList.
 * 
 * @param {NodeList} elements list of HTML Elements
 * @param {String} event type
 */
const addListeners = ( elements = [], event, handler ) => {
    for ( let element of elements ) {
        element.addEventListener( event, handler );
    }
};

/**
 * Open a <detail> with id provided as hash.
 * 
 * @param  {String} hash [description]
 */
const goToDetail = ( hash = null ) => {
    if ( !hash ) {
        return;
    }
    const detailEl = document.querySelector( 'details' + hash );
    if ( detailEl ) {
        detailEl.open = true;
        // for IE and Edge only:
        detailEl.setAttribute( 'open', 'open' );
    }
};

/**
 * Sets hash in URL without triggering scrolling. Adds state to history.
 * @param {string} hash [description]
 */
const setHash = ( hash ) => {
    hash = ( hash && hash.indexOf( '#' ) !== 0 ) ? '#' + hash : hash;
    history.pushState( {}, '', hash );
};

/**
 * Adds a generic handler to any <summary> elements.
 */
const setDetailListeners = () => {
    const summaries = document.querySelectorAll( 'summary' );
    const toggles = document.querySelectorAll( '.summary-toggle' );
    addListeners( summaries, 'click', detailChangeHandler );
    addListeners( toggles, 'click', detailCollapseHandler );
};

/**
 * Adds the id of a summary as a hash to the URL.
 * 
 * @param  {Event} event 
 */
const detailChangeHandler = ( event ) => {
    const parent = event.currentTarget.parentElement;
    if ( parent && !parent.open ) {
        setHash( parent.id );
    }
};

const setHeaderListeners = () => {
    const headers = document.querySelectorAll( 'h3' );
    addListeners( headers, 'click', headerClickHandler );
    addClickableClass( headers );
};

/**
 * Adds class "clickable" to all elements in NodeList.
 * 
 * @param {NodeList} headers list of HTML Elements
 */
const addClickableClass = ( elements = [] ) => {
    for ( let element of elements ) {
        if ( getCLosestAncestorWithId( element ) ) {
            element.classList.add( 'clickable' );
        }
    }
};

/**
 * Return the closest ancestor that has an id attribute.
 * For performance reasons (and not needing more), we search up to 2 parents.
 * 
 * @param  {Element} el element
 * @return {Element}    closest element with id or null
 */
const getCLosestAncestorWithId = ( el ) => {
    const parent = el.parentElement;
    const grandParent = ( parent ) ? parent.parentElement : null;
    let foundElement = null;

    if ( parent && parent.id ) {
        foundElement = parent;
    } else if ( grandParent && grandParent.id ) {
        foundElement = grandParent;
    }
    return foundElement;
};

/** 
 * Looks two levels up for an id element and changes URL hash if present.
 * 
 * @param  {Event]} event
 */
const headerClickHandler = ( event ) => {
    const section = getCLosestAncestorWithId( event.currentTarget );
    if ( section ) {
        setHash( section.id );
    }
};

const setHashChangeListener = () => {
    window.onhashchange = () => {
        setActiveMenuItem( location.hash );
        goToDetail( location.hash );
    };
};

/**
 * Sets a secondary menu item with a #hash link to active.
 * 
 * @param {string} hash The hash value including "#".
 */
const setActiveMenuItem = ( hash ) => {
    const secondaryMenu = document.querySelector( '.secondary-nav' );

    if ( !hash || !secondaryMenu ) {
        return;
    }

    const link = secondaryMenu.querySelector( 'li a[href$="' + hash + '"]' );
    if ( link ) {
        for ( let li of secondaryMenu.querySelectorAll( 'li' ) ) {
            li.classList.remove( 'active' );
        }
        link.parentElement.classList.add( 'active' );
    }
};

const setSampleInfoListener = () => {
    const btns = document.querySelectorAll( '.samples__list__item__info-btn' );
    addListeners( btns, 'click', infoClickHandler );
};

const infoClickHandler = ( event ) => {
    event.preventDefault();
    const parent = event.currentTarget.parentElement;
    if ( parent && parent.parentElement ) {
        parent.parentElement.classList.toggle( 'show-info' );
    }
    return false;
};

const setSampleScrollButtonListener = () => {
    const btns = document.querySelectorAll( '.samples__scroll-btn' );
    addListeners( btns, 'click', sampleScrollButtonHandler );
};

/**
 * "Infinite" scrollbutton handler that operates on a list that has first and second list item copied and appended to end
 * and last and beforeLast item copied and prepended to front.
 * 
 * @param  {Event} event [description]
 */
const sampleScrollButtonHandler = ( event ) => {
    const lis = document.querySelectorAll( '.samples__list__item' );
    const ul = document.querySelector( '.samples__list' );
    if ( lis ) {
        const ulStyle = window.getComputedStyle( ul );
        const liStyle = window.getComputedStyle( lis[ 0 ] );
        const distance = parseInt( liStyle.getPropertyValue( 'width' ), 10 ) +
            parseInt( liStyle.getPropertyValue( 'margin-left' ), 10 ) +
            parseInt( liStyle.getPropertyValue( 'margin-right' ), 10 );
        const min = -( lis.length - 3 ) * distance;
        // Safari returns "" for calc() result of left. The || 0 is not correct, but at least scrolling now works a bit in Safari.
        // https://bugs.webkit.org/show_bug.cgi?id=134765
        const currentLeft = parseInt( ulStyle.getPropertyValue( 'left' ) || 0, 10 );
        // Check which button was clicked (left or right);
        let left = event.currentTarget.classList.contains( 'left-scroll' ) ? currentLeft + distance : currentLeft - distance;
        // If new left is exceeding boundaries, reset
        left = left > 0 ? -left * ( lis.length - 5 ) : ( left < min ? -distance * 2 : left );
        ul.setAttribute( 'style', 'left:' + left + 'px;' );
    }
};

/**
 * Switches between collapse-all and reveal-all state of faq.
 * 
 * @param  {Event} event 
 */
const detailCollapseHandler = ( event ) => {
    const button = event.currentTarget;
    const oldText = button.textContent;
    const newText = button.dataset.toggle;
    if ( newText ) {
        button.dataset.toggle = oldText;
        button.textContent = newText;
        const details = document.querySelectorAll( 'details' );
        const open = ( oldText === 'expand' );
        if ( details ) {
            for ( let detail of details ) {
                detail.open = open;
            }
        }
    }
};

window.onload = () => {
    setActiveMenuItem( location.hash );
    goToDetail( location.hash );
    setDetailListeners();
    setHeaderListeners();
    setHashChangeListener();
    setSampleInfoListener();
    setSampleScrollButtonListener();
};
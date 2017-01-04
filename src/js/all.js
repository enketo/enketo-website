'use strict';

import 'babel-polyfill';
import 'details-polyfill-es6';

window.onload = () => {
    let hash = location.hash;
    setActiveMenuItem( hash );
    goToDetail( hash );
    setDetailListeners();
    setHeaderListeners();
    setHashChangeListener();
    setSampleInfoListener();
    setSampleScrollButtonListener();
};

/**
 * Adds listeners to a NodeList.
 * 
 * @param {NodeList} elements list of HTML Elements
 * @param {String} event type
 */
function addListeners( elements, event, handler ) {
    let element;

    if ( elements ) {
        for ( element of elements ) {
            element.addEventListener( event, handler );
        }
    }
}

/**
 * Open a <detail> with id provided as hash.
 * 
 * @param  {String} hash [description]
 */
function goToDetail( hash ) {
    let detailEl;
    if ( !hash ) {
        return;
    }
    detailEl = document.querySelector( 'details' + hash );
    if ( detailEl ) {
        detailEl.open = true;
    }
}

/**
 * Sets hash in URL without triggering scrolling. Adds state to history.
 * @param {string} hash [description]
 */
function setHash( hash ) {
    hash = ( hash && hash.indexOf( '#' ) !== 0 ) ? '#' + hash : hash;
    history.pushState( {}, '', hash );
}

/**
 * Adds a generic handler to any <summary> elements.
 */
function setDetailListeners() {
    let summaries = document.querySelectorAll( 'summary' );
    let toggles = document.querySelectorAll( '.summary-toggle' );
    addListeners( summaries, 'click', detailChangeHandler );
    addListeners( toggles, 'click', detailCollapseHandler );
}

/**
 * Adds the id of a summary as a hash to the URL.
 * 
 * @param  {Event} event 
 */
function detailChangeHandler( event ) {
    let parent = event.currentTarget.parentElement;
    if ( parent && !parent.open ) {
        setHash( parent.id );
    }
}

function setHeaderListeners() {
    let headers = document.querySelectorAll( 'h3' );
    addListeners( headers, 'click', headerClickHandler );
    addClickableClass( headers );
}

/**
 * Adds class "clickable" to all elements in NodeList.
 * 
 * @param {NodeList} headers list of HTML Elements
 */
function addClickableClass( elements ) {
    let element;

    if ( elements ) {
        for ( element of elements ) {
            if ( getCLosestAncestorWithId( element ) ) {
                element.classList.add( 'clickable' );
            }
        }
    }
}

/**
 * Return the closest ancestor that has an id attribute.
 * For performance reasons (and not needing more), we search up to 2 parents.
 * 
 * @param  {Element} el element
 * @return {Element}    closest element with id or null
 */
function getCLosestAncestorWithId( el ) {
    let parent = el.parentElement;
    let grandParent = ( parent ) ? parent.parentElement : null;
    let foundElement = null;

    if ( parent && parent.id ) {
        foundElement = parent;
    } else if ( grandParent && grandParent.id ) {
        foundElement = grandParent;
    }
    return foundElement;
}

/** 
 * Looks two levels up for an id element and changes URL hash if present.
 * 
 * @param  {Event]} event
 */
function headerClickHandler( event ) {
    let section = getCLosestAncestorWithId( event.currentTarget );
    if ( section ) {
        setHash( section.id );
    }
}

function setHashChangeListener() {
    let hash;
    window.onhashchange = function() {
        hash = location.hash;
        setActiveMenuItem( hash );
        goToDetail( hash );
    };
}

/**
 * Sets a secondary menu item with a #hash link to active.
 * 
 * @param {string} hash The hash value including "#".
 */
function setActiveMenuItem( hash ) {
    let link;
    let item;
    let secondaryMenu = document.querySelector( '.secondary-nav' );

    if ( !hash || !secondaryMenu ) {
        return;
    }

    link = secondaryMenu.querySelector( 'li a[href$="' + hash + '"]' );
    if ( link ) {
        item = link.parentElement;
        for ( let li of secondaryMenu.querySelectorAll( 'li' ) ) {
            li.classList.remove( 'active' );
        }
        item.classList.add( 'active' );
    }
}

function setSampleInfoListener() {
    let btns = document.querySelectorAll( '.samples__list__item__info-btn' );
    addListeners( btns, 'click', infoClickHandler );
}

function infoClickHandler( event ) {
    let parent;

    event.preventDefault();
    parent = event.currentTarget.parentElement;
    if ( parent && parent.parentElement ) {
        parent.parentElement.classList.toggle( 'show-info' );
    }
    return false;
}

function setSampleScrollButtonListener() {
    let btns = document.querySelectorAll( '.samples__scroll-btn' );
    addListeners( btns, 'click', sampleScrollButtonHandler );
}

/**
 * "Infinite" scrollbutton handler that operates on a list that has first and second list item copied and appended to end
 * and last and beforeLast item copied and prepended to front.
 * 
 * @param  {Event} event [description]
 */
function sampleScrollButtonHandler( event ) {
    let lis = document.querySelectorAll( '.samples__list__item' );
    let ul = document.querySelector( '.samples__list' );
    if ( lis ) {
        let ulStyle = window.getComputedStyle( ul );
        let liStyle = window.getComputedStyle( lis[ 0 ] );
        let distance = parseInt( liStyle.getPropertyValue( 'width' ), 10 ) +
            parseInt( liStyle.getPropertyValue( 'margin-left' ), 10 ) +
            parseInt( liStyle.getPropertyValue( 'margin-right' ), 10 );
        let min = -( lis.length - 3 ) * distance;
        // Safari returns "" for calc() result of left. The || 0 is not correct, but at least scrolling now works a bit in Safari.
        // https://bugs.webkit.org/show_bug.cgi?id=134765
        let currentLeft = parseInt( ulStyle.getPropertyValue( 'left' ) || 0, 10 );
        // Check which button was clicked (left or right);
        let left = event.currentTarget.classList.contains( 'left-scroll' ) ? currentLeft + distance : currentLeft - distance;
        // If new left is exceeding boundaries, reset
        left = left > 0 ? -left * ( lis.length - 5 ) : ( left < min ? -distance * 2 : left );
        ul.setAttribute( 'style', 'left:' + left + 'px;' );
    }

}

/**
 * Switches between collapse-all and reveal-all state of faq.
 * 
 * @param  {Event} event 
 */
function detailCollapseHandler( event ) {
    let detail;
    let details;
    let open;
    let button = event.currentTarget;
    let oldText = button.textContent;
    let newText = button.dataset.toggle;
    if ( newText ) {
        button.dataset.toggle = oldText;
        button.textContent = newText;
        details = document.querySelectorAll( 'details' );
        open = ( oldText === 'expand' );
        if ( details ) {
            for ( detail of details ) {
                detail.open = open;
            }
        }
    }
}

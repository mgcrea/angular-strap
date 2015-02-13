'use strict';

angular.module('mgcrea.ngStrap.helpers.position', [])

  .factory('$position', function() {

    var fn = {};

    /**
     * Test the element nodeName
     * @param {element} element The raw DOM element.
     * @param {string} name The node name to lookup.
     */
    fn.nodeName = function(element, name) {
      return element.nodeName && element.nodeName.toLowerCase() === name.toLowerCase();
    };

    /**
     * Returns the element computed style
     * @param {element} element The raw DOM element.
     * @param {string} prop The property to compute.
     * @param {boolean} [decimals=false] Should the value include decimals.
     */
    fn.css = function(element, prop, decimals) {
      var value;
      if (element.currentStyle) { //IE
        value = element.currentStyle[prop];
      } else if (window.getComputedStyle) {
        value = window.getComputedStyle(element)[prop];
      } else {
        value = element.style[prop];
      }
      return decimals === true ? parseFloat(value) || 0 : value;
    };

    /**
     * Provides read-only equivalent of jQuery's offset function:
     * @required-by bootstrap-tooltip, bootstrap-affix
     * @url http://api.jquery.com/offset/
     * @param {element} element The raw DOM element.
     */
    fn.offset = function(element) {
      var boxRect = element.getBoundingClientRect();
      var docElement = element.ownerDocument;
      return {
        width: boxRect.width || element.offsetWidth,
        height: boxRect.height || element.offsetHeight,
        top: boxRect.top + (window.pageYOffset || docElement.documentElement.scrollTop) - (docElement.documentElement.clientTop || 0),
        left: boxRect.left + (window.pageXOffset || docElement.documentElement.scrollLeft) - (docElement.documentElement.clientLeft || 0)
      };
    };

    /**
     * Provides set equivalent of jQuery's offset function:
     * @required-by bootstrap-tooltip
     * @url http://api.jquery.com/offset/
     * @param {element} element The raw DOM element.
     * @param {function} options ???
     * @param {object} i ???
     */
    fn.setOffset = function (element, options, i) {
      var curPosition,
          curLeft,
          curCSSTop,
          curTop,
          curOffset,
          curCSSLeft,
          calculatePosition,
          position = fn.css(element, 'position'),
          curElem = angular.element(element),
          props = {};

      // Set position first, in-case top/left are set even on static elem
      if (position === 'static') {
        element.style.position = 'relative';
      }

      curOffset = fn.offset(element);
      curCSSTop = fn.css(element, 'top');
      curCSSLeft = fn.css(element, 'left');
      calculatePosition = (position === 'absolute' || position === 'fixed') &&
                          (curCSSTop + curCSSLeft).indexOf('auto') > -1;

      // Need to be able to calculate position if either
      // top or left is auto and position is either absolute or fixed
      if (calculatePosition) {
        curPosition = fn.position(element);
        curTop = curPosition.top;
        curLeft = curPosition.left;
      } else {
        curTop = parseFloat(curCSSTop) || 0;
        curLeft = parseFloat(curCSSLeft) || 0;
      }

      if (angular.isFunction(options)) {
        options = options.call(element, i, curOffset);
      }

      if (options.top !== null ) {
        props.top = (options.top - curOffset.top) + curTop;
      }
      if ( options.left !== null ) {
        props.left = (options.left - curOffset.left) + curLeft;
      }

      if ('using' in options) {
        options.using.call(curElem, props);
      } else {
        curElem.css({
          top: props.top + 'px',
          left: props.left + 'px'
        });
      }
    };

    /**
     * Provides read-only equivalent of jQuery's position function
     * @required-by bootstrap-tooltip, bootstrap-affix
     * @url http://api.jquery.com/offset/
     * @param {element} element The raw DOM element.
     */
    fn.position = function(element) {

      var offsetParentRect = {top: 0, left: 0},
          offsetParentElement,
          offset;

      // Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
      if (fn.css(element, 'position') === 'fixed') {

        // We assume that getBoundingClientRect is available when computed position is fixed
        offset = element.getBoundingClientRect();

      } else {

        // Get *real* offsetParentElement
        offsetParentElement = fn.offsetParent(element);

        // Get correct offsets
        offset = fn.offset(element);
        if (!fn.nodeName(offsetParentElement, 'html')) {
          offsetParentRect = fn.offset(offsetParentElement);
        }

        // Add offsetParent borders
        offsetParentRect.top += fn.css(offsetParentElement, 'borderTopWidth', true);
        offsetParentRect.left += fn.css(offsetParentElement, 'borderLeftWidth', true);
      }

      // Subtract parent offsets and element margins
      return {
        width: element.offsetWidth,
        height: element.offsetHeight,
        top: offset.top - offsetParentRect.top - fn.css(element, 'marginTop', true),
        left: offset.left - offsetParentRect.left - fn.css(element, 'marginLeft', true)
      };

    };

    /**
     * Returns the closest, non-statically positioned offsetParent of a given element
     * @required-by fn.position
     * @param {element} element The raw DOM element.
     */
    fn.offsetParent = function (element) {
      var docElement = element.ownerDocument;
      var offsetParentElement = element.offsetParent || docElement;
      if(fn.nodeName(offsetParentElement, '#document')) return docElement.documentElement;
      while(offsetParentElement && !fn.nodeName(offsetParentElement, 'html') && fn.css(offsetParentElement, 'position') === 'static') {
        offsetParentElement = offsetParentElement.offsetParent;
      }
      return offsetParentElement || docElement.documentElement;
    };

    /**
     * Provides equivalent of jQuery's height function
     * @required-by bootstrap-affix
     * @url http://api.jquery.com/height/
     * @param {element} element The raw DOM element.
     * @param {boolean} [outer=false] Should the value be the element outer value.
     */
    fn.height = function(element, outer) {
      var value = element.offsetHeight;
      if(outer) {
        value += fn.css(element, 'marginTop', true) + fn.css(element, 'marginBottom', true);
      } else {
        value -= fn.css(element, 'paddingTop', true) + fn.css(element, 'paddingBottom', true) + fn.css(element, 'borderTopWidth', true) + fn.css(element, 'borderBottomWidth', true);
      }
      return value;
    };

    /**
     * Provides equivalent of jQuery's width function
     * @required-by bootstrap-affix
     * @url http://api.jquery.com/width/
     * @param {element} element The raw DOM element.
     * @param {boolean} [outer=false] Should the value be the element outer value.
     */
    fn.width = function(element, outer) {
      var value = element.offsetWidth;
      if(outer) {
        value += fn.css(element, 'marginLeft', true) + fn.css(element, 'marginRight', true);
      } else {
        value -= fn.css(element, 'paddingLeft', true) + fn.css(element, 'paddingRight', true) + fn.css(element, 'borderLeftWidth', true) + fn.css(element, 'borderRightWidth', true);
      }
      return value;
    };

    /**
    * Provides a method for calculating the
    * position of an element in relation to
    * another element based on the
    * specified placement.
    * Placement options are:
    * top, bottom, left, right, or any combination
    * (top-left, top-right, bottom-left, etc...).
    * If auto is specified, the position
    * will be calculated based on the available
    * space in the specified container element
    * and reorient accordingly.
    * For example, if placement is 'auto left'
    * the element postion will be calculated
    * to the left of the linked element
    * when possible, otherwise it will
    * be calculated to the right.
    * @required-by bootstrap-tooltip
    * @requires bootstrap-additions
    * @url https://github.com/mgcrea/bootstrap-additions
    * @param {string} placement The placement of the element relative to the linkedElement.
    * @param {element} element - The raw DOM element to position.
    * @param {element} linkedElement - The raw DOM element to position the element relative to.
    * @param {element} [containerElement=body] - The raw DOM element that contains the linkedElement.
    */
    fn.placementPosition = function(placement, element, linkedElement, containerElement) {

      if (!angular.isElement(element) || !angular.isElement(linkedElement)) {
        return;
      }

      placement = placement || 'auto top';

      if (!angular.isElement(containerElement)) {
        containerElement = document.querySelector('body');
      }

      // Determine if an auto or normal placement
      var autoToken = /\s?auto?\s?/i,
      autoPlace  = autoToken.test(placement);

      if (autoPlace) {
        placement = placement.replace(autoToken, '');
        placement = placement.length ? placement : 'top';
      }

      // Need to add the position class before calculating the offsets
      element.classList.add(placement);

      // Get the position of the linked element
      // and the height and width of the element
      // so it can be centered.
      // TODO Why can't we use the position method already defined?
      // Should we roll what is being done in the tooltip getPosition method
      // into the position method already defined?
      //var linkedElementPosition = containerElement.tagName === 'BODY' ? fn.offset(linkedElement) : fn.position(linkedElement),
      var linkedElementPosition = fn.tooltipGetPosition(linkedElement),
      elementWidth = element.offsetWidth,
      elementHeight = element.offsetHeight;

      // If auto placing, check the positioning
      if (autoPlace) {
        var originalPlacement = placement;
        //var containerPosition = containerElement.tagName === 'BODY' ? fn.offset(containerElement) : fn.position(containerElement);
        var containerPosition = fn.tooltipGetPosition(containerElement);

        // Determine if using vertical placement
        if (originalPlacement.indexOf('bottom') >= 0 && linkedElementPosition.bottom + elementHeight > containerPosition.bottom) {
          placement = originalPlacement.replace('bottom', 'top');
        } else if (originalPlacement.indexOf('top') >= 0 && linkedElementPosition.top - elementHeight < containerPosition.top) {
          placement = originalPlacement.replace('top', 'bottom');
        }

        // Determine if using horizontal placement
        // The exotic placements of left and right are opposite of the standard placements.
        if ((originalPlacement === 'right' || originalPlacement === 'bottom-left' || originalPlacement === 'top-left') &&
          linkedElementPosition.right + elementWidth > containerPosition.width) {

          placement = originalPlacement === 'right' ? 'left' : placement.replace('left', 'right');
        } else if ((originalPlacement === 'left' || originalPlacement === 'bottom-right' || originalPlacement === 'top-right') &&
          linkedElementPosition.left - elementWidth < containerPosition.left) {

          placement = originalPlacement === 'left' ? 'right' : placement.replace('right', 'left');
        }

        element.classList.remove(originalPlacement);
        element.classList.add(placement);
      }

      // Get the element's top and left coordinates to center it with the linked element.
      return fn.placementOffset(placement, linkedElementPosition, elementWidth, elementHeight);
    };

    fn.tooltipGetPosition = function(element) {

      var elementRect = element.getBoundingClientRect();
      var rect = {};

      // IE8 has issues with angular.extend and using elRect directly.
      // By coping the values of elRect into a new object, we can continue to use extend
      // TODO Do we really need to support IE8?
      for (var p in elementRect) {
        if (elementRect.hasOwnProperty(p)) {
          rect[p] = elementRect[p];
        }
      }

      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      // TODO Do we really need to support IE8?
      if (rect.width === null) {
        rect = angular.extend({}, rect, { width: elementRect.right - elementRect.left, height: elementRect.bottom - elementRect.top });
      }

      var isBody = element.tagName === 'BODY';

      var elementOffset = isBody ? { top: 0, left: 0 } : fn.offset(element),
          scrollTop = { scroll:  isBody ? document.documentElement.scrollTop || document.body.scrollTop : element.scrollTop || 0 },
          outerDimensions = isBody ? { width: document.documentElement.clientWidth, height: window.innerHeight } : null;

      return angular.extend({}, rect, scrollTop, outerDimensions, elementOffset);

    };

    /**
    * Provides a method for calculating the
    * offset of an element to center it
    * based on the specified placement.
    * Placement options are:
    * top, bottom, left, right, or any combination
    * (top-left, top-right, bottom-left, etc...).
    * @param {string} placement The placement of the element.
    * @param {Object} position The position of the element.
    */
    fn.placementOffset = function(placement, position, actualWidth, actualHeight) {
      var offset;
      var split = placement.split('-');

      switch (split[0]) {
      case 'right':
        offset = {
          top: position.top + position.height / 2 - actualHeight / 2,
          left: position.left + position.width
        };
        break;
      case 'bottom':
        offset = {
          top: position.top + position.height,
          left: position.left + position.width / 2 - actualWidth / 2
        };
        break;
      case 'left':
        offset = {
          top: position.top + position.height / 2 - actualHeight / 2,
          left: position.left - actualWidth
        };
        break;
      default:
        offset = {
          top: position.top - actualHeight,
          left: position.left + position.width / 2 - actualWidth / 2
        };
        break;
      }

      if(!split[1]) {
        return offset;
      }

      // Add support for corners @todo css
      if(split[0] === 'top' || split[0] === 'bottom') {
        switch (split[1]) {
          case 'left':
            offset.left = position.left;
            break;
          case 'right':
            offset.left =  position.left + position.width - actualWidth;
        }
      } else if(split[0] === 'left' || split[0] === 'right') {
        switch (split[1]) {
          case 'top':
            offset.top = position.top - actualHeight;
            break;
          case 'bottom':
            offset.top = position.top + position.height;
        }
      }

      return offset;
    };

    return fn;

  });

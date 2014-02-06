'use strict';

angular.module('mgcrea.ngStrap.affix', ['mgcrea.ngStrap.helpers.dimensions'])

  .provider('$affix', function() {

    var defaults = this.defaults = {
      offsetTop: 'auto'
    };

    this.$get = function($window, dimensions) {

      var bodyEl = angular.element($window.document.body);

      function AffixFactory(element, config) {

        var $affix = {};

        // Common vars
        var options = angular.extend({}, defaults, config);

        // Initial private vars
        var reset = 'affix affix-top affix-bottom',
            initialAffixTop = 0,
            initialOffsetTop = 0,
            affixed = null,
            unpin = null;

        var target = options.target;
        var getScrollTop, getScrollHeight;
        if(options.target[0] === $window) {
          getScrollTop = function() {
            return $window.pageYOffset;
          };
          getScrollHeight = function() {
            return $window.document.body.scrollHeight;
          };
        }
        else {
          getScrollTop = function() {
            return options.target[0].scrollTop;
          };
          getScrollHeight = function() {
            return options.target[0].scrollHeight
          };
        }

        var parent = element.parent();
        // Options: custom parent
        if (options.offsetParent) {
          if (options.offsetParent.match(/^\d+$/)) {
            for (var i = 0; i < (options.offsetParent * 1) - 1; i++) {
              parent = parent.parent();
            }
          }
          else {
            parent = angular.element(options.offsetParent);
          }
        }

        // Options: offsets
        var offsetTop = 0;
        if(options.offsetTop) {
          if(options.offsetTop === 'auto') {
            options.offsetTop = '+0';
          }
          if(options.offsetTop.match(/^[-+]\d+$/)) {
            initialAffixTop -= options.offsetTop * 1;
            if(options.offsetParent) {
              offsetTop = dimensions.offset(parent[0]).top + (options.offsetTop * 1);
            }
            else {
              offsetTop = dimensions.offset(element[0]).top - dimensions.css(element[0], 'marginTop', true) + (options.offsetTop * 1);
            }
          }
          else {
            offsetTop = options.offsetTop * 1;
          }
        }

        var offsetBottom = 0;
        if(options.offsetBottom) {
          if(options.offsetParent && options.offsetBottom.match(/^[-+]\d+$/)) {
            // add 1 pixel due to rounding problems...
            offsetBottom = getScrollHeight() - (dimensions.offset(parent[0]).top + dimensions.height(parent[0])) + (options.offsetBottom * 1) + 1;
          }
          else {
            offsetBottom = options.offsetBottom * 1;
          }
        }

        $affix.init = function() {

          initialOffsetTop = dimensions.offset(element[0]).top + initialAffixTop;

          // Bind events
          target.on('scroll', this.checkPosition);
          target.on('click', this.checkPositionWithEventLoop);
          // Both of these checkPosition() calls are necessary for the case where
          // the user hits refresh after scrolling to the bottom of the page.
          this.checkPosition();
          this.checkPositionWithEventLoop();

        };

        $affix.destroy = function() {

          // Unbind events
          target.off('scroll', this.checkPosition);
          target.off('click', this.checkPositionWithEventLoop);

        };

        $affix.checkPositionWithEventLoop = function() {

          setTimeout(this.checkPosition, 1);

        };

        $affix.checkPosition = function() {
          // if (!this.$element.is(':visible')) return

          var scrollTop = getScrollTop();
          var position = dimensions.offset(element[0]);
          var elementHeight = dimensions.height(element[0]);

          // Get required affix class according to position
          var affix = getRequiredAffixClass(unpin, position, elementHeight);

          // Did affix status changed this last check?
          if(affixed === affix) return;
          affixed = affix;

          // Add proper affix class
          element.removeClass(reset).addClass('affix' + ((affix !== 'middle') ? '-' + affix : ''));

          if(affix === 'top') {
            unpin = null;
            element.css('position', (options.offsetParent) ? '' : 'relative');
            element.css('top', '');
          } else if(affix === 'bottom') {
            if (options.offsetUnpin) {
              unpin = -(options.offsetUnpin * 1);
            }
            else {
              // Calculate unpin threshold when affixed to bottom.
              // Hopefully the browser scrolls pixel by pixel.
              unpin = position.top - scrollTop;
            }
            element.css('position', (options.offsetParent) ? '' : 'relative');
            element.css('top', (options.offsetParent) ? '' : ((bodyEl[0].offsetHeight - offsetBottom - elementHeight - initialOffsetTop) + 'px'));
          } else { // affix === 'middle'
            unpin = null;
            element.css('position', 'fixed');
            element.css('top', initialAffixTop + 'px');
          }

        };

        // Private methods

        function getRequiredAffixClass(unpin, position, elementHeight) {

          var scrollTop = getScrollTop();
          var scrollHeight = getScrollHeight();

          if(scrollTop <= offsetTop) {
            return 'top';
          } else if(unpin !== null && (scrollTop + unpin <= position.top)) {
            return 'middle';
          } else if(offsetBottom !== null && (position.top + elementHeight + initialAffixTop >= scrollHeight - offsetBottom)) {
            return 'bottom';
          } else {
            return 'middle';
          }

        }

        $affix.init();
        return $affix;

      }

      return AffixFactory;

    };

  })

  .directive('bsAffix', function($affix, $window) {

    return {
      restrict: 'EAC',
      require: '^?bsAffixTarget',
      link: function postLink(scope, element, attr, affixTarget) {

        var options = {
          scope: scope,
          offsetTop: 'auto',
          target: affixTarget ? affixTarget.$element : angular.element($window)
        };
        angular.forEach(['offsetTop', 'offsetBottom', 'offsetParent', 'offsetUnpin'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        var affix = $affix(element, options);
        scope.$on('$destroy', function() {
          options = null;
          affix = null;
        });

      }
    };

  })

  .directive('bsAffixTarget', function () {
    return {
      controller: ['$element', function ($element) {
        this.$element = $element;
      }]
    };
  });

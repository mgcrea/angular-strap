'use strict';

angular.module('mgcrea.ngStrap.popover', ['mgcrea.ngStrap.tooltip'])

  .run(function($templateCache) {
    $templateCache.put('$popover', '<div class="popover" ng-show="content" ng-class="{\'in\': $visible}"><div class="arrow"></div><h3 class="popover-title" ng-bind-html="title" ng-show="title"></h3><div class="popover-content" ng-bind-html="content"></div></div>');
  })

  .provider('$popover', function() {

    var defaults = this.defaults = {
      animation: 'animation-fade',
      placement: 'right',
      template: '$popover',
      trigger: 'click',
      title: '',
      content: '',
      delay: 0,
      // html: false,
      container: false
    };

    this.$get = function($tooltip) {

      function PopoverFactory(element, config) {

        // Common vars
        var options = angular.extend({}, defaults, config);

        return $tooltip(element, options);

      }

      return PopoverFactory;

    };

  })

  .directive('bsPopover', function($window, $location, $sce, $popover) {

    var forEach = angular.forEach;
    var isDefined = angular.isDefined;
    var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;

    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr) {

        // Directive options
        var options = {scope: scope};
        forEach(['placement', 'container', 'delay', 'trigger', 'animation', 'template'], function(key) {
          if(isDefined(attr[key])) options[key] = attr[key];
        });

        // Support scope as data-attrs
        forEach(['title', 'content'], function(key) {
          attr[key] && attr.$observe(key, function(newValue, oldValue) {
            scope[key] = newValue;
            isDefined(oldValue) && requestAnimationFrame(function() {
              popover && popover.$applyPlacement();
            });
          });
        });

        // Support scope as an object
        attr.bsPopover && scope.$watch(attr.bsPopover, function(newValue, oldValue) {
          if(angular.isObject(newValue)) {
            angular.extend(scope, newValue);
          } else {
            scope.content = newValue;
          }
          isDefined(oldValue) && requestAnimationFrame(function() {
            popover && popover.$applyPlacement();
          });
        }, true);

        // Initialize popover
        var popover = $popover(element, options);

        // Garbage collection
        scope.$on('$destroy', function() {
          popover.destroy();
          options = null;
          popover = null;
        });

      }
    };

  });

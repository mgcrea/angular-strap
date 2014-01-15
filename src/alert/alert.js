'use strict';

// @BUG: following snippet won't compile correctly
// @TODO: submit issue to core
// '<span ng-if="title"><strong ng-bind="title"></strong>&nbsp;</span><span ng-bind-html="content"></span>' +

angular.module('mgcrea.ngStrap.alert', [])

  .run(function($templateCache) {

    var template =  '' +
      '<div class="alert" tabindex="-1" ng-class="[type ? \'alert-\' + type : null]">' +
        '<button type="button" class="close" ng-click="$hide()">&times;</button>' +
        '<strong ng-bind="title"></strong>&nbsp;<span ng-bind-html="content"></span>' +
      '</div>';

    $templateCache.put('$alert', template);

  })

  .provider('$alert', function() {

    var defaults = this.defaults = {
      animation: 'animation-fade',
      prefixClass: 'alert',
      placement: null,
      template: '$alert',
      container: false,
      element: null,
      backdrop: false,
      keyboard: true,
      show: true,
      // Specific options
      duration: false
    };

    this.$get = function($modal, $timeout) {

      function AlertFactory(config) {

        var $alert = {};

        // Common vars
        var options = angular.extend({}, defaults, config);

        $alert = $modal(options);

        // Support scope as string options
        if(!options.scope) {
          angular.forEach([/*'title', 'content', */'type'], function(key) {
            if(options[key]) $alert.$scope[key] = options[key];
          });
        }

        // Support auto-close duration
        var show = $alert.show;
        if(options.duration) {
          $alert.show = function() {
            show();
            $timeout(function() {
              $alert.hide();
            }, options.duration * 1000);
          };
        }

        return $alert;

      }

      return AlertFactory;

    };

  })

  .directive('bsAlert', function($window, $location, $sce, $alert) {

    var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;

    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {

        // Directive options
        var options = {scope: scope, element: element, show: false};
        angular.forEach(['template', 'placement', 'keyboard', 'html', 'container', 'animation', 'duration'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Support scope as data-attrs
        angular.forEach(['title', 'content', 'type'], function(key) {
          attr[key] && attr.$observe(key, function(newValue, oldValue) {
            scope[key] = newValue;
          });
        });

        // Support scope as an object
        attr.bsAlert && scope.$watch(attr.bsAlert, function(newValue, oldValue) {
          if(angular.isObject(newValue)) {
            angular.extend(scope, newValue);
          } else {
            scope.content = newValue;
          }
        }, true);

        // Initialize alert
        var alert = $alert(options);

        // Trigger
        element.on(attr.trigger || 'click', alert.toggle);

        // Garbage collection
        scope.$on('$destroy', function() {
          alert.destroy();
          options = null;
          alert = null;
        });

      }
    };

  });

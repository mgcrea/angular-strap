'use strict';

var forEach = angular.forEach;
var isObject = angular.isObject;
var isDefined = angular.isDefined;

angular.module('mgcrea.ngStrap.aside', [])

  .run(function($templateCache) {
    var template = '' +
    '<div class="aside" tabindex="-1" role="dialog">' +
      '<div class="aside-dialog">' +
        '<div class="aside-content">' +
          '<div class="aside-header" ng-show="title">' +
            '<button type="button" class="close" ng-click="$hide()">&times;</button>' +
            '<h4 class="aside-title" ng-bind-html="title"></h4>' +
          '</div>' +
          '<div class="aside-body" ng-show="content" ng-bind-html="content"></div>' +
          '<div class="aside-footer">' +
            '<button type="button" class="btn btn-default" ng-click="$hide()">Close</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
    $templateCache.put('$aside', template);
  })

  .provider('$aside', function() {

    var defaults = this.defaults = {
      animation: 'animation-fadeAndSlideRight',
      prefixClass: 'aside',
      placement: 'right',
      template: '$aside',
      container: false,
      element: null,
      backdrop: true,
      keyboard: true,
      show: true
    };

    this.$get = function($modal) {

      function AsideFactory(config) {

        var $aside = {};

        // Common vars
        var options = angular.extend({}, defaults, config);

        $aside = $modal(options);

        return $aside;

      }

      return AsideFactory;

    };

  })

  .directive('bsAside', function($window, $location, $sce, $aside) {

    var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;

    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {
        // Directive options
        var options = {scope: scope, element: element, show: false};
        forEach(['template', 'placement', 'backdrop', 'keyboard', 'show', 'container', 'animation'], function(key) {
          if(isDefined(attr[key])) options[key] = attr[key];
        });

        // Support scope as data-attrs
        forEach(['title', 'content'], function(key) {
          attr[key] && attr.$observe(key, function(newValue, oldValue) {
            scope[key] = newValue;
          });
        });

        // Support scope as an object
        attr.bsAside && scope.$watch(attr.bsAside, function(newValue, oldValue) {
          if(angular.isObject(newValue)) {
            angular.extend(scope, newValue);
          } else {
            scope.content = newValue;
          }
        }, true);

        // Initialize aside
        var aside = $aside(options);

        // Trigger
        element.on(attr.trigger || 'click', aside.toggle);

        // Garbage collection
        scope.$on('$destroy', function() {
          aside.destroy();
          options = null;
          aside = null;
        });

      }
    };

  });

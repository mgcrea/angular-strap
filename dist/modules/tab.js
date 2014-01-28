/**
 * angular-strap
 * @version v2.0.0-rc.1 - 2014-01-28
 * @link http://mgcrea.github.io/angular-strap
 * @author [object Object]
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';
angular.module('mgcrea.ngStrap.tab', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('$pane', '{{pane.content}}');
  }
]).provider('$tab', function () {
  var defaults = this.defaults = {
      animation: 'animation-fade',
      template: 'tab/tab.tpl.html'
    };
  this.$get = function () {
    return { defaults: defaults };
  };
}).directive('bsTabs', [
  '$window',
  '$animate',
  '$tab',
  function ($window, $animate, $tab) {
    var defaults = $tab.defaults;
    return {
      restrict: 'EAC',
      scope: true,
      require: '?ngModel',
      templateUrl: function (element, attr) {
        return attr.template || defaults.template;
      },
      link: function postLink(scope, element, attr, controller) {
        var options = defaults;
        angular.forEach(['animation'], function (key) {
          if (angular.isDefined(attr[key]))
            options[key] = attr[key];
        });
        attr.bsTabs && scope.$watch(attr.bsTabs, function (newValue, oldValue) {
          scope.panes = newValue;
        }, true);
        element.addClass('tabs');
        if (options.animation) {
          element.addClass(options.animation);
        }
        scope.active = scope.activePane = 0;
        scope.setActive = function (index, ev) {
          scope.active = index;
          if (controller) {
            controller.$setViewValue(index);
          }
        };
        if (controller) {
          controller.$render = function () {
            scope.active = controller.$modelValue * 1;
          };
        }
      }
    };
  }
]);
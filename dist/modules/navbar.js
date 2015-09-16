/**
 * angular-strap
 * @version v2.3.2 - 2015-09-15
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

angular.module('mgcrea.ngStrap.navbar', []).provider('$navbar', function() {
  var defaults = this.defaults = {
    activeClass: 'active',
    routeAttr: 'data-match-route',
    strict: false
  };
  this.$get = function() {
    return {
      defaults: defaults
    };
  };
}).directive('bsNavbar', [ '$window', '$location', '$navbar', function($window, $location, $navbar) {
  var defaults = $navbar.defaults;
  return {
    restrict: 'A',
    link: function postLink(scope, element, attr, controller) {
      var options = angular.copy(defaults);
      angular.forEach(Object.keys(defaults), function(key) {
        if (angular.isDefined(attr[key])) options[key] = attr[key];
      });
      scope.$watch(function() {
        return $location.path();
      }, function(newValue, oldValue) {
        var liElements = element[0].querySelectorAll('li[' + options.routeAttr + ']');
        angular.forEach(liElements, function(li) {
          var liElement = angular.element(li);
          var pattern = liElement.attr(options.routeAttr).replace('/', '\\/');
          if (options.strict) {
            pattern = '^' + pattern + '$';
          }
          var regexp = new RegExp(pattern, 'i');
          if (regexp.test(newValue)) {
            liElement.addClass(options.activeClass);
          } else {
            liElement.removeClass(options.activeClass);
          }
        });
      });
    }
  };
} ]);
'use strict';

angular.module('mgcrea.ngStrap.navbar', [])

  .provider('$navbar', function () {

    var defaults = this.defaults = {
      activeClass: 'active',
      routeAttr: 'data-match-route',
      strict: false
    };

    this.$get = function () {
      return {defaults: defaults};
    };

  })

  .directive('bsNavbar', function ($window, $location, $rootScope, $navbar) {

    var defaults = $navbar.defaults;

    return {
      restrict: 'A',
      link: function postLink(scope, element, attr, controller) {

        // Directive options
        var options = {};
        angular.extend(options, defaults);

        // Fire once, then listen for location change
        evaluatePath(options);
        $rootScope.$on('$locationChangeSuccess', function () {
            evaluatePath(options);
        });

        ////////////////////

        function evaluatePath(options) {
          var path = $location.path();
          var liElements = element[0].querySelectorAll('li[' + options.routeAttr + ']');
          angular.forEach(liElements, function (li) {

            var liElement = angular.element(li);
            var pattern = liElement.attr(options.routeAttr).replace('/', '\\/');
            if (options.strict) {
              pattern = '^' + pattern + '$';
            }
            var regexp = new RegExp(pattern, 'i');

            if (regexp.test(path)) {
              liElement.addClass(options.activeClass);
            } else {
              liElement.removeClass(options.activeClass);
            }

          });

        }

      }

    };

  });

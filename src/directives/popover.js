'use strict';

angular.module('$strap.directives')

.directive('bsPopover', function($parse, $compile, $http, $timeout, $q, $templateCache) {

  var type = 'popover',
      dataPrefix = !!$.fn.emulateTransitionEnd ? 'bs.' : '',
      evSuffix = dataPrefix ? '.' + dataPrefix + type : '';

  // Hide popovers when pressing esc
  $('body').on('keyup', function(ev) {
    if(ev.keyCode === 27) {
      $('.popover.in').popover('hide');
    }
  });

  return {
    restrict: 'A',
    scope: true,
    link: function postLink(scope, element, attr, ctrl) {

      var getter = $parse(attr.bsPopover),
        setter = getter.assign,
        value = getter(scope),
        options = {};

      if(angular.isObject(value)) {
        options = value;
      }

      $q.when(options.content || $templateCache.get(value) || $http.get(value, {cache: true})).then(function onSuccess(template) {

        // Handle response from $http promise
        if(angular.isObject(template)) {
          template = template.data;
        }

        // Handle data-placement and data-trigger attributes
        angular.forEach(['placement', 'trigger'], function(name) {
          if(!!attr[name]) {
            options[name] = attr[name];
          }
        });

        // Handle data-unique attribute
        if(!!attr.unique) {
          element.on('show' + evSuffix, function(ev) { // requires bootstrap 2.3.0+
            // Hide any active popover except self
            $('.popover.in').not(element).popover('hide');
          });
        }

        // Handle data-hide attribute to toggle visibility
        if(!!attr.hide) {
          scope.$watch(attr.hide, function(newValue, oldValue) {
            if(!!newValue) {
              popover.hide();
            } else if(newValue !== oldValue) {
              $timeout(function() {
                popover.show();
              });
            }
          });
        }

        if(!!attr.show) {
          scope.$watch(attr.show, function(newValue, oldValue) {
            if(!!newValue) {
              $timeout(function() {
                popover.show();
              });
            } else if(newValue !== oldValue) {
              popover.hide();
            }
          });
        }

        // Initialize popover
        element.popover(angular.extend({}, options, {
          content: template,
          html: true
        }));

        // Bootstrap override to provide tip() reference & compilation
        var popover = element.data(dataPrefix + type);
        popover.hasContent = function() {
          return this.getTitle() || template; // fix multiple $compile()
        };
        popover.getPosition = function() {
          var r = $.fn.popover.Constructor.prototype.getPosition.apply(this, arguments);

          // Compile content
          $compile(this.$tip)(scope);
          scope.$digest();

          // Bind popover to the tip()
          this.$tip.data(dataPrefix + type, this);

          return r;
        };

        // Provide scope display functions
        scope.$popover = function(name) {
          popover(name);
        };
        angular.forEach(['show', 'hide'], function(name) {
          scope[name] = function() {
            popover[name]();
          };
        });
        scope.dismiss = scope.hide;

        // Emit popover events
        angular.forEach(['show', 'shown', 'hide', 'hidden'], function(name) {
          element.on(name + evSuffix, function(ev) {
            scope.$emit('popover-' + name, ev);
          });
        });

      });

    }
  };

});

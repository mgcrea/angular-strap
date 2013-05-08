'use strict';

angular.module('$strap.directives')

.directive('bsPopover', function($parse, $compile, $http, $timeout, $q, $templateCache) {

  // Hide popovers when pressing esc
  $('body').on('keyup', function(ev) {
    if(ev.keyCode === 27) {
      $('.popover.in').each(function() {
        $(this).popover('hide');
      });
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

        // Handle data-unique attribute
        if(!!attr.unique) {
          element.on('show', function(ev) { // requires bootstrap 2.3.0+
            // Hide any active popover except self
            $('.popover.in').each(function() {
              var $this = $(this),
                popover = $this.data('popover');
              if(popover && !popover.$element.is(element)) {
                $this.popover('hide');
              }
            });
          });
        }

        // Handle data-hide attribute to toggle visibility
        if(!!attr.hide) {
          scope.$watch(attr.hide, function(newValue, oldValue) {
            if(!!newValue) {
              popover.hide();
            } else if(newValue !== oldValue) {
              popover.show();
            }
          });
        }

        // Initialize popover
        element.popover(angular.extend({}, options, {
          content: template,
          html: true
        }));

        // Bootstrap override to provide tip() reference & compilation
        var popover = element.data('popover');
        popover.hasContent = function() {
          return this.getTitle() || template; // fix multiple $compile()
        };
        popover.getPosition = function() {
          var r = $.fn.popover.Constructor.prototype.getPosition.apply(this, arguments);

          // Compile content
          $compile(this.$tip)(scope);
          scope.$digest();

          // Bind popover to the tip()
          this.$tip.data('popover', this);

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
          element.on(name, function(ev) {
            scope.$emit('popover-' + name, ev);
          });
        });

      });

    }
  };

});
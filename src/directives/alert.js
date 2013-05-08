'use strict';

angular.module('$strap.directives')

.directive('bsAlert', function($parse, $timeout, $compile) {

  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {

      var getter = $parse(attrs.bsAlert),
        setter = getter.assign,
        value = getter(scope);

      // For static alerts
      if(!attrs.bsAlert) {

        // Setup close button
        if(angular.isUndefined(attrs.closeButton) || (attrs.closeButton !== '0' && attrs.closeButton !== 'false')) {
          element.prepend('<button type="button" class="close" data-dismiss="alert">&times;</button>');
        }

      } else {

        scope.$watch(attrs.bsAlert, function(newValue, oldValue) {
          value = newValue;

          // Set alert content
          element.html((newValue.title ? '<strong>' + newValue.title + '</strong>&nbsp;' : '') + newValue.content || '');

          if(!!newValue.closed) {
            element.hide();
          }

          // Compile alert content
          //$timeout(function(){
          $compile(element.contents())(scope);
          //});

          // Add proper class
          if(newValue.type || oldValue.type) {
            oldValue.type && element.removeClass('alert-' + oldValue.type);
            newValue.type && element.addClass('alert-' + newValue.type);
          }

          // Setup close button
          if(angular.isUndefined(attrs.closeButton) || (attrs.closeButton !== '0' && attrs.closeButton !== 'false')) {
            element.prepend('<button type="button" class="close" data-dismiss="alert">&times;</button>');
          }

        }, true);

      }

      element.addClass('alert').alert();

      // Support fade-in effect
      if(element.hasClass('fade')) {
        element.removeClass('in');
        setTimeout(function() {
          element.addClass('in');
        });
      }

      var parentArray = attrs.ngRepeat && attrs.ngRepeat.split(' in ').pop();

      element.on('close', function(ev) {
        var removeElement;

        if(parentArray) { // ngRepeat, remove from parent array
          ev.preventDefault();

          element.removeClass('in');

          removeElement = function() {
            element.trigger('closed');
            if(scope.$parent) {
              scope.$parent.$apply(function() {
                var path = parentArray.split('.');
                var curr = scope.$parent;

                for (var i = 0; i < path.length; ++i) {
                  if (curr) {
                    curr = curr[path[i]];
                  }
                }

                if (curr) {
                  curr.splice(scope.$index, 1);
                }
              });
            }
          };

          $.support.transition && element.hasClass('fade') ?
            element.on($.support.transition.end, removeElement) :
            removeElement();

        } else if(value) { // object, set closed property to 'true'
          ev.preventDefault();

          element.removeClass('in');

          removeElement = function() {
            element.trigger('closed');
            scope.$apply(function() {
              value.closed = true;
            });
          };

          $.support.transition && element.hasClass('fade') ?
            element.on($.support.transition.end, removeElement) :
            removeElement();

        } else { // static, regular behavior
        }

      });

    }
  };
});

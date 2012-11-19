
angular.module('$strap.directives')

.directive('bsButton', ['$parse', function($parse) {

return {
  restrict: 'A',
  require: 'ngModel',
  link: function postLink(scope, element, attr, ctrl) {

    var getter = $parse(attr.ngModel),
      setter = getter.assign;

    // Disable bootstrap embedded button toggling
    if(element.attr('data-toggle') == 'button') element.removeAttr('data-toggle');
      if(element.parent().attr('data-toggle') == 'buttons-checkbox') element.parent().removeAttr('data-toggle');
    // Watch model for changes instead
    scope.$watch(attr.ngModel, function(newValue, oldValue) {
      if(!newValue) element.removeClass('active')
      else element.addClass('active');
    });

    // Click handling
    element.on('click', function(ev) {
      scope.$apply(function() {
        setter(scope, !getter(scope));
      });
    });

    // Initial state
    if(getter(scope)) {
      element.addClass('active');
    }

  }
}

}])

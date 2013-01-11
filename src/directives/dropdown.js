
angular.module('$strap.directives')

.directive('bsDropdown', ['$parse', '$compile', function($parse, $compile) {
  'use strict';

  var slice = Array.prototype.slice;

  var template = '' +
  '<ul class="dropdown-menu" role="menu" aria-labelledby="drop1">' +
    '<li ng-repeat="item in items" ng-class="{divider: !!item.divider, \'dropdown-submenu\': !!item.submenu && item.submenu.length}">' +
      '<a ng-hide="!!item.divider" tabindex="-1" ng-href="{{item.href}}" ng-click="{{item.click}}" target="{{item.target}}" ng-bind-html-unsafe="item.text"></a>' +
    '</li>' +
  '</ul>';

  var linkSubmenu = function(items, parent, scope) {
    var subitems, submenu, subscope;
    for (var i = 0, l = items.length; i < l; i++) {
      if(subitems = items[i].submenu) {
        subscope = scope.$new();
        subscope.items = subitems;
        submenu = $compile(template)(subscope);
        submenu = submenu.appendTo(parent.children('li:nth-child(' + (i+1) + ')'));
        asyncLinkSubmenu(subitems, submenu, subscope);
      }
    }
  };

  var asyncLinkSubmenu = function() {
    var args = slice.call(arguments);
    setTimeout(function() {
      linkSubmenu.apply(null, args);
    });
  };

  return {
    restrict: 'EA',
    scope: true,
    link: function postLink(scope, element, attr) {

      var getter = $parse(attr.bsDropdown);

      scope.items = getter(scope);
      var dropdown = $compile(template)(scope);
      asyncLinkSubmenu(scope.items, dropdown, scope);
      dropdown.insertAfter(element);

      element
        .addClass('dropdown-toggle')
        .attr('data-toggle', "dropdown");

    }
  };

}]);

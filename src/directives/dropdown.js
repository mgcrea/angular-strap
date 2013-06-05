'use strict';

angular.module('$strap.directives')

    .directive('bsDropdown', function($parse, $compile) {

        var buildTemplate = function(items, ul) {
            if(!ul) ul = ['<ul class="dropdown-menu" role="menu" aria-labelledby="drop1">', '</ul>'];
            angular.forEach(items, function(item, index) {
                if(item.divider) return ul.splice(index + 1, 0, '<li class="divider"></li>');
                var li = '<li' + (item.submenu && item.submenu.length ? ' class="dropdown-submenu"' : '') + '>' +
                    '<a tabindex="-1" ng-href="' + (item.href || '') + '"' + (item.click ? '" ng-click="' + item.click + '"' : '') + (item.target ? '" target="' + item.target + '"' : '') + (item.method ? '" data-method="' + item.method + '"' : '') + '>' +
                    (item.text || '') + '</a>';
                if(item.submenu && item.submenu.length) li += buildTemplate(item.submenu).join('\n');
                li += '</li>';
                ul.splice(index + 1, 0, li);
              });
              return ul;
          };

        return {
            restrict: 'EA',
            scope: true,
            link: function postLink(scope, iElement, iAttrs) {
                scope.$watch(iAttrs.bsDropdown,function(newdd,olddd) {
                    var dropdown = angular.element(buildTemplate(newdd).join(''));
                    iElement.nextAll().remove();
                    dropdown.insertAfter(iElement);

                    // Compile dropdown-menu
                    $compile(iElement.next('ul.dropdown-menu'))(scope);

                    iElement
                       .addClass('dropdown-toggle')
                       .attr('data-toggle', 'dropdown');

                  });
              }
          };

      });


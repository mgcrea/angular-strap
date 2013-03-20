
angular.module('$strap.directives')

.directive('bsTabs', ['$parse', '$compile', '$timeout', function($parse, $compile, $timeout) {
  'use strict';

  return {
    restrict: 'A',
    link: function postLink(scope, iElement, iAttrs) {

      var tabs = ['<ul class="nav nav-tabs">', '</ul>'];
      var panes = ['<div class="tab-content">', '</div>'];

      iElement.hide();

      // Defer after any ngRepeat rendering
      $timeout(function() {
        iElement.find('[data-tab]').each(function(index) {
          var $this = angular.element(this),
              id = 'tab-' + scope.$id + '-' + index,
              active = $this.hasClass('active'),
              fade = $this.hasClass('fade'),
              title = scope.$eval($this.data('tab'));
          tabs.splice(index + 1, 0, '<li' + (active ? ' class="active"' : '') + '><a href="#' + id + '" data-toggle="tab">' + title + '</a></li>');
          panes.splice(index + 1, 0, '<div class="tab-pane ' + $this.attr('class') + (fade && active ? ' in' : '') + '" id="' + id + '">' + this.innerHTML + '</div>');
        });

        iElement.html(tabs.join('') + panes.join('')).show();

        // Compile tab-content
        $compile(iElement.children('div.tab-content'))(scope);

      }, 500);

    }

  };

}]);

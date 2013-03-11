
angular.module('$strap.directives')

.directive('bsTabs', ['$location', function($location) {
  'use strict';

  return {
    restrict: 'A',
    link: function postLink(scope, iElement, iAttrs, controller) {

      var tabs = ['<ul class="nav nav-tabs">', '</ul>'];
      var panes = ['<div class="tab-content">', '</div>'];

      iElement.find('[data-tab]').each(function(index) {
        var $this = angular.element(this),
            id = 'tab-' + scope.$id + '-' + index,
            active = $this.hasClass('active'),
            fade = $this.hasClass('fade'),
            title = scope.$eval($this.data('tab'));
        tabs.splice(index + 1, 0, '<li' + (active ? ' class="active"' : '') + '><a href="#' + id + '" data-toggle="tab">' + title + '</a></li>');
        panes.splice(index + 1, 0, '<div class="tab-pane ' + $this.attr('class') + (fade && active ? ' in' : '') + '" id="' + id + '">' + this.innerHTML + '</div>');
      });

      iElement.html(tabs.join('') + panes.join(''));

    }

  };

}]);

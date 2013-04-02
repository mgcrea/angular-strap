
angular.module('$strap.directives')

.directive('bsTabs', ['$parse', '$compile', '$timeout', function($parse, $compile, $timeout) {
  'use strict';

  return {
    restrict: 'A',
    require: '?ngModel',
    scope: true,
    link: function postLink(scope, iElement, iAttrs, controller) {

      var getter = $parse(iAttrs.bsTabs),
        setter = getter.assign,
        value = getter(scope);

      var tabs = ['<ul class="nav nav-tabs">', '</ul>'];
      var panes = ['<div class="tab-content">', '</div>'];

      iElement.hide();
      var activeTab = 0;

      // Defer after any ngRepeat rendering
      $timeout(function() {

        if(!angular.isArray(value)) {

          value = [];
          // Convert existing dom elements
          iElement.children('[data-title], [data-tab]').each(function(index) {
            var $this = angular.element(this);
            value.push({
              title: scope.$eval($this.data('title') || $this.data('tab')),
              content: this.innerHTML,
              active: $this.hasClass('active'),
              fade: $this.hasClass('fade')
            });
          });

        }

        // Select correct starting activeTab
        angular.forEach(value, function(tab, index) {
          if(tab.active) {
            activeTab = index;
          }
        });

        // Build from object
        angular.forEach(value, function(tab, index) {
          var id = 'tab-' + scope.$id + '-' + index,
              active = activeTab === index,
              fade = iAttrs.fade || tab.fade;
          tabs.splice(index + 1, 0, '<li' + (active ? ' class="active"' : '') + '><a href="#' + id + '" data-index="' + index + '" data-toggle="tab">' + tab.title + '</a></li>');
          panes.splice(index + 1, 0, '<div class="tab-pane' + (active ? ' active' : '') + (fade ? ' fade' : '') + (fade && active ? ' in' : '') + '" id="' + id + '">' + tab.content + '</div>');
        });

        iElement.html(tabs.join('') + panes.join('')).show();

        // Compile tab-content
        $compile(iElement.children('div.tab-content'))(scope);

      });

      // If we have a controller (i.e. ngModelController) then wire it up
      if(controller) {

        iElement.on('show', function(ev) {
          var $target = $(ev.target);
          scope.$apply(function() {
            controller.$setViewValue($target.data('index'));
          });
        });

        // Watch ngModel for changes
        scope.$watch(iAttrs.ngModel, function(newValue, oldValue) {
          if(angular.isUndefined(newValue)) { return; }
          activeTab = newValue; // update starting activeTab before first build
          setTimeout(function() {
            var $next = iElement.children('ul.nav-tabs').find('li:eq(' + newValue*1 + ')');
            if(!$next.hasClass('active')) {
              $next.children('a').tab('show');
            }
          });
        });

      }

    }

  };

}]);

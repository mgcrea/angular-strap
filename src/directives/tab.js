'use strict';

angular.module('$strap.directives')

.directive('bsTabs', function($parse, $compile, $timeout) {

  var template = '<div class="tabs">' +
  '<ul class="nav nav-tabs">' +
    '<li ng-repeat="pane in panes" ng-class="{active:pane.active}">' +
      '<a data-target="#{{pane.id}}" data-index="{{$index}}" data-toggle="tab">{{pane.title}}</a>' +
    '</li>' +
  '</ul>' +
  '<div class="tab-content" ng-transclude>' +
    // '<div ng-repeat="pane in panes" ng-class="{active:pane.selected}">{{pane.content}}</div>' +
  '</div>';

  return {
    restrict: 'A',
    require: '?ngModel',
    priority: 0,
    scope: true,
    template: template,//'<div class="tabs"><ul class="nav nav-tabs"></ul><div class="tab-content"></div></div>',
    replace: true,
    transclude: true,
    compile: function compile(tElement, tAttrs, transclude) {

      return function postLink(scope, iElement, iAttrs, controller) {

        var getter = $parse(iAttrs.bsTabs),
            setter = getter.assign,
            value = getter(scope);

        scope.panes = [];
        var $tabs = iElement.find('ul.nav-tabs');
        var $panes = iElement.find('div.tab-content');


        var activeTab = 0, id, title, active;
        $timeout(function() {

          $panes.find('[data-title], [data-tab]').each(function(index) {
            var $this = angular.element(this);

            id = 'tab-' + scope.$id + '-' + index;
            title = $this.data('title') || $this.data('tab');
            active = !active && $this.hasClass('active');

            $this.attr('id', id).addClass('tab-pane');
            if(iAttrs.fade) $this.addClass('fade');

            scope.panes.push({
              id: id,
              title: title,
              content: this.innerHTML,
              active: active
            });

          });

          if(scope.panes.length && !active) {
            $panes.find('.tab-pane:first-child').addClass('active' + (iAttrs.fade ? ' in' : ''));
            scope.panes[0].active = true;
          }

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
            if(angular.isUndefined(newValue)) return;
            activeTab = newValue; // update starting activeTab before first build
            setTimeout(function() {
              var $next = $($tabs[0].querySelectorAll('li')[newValue*1]);
              if(!$next.hasClass('active')) {
                $next.children('a').tab('show');
              }
            });
          });

        }

      };

    }

  };

});

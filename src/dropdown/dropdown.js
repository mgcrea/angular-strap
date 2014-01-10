'use strict';

angular.module('mgcrea.ngStrap.dropdown', ['mgcrea.ngStrap.tooltip'])

  .run(function($templateCache) {

    var template = '' +
      '<ul tabindex="-1" class="dropdown-menu" role="menu">' +
        '<li role="presentation" ng-class="{divider: item.divider}" ng-repeat="item in content" >' +
          '<a role="menuitem" tabindex="-1" href="{{item.href}}" ng-if="!item.divider" ng-click="$eval(item.click);$hide()" ng-bind="item.text"></a>' +
        '</li>' +
      '</ul>';

    $templateCache.put('$dropdown', template);

  })

  .provider('$dropdown', function() {

    var defaults = this.defaults = {
      animation: 'animation-fade',
      prefixClass: 'dropdown',
      placement: 'bottom-left',
      template: '$dropdown',
      trigger: 'click',
      container: false,
      keyboard: true,
      html: false,
      delay: 0
    };

    this.$get = function($window, $tooltip) {

      var bodyEl = angular.element($window.document.body);
      var matchesSelector = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector;

      function DropdownFactory(element, config) {

        var $dropdown = {};

        // Common vars
        var options = angular.extend({}, defaults, config);

        $dropdown = $tooltip(element, options);

        // Protected methods

        $dropdown.$onKeyDown = function(evt) {
          if (!/(38|40)/.test(evt.keyCode)) return;
          evt.preventDefault();
          evt.stopPropagation();

          // Retrieve focused index
          var items = angular.element($dropdown.$element[0].querySelectorAll('li:not(.divider) a'));
          if(!items.length) return;
          var index;
          angular.forEach(items, function(el, i) {
            if(matchesSelector && matchesSelector.call(el, ':focus')) index = i;
          });

          // Navigate with keyboard
          if(evt.keyCode === 38 && index > 0) index--;
          else if(evt.keyCode === 40 && index < items.length - 1) index++;
          else if(angular.isUndefined(index)) index = 0;
          items.eq(index)[0].focus();

        };

        // Overrides

        var show = $dropdown.show;
        $dropdown.show = function() {
          show();
          setTimeout(function() {
            options.keyboard && $dropdown.$element.on('keydown', $dropdown.$onKeyDown);
            bodyEl.on('click', onBodyClick);
          });
        };

        var hide = $dropdown.hide;
        $dropdown.hide = function() {
          options.keyboard && $dropdown.$element.off('keydown', $dropdown.$onKeyDown);
          bodyEl.off('click', onBodyClick);
          hide();
        };

        // Private functions

        function onBodyClick(evt) {
          if(evt.target === element[0]) return;
          return evt.target !== element[0] && $dropdown.hide();
        }

        return $dropdown;

      }

      return DropdownFactory;

    };

  })

  .directive('bsDropdown', function($window, $location, $sce, $dropdown) {

    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {

        // Directive options
        var options = {scope: scope};
        angular.forEach(['placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'template'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Support scope as an object
        attr.bsDropdown && scope.$watch(attr.bsDropdown, function(newValue, oldValue) {
          scope.content = newValue;
        }, true);

        // Initialize dropdown
        var dropdown = $dropdown(element, options);

        // Garbage collection
        scope.$on('$destroy', function() {
          dropdown.destroy();
          options = null;
          dropdown = null;
        });

      }
    };

  });

/**
 * angular-strap
 * @version v2.3.12 - 2017-04-19
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

angular.module('mgcrea.ngStrap.tab', []).provider('$tab', function() {
  var defaults = this.defaults = {
    animation: 'am-fade',
    template: 'tab/tab.tpl.html',
    navClass: 'nav-tabs',
    activeClass: 'active'
  };
  var _tabsHash = {};
  var _addTabControl = function(key, control) {
    if (!_tabsHash[key]) _tabsHash[key] = control;
  };
  var controller = this.controller = function($scope, $element, $attrs, $timeout) {
    var self = this;
    self.$options = angular.copy(defaults);
    angular.forEach([ 'animation', 'navClass', 'activeClass', 'id' ], function(key) {
      if (angular.isDefined($attrs[key])) self.$options[key] = $attrs[key];
    });
    $scope.$navClass = self.$options.navClass;
    $scope.$activeClass = self.$options.activeClass;
    $scope.$onClick = function $onClick(evt, pane, index) {
      if (!pane.disabled) {
        self.$setActive(pane.name || index);
        focusCurrentTab();
      }
      evt.preventDefault();
      evt.stopPropagation();
    };
    function navigatePane(index, toLeft) {
      var newIndex = 0;
      if (toLeft) {
        newIndex = index - 1 < 0 ? self.$panes.length - 1 : index - 1;
      } else {
        newIndex = index + 1 >= self.$panes.length ? 0 : index + 1;
      }
      if (self.$panes[newIndex].disabled) {
        navigatePane(newIndex, toLeft);
      } else {
        self.$setActive(self.$panes[newIndex].name || newIndex);
        focusCurrentTab();
      }
    }
    function focusCurrentTab() {
      $timeout(function() {
        var activeAs = angular.element($element[0].querySelectorAll('li.' + self.$options.activeClass));
        if (activeAs.length > 0 && activeAs[0]) {
          activeAs[0].focus();
        }
      }, 100);
    }
    self.$panes = $scope.$panes = [];
    self.$activePaneChangeListeners = self.$viewChangeListeners = [];
    self.$push = function(pane) {
      if (angular.isUndefined(self.$panes.$active)) {
        $scope.$setActive(pane.name || 0);
      }
      self.$panes.push(pane);
      self.$panes.forEach(function(tabPane, index) {
        tabPane.$describedBy = self.$options.id === undefined ? undefined : self.$options.id + '_$tab_' + index;
        tabPane.$labeledBy = self.$options.id === undefined ? undefined : self.$options.id + '_$tab_' + index + '_a';
      });
    };
    self.$remove = function(pane) {
      var index = self.$panes.indexOf(pane);
      var active = self.$panes.$active;
      var activeIndex;
      if (angular.isString(active)) {
        activeIndex = self.$panes.map(function(pane) {
          return pane.name;
        }).indexOf(active);
      } else {
        activeIndex = self.$panes.$active;
      }
      self.$panes.splice(index, 1);
      if (index < activeIndex) {
        activeIndex--;
      } else if (index === activeIndex && activeIndex === self.$panes.length) {
        activeIndex--;
      }
      if (activeIndex >= 0 && activeIndex < self.$panes.length) {
        self.$setActive(self.$panes[activeIndex].name || activeIndex);
      } else {
        self.$setActive();
      }
    };
    self.$setActive = $scope.$setActive = function(value) {
      self.$panes.$active = value;
      self.$activePaneChangeListeners.forEach(function(fn) {
        fn();
      });
    };
    self.$isActive = $scope.$isActive = function($pane, $index) {
      return self.$panes.$active === $pane.name || self.$panes.$active === $index;
    };
    self.$onKeyPress = $scope.$onKeyPress = function(e, name, index) {
      if (e.keyCode === 32 || e.charCode === 32 || e.keyCode === 13 || e.charCode === 13) {
        self.$setActive(name);
        e.preventDefault();
        e.stopPropagation();
      } else if (e.keyCode === 37 || e.charCode === 37 || e.keyCode === 39 || e.charCode === 39) {
        navigatePane(index, e.keyCode === 37 || e.charCode === 37);
      }
    };
  };
  this.$get = function() {
    var $tab = {};
    $tab.defaults = defaults;
    $tab.controller = controller;
    $tab.addTabControl = _addTabControl;
    $tab.tabsHash = _tabsHash;
    return $tab;
  };
}).directive('bsTabs', [ '$window', '$animate', '$tab', '$parse', '$timeout', function($window, $animate, $tab, $parse, $timeout) {
  var defaults = $tab.defaults;
  return {
    require: [ '?ngModel', 'bsTabs' ],
    transclude: true,
    scope: true,
    controller: [ '$scope', '$element', '$attrs', '$timeout', $tab.controller ],
    templateUrl: function(element, attr) {
      return attr.template || defaults.template;
    },
    link: function postLink(scope, element, attrs, controllers) {
      var ngModelCtrl = controllers[0];
      var bsTabsCtrl = controllers[1];
      if (attrs.tabKey !== '' && attrs.tabKey !== undefined) {
        $tab.addTabControl(attrs.tabKey, bsTabsCtrl);
      }
      if (ngModelCtrl) {
        bsTabsCtrl.$activePaneChangeListeners.push(function() {
          ngModelCtrl.$setViewValue(bsTabsCtrl.$panes.$active);
        });
        ngModelCtrl.$formatters.push(function(modelValue) {
          bsTabsCtrl.$setActive(modelValue);
          return modelValue;
        });
      }
      bsTabsCtrl.$activePaneChangeListeners.push(function() {
        $timeout(function() {
          var liElements = element.find('li');
          for (var i = 0; i < liElements.length; i++) {
            var iElement = angular.element(liElements[i]);
            if (iElement.hasClass(bsTabsCtrl.$options.activeClass)) {
              iElement.find('a')[0].focus();
            }
          }
        }, 100);
      });
      if (attrs.bsActivePane) {
        var parsedBsActivePane = $parse(attrs.bsActivePane);
        bsTabsCtrl.$activePaneChangeListeners.push(function() {
          parsedBsActivePane.assign(scope, bsTabsCtrl.$panes.$active);
        });
        scope.$watch(attrs.bsActivePane, function(newValue, oldValue) {
          bsTabsCtrl.$setActive(newValue);
        }, true);
      }
    }
  };
} ]).directive('bsPane', [ '$window', '$animate', '$sce', function($window, $animate, $sce) {
  return {
    require: [ '^?ngModel', '^bsTabs' ],
    scope: true,
    link: function postLink(scope, element, attrs, controllers) {
      var bsTabsCtrl = controllers[1];
      element.addClass('tab-pane');
      element.attr('role', 'tabpanel');
      attrs.$observe('title', function(newValue, oldValue) {
        scope.title = $sce.trustAsHtml(newValue);
      });
      scope.name = attrs.name;
      scope.id = attrs.id;
      scope.name = scope.name || scope.id;
      if (bsTabsCtrl.$options.animation) {
        element.addClass(bsTabsCtrl.$options.animation);
      }
      attrs.$observe('disabled', function(newValue, oldValue) {
        scope.disabled = scope.$eval(newValue);
      });
      bsTabsCtrl.$push(scope);
      if (scope.$describedBy !== undefined) {
        element.attr('aria-describedby', scope.$describedBy);
      }
      scope.$on('$destroy', function() {
        bsTabsCtrl.$remove(scope);
      });
      function render() {
        var index = bsTabsCtrl.$panes.indexOf(scope);
        $animate[bsTabsCtrl.$isActive(scope, index) ? 'addClass' : 'removeClass'](element, bsTabsCtrl.$options.activeClass);
      }
      bsTabsCtrl.$activePaneChangeListeners.push(function() {
        render();
      });
      render();
    }
  };
} ]);
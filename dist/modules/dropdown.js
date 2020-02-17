/**
 * angular-strap
 * @version v2.3.12 - 2020-02-17
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

angular.module('mgcrea.ngStrap.dropdown', [ 'mgcrea.ngStrap.tooltip' ]).provider('$dropdown', function() {
  var defaults = this.defaults = {
    animation: 'am-fade',
    prefixClass: 'dropdown',
    prefixEvent: 'dropdown',
    placement: 'bottom-left',
    templateUrl: 'dropdown/dropdown.tpl.html',
    trigger: 'click',
    container: false,
    keyboard: true,
    html: false,
    delay: 0
  };
  this.$get = [ '$window', '$rootScope', '$tooltip', '$timeout', function($window, $rootScope, $tooltip, $timeout) {
    var bodyEl = angular.element($window.document.body);
    var matchesSelector = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector;
    function DropdownFactory(element, config) {
      var $dropdown = {};
      var options = angular.extend({}, defaults, config);
      $dropdown.$scope = options.scope && options.scope.$new() || $rootScope.$new();
      $dropdown = $tooltip(element, options);
      var parentEl = element.parent();
      if (element && element[0] && element[0].tagName.toUpperCase() === 'BUTTON') {
        element.attr('aria-haspopup', 'true');
        element.attr('data-toggle', 'dropdown');
        element.attr('aria-expanded', 'false');
      }
      element.keydown(function(evt) {
        if (/(9)/.test(evt.keyCode)) {
          evt.preventDefault();
          evt.stopPropagation();
          var items = angular.element($dropdown.$element[0].querySelectorAll('li:not(.divider) a'));
          items.eq(0)[0].focus();
        }
      });
      $dropdown.$onKeyDown = function(evt) {
        if (/(9)/.test(evt.keyCode) && !options.keyboard || /27/.test(evt.keyCode)) {
          $dropdown.hide(/27/.test(evt.keyCode));
          return;
        }
        if (!/(38|40)/.test(evt.keyCode)) return;
        evt.preventDefault();
        evt.stopPropagation();
        var items = angular.element($dropdown.$element[0].querySelectorAll('li:not(.divider) a'));
        if (!items.length) return;
        var index;
        angular.forEach(items, function(el, i) {
          if (matchesSelector && matchesSelector.call(el, ':focus')) index = i;
        });
        if (evt.keyCode === 38 && index > 0) index--; else if (evt.keyCode === 40 && index < items.length - 1) index++; else if (evt.keyCode === 40 && index === items.length - 1) index = 0; else if (angular.isUndefined(index)) index = 0;
        items.eq(index)[0].focus();
      };
      $dropdown.$onFocusOut = function(evt) {
        var inMenu = false;
        var parent = angular.element(evt.relatedTarget);
        while (parent !== undefined && parent.length && parent[0] !== $window.document.body) {
          parent = parent.parent();
          if (parent !== undefined && parent[0] === $dropdown.$element[0]) {
            inMenu = true;
            break;
          } else {
            inMenu = false;
          }
        }
        if (!inMenu) {
          $dropdown.hide();
        } else {
          evt.preventDefault();
          evt.stopPropagation();
        }
      };
      var show = $dropdown.show;
      $dropdown.show = function() {
        show();
        $timeout(function() {
          element.attr('aria-expanded', 'true');
          if ($dropdown.$element) {
            $dropdown.$element.attr('aria-hidden', 'false');
            $dropdown.$element.attr('role', 'menu');
          }
          if (options.keyboard && $dropdown.$element) {
            $dropdown.$element.on('keydown', $dropdown.$onKeyDown);
            $dropdown.$element.on('focusout', $dropdown.$onFocusOut);
          }
          bodyEl.on('click', onBodyClick);
          if ($dropdown.$element) {
            var items = angular.element($dropdown.$element[0].querySelectorAll('li:not(.divider)'));
            items.attr('role', 'none');
            angular.element($dropdown.$element[0].querySelectorAll('li.divider')).attr('role', 'seperator');
            items = angular.element($dropdown.$element[0].querySelectorAll('li:not(.divider) a'));
            items.attr('role', 'menuitem');
            if (items.length && options.keyboard) {
              angular.forEach(items, function(value, key) {
                angular.element(value).attr('tabindex', '-1');
              });
            }
          }
        }, 0, false);
        if (parentEl.hasClass('dropdown')) parentEl.addClass('open');
      };
      var hide = $dropdown.hide;
      $dropdown.hide = function(returnFocus) {
        if (!$dropdown.$isShown) return;
        element.attr('aria-expanded', 'false');
        $dropdown.$element.attr('aria-hidden', 'true');
        if (options.keyboard && $dropdown.$element) {
          $dropdown.$element.off('keydown', $dropdown.$onKeyDown);
          $dropdown.$element.off('focusout', $dropdown.$onFocusOut);
        }
        bodyEl.off('click', onBodyClick);
        if (parentEl.hasClass('dropdown')) parentEl.removeClass('open');
        $timeout(function() {
          hide();
          if (returnFocus) {
            $timeout(function() {
              if (element && element[0]) {
                element[0].focus();
              }
            }, 0, false);
          }
        }, 200);
      };
      var destroy = $dropdown.destroy;
      $dropdown.destroy = function() {
        bodyEl.off('click', onBodyClick);
        destroy();
      };
      function onBodyClick(evt) {
        if (evt.target === element[0]) return undefined;
        return evt.target !== element[0] && $dropdown.hide();
      }
      return $dropdown;
    }
    return DropdownFactory;
  } ];
}).directive('bsDropdown', [ '$window', '$sce', '$dropdown', function($window, $sce, $dropdown) {
  return {
    restrict: 'EAC',
    scope: true,
    compile: function(tElement, tAttrs) {
      if (!tAttrs.bsDropdown) {
        var nextSibling = tElement[0].nextSibling;
        while (nextSibling && nextSibling.nodeType !== 1) {
          nextSibling = nextSibling.nextSibling;
        }
        if (nextSibling && nextSibling.className.split(' ').indexOf('dropdown-menu') >= 0) {
          tAttrs.template = nextSibling.outerHTML;
          tAttrs.templateUrl = undefined;
          nextSibling.parentNode.removeChild(nextSibling);
        }
      }
      return function postLink(scope, element, attr) {
        var options = {
          scope: scope
        };
        angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'id', 'autoClose' ], function(key) {
          if (angular.isDefined(tAttrs[key])) options[key] = tAttrs[key];
        });
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach([ 'html', 'container' ], function(key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
        });
        angular.forEach([ 'onBeforeShow', 'onShow', 'onBeforeHide', 'onHide' ], function(key) {
          var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
          if (angular.isDefined(attr[bsKey])) {
            options[key] = scope.$eval(attr[bsKey]);
          }
        });
        if (attr.bsDropdown) {
          scope.$watch(attr.bsDropdown, function(newValue, oldValue) {
            scope.content = newValue;
          }, true);
        }
        var dropdown = $dropdown(element, options);
        if (attr.bsShow) {
          scope.$watch(attr.bsShow, function(newValue, oldValue) {
            if (!dropdown || !angular.isDefined(newValue)) return;
            if (angular.isString(newValue)) newValue = !!newValue.match(/true|,?(dropdown),?/i);
            if (newValue === true) {
              dropdown.show();
            } else {
              dropdown.hide();
            }
          });
        }
        scope.$on('$destroy', function() {
          if (dropdown) dropdown.destroy();
          options = null;
          dropdown = null;
        });
      };
    }
  };
} ]);
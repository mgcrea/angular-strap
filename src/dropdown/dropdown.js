'use strict';

angular.module('mgcrea.ngStrap.dropdown', ['mgcrea.ngStrap.tooltip'])

  .provider('$dropdown', function () {

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

    this.$get = function ($window, $rootScope, $tooltip, $timeout) {

      var bodyEl = angular.element($window.document.body);
      var matchesSelector = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector;

      function DropdownFactory (element, config) {

        var $dropdown = {};

        // Common vars
        var options = angular.extend({}, defaults, config);
        /* var scope = */
        $dropdown.$scope = options.scope && options.scope.$new() || $rootScope.$new();

        $dropdown = $tooltip(element, options);
        var parentEl = element.parent();

        if (element && element[0] && element[0].tagName.toUpperCase() === 'BUTTON') {
          element.attr('aria-haspopup', 'true');
          element.attr('aria-expanded', 'false');
        }

        // Protected methods

        $dropdown.$onKeyDown = function (evt) {
          if (evt.keyCode === 9 || evt.keyCode === 27) {
            $dropdown.hide(/27/.test(evt.keyCode));
            return;
          } else if ($dropdown.$element && (evt.keyCode === 38 || evt.keyCode === 40 || evt.keyCode === 32 || evt.keyCode === 13)) {
            //$dropdown.$element.focus();

            evt.preventDefault();
            evt.stopPropagation();

            // Retrieve active index
            var items = angular.element($dropdown.$element[0].querySelectorAll('li:not(.divider) a'));
            if (!items.length) return;
            var index;
            angular.forEach(items, function (el, i) {
              if (matchesSelector && matchesSelector.call(el, '.active')) {
                index = i;
                angular.element(el).removeClass('active');
              }
            });

            // Navigate with keyboard
            if (evt.keyCode === 32 || evt.keyCode === 13) {
              items.eq(index).click();
            } else if (evt.keyCode === 38 && index > 0) index--;
            else if (evt.keyCode === 38 && (angular.isUndefined(index) || index === 0)) index = items.length - 1;
            else if (evt.keyCode === 40 && index < items.length - 1) index++;
            else if (evt.keyCode === 40 && index === items.length - 1) index = 0;
            else if (angular.isUndefined(index)) index = 0;
            items.eq(index).addClass('active');
            $dropdown.$element.attr('aria-activedescendant', items.eq(index).attr('id'));
			items.eq(index)[0].focus();
          }
        };

        $dropdown.$onFocusOut = function (evt) {
          // find out if the related target's parents contain the datepicker's $element
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

        // Overrides

        var show = $dropdown.show;
        $dropdown.show = function () {
          show();
          // use timeout to hookup the events to prevent
          // event bubbling from being processed imediately.
          $timeout(function () {
            // Set assistive technology properties
            element.attr('aria-expanded', 'true');
            if ($dropdown.$element) {
              $dropdown.$element.attr('aria-activedescendant', '');
              $dropdown.$element.attr('role', 'menu');
              $dropdown.$element.attr('tabindex', '-1');
            }
            if (options.keyboard && $dropdown.$element) {
              $dropdown.$element.on('keydown', $dropdown.$onKeyDown);
              $dropdown.$element.on('focusout', $dropdown.$onFocusOut);
            }

            bodyEl.on('click', onBodyClick);

            if ($dropdown.$element) {
              var items = angular.element($dropdown.$element[0].querySelectorAll('li:not(.divider)'));
              // <li> should have role="none" as per SS-9603
              items.attr('role', 'none');

              angular.element($dropdown.$element[0].querySelectorAll('li.divider')).attr('role', 'seperator');

              items = angular.element($dropdown.$element[0].querySelectorAll('li:not(.divider) a'));
              items.attr('role', 'menuitem');
              if (items.length && options.keyboard) {
                // Dropdown menu items that are natively focusable need to have a tabindex of -1 per SS-9603
                // Menu item ID's should be unique for aria-activedescendant
                angular.forEach(items, function (value, key) {
                  angular.element(value).attr('id', $dropdown.$scope.$id + '_menuitem_' + key);
                  angular.element(value).attr('tabindex', '-1');
                });
              }
            }
          }, 0, false);
          if (parentEl.hasClass('dropdown')) parentEl.addClass('open');
        };

        var hide = $dropdown.hide;
        $dropdown.hide = function (returnFocus) {
          if (!$dropdown.$isShown) return;

          element.attr('aria-expanded', 'false');

          if (options.keyboard && $dropdown.$element) {
            $dropdown.$element.off('keydown', $dropdown.$onKeyDown);
            $dropdown.$element.off('focusout', $dropdown.$onFocusOut);
          }

          bodyEl.off('click', onBodyClick);
          if (parentEl.hasClass('dropdown')) parentEl.removeClass('open');
          $timeout(function () {
            hide();
            if (returnFocus) {
              $timeout(function () {
                if (element && element[0]) {
                  element[0].focus();
                }
              }, 0, false);
            }
          }, 200);
        };

        var destroy = $dropdown.destroy;
        $dropdown.destroy = function () {
          bodyEl.off('click', onBodyClick);
          destroy();
        };

        // Private functions

        function onBodyClick (evt) {
          if (evt.target === element[0]) return undefined;
          return evt.target !== element[0] && $dropdown.hide();
        }

        return $dropdown;

      }

      return DropdownFactory;

    };

  })

  .directive('bsDropdown', function ($window, $sce, $dropdown) {

    return {
      restrict: 'EAC',
      scope: true,
      compile: function (tElement, tAttrs) {

        // Support for inlined template (next sibling)
        // It must be fetched before compilation
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

        return function postLink (scope, element, attr) {

          // Directive options
          var options = {
            scope: scope
          };
          angular.forEach(['template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'id', 'autoClose'], function (key) {
            if (angular.isDefined(tAttrs[key])) options[key] = tAttrs[key];
          });

          // use string regex match boolean attr falsy values, leave truthy values be
          var falseValueRegExp = /^(false|0|)$/i;
          angular.forEach(['html', 'container'], function (key) {
            if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
          });

          // bind functions from the attrs to the show and hide events
          angular.forEach(['onBeforeShow', 'onShow', 'onBeforeHide', 'onHide'], function (key) {
            var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
            if (angular.isDefined(attr[bsKey])) {
              options[key] = scope.$eval(attr[bsKey]);
            }
          });

          // Support scope as an object
          if (attr.bsDropdown) {
            scope.$watch(attr.bsDropdown, function (newValue, oldValue) {
              scope.content = newValue;
            }, true);
          }

          // Initialize dropdown
          var dropdown = $dropdown(element, options);

          // Pickup key press on the dropdown button
          element.on('keydown',function (evt) {
            if (evt.keyCode === 38 || evt.keyCode === 40 || evt.keyCode === 27 || evt.keyCode === 9) {
              dropdown.$onKeyDown(evt);
            }
          });

          // Visibility binding support
          if (attr.bsShow) {
            scope.$watch(attr.bsShow, function (newValue, oldValue) {
              if (!dropdown || !angular.isDefined(newValue)) return;
              if (angular.isString(newValue)) newValue = !!newValue.match(/true|,?(dropdown),?/i);
              if (newValue === true) {
                dropdown.show();
              } else {
                dropdown.hide();
              }
            });
          }

          // Garbage collection
          scope.$on('$destroy', function () {
            if (dropdown) dropdown.destroy();
            options = null;
            dropdown = null;
          });

        };
      }
    };

  });

'use strict';

angular.module('mgcrea.ngStrap.select', ['mgcrea.ngStrap.tooltip', 'mgcrea.ngStrap.helpers.parseOptions'])

  .provider('$select', function() {

    var defaults = this.defaults = {
      animation: 'animation-fade',
      prefixClass: 'select',
      placement: 'bottom-left',
      template: 'select/select.tpl.html',
      trigger: 'focus',
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      multiple: false,
      sort: true,
      caretHtml: '&nbsp;<span class="caret"></span>',
      placeholder: 'Choose among the following...'
    };

    this.$get = function($window, $document, $rootScope, $tooltip) {

      var bodyEl = angular.element($window.document.body);
      var isTouch = 'createTouch' in $window.document;

      function SelectFactory(element, controller, config) {

        var $select = {};

        // Common vars
        var options = angular.extend({}, defaults, config);

        $select = $tooltip(element, options);
        var parentScope = config.scope;
        var scope = $select.$scope;

        scope.$matches = [];
        scope.$activeIndex = 0;
        scope.$isMultiple = options.multiple;

        scope.$activate = function(index) {
          scope.$$postDigest(function() {
            $select.activate(index);
          });
        };

        scope.$select = function(index, evt) {
          scope.$$postDigest(function() {
            $select.select(index);
          });
        };

        scope.$isVisible = function() {
          return $select.$isVisible();
        };

        scope.$isActive = function(index) {
          return $select.$isActive(index);
        };

        // Public methods

        $select.update = function(matches) {
          scope.$matches = matches;
          if(controller.$modelValue && matches.length) {
            if(options.multiple && angular.isArray(controller.$modelValue)) {
              scope.$activeIndex = controller.$modelValue.map(function(value) {
                return $select.$getIndex(value);
              });
            } else {
              scope.$activeIndex = $select.$getIndex(controller.$modelValue);
            }
          } else if(scope.$activeIndex >= matches.length) {
            scope.$activeIndex = options.multiple ? [] : 0;
          }
        };

        $select.activate = function(index) {
          if(options.multiple) {
            scope.$activeIndex.sort();
            $select.$isActive(index) ? scope.$activeIndex.splice(scope.$activeIndex.indexOf(index), 1) : scope.$activeIndex.push(index);
            if(options.sort) scope.$activeIndex.sort();
          } else {
            scope.$activeIndex = index;
          }
          return scope.$activeIndex;
        };

        $select.select = function(index) {
          var value = scope.$matches[index].value;
          $select.activate(index);
          if(options.multiple) {
            controller.$setViewValue(scope.$activeIndex.map(function(index) {
              return scope.$matches[index].value;
            }));
          } else {
            controller.$setViewValue(value);
          }
          controller.$render();
          if(parentScope) parentScope.$digest();
          // Hide if single select
          if(!options.multiple) {
            if(options.trigger === 'focus') element[0].blur();
            else if($select.$isShown) $select.hide();
          }
          // Emit event
          scope.$emit('$select.select', value, index);
        };

        // Protected methods

        $select.$isVisible = function() {
          if(!options.minLength || !controller) {
            return scope.$matches.length;
          }
          // minLength support
          return scope.$matches.length && controller.$viewValue.length >= options.minLength;
        };

        $select.$isActive = function(index) {
          if(options.multiple) {
            return scope.$activeIndex.indexOf(index) !== -1;
          } else {
            return scope.$activeIndex === index;
          }
        };

        $select.$getIndex = function(value) {
          var l = scope.$matches.length, i = l;
          if(!l) return;
          for(i = l; i--;) {
            if(scope.$matches[i].value === value) break;
          }
          if(i < 0) return;
          return i;
        };

        $select.$onElementMouseDown = function(evt) {
          evt.preventDefault();
          evt.stopPropagation();
          if($select.$isShown) {
            element[0].blur();
          } else {
            element[0].focus();
          }
        };

        $select.$onMouseDown = function(evt) {
          // Prevent blur on mousedown on .dropdown-menu
          evt.preventDefault();
          evt.stopPropagation();
          // Emulate click for mobile devices
          if(isTouch) {
            var targetEl = angular.element(evt.target);
            targetEl.triggerHandler('click');
          }
        };

        $select.$onKeyDown = function(evt) {
          if (!/(38|40|13)/.test(evt.keyCode)) return;
          evt.preventDefault();
          evt.stopPropagation();

          // Select with enter
          if(evt.keyCode === 13) {
            return $select.select(scope.$activeIndex);
          }

          // Navigate with keyboard
          if(evt.keyCode === 38 && scope.$activeIndex > 0) scope.$activeIndex--;
          else if(evt.keyCode === 40 && scope.$activeIndex < scope.$matches.length - 1) scope.$activeIndex++;
          else if(angular.isUndefined(scope.$activeIndex)) scope.$activeIndex = 0;
          scope.$digest();
        };

        // Overrides

        var _init = $select.init;
        $select.init = function() {
          _init();
          element.on(isTouch ? 'touchstart' : 'mousedown', $select.$onElementMouseDown);
        };

        var _destroy = $select.destroy;
        $select.destroy = function() {
          _destroy();
          element.off(isTouch ? 'touchstart' : 'mousedown', $select.$onElementMouseDown);
        };

        var _show = $select.show;
        $select.show = function() {
          _show();
          if(options.multiple) {
            $select.$element.addClass('select-multiple');
          }
          setTimeout(function() {
            $select.$element.on(isTouch ? 'touchstart' : 'mousedown', $select.$onMouseDown);
            if(options.keyboard) {
              element.on('keydown', $select.$onKeyDown);
            }
          });
        };

        var _hide = $select.hide;
        $select.hide = function() {
          $select.$element.off(isTouch ? 'touchstart' : 'mousedown', $select.$onMouseDown);
          if(options.keyboard) {
            element.off('keydown', $select.$onKeyDown);
          }
          _hide();
        };

        return $select;

      }

      SelectFactory.defaults = defaults;
      return SelectFactory;

    };

  })

  .directive('bsSelect', function($window, $parse, $q, $select, $parseOptions) {

    var defaults = $select.defaults;

    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {

        // Directive options
        var options = {scope: scope};
        angular.forEach(['placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'template', 'placeholder', 'multiple'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // if(element[0].nodeName.toLowerCase() === 'select') {
        //   var inputEl = element;
        //   inputEl.css('display', 'none');
        //   element = angular.element('<div class="btn btn-default"></div>');
        //   inputEl.after(element);
        // }

        // Build proper ngOptions
        var parsedOptions = $parseOptions(attr.ngOptions);

        // Initialize select
        var select = $select(element, controller, options);

        // Watch ngOptions values for changes
        scope.$watch(parsedOptions.$match[7], function(newValue, oldValue) {
          parsedOptions.valuesFn(scope, controller)
          .then(function(values) {
            select.update(values);
            controller.$render();
          });
        });

        // Model rendering in view
        controller.$render = function () {
          // console.warn('$render', element.attr('ng-model'), 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue, 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue);
          var selected, index;
          if(options.multiple && angular.isArray(controller.$modelValue)) {
            selected = controller.$modelValue.map(function(value) {
              index = select.$getIndex(value);
              return angular.isDefined(index) ? select.$scope.$matches[index].label : false;
            }).filter(angular.isDefined).join(', ');
          } else {
            index = select.$getIndex(controller.$modelValue);
            selected = angular.isDefined(index) ? select.$scope.$matches[index].label : false;
          }
          element.html((selected ? selected : attr.placeholder || defaults.placeholder) + defaults.caretHtml);
        };

        // Garbage collection
        scope.$on('$destroy', function() {
          select.destroy();
          options = null;
          select = null;
        });

      }
    };

  });

'use strict';

angular.module('mgcrea.ngStrap.typeahead', ['mgcrea.ngStrap.tooltip', 'mgcrea.ngStrap.helpers.parseOptions'])

  .provider('$typeahead', function() {

    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'typeahead',
      prefixEvent: '$typeahead',
      placement: 'bottom-left',
      template: 'typeahead/typeahead.tpl.html',
      trigger: 'focus',
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      minLength: 1,
      filter: 'filter',
      limit: 6
    };

    this.$get = function($window, $rootScope, $tooltip, $parseOptions, $parse) {

      var bodyEl = angular.element($window.document.body);

      function TypeaheadFactory(element, controller, config) {

        var $typeahead = {};

        // Common vars
        var options = angular.extend({}, defaults, config);
        var parsedOptions = $parseOptions(config.ngOptions);

        $typeahead = $tooltip(element, options);
        var parentScope = config.scope;
        var scope = $typeahead.$scope;

        // // Watch options on demand
        // if(options.watchOptions) {
        //   // Watch ngOptions values before filtering for changes, drop function calls
        //   var watchedOptions = parsedOptions.$match[7].replace(/\|.+/, '').replace(/\(.*\)/g, '').trim();
        //   scope.$watch(watchedOptions, function (newValue, oldValue) {
        //     // console.warn('scope.$watch(%s)', watchedOptions, newValue, oldValue);
        //     parsedOptions.valuesFn(scope, controller).then(function (values) {
        //       $typeahead.update(values);
        //       controller.$render();
        //     });
        //   }, true);
        // }

        scope.$resetMatches = function(){
          scope.$matches = [];
          scope.$activeIndex = 0;
        };
        scope.$resetMatches();

        scope.$activate = function(index) {
          scope.$$postDigest(function() {
            $typeahead.activate(index);
          });
        };

        scope.$select = function(index, evt) {
          scope.$$postDigest(function() {
            $typeahead.select(index);
          });
        };

        // Public methods

        $typeahead.update = function(matches) {
          scope.$matches = matches;
          if(scope.$activeIndex >= matches.length) {
            scope.$activeIndex = 0;
          }
        };

        $typeahead.activate = function(index) {
          scope.$activeIndex = index;
        };

        var _isSelectingIndex = null;
        $typeahead.select = function(index) {
          _isSelectingIndex = index;
          var value = scope.$matches[index].label;
          controller.$setViewValue(value);
          controller.$render();
          scope.$resetMatches();
          if($typeahead.$scope.$isShown) $typeahead.hide();
          if(parentScope) parentScope.$apply();
          // Emit event
          scope.$emit(options.prefixEvent + '.select', value, index);
        };

        // parser manages typeahead matches and selectionMode
        controller.$parsers.unshift(function (inputValue) {

          if(_isSelectingIndex !== null && $typeahead.$scope.$matches.length > _isSelectingIndex){
            var value = $typeahead.$scope.$matches[_isSelectingIndex];
            value = options.selectMode ? value.value : value.label;
            _isSelectingIndex = null;
            controller.$setValidity('select', true);
            return value;
          } else {

            if(inputValue.length >= options.minLength){
              parsedOptions.valuesFn(scope, controller)
                .then(function(values) {
                  if(!values.length){
                    if(options.selectMode && inputValue.length > 0) {
                      controller.$setViewValue(controller.$viewValue.substring(0, controller.$viewValue.length - 1));
                      controller.$render();
                      return;
                    }
                    $typeahead.hide();
                  }
                  $typeahead.update(values);
                  if(!$typeahead.$scope.$isShown) $typeahead.show();
                });
            } else {
              $typeahead.hide();
              scope.$resetMatches();
            }
            return !options.selectMode ? inputValue : undefined;
          }
        });

        if(options.formatter){
          var formatter = $parse(options.formatter)(scope);
          if(angular.isFunction(formatter)){
            controller.$formatters.unshift(function(value){
              return formatter(value);
            });
          } else if(angular.isString(formatter)){
            controller.$formatters.unshift(function(value){
              return value[formatter];
            });
          }
        } else {
          controller.$formatters.unshift(function(value){
            var viewValue = parsedOptions.calcViewValue(value);
            if(viewValue){
              parsedOptions.valuesFn(scope, {$viewValue:viewValue}).then(function(values){
                $typeahead.update(values);
              });
            }
            return viewValue;
          });
        }


        // Protected methods

        $typeahead.$getIndex = function(value) {
          var l = scope.$matches.length, i = l;
          if(!l) return;
          for(i = l; i--;) {
            if(scope.$matches[i].value === value) break;
          }
          if(i < 0) return;
          return i;
        };

        $typeahead.$onMouseDown = function(evt) {
          // Prevent blur on mousedown
          evt.preventDefault();
          evt.stopPropagation();
        };

        $typeahead.$onKeyDown = function(evt) {
          if(!/(38|40|13)/.test(evt.keyCode)) return;

          // Let ngSubmit pass if the typeahead tip is hidden
          if($typeahead.$scope.$isShown) {
            evt.preventDefault();
            evt.stopPropagation();
          }

          // Select with enter
          if(evt.keyCode === 13 && scope.$matches.length) {
            $typeahead.select(scope.$activeIndex);
          }

          // Navigate with keyboard
          else if(evt.keyCode === 38 && scope.$activeIndex > 0) scope.$activeIndex--;
          else if(evt.keyCode === 40 && scope.$activeIndex < scope.$matches.length - 1) scope.$activeIndex++;
          else if(angular.isUndefined(scope.$activeIndex)) scope.$activeIndex = 0;
          scope.$digest();
        };

        // Overrides

        var _show = $typeahead.show;
        $typeahead.show = function() {
          if(!scope.$matches.length) return;
          _show();
          setTimeout(function() {
            $typeahead.$element.on('mousedown', $typeahead.$onMouseDown);
            if(options.keyboard) {
              element.on('keydown', $typeahead.$onKeyDown);
            }
          });
        };

        var _hide = $typeahead.hide;
        $typeahead.hide = function() {
          $typeahead.$element && $typeahead.$element.off('mousedown', $typeahead.$onMouseDown);
          if(options.keyboard) {
            element.off('keydown', $typeahead.$onKeyDown);
          }
          _hide();
        };

        return $typeahead;

      }

      TypeaheadFactory.defaults = defaults;
      return TypeaheadFactory;

    };

  })

  .directive('bsTypeahead', function($window, $q, $typeahead) {

    var defaults = $typeahead.defaults;

    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {

        // Directive options
        var options = {scope: scope};
        angular.forEach(['ngOptions', 'placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'template', 'filter', 'limit', 'minLength', 'watchOptions', 'selectMode', 'formatter'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Build proper ngOptions
        var filter = options.filter || defaults.filter;
        var limit = options.limit || defaults.limit;
        var ngOptions = attr.ngOptions;
        if(filter) options.ngOptions += ' | ' + filter + ':$viewValue';
        if(limit) options.ngOptions += ' | limitTo:' + limit;

        // Initialize typeahead
        var typeahead = $typeahead(element, controller, options);

        // // Watch options on demand
        // if(options.watchOptions) {
        //   // Watch ngOptions values before filtering for changes, drop function calls
        //   var watchedOptions = typeahead.parsedOptions.$match[7].replace(/\|.+/, '').replace(/\(.*\)/g, '').trim();
        //   scope.$watch(watchedOptions, function (newValue, oldValue) {
        //     // console.warn('scope.$watch(%s)', watchedOptions, newValue, oldValue);
        //     typeahead.parsedOptions.valuesFn(scope, controller).then(function (values) {
        //       typeahead.update(values);
        //       controller.$render();
        //     });
        //   }, true);
        // }

        // Watch model for changes
        scope.$watch(attr.ngModel, function(newValue, oldValue) {
          scope.$modelValue = newValue; // Publish modelValue on scope for custom templates
        });

        // Model rendering in view
        controller.$render = function () {
          if(controller.$viewValue){
            element.val(controller.$viewValue.replace(/<(?:.|\n)*?>/gm, '').trim());
          } else {
            element.val('');
          }
        };

        // Garbage collection
        scope.$on('$destroy', function() {
          if (typeahead) typeahead.destroy();
          options = null;
          typeahead = null;
        });

      }
    };

  });

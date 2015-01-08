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
      limit: 6,
      comparator: ''
    };

    this.$get = function($window, $rootScope, $tooltip, $parseOptions, $timeout) {

      var bodyEl = angular.element($window.document.body);

      function TypeaheadFactory(element, controller, config) {

        var $typeahead = {};

        // Common vars
        var options = angular.extend({}, defaults, config);
        var parsedOptions = $parseOptions(config.ngOptions);

        $typeahead = $tooltip(element, options);
        var parentScope = config.scope;
        var scope = $typeahead.$scope;
        var _selectingValue = null, _hasSelection = false, _firstShow = true, _isParsing = false;

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

        scope.$isVisible = function() {
          return $typeahead.$isVisible();
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

        $typeahead.select = function(index) {

          var label = scope.$matches[index].label;
          _selectingValue = scope.$matches[index].value;

          if(angular.version.minor > 2 && controller.$viewValue === label){
            controller.$validate();
          } else {
            controller.$setViewValue(label);
          }

          controller.$render();
          scope.$resetMatches();
          if(parentScope) parentScope.$apply();

          // Emit event
          scope.$emit(options.prefixEvent + '.select', _selectingValue, index);
          _selectingValue = null;

        };


        // Protected methods

        $typeahead.$isVisible = function() {
          if(!options.minLength || !controller) {
            return !!scope.$matches.length;
          }
          // minLength support
          var viewValue = controller.$viewValue != null ? controller.$viewValue : ''; //no need in angular >=1.3
          return scope.$matches.length && viewValue.length >= options.minLength && !_hasSelection;
        };

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
          if(_isParsing) return false
          if(!/(38|40|13)/.test(evt.keyCode)) return;
          // Let ngSubmit pass if the typeahead tip is hidden
          if($typeahead.$isVisible()) {
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
          // Initial call parsedOptions. Next calls are done in parser
          if(_firstShow){
            _isParsing = true;
            parsedOptions.valuesFn(scope, controller).then(function(values) {
              $typeahead.update(values);
              _isParsing = false;
            });
            _firstShow = false;
          }

          _show();
          // use timeout to hookup the events to prevent
          // event bubbling from being processed imediately.
          $timeout(function() {
            $typeahead.$element.on('mousedown', $typeahead.$onMouseDown);
            if(options.keyboard) {
              element.on('keydown', $typeahead.$onKeyDown);
            }
          }, 0, false);
        };

        var _hide = $typeahead.hide;
        $typeahead.hide = function() {
          $typeahead.$element && $typeahead.$element.off('mousedown', $typeahead.$onMouseDown);
          if(options.keyboard) {
            element.off('keydown', $typeahead.$onKeyDown);
          }
          _hide();
        };


        // Watches, parsers and fortmatters
        // Watch options on demand
        if(options.watchOptions) {
          // Watch ngOptions values before filtering for changes, drop function calls
          var watchedOptions = parsedOptions.$match[7].replace(/\|.+/, '').replace(/\(.*\)/g, '').trim();
          scope.$watch(watchedOptions, function (newValue, oldValue) {
            // console.warn('scope.$watch(%s)', watchedOptions, newValue, oldValue);
            if(newValue === oldValue) return;
            parsedOptions.valuesFn(scope, controller).then(function (values) {
              $typeahead.update(values);
              controller.$render();
            });
          }, true);
        }

        // parser manages typeahead matches and selectionMode
        controller.$parsers.push(function (inputValue) {
          if(inputValue === undefined) inputValue = '';
          if(_selectingValue !== null){
            _hasSelection = true;
            scope.$modelValue = _selectingValue;
            return _selectingValue;
          } else {
            if(inputValue.length >= options.minLength){
              _isParsing = true;
              parsedOptions.valuesFn(scope, controller)
                .then(function(values){
                  _isParsing = false;
                  if(!values.length){
                    if(options.selectMode && inputValue.length > 0) {
                      controller.$setViewValue(controller.$viewValue.substring(0, controller.$viewValue.length - 1));
                      controller.$render();
                      return;
                    }
                    scope.$resetMatches();
                  } else {
                    $typeahead.update(values);
                  }
                });
              }
            _hasSelection = false;
            scope.$modelValue = !options.selectMode ? inputValue : undefined;
            return scope.$modelValue;
          }
        });

        controller.$formatters.push(function(value){
          if(value != null)_hasSelection = true;

          scope.$modelValue = parsedOptions.displayValue(value);
          return scope.$modelValue;
        });


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
        angular.forEach(['ngOptions', 'placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'template', 'filter', 'limit', 'minLength', 'watchOptions', 'selectMode', 'comparator'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Build proper ngOptions
        var filter = options.filter || defaults.filter;
        var limit = options.limit || defaults.limit;
        var comparator = options.comparator || defaults.comparator;

        var ngOptions = attr.ngOptions;
        if(filter) options.ngOptions += ' | ' + filter + ':$viewValue';
        if(comparator) options.ngOptions += ':' + comparator;
        if(limit) options.ngOptions += ' | limitTo:' + limit;

        // Initialize typeahead
        var typeahead = $typeahead(element, controller, options);

        // Model rendering in view
        controller.$render = function () {
          if(controller.$viewValue){
            element.val(controller.$viewValue.toString().replace(/<(?:.|\n)*?>/gm, '').trim());
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

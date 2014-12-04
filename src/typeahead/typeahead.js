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
        var _selectingValue = null, _hasSelection = false, _firstShow = true, _isParsing = false, _lastViewValue;

        function _stringify(val){
          return val != null ? val : '';
        }

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

        scope.$isVisible = function() {
          return $typeahead.$isVisible();
        };

        // Public methods

        $typeahead.activate = function(index) {
          scope.$activeIndex = index;
        };

        // updates matches managing invalid inputs in selectMode
        $typeahead.updateMatches = function() {
          _isParsing = true;
          var copyOfViewValue = controller.$viewValue; // to prevent assigning _lastViewValue to a altered controller.$viewValue
          return parsedOptions.valuesFn(scope, controller).then(function(matches){
            if(!matches.length){
              if(options.selectMode && _stringify(controller.$viewValue).length > 0){
                  controller.$setViewValue(_lastViewValue);
                  controller.$render();
              } else {
                scope.$resetMatches();
              }
            } else {
              scope.$matches = matches;
              if(scope.$activeIndex >= matches.length) {
                scope.$activeIndex = 0;
              }
              _lastViewValue = copyOfViewValue;
            }
            _isParsing = false;
            return scope.$matches;
          });
        };


        $typeahead.setInput = function(inputValue){

            if(typeof inputValue === 'object'){
              // if argument is object then caller is the select callback and not the parser.
              // set _selectingValue and call $setViewValue. No need to return value here.
              _selectingValue = inputValue.value;
              if(angular.version.minor > 2 && controller.$viewValue === inputValue.label){
                controller.$validate();
              } else {
                controller.$setViewValue(inputValue.label);
              }

            } else {

              if(_selectingValue !== null){
                // viewValue set by selection.
                scope.$modelValue = _selectingValue;
                scope.$resetMatches();
                controller.$render();

                _selectingValue = null, _hasSelection = true, _lastViewValue = inputValue;

              } else {

                if(_stringify(inputValue).length >= options.minLength){
                  $typeahead.updateMatches();
                }
                scope.$modelValue = !options.selectMode ? inputValue : undefined;
                _hasSelection = false;
              }
              return scope.$modelValue;
            }
        };

        $typeahead.setModel = function(value){
          if(value != null) _hasSelection = true;
          scope.$modelValue = value;
          return parsedOptions.displayValue(value);
        };

        // Protected methods

        $typeahead.$isVisible = function() {
          if(!options.minLength || !controller) {
            return !!scope.$matches.length;
          }
          // minLength support
          // we need to stringify in angular < 1.3
          return scope.$matches.length && _stringify(controller.$viewValue).length >= options.minLength && !_hasSelection;
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
          if(_isParsing) return false;
          if(!/(38|40|13)/.test(evt.keyCode)) return;

          // Let ngSubmit pass if the typeahead tip is hidden
          if($typeahead.$isVisible()) {
            evt.preventDefault();
            evt.stopPropagation();

            // only process key press if suggestion list is visible

            // Select with enter
            if(evt.keyCode === 13 && scope.$matches.length) {
              $typeahead.setInput(scope.$matches[scope.$activeIndex]);
            }

            // Navigate with keyboard
            else if(evt.keyCode === 38 && scope.$activeIndex > 0) scope.$activeIndex--;
            else if(evt.keyCode === 40 && scope.$activeIndex < scope.$matches.length - 1) scope.$activeIndex++;
            else if(angular.isUndefined(scope.$activeIndex)) scope.$activeIndex = 0;
            scope.$digest();
          }
        };

        // Overrides

        var show = $typeahead.show;
        $typeahead.show = function() {
          // Initial call parsedOptions. Next calls are done in parser
          // TODO update test to be able to use this condition
          // if(_firstShow && _stringify(controller.$viewValue).length >= options.minLength && !_hasSelection){
          if(_firstShow){
            $typeahead.updateMatches();
            _firstShow = false;
          }

          show();
          // use timeout to hookup the events to prevent
          // event bubbling from being processed imediately.
          $timeout(function() {
            $typeahead.$element.on('mousedown', $typeahead.$onMouseDown);
            if(options.keyboard) {
              element.on('keydown', $typeahead.$onKeyDown);
            }
          }, 0, false);
        };

        var hide = $typeahead.hide;
        $typeahead.hide = function() {
          $typeahead.$element && $typeahead.$element.off('mousedown', $typeahead.$onMouseDown);
          if(options.keyboard) {
            element.off('keydown', $typeahead.$onKeyDown);
          }
          hide();
        };

        // Watch options on demand
        if(options.watchOptions) {
          // Watch ngOptions values before filtering for changes, drop function calls
          var watchedOptions = parsedOptions.$match[7].replace(/\|.+/, '').replace(/\(.*\)/g, '').trim();
          scope.$watch(watchedOptions, function (newValue, oldValue) {
            if(newValue === oldValue) return;
              $typeahead.updateMatches();
          }, true);
        }

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

        if(filter) options.ngOptions += ' | ' + filter + ':$viewValue';
        if(comparator) options.ngOptions += ':' + comparator;
        if(limit) options.ngOptions += ' | limitTo:' + limit;


        // Initialize typeahead
        var typeahead = $typeahead(element, controller, options);

        typeahead.$scope.$select = function(item, index, evt) {
          typeahead.setInput(item);
        };

        controller.$parsers.push(function (inputValue) {
            return typeahead.setInput(inputValue);
        });

        controller.$formatters.push(function(modelValue){
          return typeahead.setModel(modelValue);
        });


        // Model rendering in view
        controller.$render = function () {
          // console.warn('$render', element.attr('ng-model'), 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue, 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue);
          if(controller.$isEmpty(controller.$viewValue)) {
            element.val('');
          } else {
            element.val(controller.$viewValue.toString().replace(/<(?:.|\n)*?>/gm, '').trim());
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

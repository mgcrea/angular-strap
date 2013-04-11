/**
 * AngularStrap - Twitter Bootstrap directives for AngularJS
 * @version v0.7.2 - 2013-04-11
 * @link http://mgcrea.github.com/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

angular.module('$strap.config', []).value('$strap.config', {});
angular.module('$strap.filters', ['$strap.config']);
angular.module('$strap.directives', ['$strap.config']);
angular.module('$strap', ['$strap.filters', '$strap.directives', '$strap.config']);


angular.module('$strap.directives')

.directive('bsAlert', ['$parse', '$timeout', '$compile', function($parse, $timeout, $compile) {
  'use strict';

  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {

      var getter = $parse(attrs.bsAlert),
        setter = getter.assign,
        value = getter(scope);

      // For static alerts
      if(!attrs.bsAlert) {

        // Setup close button
        if(angular.isUndefined(attrs.closeButton) || (attrs.closeButton !== '0' && attrs.closeButton !== 'false')) {
          element.prepend('<button type="button" class="close" data-dismiss="alert">&times;</button>');
        }

      } else {

        scope.$watch(attrs.bsAlert, function(newValue, oldValue) {
          value = newValue;

          // Set alert content
          element.html((newValue.title ? '<strong>' + newValue.title + '</strong>&nbsp;' : '') + newValue.content || '');

          if(!!newValue.closed) {
            element.hide();
          }

          // Compile alert content
          //$timeout(function(){
          $compile(element.contents())(scope);
          //});

          // Add proper class
          if(newValue.type || oldValue.type) {
            oldValue.type && element.removeClass('alert-' + oldValue.type);
            newValue.type && element.addClass('alert-' + newValue.type);
          }

          // Setup close button
          if(angular.isUndefined(attrs.closeButton) || (attrs.closeButton !== '0' && attrs.closeButton !== 'false')) {
            element.prepend('<button type="button" class="close" data-dismiss="alert">&times;</button>');
          }

        }, true);

      }

      element.addClass('alert').alert();

      // Support fade-in effect
      if(element.hasClass('fade')) {
        element.removeClass('in');
        setTimeout(function() {
          element.addClass('in');
        });
      }

      var parentArray = attrs.ngRepeat && attrs.ngRepeat.split(' in ').pop();

      element.on('close', function(ev) {
        var removeElement;

        if(parentArray) { // ngRepeat, remove from parent array
          ev.preventDefault();

          element.removeClass('in');

          removeElement = function() {
            element.trigger('closed');
            if(scope.$parent) {
              scope.$parent.$apply(function() {
                var path = parentArray.split('.');
                var curr = scope.$parent;

                for (var i = 0; i < path.length; ++i) {
                  if (curr) {
                    curr = curr[path[i]];
                  }
                }

                if (curr) {
                  curr.splice(scope.$index, 1);
                }
              });
            }
          };

          $.support.transition && element.hasClass('fade') ?
            element.on($.support.transition.end, removeElement) :
            removeElement();

        } else if(value) { // object, set closed property to 'true'
          ev.preventDefault();

          element.removeClass('in');

          removeElement = function() {
            element.trigger('closed');
            scope.$apply(function() {
              value.closed = true;
            });
          };

          $.support.transition && element.hasClass('fade') ?
            element.on($.support.transition.end, removeElement) :
            removeElement();

        } else { // static, regular behavior
        }

      });

    }
  };
}]);


angular.module('$strap.directives')

.directive('bsButton', ['$parse', '$timeout', function($parse, $timeout) {
  'use strict';

  return {
    restrict: 'A',
    require: '?ngModel',
    link: function postLink(scope, element, attrs, controller) {

      // If we have a controller (i.e. ngModelController) then wire it up
      if(controller) {

        // Set as single toggler if not part of a btn-group
        if(!element.parent('[data-toggle="buttons-checkbox"], [data-toggle="buttons-radio"]').length) {
          element.attr('data-toggle', 'button');
        }

        // Handle start state
        var startValue = !!scope.$eval(attrs.ngModel);
        if(startValue) {
          element.addClass('active');
        }

        // Watch model for changes
        scope.$watch(attrs.ngModel, function(newValue, oldValue) {
          var bNew = !!newValue, bOld = !!oldValue;
          if(bNew !== bOld) {
            $.fn.button.Constructor.prototype.toggle.call(button);
          // Handle $q promises
          } else if(bNew && !startValue) {
            element.addClass('active');
          }
        });

      }

      // Support buttons without .btn class
      if(!element.hasClass('btn')) {
        element.on('click.button.data-api', function (e) {
          element.button('toggle');
        });
      }

      // Initialize button
      element.button();

      // Bootstrap override to handle toggling
      var button = element.data('button');
      button.toggle = function() {

        if(!controller) {
          return $.fn.button.Constructor.prototype.toggle.call(this);
        }

        var $parent = element.parent('[data-toggle="buttons-radio"]');

        if($parent.length) {
          element.siblings('[ng-model]').each(function(k, v) {
            $parse($(v).attr('ng-model')).assign(scope, false);
          });
          scope.$digest();
          if(!controller.$modelValue) {
            controller.$setViewValue(!controller.$modelValue);
            scope.$digest();
          }
        } else {
          scope.$apply(function () {
            controller.$setViewValue(!controller.$modelValue);
          });
        }

      };

      /*Provide scope display functions
      scope._button = function(event) {
        element.button(event);
      };
      scope.loading = function() {
        element.tooltip('loading');
      };
      scope.reset = function() {
        element.tooltip('reset');
      };

      if(attrs.loadingText) element.click(function () {
        //var btn = $(this)
        element.button('loading')
        setTimeout(function () {
        element.button('reset')
        }, 1000)
      });*/

    }
  };

}])

.directive('bsButtonsCheckbox', ['$parse', function($parse) {
  'use strict';
  return {
    restrict: 'A',
    require: '?ngModel',
    compile: function compile(tElement, tAttrs, transclude) {
      tElement.attr('data-toggle', 'buttons-checkbox').find('a, button').each(function(k, v) {
        $(v).attr('bs-button', '');
      });
    }
  };

}])

.directive('bsButtonsRadio', ['$timeout', function($timeout) {
  'use strict';
  return {
    restrict: 'A',
    require: '?ngModel',
    compile: function compile(tElement, tAttrs, transclude) {

      tElement.attr('data-toggle', 'buttons-radio');

      // Delegate to children ngModel
      if(!tAttrs.ngModel) {
        tElement.find('a, button').each(function(k, v) {
          $(v).attr('bs-button', '');
        });
      }

      return function postLink(scope, iElement, iAttrs, controller) {

        // If we have a controller (i.e. ngModelController) then wire it up
        if(controller) {

          $timeout(function() {
            iElement
              .find('[value]').button()
              .filter('[value="' + controller.$viewValue + '"]')
              .addClass('active');
          });

          iElement.on('click.button.data-api', function (ev) {
            scope.$apply(function () {
              controller.$setViewValue($(ev.target).closest('button').attr('value'));
            });
          });

          // Watch model for changes
          scope.$watch(iAttrs.ngModel, function(newValue, oldValue) {
            if(newValue !== oldValue) {
              var $btn = iElement.find('[value="' + scope.$eval(iAttrs.ngModel) + '"]');
              if($btn.length) {
                $btn.button('toggle');
                // $.fn.button.Constructor.prototype.toggle.call($btn.data('button'));
              }
            }
          });

        }

      };
    }
  };

}]);


angular.module('$strap.directives')

.directive('bsButtonSelect', ['$parse', '$timeout', function($parse, $timeout) {
  'use strict';

  return {
    restrict: 'A',
    require: '?ngModel',
    link: function postLink(scope, element, attrs, ctrl) {

      var getter = $parse(attrs.bsButtonSelect),
        setter = getter.assign;

      // Bind ngModelController
      if(ctrl) {
        element.text(scope.$eval(attrs.ngModel));
        // Watch model for changes
        scope.$watch(attrs.ngModel, function(newValue, oldValue) {
          element.text(newValue);
        });
      }

      // Click handling
      var values, value, index, newValue;
      element.bind('click', function(ev) {
        values = getter(scope);
        value = ctrl ? scope.$eval(attrs.ngModel) : element.text();
        index = values.indexOf(value);
        newValue = index > values.length - 2 ? values[0] : values[index + 1];
        console.warn(values, newValue);

        scope.$apply(function() {
          element.text(newValue);
          if(ctrl) {
            ctrl.$setViewValue(newValue);
          }
        });
      });
    }
  };

}]);

// https://github.com/eternicode/bootstrap-datepicker

angular.module('$strap.directives')

.directive('bsDatepicker', ['$timeout', '$strap.config', function($timeout, config) {
  'use strict';

  var isAppleTouch = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;

  var regexpMap = function regexpMap(language) {
    language = language || 'en';
    return {
      '/'    : '[\\/]',
      '-'    : '[-]',
      '.'    : '[.]',
      ' '    : '[\\s]',
      'dd'   : '(?:(?:[0-2]?[0-9]{1})|(?:[3][01]{1}))',
      'd'    : '(?:(?:[0-2]?[0-9]{1})|(?:[3][01]{1}))',
      'mm'   : '(?:[0]?[1-9]|[1][012])',
      'm'    : '(?:[0]?[1-9]|[1][012])',
      'DD'   : '(?:' + $.fn.datepicker.dates[language].days.join('|') + ')',
      'D'    : '(?:' + $.fn.datepicker.dates[language].daysShort.join('|') + ')',
      'MM'   : '(?:' + $.fn.datepicker.dates[language].months.join('|') + ')',
      'M'    : '(?:' + $.fn.datepicker.dates[language].monthsShort.join('|') + ')',
      'yyyy' : '(?:(?:[1]{1}[0-9]{1}[0-9]{1}[0-9]{1})|(?:[2]{1}[0-9]{3}))(?![[0-9]])',
      'yy'   : '(?:(?:[0-9]{1}[0-9]{1}))(?![[0-9]])'
    };
  };

  var regexpForDateFormat = function regexpForDateFormat(format, language) {
    var re = format, map = regexpMap(language), i;
    // Abstract replaces to avoid collisions
    i = 0; angular.forEach(map, function(v, k) {
      re = re.split(k).join('${' + i + '}'); i++;
    });
    // Replace abstracted values
    i = 0; angular.forEach(map, function(v, k) {
      re = re.split('${' + i + '}').join(v); i++;
    });
    return new RegExp('^' + re + '$', ['i']);
  };

  return {
    restrict: 'A',
    require: '?ngModel',
    link: function postLink(scope, element, attrs, controller) {

      var options = config.datepicker || {},
          language = attrs.language || options.language || 'en',
          type = attrs.dateType || options.type || 'date',
          format = attrs.dateFormat || options.format || ($.fn.datepicker.dates[language] && $.fn.datepicker.dates[language].format) || 'yyyy-mm-dd';

      var dateFormatRegexp = isAppleTouch ? regexpForDateFormat('yyyy-mm-dd', language) : regexpForDateFormat(format, language);

      // Handle date validity according to dateFormat
      if(controller) {

        // controller.$formatters.unshift(function(viewValue) {
        //   console.warn('$formatters', arguments);
        // });

        // ngModel validity
        controller.$parsers.unshift(function(viewValue) {
          if(!viewValue) {
            controller.$setValidity('date', true);
            return null;
          } else if(type === 'date' && angular.isDate(viewValue)) {
            controller.$setValidity('date', true);
            return viewValue;
          } else if(angular.isString(viewValue) && dateFormatRegexp.test(viewValue)) {
            controller.$setValidity('date', true);
            if(isAppleTouch) return new Date(viewValue);
            return type === 'string' ? viewValue : $.fn.datepicker.DPGlobal.parseDate(viewValue, $.fn.datepicker.DPGlobal.parseFormat(format), language);
          } else {
            controller.$setValidity('date', false);
            return undefined;
          }
        });

        // ngModel rendering
        controller.$render = function ngModelRender() {
          return controller.$modelValue && element.datepicker('setValue', controller.$modelValue);
        };

      }

      // Use native interface for touch devices
      if(isAppleTouch) {

        element.prop('type', 'date').css('-webkit-appearance', 'textfield');

      } else {

        // If we have a ngModelController then wire it up
        if(controller) {
          element.on('changeDate', function(ev) {
            scope.$apply(function () {
              controller.$setViewValue(type === 'string' ? element.val() : ev.date);
            });
          });
        }

        // Create datepicker
        element.attr('data-toggle', 'datepicker');
        element.datepicker({
          autoclose: true,
          format: format,
          language: language,
          forceParse: attrs.forceParse || false
        });

        // Garbage collection
        scope.$on('$destroy', function() {
          console.warn('$destroy');
          var datepicker = element.data('datepicker');
          if(datepicker) {
            datepicker.picker.remove();
            element.data('datepicker', null);
          }
        });

      }

      // Support add-on
      var component = element.siblings('[data-toggle="datepicker"]');
      if(component.length) {
        component.on('click', function() {
          element.trigger('focus');
        });
      }

    }

  };

}]);


angular.module('$strap.directives')

.directive('bsDropdown', ['$parse', '$compile', '$timeout', function($parse, $compile, $timeout) {
  'use strict';

  var buildTemplate = function(items, ul) {
    if(!ul) ul = ['<ul class="dropdown-menu" role="menu" aria-labelledby="drop1">', '</ul>'];
    angular.forEach(items, function(item, index) {
      if(item.divider) return ul.splice(index + 1, 0, '<li class="divider"></li>');
      var li = '<li' + (item.submenu && item.submenu.length ? ' class="dropdown-submenu"' : '') + '>' +
        '<a tabindex="-1" ng-href="' + (item.href || '') + '"' + (item.click ? '" ng-click="' + item.click + '"' : '') + (item.target ? '" target="' + item.target + '"' : '') + '>' +
        (item.text || '') + '</a>';
      if(item.submenu && item.submenu.length) li += buildTemplate(item.submenu).join("\n");
      li += '</li>';
      ul.splice(index + 1, 0, li);
    });
    return ul;
  };

  return {
    restrict: 'EA',
    scope: true,
    link: function postLink(scope, iElement, iAttrs) {

      var getter = $parse(iAttrs.bsDropdown),
          items = getter(scope);

      // Defer after any ngRepeat rendering
      $timeout(function() {

        if(!angular.isArray(items)) {
          // @todo?
        }

        var dropdown = angular.element(buildTemplate(items).join(''));
        dropdown.insertAfter(iElement);

        // Compile dropdown-menu
        $compile(iElement.next('ul.dropdown-menu'))(scope);

      });

      iElement
        .addClass('dropdown-toggle')
        .attr('data-toggle', "dropdown");

    }
  };

}]);

angular.module('$strap.directives')

.factory('$modal', ['$rootScope', '$compile', '$http', '$timeout', '$q', '$templateCache', function($rootScope, $compile, $http, $timeout, $q, $templateCache) {

  var ModalFactory = function ModalFactory(options) {

    function Modal(options) {
      if(!options) options = {};

      var scope = options.scope || $rootScope.$new(),
          templateUrl = options.template;

      //@todo support {title, content} object

      return $q.when($templateCache.get(templateUrl) || $http.get(templateUrl, {cache: true}).then(function(res) { return res.data; }))
      .then(function onSuccess(template) {

        // Build modal object
        var id = templateUrl.replace('.html', '').replace(/[\/|\.|:]/g, "-") + '-' + scope.$id;
        var $modal = $('<div class="modal hide" tabindex="-1"></div>').attr('id', id).addClass('fade').html(template);
        if(options.modalClass) $modal.addClass(options.modalClass);

        $('body').append($modal);

        // Compile modal content
        $timeout(function() {
          $compile($modal)(scope);
        });

        // Provide scope display functions
        scope.$modal = function(name) {
          $modal.modal(name);
        };
        scope.hide = function() {
          $modal.modal('hide');
        };
        scope.show = function() {
          $modal.modal('show');
        };
        scope.dismiss = scope.hide;

        // Emit modal events
        angular.forEach(['show', 'shown', 'hide', 'hidden'], function(name) {
          $modal.on(name, function(ev) {
            scope.$emit('modal-' + name, ev);
          });
        });

        // Support autofocus attribute
        $modal.on('shown', function(event) {
          $('input[autofocus]', $modal).first().trigger('focus');
        });

        if(options.show) {
          $modal.modal('show');
        }

        return $modal;

      });

    }

    return new Modal(options);

  };

  return ModalFactory;

}])

.directive('bsModal', ['$q', '$modal', function($q, $modal) {
  'use strict';

  return {
    restrict: 'A',
    scope: true,
    link: function postLink(scope, iElement, iAttrs, controller) {

      var options = {
        template: scope.$eval(iAttrs.bsModal),
        scope: scope,
        modalClass: iAttrs.modalClass || '',
        backdrop: iAttrs.backdrop*1 || true,
        keyboard: iAttrs.keyboard*1 || true,
        show: iAttrs.show*1 || false
      };

      $q.when($modal(options)).then(function onSuccess(modal) {
        iElement.attr('data-target', '#' + modal.attr('id')).attr('data-toggle', 'modal');
      });

    }
  };
}]);


angular.module('$strap.directives')

.directive('bsNavbar', ['$location', function($location) {
  'use strict';

  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs, controller) {
      // Watch for the $location
      scope.$watch(function() {
        return $location.path();
      }, function(newValue, oldValue) {

        $('li[data-match-route]', element).each(function(k, li) {
          var $li = angular.element(li),
            // data('match-rout') does not work with dynamic attributes
            pattern = $li.attr('data-match-route'),
            regexp = new RegExp('^' + pattern + '$', ["i"]);

          if(regexp.test(newValue)) {
            $li.addClass('active');
          } else {
            $li.removeClass('active');
          }

        });
      });
    }
  };
}]);


angular.module('$strap.directives')

.directive('bsPopover', ['$parse', '$compile', '$http', '$timeout', '$q', '$templateCache', function($parse, $compile, $http, $timeout, $q, $templateCache) {
  'use strict';

  // Hide popovers when pressing esc
  $("body").on("keyup", function(ev) {
    if(ev.keyCode === 27) {
      $(".popover.in").each(function() {
        $(this).popover('hide');
      });
    }
  });

  return {
    restrict: 'A',
    scope: true,
    link: function postLink(scope, element, attr, ctrl) {

      var getter = $parse(attr.bsPopover),
        setter = getter.assign,
        value = getter(scope),
        options = {};

      if(angular.isObject(value)) {
        options = value;
      }

      $q.when(options.content || $templateCache.get(value) || $http.get(value, {cache: true})).then(function onSuccess(template) {

        // Handle response from $http promise
        if(angular.isObject(template)) {
          template = template.data;
        }

        // Handle data-unique attribute
        if(!!attr.unique) {
          element.on('show', function(ev) { // requires bootstrap 2.3.0+
            // Hide any active popover except self
            $(".popover.in").each(function() {
              var $this = $(this),
                popover = $this.data('popover');
              if(popover && !popover.$element.is(element)) {
                $this.popover('hide');
              }
            });
          });
        }

        // Handle data-hide attribute to toggle visibility
        if(!!attr.hide) {
          scope.$watch(attr.hide, function(newValue, oldValue) {
            if(!!newValue) {
              popover.hide();
            } else if(newValue !== oldValue) {
              popover.show();
            }
          });
        }

        // Initialize popover
        element.popover(angular.extend({}, options, {
          content: template,
          html: true
        }));

        // Bootstrap override to provide tip() reference & compilation
        var popover = element.data('popover');
        popover.hasContent = function() {
          return this.getTitle() || template; // fix multiple $compile()
        };
        popover.getPosition = function() {
          var r = $.fn.popover.Constructor.prototype.getPosition.apply(this, arguments);

          // Compile content
          $compile(this.$tip)(scope);
          scope.$digest();

          // Bind popover to the tip()
          this.$tip.data('popover', this);

          return r;
        };

        // Provide scope display functions
        scope._popover = function(name) {
          element.popover(name);
        };
        scope.hide = function() {
          element.popover('hide');
        };
        scope.show = function() {
          element.popover('show');
        };
        scope.dismiss = scope.hide;

      });

    }
  };

}]);

angular.module('$strap.directives')

.directive('bsSelect', ['$timeout', function($timeout) {
  'use strict';

  var NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w\d]*)|(?:\(\s*([\$\w][\$\w\d]*)\s*,\s*([\$\w][\$\w\d]*)\s*\)))\s+in\s+(.*)$/;

  return {
    restrict: 'A',
    require: '?ngModel',
    link: function postLink(scope, element, attrs, controller) {

      var options = scope.$eval(attrs.bsSelect) || {};
      // console.warn('postLink', options, arguments);

      $timeout(function() {
        element.selectpicker(options);
        element.next().removeClass('ng-scope');
      });

      // If we have a controller (i.e. ngModelController) then wire it up
      if(controller) {

        // Watch for changes to the model value
        scope.$watch(attrs.ngModel, function(newValue, oldValue) {
          if (newValue !== oldValue) {
            element.selectpicker('refresh');
          }
        });

      }

    }

  };

}]);


angular.module('$strap.directives')

.directive('bsTabs', ['$parse', '$compile', '$timeout', function($parse, $compile, $timeout) {
  'use strict';

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
            $panes.find('.tab-pane:first').addClass('active' + (iAttrs.fade ? ' in' : ''));
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
              var $next = $tabs.find('li:eq(' + newValue*1 + ')');
              if(!$next.hasClass('active')) {
                $next.children('a').tab('show');
              }
            });
          });

        }

    };

  }

};

}]);


angular.module('$strap.directives')

.directive('bsTimepicker', ['$timeout', function($timeout) {
  'use strict';

  var TIME_REGEXP = '((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9])?(?:\\s?(?:am|AM|pm|PM))?)';

  return {
    restrict: 'A',
    require: '?ngModel',
    link: function postLink(scope, element, attrs, controller) {

      // If we have a controller (i.e. ngModelController) then wire it up
      if(controller) {
        element.on('changeTime.timepicker', function(ev) {
          $timeout(function() {
            controller.$setViewValue(element.val());
          });
        });
      }

      // Handle input time validity
      var timeRegExp = new RegExp('^' + TIME_REGEXP + '$', ['i']);
      controller.$parsers.unshift(function(viewValue) {
        // console.warn('viewValue', viewValue, timeRegExp,  timeRegExp.test(viewValue));
        if (!viewValue || timeRegExp.test(viewValue)) {
          controller.$setValidity('time', true);
          return viewValue;
        } else {
          controller.$setValidity('time', false);
          return;
        }
      });

      // Create datepicker
      element.attr('data-toggle', 'timepicker');
      element.parent().addClass('bootstrap-timepicker');
      element.timepicker();
      var timepicker = element.data('timepicker');

      // Support add-on
      var component = element.siblings('[data-toggle="timepicker"]');
      if(component.length) {
        component.on('click', $.proxy(timepicker.showWidget, timepicker));
      }

    }
  };

}]);


angular.module('$strap.directives')

.directive('bsTooltip', ['$parse', '$compile',  function($parse, $compile) {
  'use strict';

  return {
    restrict: 'A',
    scope: true,
    link: function postLink(scope, element, attrs, ctrl) {

      var getter = $parse(attrs.bsTooltip),
        setter = getter.assign,
        value = getter(scope);

      // Watch bsTooltip for changes
      scope.$watch(attrs.bsTooltip, function(newValue, oldValue) {
        if(newValue !== oldValue) {
          value = newValue;
        }
      });

      if(!!attrs.unique) {
        element.on('show', function(ev) {
          // Hide any active popover except self
          $(".tooltip.in").each(function() {
            var $this = $(this),
              tooltip = $this.data('tooltip');
            if(tooltip && !tooltip.$element.is(element)) {
              $this.tooltip('hide');
            }
          });
        });
      }

      // Initialize tooltip
      element.tooltip({
        title: function() { return angular.isFunction(value) ? value.apply(null, arguments) : value; },
        html: true
      });

      // Bootstrap override to provide events & tip() reference
      var tooltip = element.data('tooltip');
      tooltip.show = function() {
        var r = $.fn.tooltip.Constructor.prototype.show.apply(this, arguments);
        // Bind tooltip to the tip()
        this.tip().data('tooltip', this);
        return r;
      };

      //Provide scope display functions
      scope._tooltip = function(event) {
        element.tooltip(event);
      };
      scope.hide = function() {
        element.tooltip('hide');
      };
      scope.show = function() {
        element.tooltip('show');
      };
      scope.dismiss = scope.hide;

    }
  };

}]);

angular.module('$strap.directives')

.directive('bsTypeahead', ['$parse', function($parse) {
  'use strict';

  return {
    restrict: 'A',
    require: '?ngModel',
    link: function postLink(scope, element, attrs, controller) {

      var getter = $parse(attrs.bsTypeahead),
          setter = getter.assign,
          value = getter(scope);

      // Watch bsTypeahead for changes
      scope.$watch(attrs.bsTypeahead, function(newValue, oldValue) {
        if(newValue !== oldValue) {
          value = newValue;
        }
      });

      element.attr('data-provide', 'typeahead');
      element.typeahead({
        source: function(query) { return angular.isFunction(value) ? value.apply(null, arguments) : value; },
        minLength: attrs.minLength || 1,
        items: attrs.items,
        updater: function(value) {
          // If we have a controller (i.e. ngModelController) then wire it up
          if(controller) {
            scope.$apply(function () {
              controller.$setViewValue(value);
            });
          }
          scope.$emit('typeahead-updated', value);
          return value;
        }
      });

      // Bootstrap override
      var typeahead = element.data('typeahead');
      // Fixes #2043: allows minLength of zero to enable show all for typeahead
      typeahead.lookup = function (ev) {
        var items;
        this.query = this.$element.val() || '';
        if (this.query.length < this.options.minLength) {
          return this.shown ? this.hide() : this;
        }
        items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source;
        return items ? this.process(items) : this;
      };

      // Support 0-minLength
      if(attrs.minLength === "0") {
        setTimeout(function() { // Push to the event loop to make sure element.typeahead is defined (breaks tests otherwise)
          element.on('focus', function() {
            element.val().length === 0 && setTimeout(element.typeahead.bind(element, 'lookup'), 200);
          });
        });
      }

    }
  };

}]);

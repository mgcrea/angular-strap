/**
 * AngularStrap - Twitter Bootstrap directives for AngularJS
 * @version v0.7.8 - 2013-12-03
 * @link http://mgcrea.github.com/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function (window, document, undefined) {
  'use strict';
  angular.module('$strap.config', []).value('$strapConfig', {});
  angular.module('$strap.filters', ['$strap.config']);
  angular.module('$strap.directives', ['$strap.config']);
  angular.module('$strap', [
    '$strap.filters',
    '$strap.directives',
    '$strap.config'
  ]);
  angular.module('$strap.directives').directive('bsAlert', [
    '$parse',
    '$timeout',
    '$compile',
    function ($parse, $timeout, $compile) {
      return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
          var getter = $parse(attrs.bsAlert), setter = getter.assign, value = getter(scope);
          var closeAlert = function closeAlertFn(delay) {
            $timeout(function () {
              element.alert('close');
            }, delay * 1);
          };
          if (!attrs.bsAlert) {
            if (angular.isUndefined(attrs.closeButton) || attrs.closeButton !== '0' && attrs.closeButton !== 'false') {
              element.prepend('<button type="button" class="close" data-dismiss="alert">&times;</button>');
            }
            if (attrs.closeAfter)
              closeAlert(attrs.closeAfter);
          } else {
            scope.$watch(attrs.bsAlert, function (newValue, oldValue) {
              value = newValue;
              element.html((newValue.title ? '<strong>' + newValue.title + '</strong>&nbsp;' : '') + newValue.content || '');
              if (!!newValue.closed) {
                element.hide();
              }
              $compile(element.contents())(scope);
              if (newValue.type || oldValue.type) {
                oldValue.type && element.removeClass('alert-' + oldValue.type);
                newValue.type && element.addClass('alert-' + newValue.type);
              }
              if (angular.isDefined(newValue.closeAfter))
                closeAlert(newValue.closeAfter);
              else if (attrs.closeAfter)
                closeAlert(attrs.closeAfter);
              if (angular.isUndefined(attrs.closeButton) || attrs.closeButton !== '0' && attrs.closeButton !== 'false') {
                element.prepend('<button type="button" class="close" data-dismiss="alert">&times;</button>');
              }
            }, true);
          }
          element.addClass('alert').alert();
          if (element.hasClass('fade')) {
            element.removeClass('in');
            setTimeout(function () {
              element.addClass('in');
            });
          }
          var parentArray = attrs.ngRepeat && attrs.ngRepeat.split(' in ').pop();
          element.on('close', function (ev) {
            var removeElement;
            if (parentArray) {
              ev.preventDefault();
              element.removeClass('in');
              removeElement = function () {
                element.trigger('closed');
                if (scope.$parent) {
                  scope.$parent.$apply(function () {
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
              $.support.transition && element.hasClass('fade') ? element.on($.support.transition.end, removeElement) : removeElement();
            } else if (value) {
              ev.preventDefault();
              element.removeClass('in');
              removeElement = function () {
                element.trigger('closed');
                scope.$apply(function () {
                  value.closed = true;
                });
              };
              $.support.transition && element.hasClass('fade') ? element.on($.support.transition.end, removeElement) : removeElement();
            } else {
            }
          });
        }
      };
    }
  ]);
  angular.module('$strap.directives').directive('bsButton', [
    '$parse',
    '$timeout',
    '$strapConfig',
    function ($parse, $timeout, $strapConfig) {
      var type = 'button', dataPrefix = !!$.fn.emulateTransitionEnd ? 'bs.' : '', evSuffix = dataPrefix ? '.' + dataPrefix + type : '';
      var evName = 'click' + evSuffix + '.data-api';
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function postLink(scope, element, attrs, controller) {
          if (controller) {
            if (!element.parent('[data-toggle="buttons-checkbox"], [data-toggle="buttons-radio"]').length) {
              element.attr('data-toggle', 'button');
            }
            var startValue = !!scope.$eval(attrs.ngModel);
            if (startValue) {
              element.addClass('active');
            }
            scope.$watch(attrs.ngModel, function (newValue, oldValue) {
              var bNew = !!newValue, bOld = !!oldValue;
              if (bNew !== bOld) {
                $.fn.button.Constructor.prototype.toggle.call(button);
              } else if (bNew && !startValue) {
                element.addClass('active');
              }
            });
          }
          if (!element.hasClass('btn')) {
            element.on(evName, function (ev) {
              element.button('toggle');
            });
          }
          element.button();
          var button = element.data(dataPrefix + type);
          button.toggle = function () {
            if (!controller) {
              return $.fn.button.Constructor.prototype.toggle.call(this);
            }
            var $parent = element.parent('[data-toggle="buttons-radio"]');
            if ($parent.length) {
              element.siblings('[ng-model]').each(function (k, v) {
                $parse($(v).attr('ng-model')).assign(scope, false);
              });
              scope.$digest();
              if (!controller.$modelValue) {
                controller.$setViewValue(!controller.$modelValue);
                scope.$digest();
              }
            } else {
              scope.$apply(function () {
                controller.$setViewValue(!controller.$modelValue);
              });
            }
          };
        }
      };
    }
  ]).directive('bsButtonsCheckbox', [
    '$parse',
    function ($parse) {
      return {
        restrict: 'A',
        require: '?ngModel',
        compile: function compile(tElement, tAttrs, transclude) {
          tElement.attr('data-toggle', 'buttons-checkbox').find('a, button').each(function (k, v) {
            $(v).attr('bs-button', '');
          });
        }
      };
    }
  ]).directive('bsButtonsRadio', [
    '$timeout',
    function ($timeout) {
      var type = 'button', dataPrefix = !!$.fn.emulateTransitionEnd ? 'bs.' : '', evSuffix = dataPrefix ? '.' + dataPrefix + type : '';
      var evName = 'click' + evSuffix + '.data-api';
      return {
        restrict: 'A',
        require: '?ngModel',
        compile: function compile(tElement, tAttrs, transclude) {
          tElement.attr('data-toggle', 'buttons-radio');
          if (!tAttrs.ngModel) {
            tElement.find('a, button').each(function (k, v) {
              $(v).attr('bs-button', '');
            });
          }
          return function postLink(scope, iElement, iAttrs, controller) {
            if (controller) {
              $timeout(function () {
                iElement.find('[value]').button().filter('[value="' + controller.$viewValue + '"]').addClass('active');
              }, 0, false);
              iElement.on(evName, function (ev) {
                scope.$apply(function () {
                  controller.$setViewValue($(ev.target).closest('button').attr('value'));
                });
              });
              scope.$watch(iAttrs.ngModel, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                  var $btn = iElement.find('[value="' + scope.$eval(iAttrs.ngModel) + '"]');
                  if ($btn.length) {
                    $btn.button('toggle');
                  }
                }
              });
            }
          };
        }
      };
    }
  ]);
  angular.module('$strap.directives').directive('bsButtonSelect', [
    '$parse',
    '$timeout',
    function ($parse, $timeout) {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function postLink(scope, element, attrs, ctrl) {
          var getter = $parse(attrs.bsButtonSelect), setter = getter.assign;
          if (ctrl) {
            element.text(scope.$eval(attrs.ngModel));
            scope.$watch(attrs.ngModel, function (newValue, oldValue) {
              element.text(newValue);
            });
          }
          var values, value, index, newValue;
          element.bind('click', function (ev) {
            values = getter(scope);
            value = ctrl ? scope.$eval(attrs.ngModel) : element.text();
            index = values.indexOf(value);
            newValue = index > values.length - 2 ? values[0] : values[index + 1];
            scope.$apply(function () {
              element.text(newValue);
              if (ctrl) {
                ctrl.$setViewValue(newValue);
              }
            });
          });
        }
      };
    }
  ]);
  angular.module('$strap.directives').directive('bsDatepicker', [
    '$timeout',
    '$strapConfig',
    function ($timeout, $strapConfig) {
      var isAppleTouch = /(iP(a|o)d|iPhone)/g.test(navigator.userAgent);
      var regexpMap = function regexpMapFn(language) {
        if (!($.fn.datepicker.dates[language] && language)) {
          language = 'en';
        }
        return {
          '/': '[\\/]',
          '-': '[-]',
          '.': '[.]',
          ' ': '[\\s]',
          'dd': '(?:(?:[0-2]?[0-9]{1})|(?:[3][01]{1}))',
          'd': '(?:(?:[0-2]?[0-9]{1})|(?:[3][01]{1}))',
          'mm': '(?:[0]?[1-9]|[1][012])',
          'm': '(?:[0]?[1-9]|[1][012])',
          'DD': '(?:' + $.fn.datepicker.dates[language].days.join('|') + ')',
          'D': '(?:' + $.fn.datepicker.dates[language].daysShort.join('|') + ')',
          'MM': '(?:' + $.fn.datepicker.dates[language].months.join('|') + ')',
          'M': '(?:' + $.fn.datepicker.dates[language].monthsShort.join('|') + ')',
          'yyyy': '(?:(?:[1]{1}[0-9]{1}[0-9]{1}[0-9]{1})|(?:[2]{1}[0-9]{3}))(?![[0-9]])',
          'yy': '(?:(?:[0-9]{1}[0-9]{1}))(?![[0-9]])'
        };
      };
      var regexpForDateFormat = function regexpForDateFormatFn(format, language) {
        var re = format, map = regexpMap(language), i;
        i = 0;
        angular.forEach(map, function (v, k) {
          re = re.split(k).join('${' + i + '}');
          i++;
        });
        i = 0;
        angular.forEach(map, function (v, k) {
          re = re.split('${' + i + '}').join(v);
          i++;
        });
        return new RegExp('^' + re + '$', ['i']);
      };
      var ISODateRegexp = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function postLink(scope, element, attrs, controller) {
          var options = angular.extend({ autoclose: true }, $strapConfig.datepicker || {});
          var type = attrs.dateType || options.type || 'date';
          var getFormattedModelValue = function (modelValue, format, language) {
            if (modelValue && type === 'iso' && ISODateRegexp.test(modelValue)) {
              return $.fn.datepicker.DPGlobal.parseDate(new Date(modelValue), $.fn.datepicker.DPGlobal.parseFormat(format), language);
            } else if (modelValue && type === 'date' && angular.isString(modelValue)) {
              return $.fn.datepicker.DPGlobal.parseDate(modelValue, $.fn.datepicker.DPGlobal.parseFormat(format), language);
            } else {
              return modelValue;
            }
          };
          var init = function () {
            options = angular.extend({ autoclose: true }, $strapConfig.datepicker || {});
            type = attrs.dateType || options.type || 'date';
            angular.forEach([
              'format',
              'weekStart',
              'calendarWeeks',
              'startDate',
              'endDate',
              'daysOfWeekDisabled',
              'autoclose',
              'startView',
              'minViewMode',
              'todayBtn',
              'todayHighlight',
              'keyboardNavigation',
              'language',
              'forceParse'
            ], function (key) {
              if (angular.isDefined(attrs[key]))
                options[key] = attrs[key];
            });
            var language = options.language || 'en', readFormat = attrs.dateFormat || options.format || $.fn.datepicker.dates[language] && $.fn.datepicker.dates[language].format || 'mm/dd/yyyy', format = isAppleTouch && !options.disableNative ? 'yyyy-mm-dd' : readFormat, dateFormatRegexp = regexpForDateFormat(format, language);
            if (controller) {
              controller.$formatters.unshift(function (modelValue) {
                return getFormattedModelValue(modelValue, readFormat, language);
              });
              controller.$parsers.unshift(function (viewValue) {
                if (!viewValue) {
                  controller.$setValidity('date', true);
                  return null;
                } else if ((type === 'date' || type === 'iso') && angular.isDate(viewValue)) {
                  controller.$setValidity('date', true);
                  return viewValue;
                } else if (angular.isString(viewValue) && dateFormatRegexp.test(viewValue)) {
                  controller.$setValidity('date', true);
                  if (isAppleTouch && !options.disableNative)
                    return new Date(viewValue);
                  return type === 'string' ? viewValue : $.fn.datepicker.DPGlobal.parseDate(viewValue, $.fn.datepicker.DPGlobal.parseFormat(format), language);
                } else {
                  controller.$setValidity('date', false);
                  return undefined;
                }
              });
              controller.$render = function ngModelRender() {
                if (isAppleTouch && !options.disableNative) {
                  var date = controller.$viewValue ? $.fn.datepicker.DPGlobal.formatDate(controller.$viewValue, $.fn.datepicker.DPGlobal.parseFormat(format), language) : '';
                  element.val(date);
                  return date;
                }
                if (!controller.$viewValue)
                  element.val('');
                return element.datepicker('update', controller.$viewValue);
              };
            }
            if (isAppleTouch && !options.disableNative) {
              element.prop('type', 'date').css('-webkit-appearance', 'textfield');
            } else {
              if (controller) {
                element.on('changeDate', function (ev) {
                  scope.$apply(function () {
                    controller.$setViewValue(type === 'string' ? element.val() : ev.date);
                  });
                });
              }
              element.datepicker(angular.extend(options, {
                format: format,
                language: language
              }));
              scope.$on('$destroy', function () {
                var datepicker = element.data('datepicker');
                if (datepicker) {
                  datepicker.picker.remove();
                  element.data('datepicker', null);
                }
              });
              attrs.$observe('startDate', function (value) {
                element.datepicker('setStartDate', value);
              });
              attrs.$observe('endDate', function (value) {
                element.datepicker('setEndDate', value);
              });
            }
            var component = element.siblings('[data-toggle="datepicker"]');
            if (component.length) {
              component.on('click', function () {
                if (!element.prop('disabled')) {
                  element.trigger('focus');
                }
              });
            }
          };
          init();
          scope.$watch(function () {
            return attrs.language;
          }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
              var oldLanguage = $.fn.datepicker.dates[oldValue] ? oldValue : 'en';
              var oldFormat = attrs.dateFormat || options.format || $.fn.datepicker.dates[oldLanguage] && $.fn.datepicker.dates[oldLanguage].format || 'mm/dd/yyyy';
              var oldDate = $.fn.datepicker.DPGlobal.parseDate(element.val(), $.fn.datepicker.DPGlobal.parseFormat(oldFormat), oldLanguage);
              var newLanguage = $.fn.datepicker.dates[newValue] ? newValue : 'en';
              var newFormat = $.fn.datepicker.dates[newLanguage] && $.fn.datepicker.dates[newLanguage].format || 'mm/dd/yyyy';
              var newDateString = $.fn.datepicker.DPGlobal.formatDate(oldDate, $.fn.datepicker.DPGlobal.parseFormat(newFormat), newLanguage);
              element.datepicker('remove');
              element.val('');
              init();
              var mValue = getFormattedModelValue(newDateString, newFormat, newLanguage);
              controller.$modelValue = mValue;
              controller.$viewValue = newDateString;
            }
          });
        }
      };
    }
  ]);
  angular.module('$strap.directives').directive('bsDropdown', [
    '$parse',
    '$compile',
    '$timeout',
    function ($parse, $compile, $timeout) {
      var buildTemplate = function (items, ul) {
        if (!ul)
          ul = [
            '<ul class="dropdown-menu" role="menu" aria-labelledby="drop1">',
            '</ul>'
          ];
        angular.forEach(items, function (item, index) {
          if (item.divider)
            return ul.splice(index + 1, 0, '<li class="divider"></li>');
          var li = '<li' + (item.submenu && item.submenu.length ? ' class="dropdown-submenu"' : '') + '>' + '<a tabindex="-1" ng-href="' + (item.href || '') + '"' + (item.click ? '" ng-click="' + item.click + '"' : '') + (item.target ? '" target="' + item.target + '"' : '') + (item.method ? '" data-method="' + item.method + '"' : '') + '>' + (item.icon && '<i class="' + item.icon + '"></i>&nbsp;' || '') + (item.text || '') + '</a>';
          if (item.submenu && item.submenu.length)
            li += buildTemplate(item.submenu).join('\n');
          li += '</li>';
          ul.splice(index + 1, 0, li);
        });
        return ul;
      };
      return {
        restrict: 'EA',
        scope: true,
        link: function postLink(scope, iElement, iAttrs) {
          var getter = $parse(iAttrs.bsDropdown), items = getter(scope);
          $timeout(function () {
            if (!angular.isArray(items)) {
            }
            var dropdown = angular.element(buildTemplate(items).join(''));
            dropdown.insertAfter(iElement);
            $compile(iElement.next('ul.dropdown-menu'))(scope);
          });
          iElement.addClass('dropdown-toggle').attr('data-toggle', 'dropdown');
        }
      };
    }
  ]);
  angular.module('$strap.directives').factory('$modal', [
    '$rootScope',
    '$compile',
    '$http',
    '$timeout',
    '$q',
    '$templateCache',
    '$strapConfig',
    function ($rootScope, $compile, $http, $timeout, $q, $templateCache, $strapConfig) {
      var type = 'modal', dataPrefix = !!$.fn.emulateTransitionEnd ? 'bs.' : '', evSuffix = dataPrefix ? '.' + dataPrefix + type : '';
      var ModalFactory = function ModalFactoryFn(config) {
        function Modal(config) {
          var options = angular.extend({ show: true }, $strapConfig.modal, config), scope = options.scope ? options.scope : $rootScope.$new(), templateUrl = options.template;
          return $q.when($templateCache.get(templateUrl) || $http.get(templateUrl, { cache: true }).then(function (res) {
            return res.data;
          })).then(function onSuccess(template) {
            var id = templateUrl.replace('.html', '').replace(/[\/|\.|:]/g, '-') + '-' + scope.$id;
            var $modal = $('<div class="modal" tabindex="-1"></div>').attr('id', id).addClass('fade').html(template);
            if (!$.fn.emulateTransitionEnd)
              $modal.addClass('hide');
            if (options.modalClass)
              $modal.addClass(options.modalClass);
            $('body').append($modal);
            $timeout(function () {
              $compile($modal)(scope);
            });
            scope.$modal = function (name) {
              $modal.modal(name);
            };
            angular.forEach([
              'show',
              'hide'
            ], function (name) {
              scope[name] = function () {
                $modal.modal(name);
              };
            });
            scope.dismiss = scope.hide;
            angular.forEach([
              'show',
              'shown',
              'hide',
              'hidden'
            ], function (name) {
              $modal.on(name + evSuffix, function (ev) {
                scope.$emit('modal-' + name, ev);
              });
            });
            $modal.on('shown' + evSuffix, function (ev) {
              $('input[autofocus], textarea[autofocus]', $modal).first().trigger('focus');
            });
            $modal.on('hidden' + evSuffix, function (ev) {
              if (!options.persist)
                scope.$destroy();
            });
            scope.$on('$destroy', function () {
              $modal.remove();
            });
            $modal.modal(options);
            return $modal;
          });
        }
        return new Modal(config);
      };
      return ModalFactory;
    }
  ]).directive('bsModal', [
    '$q',
    '$modal',
    function ($q, $modal) {
      return {
        restrict: 'A',
        scope: true,
        link: function postLink(scope, iElement, iAttrs, controller) {
          var options = {
              template: scope.$eval(iAttrs.bsModal),
              persist: true,
              show: false,
              scope: scope
            };
          angular.forEach([
            'modalClass',
            'backdrop',
            'keyboard'
          ], function (key) {
            if (angular.isDefined(iAttrs[key]))
              options[key] = iAttrs[key];
          });
          $q.when($modal(options)).then(function onSuccess(modal) {
            iElement.attr('data-target', '#' + modal.attr('id')).attr('data-toggle', 'modal');
          });
        }
      };
    }
  ]);
  angular.module('$strap.directives').directive('bsNavbar', [
    '$location',
    function ($location) {
      return {
        restrict: 'A',
        link: function postLink(scope, element, attrs, controller) {
          scope.$watch(function () {
            return $location.path();
          }, function (newValue, oldValue) {
            $('li[data-match-route]', element).each(function (k, li) {
              var $li = angular.element(li), pattern = $li.attr('data-match-route'), regexp = new RegExp('^' + pattern + '$', ['i']);
              if (regexp.test(newValue)) {
                $li.addClass('active');
                var $collapse = $li.find('.collapse.in');
                if ($collapse.length)
                  $collapse.collapse('hide');
              } else {
                $li.removeClass('active');
              }
            });
          });
        }
      };
    }
  ]);
  angular.module('$strap.directives').directive('bsPopover', [
    '$parse',
    '$compile',
    '$http',
    '$timeout',
    '$q',
    '$templateCache',
    function ($parse, $compile, $http, $timeout, $q, $templateCache) {
      var type = 'popover', dataPrefix = !!$.fn.emulateTransitionEnd ? 'bs.' : '', evSuffix = dataPrefix ? '.' + dataPrefix + type : '';
      $('body').on('keyup', function (ev) {
        if (ev.keyCode === 27) {
          $('.popover.in').popover('hide');
        }
      });
      return {
        restrict: 'A',
        scope: true,
        link: function postLink(scope, element, attr, ctrl) {
          var getter = $parse(attr.bsPopover), setter = getter.assign, value = getter(scope), options = {};
          if (angular.isObject(value)) {
            options = value;
          }
          $q.when(options.content || $templateCache.get(value) || $http.get(value, { cache: true })).then(function onSuccess(template) {
            if (angular.isObject(template)) {
              template = template.data;
            }
            angular.forEach([
              'placement',
              'trigger'
            ], function (name) {
              if (!!attr[name]) {
                options[name] = attr[name];
              }
            });
            if (!!attr.unique) {
              element.on('show' + evSuffix, function (ev) {
                $('.popover.in').not(element).popover('hide');
              });
            }
            if (!!attr.hide) {
              scope.$watch(attr.hide, function (newValue, oldValue) {
                if (!!newValue) {
                  popover.hide();
                } else if (newValue !== oldValue) {
                  $timeout(function () {
                    popover.show();
                  });
                }
              });
            }
            if (!!attr.show) {
              scope.$watch(attr.show, function (newValue, oldValue) {
                if (!!newValue) {
                  $timeout(function () {
                    popover.show();
                  });
                } else if (newValue !== oldValue) {
                  popover.hide();
                }
              });
            }
            element.popover(angular.extend({}, options, {
              content: template,
              html: true
            }));
            var popover = element.data(dataPrefix + type);
            popover.hasContent = function () {
              return this.getTitle() || template;
            };
            popover.getPosition = function () {
              var r = $.fn.popover.Constructor.prototype.getPosition.apply(this, arguments);
              $compile(this.$tip)(scope);
              scope.$digest();
              this.$tip.data(dataPrefix + type, this);
              return r;
            };
            scope.$popover = function (name) {
              popover(name);
            };
            angular.forEach([
              'show',
              'hide'
            ], function (name) {
              scope[name] = function () {
                popover[name]();
              };
            });
            scope.dismiss = scope.hide;
            angular.forEach([
              'show',
              'shown',
              'hide',
              'hidden'
            ], function (name) {
              element.on(name + evSuffix, function (ev) {
                scope.$emit('popover-' + name, ev);
              });
            });
          });
        }
      };
    }
  ]);
  angular.module('$strap.directives').directive('bsSelect', [
    '$timeout',
    '$parse',
    function ($timeout, $parse) {
      var NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w\d]*)|(?:\(\s*([\$\w][\$\w\d]*)\s*,\s*([\$\w][\$\w\d]*)\s*\)))\s+in\s+(.*)$/;
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function postLink(scope, element, attrs, controller) {
          var options = scope.$eval(attrs.bsSelect) || {}, selectpicker;
          $timeout(function () {
            element.selectpicker(options);
            element.unbind('DOMNodeInserted DOMNodeRemoved');
            selectpicker = element.next('.bootstrap-select');
            selectpicker.removeClass('ng-scope');
          });
          if (controller) {
            var refresh = function (newValue, oldValue) {
              if (!angular.equals(newValue, oldValue)) {
                element.selectpicker('refresh');
              }
            };
            var checkValidity = function (value) {
              if (selectpicker) {
                selectpicker.toggleClass('ng-invalid', !controller.$valid).toggleClass('ng-valid', controller.$valid).toggleClass('ng-invalid-required', !controller.$valid).toggleClass('ng-valid-required', controller.$valid).toggleClass('ng-dirty', controller.$dirty).toggleClass('ng-pristine', controller.$pristine);
              }
              return value;
            };
            controller.$parsers.push(checkValidity);
            controller.$formatters.push(checkValidity);
            attrs.$observe('required', function () {
              checkValidity(controller.$viewValue);
            });
            scope.$watch(attrs.ngModel, refresh);
            if (attrs.ngOptions) {
              var match = attrs.ngOptions.match(NG_OPTIONS_REGEXP), valuesFn = $parse(match[7]);
              if (match && match[7]) {
                scope.$watch(function () {
                  return valuesFn(scope);
                }, refresh, true);
              }
            }
          }
        }
      };
    }
  ]);
  angular.module('$strap.directives').directive('bsTabs', [
    '$parse',
    '$compile',
    '$timeout',
    function ($parse, $compile, $timeout) {
      var template = '<div class="tabs">' + '<ul class="nav nav-tabs">' + '<li ng-repeat="pane in panes" ng-class="{active:pane.active}">' + '<a data-target="#{{pane.id}}" data-index="{{$index}}" data-toggle="tab">{{pane.title}}</a>' + '</li>' + '</ul>' + '<div class="tab-content" ng-transclude>' + '</div>';
      return {
        restrict: 'A',
        require: '?ngModel',
        priority: 0,
        scope: true,
        template: template,
        replace: true,
        transclude: true,
        compile: function compile(tElement, tAttrs, transclude) {
          return function postLink(scope, iElement, iAttrs, controller) {
            var getter = $parse(iAttrs.bsTabs), setter = getter.assign, value = getter(scope);
            scope.panes = [];
            var $tabs = iElement.find('ul.nav-tabs');
            var $panes = iElement.find('div.tab-content');
            var activeTab = 0, id, title, active;
            $timeout(function () {
              $panes.find('[data-title], [data-tab]').each(function (index) {
                var $this = angular.element(this);
                id = 'tab-' + scope.$id + '-' + index;
                title = $this.data('title') || $this.data('tab');
                active = !active && $this.hasClass('active');
                $this.attr('id', id).addClass('tab-pane');
                if (iAttrs.fade)
                  $this.addClass('fade');
                scope.panes.push({
                  id: id,
                  title: title,
                  content: this.innerHTML,
                  active: active
                });
              });
              if (scope.panes.length && !active) {
                $panes.find('.tab-pane:first-child').addClass('active' + (iAttrs.fade ? ' in' : ''));
                scope.panes[0].active = true;
              }
            });
            if (controller) {
              iElement.on('show', function (ev) {
                var $target = $(ev.target);
                scope.$apply(function () {
                  controller.$setViewValue($target.data('index'));
                });
              });
              scope.$watch(iAttrs.ngModel, function (newValue, oldValue) {
                if (angular.isUndefined(newValue))
                  return;
                activeTab = newValue;
                setTimeout(function () {
                  var $next = $($tabs[0].querySelectorAll('li')[newValue * 1]);
                  if (!$next.hasClass('active')) {
                    $next.children('a').tab('show');
                  }
                });
              });
            }
          };
        }
      };
    }
  ]);
  angular.module('$strap.directives').directive('bsTimepicker', [
    '$timeout',
    '$strapConfig',
    function ($timeout, $strapConfig) {
      var TIME_REGEXP = '((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9])?(?:\\s?(?:am|AM|pm|PM))?)';
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function postLink(scope, element, attrs, controller) {
          var pad = function (number) {
            var r = String(number);
            if (r.length === 1) {
              r = '0' + r;
            }
            return r;
          };
          var options = angular.extend({ openOnFocus: false }, $strapConfig.timepicker);
          var defaultTime = attrs.defaultTime || options.defaultTime || false;
          options.defaultTime = false;
          var type = attrs.timeType || options.timeType || 'string';
          angular.forEach([
            'template',
            'minuteStep',
            'showSeconds',
            'secondStep',
            'showMeridian',
            'showInputs',
            'disableFocus',
            'modalBackdrop',
            'openOnFocus'
          ], function (key) {
            if (angular.isDefined(attrs[key])) {
              if (attrs[key] === 'true' || attrs[key] === 'false') {
                options[key] = attrs[key] === 'true';
              } else if (/^\-?([0-9]+|Infinity)$/.test(attrs[key])) {
                options[key] = parseInt(attrs[key], 10);
              } else {
                options[key] = attrs[key];
              }
            }
          });
          if (controller) {
            element.on('changeTime.timepicker', function (ev) {
              $timeout(function () {
                if (type === 'string') {
                  controller.$setViewValue(element.val());
                } else if (type === 'date') {
                  var date = new Date();
                  date.setHours(ev.time.hours);
                  date.setMinutes(ev.time.minutes);
                  controller.$setViewValue(date);
                }
              });
            });
            var timeRegExp = new RegExp('^' + TIME_REGEXP + '$', ['i']);
            controller.$formatters.unshift(function (modelValue) {
              if (modelValue) {
                if (type === 'date') {
                  controller.$setViewValue(new Date(modelValue));
                  element.val(new Date(modelValue));
                  return new Date(modelValue);
                }
                controller.$setViewValue(modelValue);
                element.val(modelValue);
                return modelValue;
              } else if (defaultTime) {
                if (defaultTime === 'current') {
                  if (type === 'date') {
                    controller.$setViewValue(new Date());
                    element.val(new Date());
                    return new Date();
                  } else {
                    var currentDate = new Date();
                    var currentTime = pad(currentDate.getHours()) + ':' + pad(currentDate.getMinutes());
                    controller.$setViewValue(currentDate);
                    element.val(currentDate);
                    return currentDate;
                  }
                } else {
                  controller.$setViewValue(defaultTime);
                  element.val(defaultTime);
                  return defaultTime;
                }
              }
              controller.$setViewValue(element.val());
              return element.val();
            });
            controller.$render = function ngModelRender() {
              if (controller.$viewValue) {
                if (type === 'date') {
                  var renderedDate;
                  if (timeRegExp.test(controller.$viewValue)) {
                    renderedDate = new Date();
                    var dateParts = controller.$viewValue.split(':');
                    var hours = !isNaN(parseInt(dateParts[0], 10)) ? parseInt(dateParts[0], 10) : '0';
                    var minutes = !isNaN(parseInt(dateParts[1], 10)) ? parseInt(dateParts[1], 10) : '0';
                    renderedDate.setHours(hours);
                    renderedDate.setMinutes(minutes);
                    element.val(controller.$viewValue);
                    controller.$setViewValue(renderedDate);
                    return renderedDate;
                  } else {
                    renderedDate = new Date(controller.$viewValue);
                    var modelRender = renderedDate !== 'Invalid Date' ? pad(renderedDate.getHours()) + ':' + pad(renderedDate.getMinutes()) : '';
                    element.val(modelRender);
                    controller.$setViewValue(renderedDate);
                    return renderedDate;
                  }
                }
                element.val(controller.$viewValue);
                controller.$setViewValue(controller.$viewValue);
                return controller.$viewValue;
              }
              element.val('');
              return '';
            };
            controller.$parsers.unshift(function (viewValue) {
              if (!viewValue || type === 'string' && timeRegExp.test(viewValue)) {
                controller.$setValidity('time', true);
                return viewValue;
              } else if (type === 'date' && typeof viewValue === 'object' && viewValue.toString() !== 'Invalid Date') {
                controller.$setValidity('time', true);
                return viewValue;
              } else {
                controller.$setValidity('time', false);
                return;
              }
            });
          }
          element.attr('data-toggle', 'timepicker');
          element.parent().addClass('bootstrap-timepicker');
          element.timepicker(options || {});
          var timepicker = element.data('timepicker');
          var component = element.siblings('[data-toggle="timepicker"]');
          if (component.length) {
            component.on('click', $.proxy(timepicker.showWidget, timepicker));
          }
          if (options.openOnFocus) {
            element.on('focus', $.proxy(timepicker.showWidget, timepicker));
          }
        }
      };
    }
  ]);
  angular.module('$strap.directives').directive('bsTooltip', [
    '$parse',
    '$compile',
    function ($parse, $compile) {
      var type = 'tooltip', dataPrefix = !!$.fn.emulateTransitionEnd ? 'bs.' : '', evSuffix = dataPrefix ? '.' + dataPrefix + type : '';
      return {
        restrict: 'A',
        scope: true,
        link: function postLink(scope, element, attrs, ctrl) {
          var getter = $parse(attrs.bsTooltip), setter = getter.assign, value = getter(scope);
          scope.$watch(attrs.bsTooltip, function (newValue, oldValue) {
            value = newValue;
          });
          if (!!attrs.unique) {
            element.on('show', function (ev) {
              $('.tooltip.in').each(function () {
                var $this = $(this), tooltip = $this.data(dataPrefix + type);
                if (tooltip && !tooltip.$element.is(element)) {
                  $this.tooltip('hide');
                }
              });
            });
          }
          element.tooltip({
            title: function () {
              return angular.isFunction(value) ? value.apply(null, arguments) : value;
            },
            html: true
          });
          var tooltip = element.data(dataPrefix + type);
          tooltip.show = function () {
            var r = $.fn.tooltip.Constructor.prototype.show.apply(this, arguments);
            this.tip().data(dataPrefix + type, this);
            return r;
          };
          scope._tooltip = function (event) {
            element.tooltip(event);
          };
          scope.hide = function () {
            element.tooltip('hide');
          };
          scope.show = function () {
            element.tooltip('show');
          };
          scope.dismiss = scope.hide;
        }
      };
    }
  ]);
  angular.module('$strap.directives').directive('bsTypeahead', [
    '$parse',
    function ($parse) {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function postLink(scope, element, attrs, controller) {
          var getter = $parse(attrs.bsTypeahead), setter = getter.assign, value = getter(scope);
          scope.$watch(attrs.bsTypeahead, function (newValue, oldValue) {
            if (newValue !== oldValue) {
              value = newValue;
            }
          });
          element.attr('data-provide', 'typeahead');
          element.typeahead({
            source: function (query) {
              return angular.isFunction(value) ? value.apply(null, arguments) : value;
            },
            minLength: attrs.minLength || 1,
            items: attrs.items,
            updater: function (value) {
              if (controller) {
                scope.$apply(function () {
                  controller.$setViewValue(value);
                });
              }
              scope.$emit('typeahead-updated', value, attrs.id);
              return value;
            }
          });
          var typeahead = element.data('typeahead');
          typeahead.lookup = function (ev) {
            var items;
            this.query = this.$element.val() || '';
            if (this.query.length < this.options.minLength) {
              return this.shown ? this.hide() : this;
            }
            items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source;
            return items ? this.process(items) : this;
          };
          if (!!attrs.matchAll) {
            typeahead.matcher = function (item) {
              return true;
            };
          }
          if (attrs.minLength === '0') {
            setTimeout(function () {
              element.on('focus', function () {
                element.val().length === 0 && setTimeout(element.typeahead.bind(element, 'lookup'), 200);
              });
            });
          }
        }
      };
    }
  ]);
}(window, document));
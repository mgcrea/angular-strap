/**
 * angular-strap
 * @version v2.3.12 - 2020-02-17
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

angular.module('mgcrea.ngStrap.modal', [ 'mgcrea.ngStrap.core', 'mgcrea.ngStrap.helpers.dimensions' ]).provider('$modal', function() {
  var defaults = this.defaults = {
    animation: 'am-fade',
    backdropAnimation: 'am-fade',
    customClass: '',
    prefixClass: 'modal',
    prefixEvent: 'modal',
    placement: 'top',
    templateUrl: 'modal/modal.tpl.html',
    template: '',
    contentTemplate: false,
    container: false,
    element: null,
    backdrop: true,
    keyboard: true,
    html: false,
    show: true,
    size: null,
    zIndex: null,
    containerElement: null
  };
  this.$get = [ '$window', '$rootScope', '$bsCompiler', '$animate', '$timeout', '$sce', 'dimensions', function($window, $rootScope, $bsCompiler, $animate, $timeout, $sce, dimensions) {
    var forEach = angular.forEach;
    var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;
    var bodyElement = angular.element($window.document.body);
    var layoutHideElement = angular.element('#layoutContainer');
    var backdropCount = 0;
    var dialogBaseZindex = 1050;
    var backdropBaseZindex = 1040;
    var validSizes = {
      lg: 'modal-lg',
      sm: 'modal-sm'
    };
    function ModalFactory(config) {
      var $modal = {};
      var options = $modal.$options = angular.extend({}, defaults, config);
      var promise = $modal.$promise = $bsCompiler.compile(options);
      var scope = $modal.$scope = options.scope && options.scope.$new() || $rootScope.$new();
      if (options.containerElement) {
        layoutHideElement = angular.element(options.containerElement);
      }
      if (!options.element && !options.container) {
        options.container = 'body';
      }
      if (options.zIndex) {
        dialogBaseZindex = parseInt(options.zIndex, 10);
        backdropBaseZindex = dialogBaseZindex - 10;
      }
      $modal.$id = options.id || options.element && options.element.attr('id') || '';
      $modal.returnFocus = function() {};
      forEach([ 'title', 'content' ], function(key) {
        if (options[key]) scope[key] = $sce.trustAsHtml(options[key]);
      });
      scope.$hide = function() {
        scope.$$postDigest(function() {
          $modal.hide();
        });
      };
      scope.$show = function() {
        scope.$$postDigest(function() {
          $modal.show();
        });
      };
      scope.$toggle = function() {
        scope.$$postDigest(function() {
          $modal.toggle();
        });
      };
      $modal.$isShown = scope.$isShown = false;
      var compileData;
      var modalElement;
      var modalScope;
      var backdropElement = angular.element('<div class="' + options.prefixClass + '-backdrop"/>');
      backdropElement.css({
        position: 'fixed',
        top: '0px',
        left: '0px',
        bottom: '0px',
        right: '0px'
      });
      promise.then(function(data) {
        compileData = data;
        $modal.init();
      });
      $modal.init = function() {
        if (options.show) {
          scope.$$postDigest(function() {
            $modal.show();
          });
        }
      };
      $modal.destroy = function() {
        destroyModalElement();
        if (backdropElement) {
          backdropElement.remove();
          backdropElement = null;
        }
        scope.$destroy();
      };
      $modal.show = function() {
        if ($modal.$isShown) return;
        var parent;
        var after;
        if (angular.isElement(options.container)) {
          parent = options.container;
          after = options.container[0].lastChild ? angular.element(options.container[0].lastChild) : null;
        } else {
          if (options.container) {
            parent = findElement(options.container);
            after = parent[0] && parent[0].lastChild ? angular.element(parent[0].lastChild) : null;
          } else {
            parent = null;
            after = options.element;
          }
        }
        if (modalElement) destroyModalElement();
        modalScope = $modal.$scope.$new();
        modalElement = $modal.$element = compileData.link(modalScope, function(clonedElement, scope) {});
        if (options.backdrop) {
          modalElement.css({
            'z-index': dialogBaseZindex + backdropCount * 20
          });
          backdropElement.css({
            'z-index': backdropBaseZindex + backdropCount * 20
          });
          backdropCount++;
        }
        if (scope.$emit(options.prefixEvent + '.show.before', $modal).defaultPrevented) {
          return;
        }
        if (angular.isDefined(options.onBeforeShow) && angular.isFunction(options.onBeforeShow)) {
          options.onBeforeShow($modal);
        }
        modalElement.css({
          display: 'block'
        }).addClass(options.placement);
        if (options.customClass) {
          modalElement.addClass(options.customClass);
        }
        if (options.size && validSizes[options.size]) {
          angular.element(findElement('.modal-dialog', modalElement[0])).addClass(validSizes[options.size]);
        }
        if (options.animation) {
          if (options.backdrop) {
            backdropElement.addClass(options.backdropAnimation);
          }
          modalElement.addClass(options.animation);
        }
        if (options.backdrop) {
          $animate.enter(backdropElement, bodyElement, null);
        }
        if (angular.version.minor <= 2) {
          $animate.enter(modalElement, parent, after, enterAnimateCallback);
        } else {
          $animate.enter(modalElement, parent, after).then(enterAnimateCallback);
        }
        $modal.$isShown = scope.$isShown = true;
        safeDigest(scope);
        var el = modalElement[0];
        requestAnimationFrame(function() {
          el.focus();
        });
        bodyElement.addClass(options.prefixClass + '-open');
        layoutHideElement.attr('aria-hidden', 'true');
        if (options.animation) {
          bodyElement.addClass(options.prefixClass + '-with-' + options.animation);
        }
        bindBackdropEvents();
        bindKeyboardEvents();
      };
      function enterAnimateCallback() {
        scope.$emit(options.prefixEvent + '.show', $modal);
        if (angular.isDefined(options.onShow) && angular.isFunction(options.onShow)) {
          options.onShow($modal);
        }
        modalElement.attr('aria-hidden', 'false');
        modalElement.attr('tabindex', '0');
        modalElement.focus();
        if (!modalElement.length || !angular.element(modalElement[0]).hasClass('modal')) {
          layoutHideElement.attr('aria-hidden', 'false');
          unbindKeyboardEvents();
        }
      }
      $modal.hide = function() {
        if (!$modal.$isShown) return;
        if (scope.$emit(options.prefixEvent + '.hide.before', $modal).defaultPrevented) {
          return;
        }
        if (angular.isDefined(options.onBeforeHide) && angular.isFunction(options.onBeforeHide)) {
          options.onBeforeHide($modal);
        }
        modalElement.attr('aria-hidden', 'true');
        if ($modal.returnFocus && typeof $modal.returnFocus === 'function') $modal.returnFocus();
        if (angular.version.minor <= 2) {
          $animate.leave(modalElement, leaveAnimateCallback);
        } else {
          $animate.leave(modalElement).then(leaveAnimateCallback);
        }
        if (options.backdrop) {
          backdropCount--;
          $animate.leave(backdropElement);
        }
        $modal.$isShown = scope.$isShown = false;
        safeDigest(scope);
        unbindBackdropEvents();
        unbindKeyboardEvents();
      };
      function leaveAnimateCallback() {
        scope.$emit(options.prefixEvent + '.hide', $modal);
        if (angular.isDefined(options.onHide) && angular.isFunction(options.onHide)) {
          options.onHide($modal);
        }
        if (findElement('.modal').length <= 0) {
          bodyElement.removeClass(options.prefixClass + '-open');
          layoutHideElement.attr('aria-hidden', 'false');
        }
        if (options.animation) {
          bodyElement.removeClass(options.prefixClass + '-with-' + options.animation);
        }
      }
      function findFocusableElements() {
        var focusableElements = 'a:not([disabled]), button:not([disabled]), input:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
        if (document.activeElement) {
          var focusable = Array.prototype.filter.call(modalElement[0].querySelectorAll(focusableElements), function(element) {
            return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement;
          });
          return focusable;
        }
      }
      function findNextFocusableElement(inReverse) {
        if (document.activeElement) {
          var focusable = findFocusableElements();
          if (focusable === undefined) return;
          if (inReverse) {
            focusable = Array.prototype.reverse.call(focusable);
          }
          var index = focusable.indexOf(document.activeElement);
          return focusable[index + 1];
        }
      }
      $modal.toggle = function() {
        if ($modal.$isShown) {
          $modal.hide();
        } else {
          $modal.show();
        }
      };
      $modal.focus = function() {
        modalElement[0].focus();
      };
      $modal.$onKeyUp = function(evt) {
        if ((evt.which === 8 || evt.which === 27) && $modal.$isShown) {
          if (evt.which === 27) {
            $modal.hide();
          }
          evt.stopPropagation();
        }
      };
      $modal.$onKeyDown = function(evt) {
        if (options.keyboard) {
          if (evt.keyCode === 8 && evt.target.tagName !== 'TEXTAREA' && evt.target.tagName !== 'INPUT') {
            evt.preventDefault();
          }
          if (evt.keyCode === 9) {
            var nextFocusable = findNextFocusableElement(evt.shiftKey);
            if (nextFocusable === undefined) {
              if (evt.preventDefault) evt.preventDefault();
              if (evt.stopPropagation) evt.stopPropagation();
              var focusable = findFocusableElements();
              if (evt.shiftKey) {
                focusable[focusable.length - 1].focus();
              } else {
                focusable[0].focus();
              }
            }
          }
        }
      };
      function bindBackdropEvents() {
        if (options.backdrop) {
          modalElement.on('click', hideOnBackdropClick);
          backdropElement.on('click', hideOnBackdropClick);
          backdropElement.on('wheel', preventEventDefault);
        }
      }
      function unbindBackdropEvents() {
        if (options.backdrop) {
          modalElement.off('click', hideOnBackdropClick);
          backdropElement.off('click', hideOnBackdropClick);
          backdropElement.off('wheel', preventEventDefault);
        }
      }
      function bindKeyboardEvents() {
        if (options.keyboard) {
          modalElement.on('keyup', $modal.$onKeyUp);
          modalElement.on('keydown', $modal.$onKeyDown);
        }
      }
      function unbindKeyboardEvents() {
        if (options.keyboard) {
          modalElement.off('keyup', $modal.$onKeyUp);
          modalElement.off('keydown', $modal.$onKeyDown);
        }
      }
      function hideOnBackdropClick(evt) {
        if (evt.target !== evt.currentTarget) return;
        if (options.backdrop === 'static') {
          $modal.focus();
        } else {
          $modal.hide();
        }
      }
      function preventEventDefault(evt) {
        evt.preventDefault();
      }
      function destroyModalElement() {
        if ($modal.$isShown && modalElement !== null) {
          unbindBackdropEvents();
          unbindKeyboardEvents();
        }
        if (modalScope) {
          modalScope.$destroy();
          modalScope = null;
        }
        if (modalElement) {
          modalElement.remove();
          modalElement = $modal.$element = null;
        }
      }
      return $modal;
    }
    function safeDigest(scope) {
      scope.$$phase || scope.$root && scope.$root.$$phase || scope.$digest();
    }
    function findElement(query, element) {
      return angular.element((element || document).querySelectorAll(query));
    }
    return ModalFactory;
  } ];
}).directive('bsModal', [ '$window', '$sce', '$parse', '$modal', function($window, $sce, $parse, $modal) {
  return {
    restrict: 'EAC',
    scope: true,
    link: function postLink(scope, element, attr, transclusion) {
      var options = {
        scope: scope,
        element: element,
        show: false
      };
      angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'contentTemplate', 'placement', 'backdrop', 'keyboard', 'html', 'container', 'animation', 'backdropAnimation', 'id', 'prefixEvent', 'prefixClass', 'customClass', 'modalClass', 'size', 'zIndex' ], function(key) {
        if (angular.isDefined(attr[key])) options[key] = attr[key];
      });
      if (options.modalClass) {
        options.customClass = options.modalClass;
      }
      var falseValueRegExp = /^(false|0|)$/i;
      angular.forEach([ 'backdrop', 'keyboard', 'html', 'container' ], function(key) {
        if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
      });
      angular.forEach([ 'onBeforeShow', 'onShow', 'onBeforeHide', 'onHide' ], function(key) {
        var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
        if (angular.isDefined(attr[bsKey])) {
          options[key] = scope.$eval(attr[bsKey]);
        }
      });
      angular.forEach([ 'title', 'content' ], function(key) {
        if (attr[key]) {
          attr.$observe(key, function(newValue, oldValue) {
            scope[key] = $sce.trustAsHtml(newValue);
          });
        }
      });
      if (attr.bsModal) {
        scope.$watch(attr.bsModal, function(newValue, oldValue) {
          if (angular.isObject(newValue)) {
            angular.extend(scope, newValue);
          } else {
            scope.content = newValue;
          }
        }, true);
      }
      var modal = $modal(options);
      if (options.keyboard) {
        modal.returnFocus = function() {
          element[0].focus();
        };
      }
      element.on(attr.trigger || 'click', modal.toggle);
      scope.$on('$destroy', function() {
        if (modal) modal.destroy();
        options = null;
        modal = null;
      });
    }
  };
} ]);
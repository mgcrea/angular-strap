'use strict';

angular.module('mgcrea.ngStrap.modal', ['mgcrea.ngStrap.helpers.dimensions'])

  .run(function($templateCache, $modal) {

    var template = '' +
      '<div class="modal" tabindex="-1" role="dialog">' +
        '<div class="modal-dialog">' +
          '<div class="modal-content">' +
            '<div class="modal-header" ng-show="title">' +
              '<button type="button" class="close" ng-click="$hide()">&times;</button>' +
              '<h4 class="modal-title" ng-bind="title"></h4>' +
            '</div>'+
            '<div class="modal-body" ng-show="content" ng-bind="content"></div>'+
            '<div class="modal-footer">' +
              '<button type="button" class="btn btn-default" ng-click="$hide()">Close</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    $templateCache.put('$modal', template);

  })

  .provider('$modal', function() {

    var defaults = this.defaults = {
      animation: 'animation-fade',
      prefixClass: 'modal',
      placement: 'top',
      template: '$modal',
      container: false,
      element: null,
      backdrop: true,
      keyboard: true,
      html: false,
      show: true
    };

    this.$get = function($window, $rootScope, $compile, $q, $templateCache, $http, $animate, $timeout, dimensions) {

      var forEach = angular.forEach;
      var jqLite = angular.element;
      var trim = String.prototype.trim;
      var bodyElement = jqLite($window.document.body);
      var htmlReplaceRegExp = /ng-bind="/ig;
      var findElement = function(query, element) {
        return jqLite((element || document).querySelectorAll(query));
      };

      function ModalFactory(config) {

        var $modal = {};

        // Common vars
        var options = angular.extend({}, defaults, config);
        $modal.$promise = $q.when($templateCache.get(options.template) || $http.get(options.template/*, {cache: true}*/));
        var scope = $modal.$scope = options.scope && options.scope.$new() || $rootScope.$new();
        if(!options.element && !options.container) {
          options.container = 'body';
        }

        // Support scope as string options
        if(!options.scope) {
          forEach(['title', 'content'], function(key) {
            if(options[key]) scope[key] = options[key];
          });
        }

        // Provide scope helpers
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

        // Fetch, compile then initialize modal
        var modalLinker, modalElement;
        var backdropElement = jqLite('<div class="' + options.prefixClass + '-backdrop"/>');
        $modal.$promise.then(function(template) {
          if(angular.isObject(template)) template = template.data;
          if(options.html) template = template.replace(htmlReplaceRegExp, 'ng-bind-html="');
          template = trim.apply(template);
          modalLinker = $compile(template);
          $modal.init();
        });

        $modal.init = function() {

          // Options: show
          if(options.show) {
            scope.$$postDigest(function() {
              $modal.show();
            });
          }

        };

        $modal.destroy = function() {

          // Remove element
          if(modalElement) {
            modalElement.remove();
            modalElement = null;
          }
          if(backdropElement) {
            backdropElement.remove();
            backdropElement = null;
          }

          // Destroy scope
          scope.$destroy();

        };

        $modal.show = function() {

          var parent = options.container ? findElement(options.container) : null;
          var after = options.container ? null : options.element;

          // Fetch a cloned element linked from template
          modalElement = $modal.$element = modalLinker(scope, function(clonedElement, scope) {});

          // Set the initial positioning.
          modalElement.css({display: 'block'}).addClass(options.placement);

          // Options: animation
          if(options.animation) {
            if(options.backdrop) {
              backdropElement.addClass('animation-fade');
            }
            modalElement.addClass(options.animation);
          }

          if(options.backdrop) {
            $animate.enter(backdropElement, bodyElement, null, function() {});
          }
          $animate.enter(modalElement, parent, after, function() {});
          scope.$isShown = true;
          scope.$$phase || scope.$digest();
          $modal.focus();

          bodyElement.addClass(options.prefixClass + '-open');
          // if(options.animation) {
          //   bodyElement.addClass(options.prefixClass + '-with-' + options.animation);
          // }

          // Bind events
          if(options.backdrop) {
            modalElement.on('click', hideOnBackdropClick);
            backdropElement.on('click', hideOnBackdropClick);
          }
          if(options.keyboard) {
            modalElement.on('keyup', $modal.$onKeyUp);
          }

        };

        $modal.hide = function() {

          $animate.leave(modalElement, function() {
            bodyElement.removeClass(options.prefixClass + '-open');
            // if(options.animation) {
            //   bodyElement.addClass(options.prefixClass + '-with-' + options.animation);
            // }
          });
          if(options.backdrop) {
            $animate.leave(backdropElement, function() {});
          }
          scope.$$phase || scope.$digest();
          scope.$isShown = false;

          // Unbind events
          if(options.backdrop) {
            modalElement.off('click', hideOnBackdropClick);
            backdropElement.off('click', hideOnBackdropClick);
          }
          if(options.keyboard) {
            modalElement.off('keyup', $modal.$onKeyUp);
          }

        };

        $modal.toggle = function() {

          scope.$isShown ? $modal.hide() : $modal.show();

        };

        $modal.focus = function() {

          modalElement[0].focus();

        };

        // Protected methods

        $modal.$onKeyUp = function(evt) {

          evt.which === 27 && $modal.hide();

        };

        // Private methods

        function hideOnBackdropClick(evt) {
          if(evt.target !== evt.currentTarget) return;
          options.backdrop === 'static' ? $modal.focus() : $modal.hide();
        }

        return $modal;

      }

      return ModalFactory;

    };

  })

  .directive('bsModal', function($window, $location, $sce, $modal) {

    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {

        // Directive options
        var options = {scope: scope, element: element, show: false};
        angular.forEach(['template', 'placement', 'backdrop', 'keyboard', 'html', 'container', 'animation'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Support scope as data-attrs
        angular.forEach(['title', 'content'], function(key) {
          attr[key] && attr.$observe(key, function(newValue, oldValue) {
            scope[key] = newValue;
          });
        });

        // Support scope as an object
        attr.bsModal && scope.$watch(attr.bsModal, function(newValue, oldValue) {
          if(angular.isObject(newValue)) {
            angular.extend(scope, newValue);
          } else {
            scope.content = newValue;
          }
        }, true);

        // Initialize modal
        var modal = $modal(options);

        // Trigger
        element.on(attr.trigger || 'click', modal.toggle);

        // Garbage collection
        scope.$on('$destroy', function() {
          modal.destroy();
          options = null;
          modal = null;
        });

      }
    };

  });

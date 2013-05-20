'use strict';

angular.module('$strap.directives')

.factory('$modal', function($rootScope, $compile, $http, $timeout, $q, $templateCache, $strapConfig) {

  var ModalFactory = function ModalFactory(config) {

    function Modal(config) {

      var options = angular.extend({show: true}, $strapConfig.modal, config),
          scope = options.scope ? options.scope : $rootScope.$new(),
          templateUrl = options.template;

      return $q.when($templateCache.get(templateUrl) || $http.get(templateUrl, {cache: true}).then(function(res) { return res.data; }))
      .then(function onSuccess(template) {

        // Build modal object
        var id = templateUrl.replace('.html', '').replace(/[\/|\.|:]/g, '-') + '-' + scope.$id;
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
        angular.forEach(['show', 'hide'], function(name) {
          scope[name] = function() {
            $modal.modal(name);
          };
        });
        scope.dismiss = scope.hide;

        // Emit modal events
        angular.forEach(['show', 'shown', 'hide', 'hidden'], function(name) {
          $modal.on(name, function(ev) {
            scope.$emit('modal-' + name, ev);
          });
        });

        // Support autofocus attribute
        $modal.on('shown', function(ev) {
          $('input[autofocus]', $modal).first().trigger('focus');
        });
        // Auto-remove $modal created via service
        $modal.on('hidden', function(ev) {
          if(!options.persist) scope.$destroy();
        });

        // Garbage collection
        scope.$on('$destroy', function() {
          $modal.remove();
        });

        $modal.modal(options);

        return $modal;

      });

    }

    return new Modal(config);

  };

  return ModalFactory;

})

.directive('bsModal', function($q, $modal) {

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

      // $.fn.datepicker options
      angular.forEach(['modalClass', 'backdrop', 'keyboard'], function(key) {
        if(angular.isDefined(iAttrs[key])) options[key] = iAttrs[key];
      });

      $q.when($modal(options)).then(function onSuccess(modal) {
        iElement.attr('data-target', '#' + modal.attr('id')).attr('data-toggle', 'modal');
      });

    }
  };
});

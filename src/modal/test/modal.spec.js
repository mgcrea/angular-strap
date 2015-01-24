'use strict';

describe('modal', function() {

  var bodyEl = $('body'), sandboxEl;
  var $rootScope, $compile, $templateCache, $$rAF, $animate, $httpBackend, $modal, scope;

  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));
  beforeEach(module('mgcrea.ngStrap.modal'));

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
    $templateCache = $injector.get('$templateCache');
    $$rAF = $injector.get('$$rAF');
    $animate = $injector.get('$animate');
    $httpBackend = $injector.get('$httpBackend');
    $modal = $injector.get('$modal');

    bodyEl.html('');
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo(bodyEl);
    scope = $rootScope.$new();
  }));

  afterEach(function() {
    scope.$destroy();
    sandboxEl.remove();
  });

  // Templates

  var templates = {
    'default': {
      scope: {modal: {title: 'Title', content: 'Hello Modal!'}},
      element: '<a title="{{modal.title}}" data-content="{{modal.content}}" bs-modal>click me</a>'
    },
    'default-with-id': {
      scope: {modal: {title: 'Title', content: 'Hello Modal!'}},
      element: '<a id="modal1" title="{{modal.title}}" data-content="{{modal.content}}" bs-modal>click me</a>'
    },
    'markup-scope': {
      element: '<a bs-modal="modal">click me</a>'
    },
    'markup-ngRepeat': {
      scope: {items: [{name: 'foo', modal: {title: 'Title', content: 'Hello Modal!'}}]},
      element: '<ul><li ng-repeat="item in items"><a title="{{item.modal.title}}" data-content="{{item.modal.content}}" bs-modal>{{item.name}}</a></li></ul>'
    },
    'markup-ngClick-service': {
      element: '<a ng-click="showModal()">click me</a>'
    },
    'options-placement': {
      element: '<a data-placement="bottom" bs-modal="modal">click me</a>'
    },
    'options-placement-exotic': {
      element: '<a data-placement="center" bs-modal="modal">click me</a>'
    },
    'options-html': {
      scope: {modal: {title: 'Title', content: 'Hello Modal<br>This is a multiline message!'}},
      element: '<a title="{{modal.title}}" data-content="{{modal.content}}" data-html="1" bs-modal>click me</a>'
    },
    'options-backdrop': {
      scope: { backdrop: false },
      element: '<a data-placement="center" bs-modal="modal" data-backdrop="{{ backdrop }}">click me</a>'
    },
    'options-template': {
      scope: {modal: {title: 'Title', content: 'Hello Modal!', counter: 0}, items: ['foo', 'bar', 'baz']},
      element: '<a title="{{modal.title}}" data-content="{{modal.content}}" data-template="custom" bs-modal>click me</a>'
    }
  };

  function compileDirective(template, locals) {
    template = templates[template];
    angular.extend(scope, template.scope || templates['default'].scope, locals);
    var element = $(template.element).appendTo(sandboxEl);
    element = $compile(element)(scope);
    scope.$digest();
    return jQuery(element[0]);
  }

  // Tests

  describe('with default template', function() {

    it('should open on click', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.modal').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.children('.modal').length).toBe(1);
    });

    it('should close on click', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.modal').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.children('.modal').length).toBe(0);
    });

    it('should correctly compile inner content', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.modal-title').html()).toBe(scope.modal.title);
      expect(sandboxEl.find('.modal-body').html()).toBe(scope.modal.content);
    });

    it('should support scope as object', function() {
      var elm = compileDirective('markup-scope');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.modal-title').html()).toBe(scope.modal.title);
      expect(sandboxEl.find('.modal-body').html()).toBe(scope.modal.content);
    });

    it('should support ngRepeat markup inside', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-modal]')).triggerHandler('click');
      expect(sandboxEl.find('.modal-title').html()).toBe(scope.items[0].modal.title);
      expect(sandboxEl.find('.modal-body').html()).toBe(scope.items[0].modal.content);
    });

  });

  describe('using service', function() {

    it('should correctly open on next digest', function() {
      var myModal = $modal(templates['default'].scope.modal);
      scope.$digest();
      expect(bodyEl.children('.modal').length).toBe(1);
      myModal.hide();
      expect(bodyEl.children('.modal').length).toBe(0);
    });

    it('should correctly be destroyed', function() {
      var myModal = $modal(angular.extend(templates['default'].scope.modal));
      scope.$digest();
      expect(bodyEl.children('.modal').length).toBe(1);
      myModal.destroy();
      expect(bodyEl.children('.modal').length).toBe(0);
      expect(bodyEl.children().length).toBe(1);
    });

    it('should correctly work with ngClick', function() {
      var elm = compileDirective('markup-ngClick-service');
      var myModal = $modal(angular.extend({show: false}, templates['default'].scope.modal));
      scope.showModal = function() {
        myModal.$promise.then(myModal.show);
      };
      expect(bodyEl.children('.modal').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      expect(bodyEl.children('.modal').length).toBe(1);
    });

    it('should correctly work with ngClick with an isolated scope', function() {
      scope = scope.$new(true);
      var elm = compileDirective('markup-ngClick-service');
      var myModal = $modal(angular.extend({show: false, scope: scope}, templates['default'].scope.modal));
      scope.showModal = function() {
        myModal.$promise.then(myModal.show);
      };
      expect(bodyEl.children('.modal').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      expect(bodyEl.children('.modal').length).toBe(1);
    });

    it('should store config id value in instance', function() {
      var myModal = $modal({ title: 'Title', content: 'Hello Modal!', id: 'modal1' });
      expect(myModal.$id).toBe('modal1');
    });

    it('should fallback to element id value when id is not provided in config', function() {
      var myModal = $modal({ title: 'Title', content: 'Hello Modal!', element: sandboxEl });
      expect(myModal.$id).toBe('sandbox');
    });

  });

  describe('using scope helpers', function() {

    var elm, elmScope;
    beforeEach(function() {
      elm = compileDirective('default');
      elmScope = angular.element(elm).scope().$$childTail;
      scope.$digest();
    });

    it('should correctly open on next digest', function() {
      expect(sandboxEl.children('.modal').length).toBe(0);
      expect(elmScope.$isShown).toBeFalsy();
      elmScope.$show();
      $animate.triggerCallbacks();
      scope.$digest();
      expect(sandboxEl.children('.modal').length).toBe(1);
      expect(elmScope.$isShown).toBeTruthy();
      elmScope.$hide();
      $animate.triggerCallbacks();
      scope.$digest();
      expect(sandboxEl.children('.modal').length).toBe(0);
      expect(elmScope.$isShown).toBeFalsy();
      elmScope.$toggle();
      $animate.triggerCallbacks();
      scope.$digest();
      expect(sandboxEl.children('.modal').length).toBe(1);
      expect(elmScope.$isShown).toBeTruthy();
      elmScope.$toggle();
      $animate.triggerCallbacks();
      scope.$digest();
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      expect(elmScope.$isShown).toBeFalsy();
    });

    it('should do nothing when hiding an already hidden popup', function() {
      expect(sandboxEl.children('.modal').length).toBe(0);
      expect(elmScope.$isShown).toBeFalsy();
      elmScope.$hide();
      $animate.triggerCallbacks();
      scope.$digest();
      expect(sandboxEl.children('.modal').length).toBe(0);
      expect(elmScope.$isShown).toBeFalsy();
    });

    it('should do nothing when showing an already visible popup', function() {
      expect(sandboxEl.children('.modal').length).toBe(0);
      expect(elmScope.$isShown).toBeFalsy();
      elmScope.$show();
      $animate.triggerCallbacks();
      scope.$digest();
      expect(sandboxEl.children('.modal').length).toBe(1);
      expect(elmScope.$isShown).toBeTruthy();
      elmScope.$show();
      $animate.triggerCallbacks();
      scope.$digest();
      expect(sandboxEl.children('.modal').length).toBe(1);
      expect(elmScope.$isShown).toBeTruthy();
    });

  });

  describe('show / hide events', function() {

    it('should dispatch show and show.before events', function() {
      var myModal = $modal(templates['default'].scope.modal);
      var emit = spyOn(myModal.$scope, '$emit').and.callThrough();
      scope.$digest();

      expect(emit).toHaveBeenCalledWith('modal.show.before', myModal);
      // show only fires AFTER the animation is complete
      expect(emit).not.toHaveBeenCalledWith('modal.show', myModal);
      $animate.triggerCallbacks();
      expect(emit).toHaveBeenCalledWith('modal.show', myModal);
    });

    it('should dispatch hide and hide.before events', function() {
      var myModal = $modal(templates['default'].scope.modal);
      scope.$digest();
      var emit = spyOn(myModal.$scope, '$emit').and.callThrough();
      myModal.hide();

      expect(emit).toHaveBeenCalledWith('modal.hide.before', myModal);
      // hide only fires AFTER the animation is complete
      expect(emit).not.toHaveBeenCalledWith('modal.hide', myModal);
      $animate.triggerCallbacks();
      expect(emit).toHaveBeenCalledWith('modal.hide', myModal);
    });

    it('should namespace show/hide events using the prefixEvent', function() {
      var myModal = $modal(angular.extend({prefixEvent: 'alert'}, templates['default'].scope.modal));
      var emit = spyOn(myModal.$scope, '$emit').and.callThrough();
      scope.$digest();
      myModal.hide();
      $animate.triggerCallbacks();

      expect(emit).toHaveBeenCalledWith('alert.show.before', myModal);
      expect(emit).toHaveBeenCalledWith('alert.show', myModal);
      expect(emit).toHaveBeenCalledWith('alert.hide.before', myModal);
      expect(emit).toHaveBeenCalledWith('alert.hide', myModal);
    });

    it('should can cancel show on show.before event', function() {
      $rootScope.$on('modal.show.before', function(e) {
        e.preventDefault();
      });
      $rootScope.$on('modal.show', function() {
        throw new Error('modal should not be shown');
      });
      var myModal = $modal(templates['default'].scope.modal);
      scope.$digest();
      $animate.triggerCallbacks();
    });

    it('should can cancel hide on hide.before event', function() {
      $rootScope.$on('modal.hide.before', function(e) {
        e.preventDefault();
      });
      $rootScope.$on('modal.hide', function() {
        throw new Error('modal should not be hidden');
      });
      var myModal = $modal(templates['default'].scope.modal);
      scope.$digest();
      myModal.hide();
      $animate.triggerCallbacks();
    });

    it('should call show.before event with modal element instance id', function() {
      var elm = compileDirective('default-with-id');
      var id = "";
      scope.$on('modal.show.before', function(evt, modal) {
        id = modal.$id;
      });

      angular.element(elm[0]).triggerHandler('click');
      scope.$digest();
      expect(id).toBe('modal1');
    });

  });

  describe('options', function() {

    describe('animation', function() {

      it('should default to `am-fade` animation', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.modal')).toHaveClass('am-fade');
      });

    });

    describe('keyboard', function() {

      it('should dismiss and stopPropagation if ESC is pressed', function() {
        var myModal = $modal(templates['default'].scope.modal);
        scope.$digest();
        expect(bodyEl.children('.modal').length).toBe(1);
        var evt = jQuery.Event( 'keyup', { keyCode: 27, which: 27 } );
        spyOn(evt, 'stopPropagation');
        myModal.$onKeyUp(evt);
        expect(bodyEl.children('.modal').length).toBe(0);
        expect(evt.stopPropagation).toHaveBeenCalled();
      });

      it('should NOT stopPropagation if ESC is pressed while modal is hidden', function() {
        var myModal = $modal(templates['default'].scope.modal);
        scope.$digest();
        myModal.hide();
        var evt = jQuery.Event( 'keyup', { keyCode: 27, which: 27 } );
        spyOn(evt, 'stopPropagation');
        myModal.$onKeyUp(evt);
        expect(evt.stopPropagation).not.toHaveBeenCalled();
      });

    });

    describe('placement', function() {

      it('should default to `top` placement', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.modal')).toHaveClass('top');
      });

      it('should support placement', function() {
        var elm = compileDirective('options-placement');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.modal')).toHaveClass('bottom');
      });

      it('should support exotic-placement', function() {
        var elm = compileDirective('options-placement-exotic');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.modal')).toHaveClass('center');
      });

    });

    describe('html', function() {

      it('should correctly compile inner content', function() {
        var elm = compileDirective('options-html');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal-title').html()).toBe(scope.modal.title);
        expect(sandboxEl.find('.modal-body').html()).toBe(scope.modal.content);
      });

    });

    describe('template', function() {

      it('should support custom template', function() {
        $templateCache.put('custom', '<div class="modal"><div class="modal-inner">foo: {{title}}</div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal-inner').text()).toBe('foo: ' + scope.modal.title);
      });

      it('should request custom template via $http', function() {
        $httpBackend.expectGET('custom').respond(200,  '<div class="modal"><div class="modal-inner">foo: {{title}}</div></div>');
        var elm = compileDirective('options-template');
        $httpBackend.flush();
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal-inner').text()).toBe('foo: ' + scope.modal.title);
      });

      it('should request custom template via $http only once', function() {
        $httpBackend.expectGET('custom').respond(200,  '<div class="modal"><div class="modal-inner">foo: {{title}}</div></div>');
        var elm = compileDirective('options-template');
        var elmBis = compileDirective('options-template');
        $httpBackend.flush();
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal-inner').text()).toBe('foo: ' + scope.modal.title);
      });

      it('should support template with ngRepeat', function() {
        $templateCache.put('custom', '<div class="modal"><div class="modal-inner"><ul><li ng-repeat="item in items">{{item}}</li></ul></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal-inner').text()).toBe('foobarbaz');
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('click');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal-inner').text()).toBe('foobarbaz');
      });

      it('should support template with ngClick', function() {
        $templateCache.put('custom', '<div class="modal"><div class="modal-inner"><a class="btn" ng-click="modal.counter=modal.counter+1">click me</a></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(sandboxEl.find('.modal-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.modal.counter).toBe(1);
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('click');
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(sandboxEl.find('.modal-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.modal.counter).toBe(2);
      });

    });

    describe('container', function() {
      it('accepts element object', function() {
      	var testElm = angular.element('<div></div>');
      	sandboxEl.append(testElm);
        var myModal = $modal(angular.extend({}, templates['default'].scope.modal, {container: testElm}));
        scope.$digest();
        expect(angular.element(testElm.children()[0]).hasClass('modal')).toBeTruthy();
      });
    });

    describe('backdrop', function() {
      it('should show backdrop by default', function() {
        var elm = compileDirective('default');
        expect(bodyEl.find('.modal-backdrop').length).toBe(0);
        angular.element(elm[0]).triggerHandler('click');
        expect(bodyEl.find('.modal-backdrop').length).toBe(1);
      });

      it('should not show backdrop if option value if falsy', function() {
        var elm = compileDirective('options-backdrop');
        expect(bodyEl.find('.modal-backdrop').length).toBe(0);
        angular.element(elm[0]).triggerHandler('click');
        expect(bodyEl.find('.modal-backdrop').length).toBe(0);
      });

    });

  });

});

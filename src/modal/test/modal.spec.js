'use strict';

describe('modal', function() {

  var bodyEl = $('body'), sandboxEl;
  var $rootScope, $compile, $templateCache, $$rAF, $animate, $timeout, $httpBackend, $modal, scope;

  beforeEach(module('ngSanitize'));
  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));
  beforeEach(module('mgcrea.ngStrap.modal'));
  beforeEach(module(function($controllerProvider) {
    $controllerProvider.register('MyModalController', function($scope) {
      $scope.title = 'foo';
      $scope.content = 'bar';
    });
  }));

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
    $templateCache = $injector.get('$templateCache');
    $$rAF = $injector.get('$$rAF');
    $animate = $injector.get('$animate');
    $timeout = $injector.get('$timeout');
    var flush = $animate.flush || $animate.triggerCallbacks;
    $animate.flush = function() {
      flush.call($animate); if(!$animate.triggerCallbacks) $timeout.flush();
    };
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
    'default-with-namespace': {
      scope: {modal: {title: 'Title', content: 'Hello Modal!'}},
      element: '<a title="{{modal.title}}" data-content="{{modal.content}}" bs-modal data-prefix-event="datepicker">click me</a>'
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
    'options-controller': {
      element: '<a data-controller="MyModalController" bs-modal>click me</a>'
    },
    'options-placement': {
      element: '<a data-placement="bottom" bs-modal="modal">click me</a>'
    },
    'options-placement-exotic': {
      element: '<a data-placement="center" bs-modal="modal">click me</a>'
    },
    'options-html': {
      scope: {modal: {title: 'title<br>next', content: 'content<br>next'}},
      element: '<a title="{{modal.title}}" data-content="{{modal.content}}" data-html="{{html}}" bs-modal>click me</a>'
    },
    'options-backdrop': {
      element: '<a bs-modal="modal" data-backdrop="{{backdrop}}">click me</a>'
    },
    'options-keyboard': {
      element: '<a bs-modal="modal" data-keyboard="{{keyboard}}">click me</a>'
    },
    'options-container': {
      element: '<a bs-modal="modal" data-container="{{container}}">click me</a>'
    },
    'options-template': {
      scope: {modal: {title: 'Title', content: 'Hello Modal!', counter: 0}, items: ['foo', 'bar', 'baz']},
      element: '<a title="{{modal.title}}" data-content="{{modal.content}}" data-template-url="custom" bs-modal>click me</a>'
    },
    'options-contentTemplate': {
      scope: {modal: {title: 'Title', content: 'Hello Modal!', counter: 0}, items: ['foo', 'bar', 'baz']},
      element: '<a title="{{modal.title}}" data-content="{{modal.content}}" data-content-template="custom" bs-modal>click me</a>'
    },
    'options-modalClass': {
      element: '<a bs-modal="modal" data-modal-class="my-custom-class">click me</a>'
    },
    'options-size-lg': {
      element: '<a bs-modal="modal" data-size="lg">click me</a>'
    },
    'options-size-invalid': {
      element: '<a bs-modal="modal" data-size="md">click me</a>'
    },
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
      try { $animate.flush(); } catch(err) {}
      scope.$digest();
      expect(sandboxEl.children('.modal').length).toBe(1);
      expect(elmScope.$isShown).toBeTruthy();
      elmScope.$hide();
      $animate.flush();
      scope.$digest();
      expect(sandboxEl.children('.modal').length).toBe(0);
      expect(elmScope.$isShown).toBeFalsy();
      elmScope.$toggle();
      $animate.flush();
      scope.$digest();
      expect(sandboxEl.children('.modal').length).toBe(1);
      expect(elmScope.$isShown).toBeTruthy();
      elmScope.$toggle();
      $animate.flush();
      scope.$digest();
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      expect(elmScope.$isShown).toBeFalsy();
    });

    it('should do nothing when hiding an already hidden popup', function() {
      expect(sandboxEl.children('.modal').length).toBe(0);
      expect(elmScope.$isShown).toBeFalsy();
      elmScope.$hide();
      try { $animate.flush(); } catch(err) {}
      scope.$digest();
      expect(sandboxEl.children('.modal').length).toBe(0);
      expect(elmScope.$isShown).toBeFalsy();
    });

    it('should do nothing when showing an already visible popup', function() {
      expect(sandboxEl.children('.modal').length).toBe(0);
      expect(elmScope.$isShown).toBeFalsy();
      elmScope.$show();
      try { $animate.flush(); } catch(err) {}
      scope.$digest();
      expect(sandboxEl.children('.modal').length).toBe(1);
      expect(elmScope.$isShown).toBeTruthy();
      elmScope.$show();
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
      $animate.flush();
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
      $animate.flush();
      expect(emit).toHaveBeenCalledWith('modal.hide', myModal);
    });

    it('should namespace show/hide events using the prefixEvent', function() {
      var myModal = $modal(angular.extend({prefixEvent: 'alert'}, templates['default'].scope.modal));
      var emit = spyOn(myModal.$scope, '$emit').and.callThrough();
      scope.$digest();
      myModal.hide();
      $animate.flush();

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
      try { $animate.flush(); } catch(err) {}
    });

    it('should be able to cancel hide on hide.before event', function() {
      $rootScope.$on('modal.hide.before', function(e) {
        e.preventDefault();
      });
      $rootScope.$on('modal.hide', function() {
        throw new Error('modal should not be hidden');
      });
      var myModal = $modal(templates['default'].scope.modal);
      scope.$digest();
      myModal.hide();
      $animate.flush();
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

    it('should call namespaced events through directive', function() {
      var elm = compileDirective('default-with-namespace');
      var showBefore, show, hide, hideBefore;
      scope.$on('datepicker.show.before', function() {
        showBefore = true;
      });
      scope.$on('datepicker.show', function() {
        show = true;
      });
      scope.$on('datepicker.hide.before', function() {
        hideBefore = true;
      });
      scope.$on('datepicker.hide', function() {
        hide = true;
      });

      angular.element(elm[0]).triggerHandler('click');
      $animate.flush();

      expect(showBefore).toBe(true);
      expect(show).toBe(true);

      angular.element(elm[0]).triggerHandler('click');
      $animate.flush();

      expect(hideBefore).toBe(true);
      expect(hide).toBe(true);
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

      // Note: modal.trigger(evt) does not trigger modal keyup handler, only modal.triggerHandler(evt) does
      it('should remove modal when data-keyboard is truthy', function() {
        var elm = compileDirective('options-keyboard', {keyboard: 'true'});
        expect(bodyEl.find('.modal').length).toBe(0);
        angular.element(elm[0]).triggerHandler('click');
        var modal = bodyEl.find('.modal');
        expect(modal.length).toBe(1);
        var evt = jQuery.Event( 'keyup', { keyCode: 27, which: 27 } );
        modal.triggerHandler(evt)
        expect(bodyEl.find('.modal').length).toBe(0);
      });

      it('should NOT remove modal when data-keyboard is falsy', function() {
        var elm = compileDirective('options-keyboard', {keyboard: 'false'});
        expect(bodyEl.find('.modal').length).toBe(0);
        angular.element(elm[0]).triggerHandler('click');
        var modal = bodyEl.find('.modal');
        expect(modal.length).toBe(1);
        var evt = jQuery.Event( 'keyup', { keyCode: 27, which: 27 } );
        modal.triggerHandler(evt)
        expect(bodyEl.find('.modal').length).toBe(1);
      });

    });

    describe('controller', function() {

      it('should properly invoke our passed controller', function() {
        var elm = compileDirective('options-controller');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal-title').html()).toBe('foo');
        expect(sandboxEl.find('.modal-body').html()).toBe('bar');
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

      it('should NOT compile inner content by default', function() {
        var elm = compileDirective('default', {modal: {title: 'title<br>next', content: 'content<br>next</span>'}});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal-title').html()).not.toBe('title<br>next');
        expect(sandboxEl.find('.modal-body').html()).not.toBe('content<br>next');
      });

      it('should compile inner content if html is true', function() {
        var elm = compileDirective('options-html', {html: true});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal-title').html()).toBe('title<br>next');
        expect(sandboxEl.find('.modal-body').html()).toBe('content<br>next');
      });

      it('should compile inner content if html is truthy', function() {
        var elm = compileDirective('options-html', {html: 'true'});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal-title').html()).toBe('title<br>next');
        expect(sandboxEl.find('.modal-body').html()).toBe('content<br>next');
      });

      // we'll test all permutations of falsy here ('False', 0, ''). They all use the same regex, so once should suffice
      it('should NOT compile inner content if html is false', function() {
        var elm = compileDirective('options-html', {html: false});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal-title').html()).not.toBe('title<br>next');
        expect(sandboxEl.find('.modal-body').html()).not.toBe('content<br>next');
      });

      it('should NOT compile inner content if html is False', function() {
        var elm = compileDirective('options-html', {html: 'False'});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal-title').html()).not.toBe('title<br>next');
        expect(sandboxEl.find('.modal-body').html()).not.toBe('content<br>next');
      });

      it('should NOT compile inner content if html is 0', function() {
        var elm = compileDirective('options-html', {html: '0'});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal-title').html()).not.toBe('title<br>next');
        expect(sandboxEl.find('.modal-body').html()).not.toBe('content<br>next');
      });

      it('should NOT compile inner content if html is empty string', function() {
        var elm = compileDirective('options-html', {html: ''});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal-title').html()).not.toBe('title<br>next');
        expect(sandboxEl.find('.modal-body').html()).not.toBe('content<br>next');
      });

    });

    describe('template', function() {

      it('should support custom template', function() {
        $templateCache.put('custom', '<div class="modal"><div class="modal-inner">foo: {{title}}</div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal-inner').text()).toBe('foo: ' + scope.modal.title);
      });

      it('should support custom template loaded by ngInclude', function() {
        $templateCache.put('custom', [200, '<div class="modal"><div class="modal-inner">foo: {{title}}</div></div>', {}, 'OK']);
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

      it('should destroy inner scopes when hidding modal', function() {
        var scopeCount = countScopes(scope, 0);
        var originalScope = scope;
        scope = scope.$new();
        $templateCache.put('custom', '<div class="modal"><div class="modal-inner"><div ng-if="1===1">Fake element to force creation of a new $scope</div><div class="btn" ng-click="$hide()"></div></div></div>');
        var elm = compileDirective('options-template');

        // We are only destroying the modal element before showing another
        // modal. This is to avoid timming issues with the hide animation
        // callback, because we could be showing a new modal before the
        // hide animation callback has been called and then the modal element
        // variables would be replaced with the new modal.
        // So, for this test to work, we need to show/hide the modal once
        // before counting the number of scopes expected.
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(sandboxEl.find('.modal-inner > .btn')[0]).triggerHandler('click'));

        // repeat process to test creation/destruction of inner scopes
        var scopeCountAfterShow = countScopes(scope, 0);
        for (var i = 0; i < 10; i++) {
          // show modal
          angular.element(elm[0]).triggerHandler('click');

          // hide modal
          expect(angular.element(sandboxEl.find('.modal-inner > .btn')[0]).triggerHandler('click'));
        }

        // scope count should be the same as it was when directive finished initialization
        expect(countScopes(scope, 0)).toBe(scopeCountAfterShow);

        scope.$destroy();
        scope = originalScope;

        // scope count should be the same as it was before directive was initialized
        expect(countScopes(scope, 0)).toBe(scopeCount);
      });

    });

    describe('contentTemplate', function() {

      it('should support custom contentTemplate', function() {
        $templateCache.put('custom', 'baz: {{title}}');
        var elm = compileDirective('options-contentTemplate');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal-body').text()).toBe('baz: ' + scope.modal.title);
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

      it('accepts data-container element selector', function() {
        var testElm = angular.element('<div id="testElm"></div>');
        sandboxEl.append(testElm);
        var elm = compileDirective('options-container', {container: '#testElm'});
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(testElm.children()[0]).hasClass('modal')).toBeTruthy();
      });

      it('should belong to sandbox when data-container is falsy', function() {
        var elm = compileDirective('options-container', angular.extend({}, templates['default'].scope.modal, {container: 'false'}));
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal').length).toBe(1);
      });

    });

    describe('backdrop', function() {
      it('should show backdrop by default', function() {
        var elm = compileDirective('default');
        expect(bodyEl.find('.modal-backdrop').length).toBe(0);
        angular.element(elm[0]).triggerHandler('click');
        expect(bodyEl.find('.modal-backdrop').length).toBe(1);
      });

      it('should show backdrop if data-backdrop is truthy', function() {
        var elm = compileDirective('options-backdrop', {backdrop: 'anything'});
        expect(bodyEl.find('.modal-backdrop').length).toBe(0);
        angular.element(elm[0]).triggerHandler('click');
        expect(bodyEl.find('.modal-backdrop').length).toBe(1);
      });

      it('should not show backdrop if data-backdrop is false', function() {
        var elm = compileDirective('options-backdrop', {backdrop: 'false'});
        expect(bodyEl.find('.modal-backdrop').length).toBe(0);
        angular.element(elm[0]).triggerHandler('click');
        expect(bodyEl.find('.modal-backdrop').length).toBe(0);
      });

      it('should show backdrop above a previous modal dialog using the z-index value', function() {
        var elm1 = compileDirective('default');
        var elm2 = compileDirective('default');

        expect(bodyEl.find('.modal-backdrop').length).toBe(0);

        angular.element(elm1[0]).triggerHandler('click');
        expect(bodyEl.find('.modal-backdrop').length).toBe(1);
        var backdrop1 = bodyEl.find('.modal-backdrop')[0];
        var modal1 = bodyEl.find('.modal')[0];

        angular.element(elm2[0]).triggerHandler('click');
        expect(bodyEl.find('.modal-backdrop').length).toBe(2);
        var backdrop2 = bodyEl.find('.modal-backdrop')[angular.version.minor <= 2 ? 1 : 0];
        var modal2 = bodyEl.find('.modal')[1];

        expect(angular.element(backdrop1).css('z-index')).toBe('1040');
        expect(angular.element(modal1).css('z-index')).toBe('1050');
        expect(angular.element(backdrop2).css('z-index')).toBe('1060');
        expect(angular.element(modal2).css('z-index')).toBe('1070');
      });

    });

    describe('modalClass', function() {
      it('should add class to the modal element', function() {
        var elm = compileDirective('options-modalClass');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.modal')).toHaveClass('my-custom-class');
      });

      it('should not add class to the modal element when modalClass is not present', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.modal')).not.toHaveClass('my-custom-class');
      });
    });

    describe('size', function() {
      it('sets size class when specified', function() {
        var elm = compileDirective('options-size-lg');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal-dialog')).toHaveClass('modal-lg');
      });

      it('does not set size class when not specified', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal-dialog')).not.toHaveClass('modal-lg');
      });

      it('does not set size class when invalid size is specified', function() {
        var elm = compileDirective('options-size-invalid');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.modal-dialog')).not.toHaveClass('modal-lg');
      });

    });

  });

});

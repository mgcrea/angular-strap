'use strict';

describe('modal', function() {

  var bodyEl = $('body'), sandboxEl;
  var $compile, $templateCache, $modal, scope;

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.modal'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_, _$modal_) {
    scope = _$rootScope_.$new();
    bodyEl.html('');
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo(bodyEl);
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    $modal = _$modal_;
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

  });

  describe('options', function() {

    describe('animation', function() {

      it('should default to `animation-fade` animation', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.modal')).toHaveClass('animation-fade');
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

  });

});

'use strict';

describe('popover', function () {

  var $compile, $templateCache, scope, sandboxEl;

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.popover'));
  jQuery.fn.triggerHandler = function(evt) {
    return angular.element(this[0]).triggerHandler(evt);
  };

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_) {
    scope = _$rootScope_;
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo('body');
  }));

  afterEach(function() {
    sandboxEl.remove();
    scope.$destroy();
  });

  // Templates

  var templates = {
    'default': {
      scope: {popover: {title: 'Title', content: 'Hello Popover<br>This is a multiline message!'}},
      element: '<a class="btn" title="{{popover.title}}" data-content="{{popover.content}}" bs-popover></a>'
    },
    'markup-scope': {
      element: '<a bs-popover="popover">click me</a>'
    },
    'markup-ngRepeat': {
      scope: {items: [{name: 'foo', popover: {title: 'Title', content: 'Hello Popover<br>This is a multiline message!'}}]},
      element: '<ul><li ng-repeat="item in items"><a class="btn" bs-popover="item.popover">{{item.name}}</a></li></ul>'
    },
    'custom-template': {
      scope: {items: ['foo', 'bar', 'baz'], foo: {bar: 0}},
      element: '<a data-content="bar" data-template="custom" bs-popover>click me</a>'
    },
    'options-placement': {
      element: '<a title="{{popover.title}}" data-placement="bottom" bs-popover>hover me</a>'
    },
    'options-placement-exotic': {
      element: '<a title="{{popover.title}}" data-placement="bottom-right" bs-popover>hover me</a>'
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

  describe('default', function () {

    it('should open on click', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children().length).toBe(1);
      elm.triggerHandler('click');
      expect(sandboxEl.children().length).toBe(2);
    });

    it('should close on double-click', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children().length).toBe(1);
      elm.triggerHandler('click');
      elm.triggerHandler('click');
      expect(sandboxEl.children().length).toBe(1);
    });

    it('should correctly compile inner content', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.popover-title').html()).toBe(scope.popover.title);
      expect(sandboxEl.find('.popover-content').html()).toBe(scope.popover.content);
    });

    it('should support scope as object', function() {
      var elm = compileDirective('markup-scope');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.popover-title').html()).toBe(scope.popover.title);
      expect(sandboxEl.find('.popover-content').html()).toBe(scope.popover.content);
    });

    it('should support ngRepeat markup inside', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-popover]')).triggerHandler('click');
      expect(sandboxEl.find('.popover-title').html()).toBe(scope.items[0].popover.title);
      expect(sandboxEl.find('.popover-content').html()).toBe(scope.items[0].popover.content);
    });

    it('should support custom template', function() {
      $templateCache.put('custom', '<div class="popover"><div class="popover-content">foo: {{content}}</div></div>');
      var elm = compileDirective('custom-template');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.popover-content').text()).toBe('foo: bar');
    });

    it('should support template with ngRepeat', function() {
      $templateCache.put('custom', '<div class="popover"><div class="popover-content"><ul><li ng-repeat="item in items">{{item}}</li></ul></div></div>');
      var elm = compileDirective('custom-template');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.popover-content').text()).toBe('foobarbaz');
      // Consecutive toggles
      angular.element(elm[0]).triggerHandler('click');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.popover-content').text()).toBe('foobarbaz');
    });

    it('should support template with ngClick', function() {
      $templateCache.put('custom', '<div class="popover"><div class="popover-content"><a class="btn" ng-click="foo.bar=foo.bar+1">click me</a></div></div>');
      var elm = compileDirective('custom-template');
      angular.element(elm[0]).triggerHandler('click');
      expect(angular.element(sandboxEl.find('.popover-content > .btn')[0]).triggerHandler('click'));
      expect(scope.foo.bar).toBe(1);
      // Consecutive toggles
      angular.element(elm[0]).triggerHandler('click');
      angular.element(elm[0]).triggerHandler('click');
      expect(angular.element(sandboxEl.find('.popover-content > .btn')[0]).triggerHandler('click'));
      expect(scope.foo.bar).toBe(2);
    });


    // it('test-cache', function() {
    //   var elm = compileDirective('default');
    //   angular.forEach(angular.element.cache, function(item) {
    //     dump(item.data);
    //   });
    // })

  });


  describe('options', function () {

    describe('animation', function () {

      it('should default to `animation-fade` animation', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.popover').hasClass('animation-fade')).toBeTruthy();
      });

    });

    describe('placement', function () {

      it('should default to `right` placement', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.popover').hasClass('right')).toBeTruthy();
      });

      it('should support placement', function() {
        var elm = compileDirective('options-placement');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.popover').hasClass('bottom')).toBeTruthy();
      });

      it('should support exotic-placement', function() {
        var elm = compileDirective('options-placement-exotic');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.popover').hasClass('bottom-right')).toBeTruthy();
      });

    });

  });
});

// https://github.com/angular-ui/bootstrap/blob/master/src/popover/test/popover.spec.js


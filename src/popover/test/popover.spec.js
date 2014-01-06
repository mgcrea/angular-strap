'use strict';

describe('popover', function () {

  var $compile, scope, sandboxEl;

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.popover'));
  jQuery.fn.triggerHandler = function(evt) {
    return angular.element(this[0]).triggerHandler(evt);
  };

  beforeEach(inject(function (_$rootScope_, _$compile_) {
    scope = _$rootScope_;
    $compile = _$compile_;
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo('body');
  }));

  afterEach(function() {
    sandboxEl.remove();
    scope.$destroy();
  });

  // Templates

  var templates = {
    'default': {
      element: '<a class="btn" data-tile="A Title" data-content="And here\'s some amazing content. It\'s very engaging. right?" data-placement="left" bs-popover></a>'
    }
  };

  function compileDirective(template, locals) {
    template = templates[template];
    angular.extend(scope, template.scope, locals);
    var element = $(template.element).appendTo(sandboxEl);
    element = $compile(element)(scope);
    scope.$digest();
    return jQuery(element[0]);
  }

  // Tests

  ddescribe('default', function () {

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

    iit('should correctly compile inner content', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(sandboxEl.find('.popover-title').html()).toBe(scope.popover.title);
      expect(sandboxEl.find('.popover-content').html()).toBe(scope.popover.content);
    });

    iit('should support scope as object', function() {
      var elm = compileDirective('markup-scope');
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(sandboxEl.find('.popover-title').html()).toBe(scope.popover.title);
      expect(sandboxEl.find('.popover-content').html()).toBe(scope.popover.content);
    });

    it('should support ngRepeat markup', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-tooltip]')).triggerHandler('mouseenter');
      expect(sandboxEl.find('.popover-content').html()).toBe(scope.items[0].tooltip);
    });

    it('should support custom template', function() {
      $templateCache.put('customTooltip', '<div class="tooltip"><div class="popover-content">foo: {{title}}</div></div>');
      var elm = compileDirective('custom-template');
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(sandboxEl.find('.popover-content').text()).toBe('foo: bar');
    });

    it('should support template with ngRepeat', function() {
      $templateCache.put('customTooltip', '<div class="tooltip"><div class="popover-content"><ul><li ng-repeat="item in items">{{item}}</li></ul></div></div>');
      var elm = compileDirective('custom-template');
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(sandboxEl.find('.popover-content').text()).toBe('foobarbaz');
      // Consecutive toggles
      angular.element(elm[0]).triggerHandler('mouseleave');
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(sandboxEl.find('.popover-content').text()).toBe('foobarbaz');
    });

    it('should support template with ngClick', function() {
      $templateCache.put('customTooltip', '<div class="tooltip"><div class="popover-content"><a class="btn" ng-click="foo.bar=foo.bar+1">click me</a></div></div>');
      var elm = compileDirective('custom-template');
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(angular.element(sandboxEl.find('.popover-content > .btn')[0]).triggerHandler('click'));
      expect(scope.foo.bar).toBe(1);
      // Consecutive toggles
      angular.element(elm[0]).triggerHandler('mouseleave');
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(angular.element(sandboxEl.find('.popover-content > .btn')[0]).triggerHandler('click'));
      expect(scope.foo.bar).toBe(2);
    });

    it('should default to `animation-fade` animation', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(sandboxEl.children('.tooltip').hasClass('animation-fade')).toBeTruthy();
    });

    // it('test-cache', function() {
    //   var elm = compileDirective('default');
    //   angular.forEach(angular.element.cache, function(item) {
    //     dump(item.data);
    //   });
    // })

  });

});

// https://github.com/angular-ui/bootstrap/blob/master/src/popover/test/popover.spec.js


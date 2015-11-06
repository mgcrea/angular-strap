'use strict';

describe('aside', function () {

  var $compile, $templateCache, scope, sandboxEl, $aside;
  var bodyEl = $('body');

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.aside'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_, _$aside_) {
    scope = _$rootScope_.$new();
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo($('body'));
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    $aside = _$aside_;
  }));

  afterEach(function() {
    scope.$destroy();
    sandboxEl.remove();
  });

  // Templates

  var templates = {
    'default': {
      scope: {aside: {title: 'Title', content: 'Hello aside!'}},
      element: '<a title="{{aside.title}}" data-content="{{aside.content}}" bs-aside>click me</a>'
    },
    'markup-scope': {
      element: '<a bs-aside="aside">click me</a>'
    },
    'markup-ngRepeat': {
      scope: {items: [{name: 'foo', aside: {title: 'Title', content: 'Hello aside!'}}]},
      element: '<ul><li ng-repeat="item in items"><a title="{{item.aside.title}}" data-content="{{item.aside.content}}" bs-aside>{{item.name}}</a></li></ul>'
    },
    'options-placement': {
      element: '<a data-placement="left" bs-aside="aside">click me</a>'
    },
    'options-template': {
      scope: {aside: {title: 'Title', content: 'Hello aside!', counter: 0}, items: ['foo', 'bar', 'baz']},
      element: '<a data-template-url="custom" bs-aside="aside">click me</a>'
    },
    'options-html': {
      scope: {aside: {title: 'title<br>next', content: 'content<br>next'}},
      element: '<a bs-aside="aside" data-html="{{html}}">click me</a>'
    },
    'options-backdrop': {
      element: '<a bs-aside="aside" data-backdrop="{{backdrop}}">click me</a>'
    },
    'options-keyboard': {
      element: '<a bs-aside="aside" data-keyboard="{{keyboard}}">click me</a>'
    },
    'options-container': {
      element: '<a bs-aside="aside" data-container="{{container}}">click me</a>'
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

  describe('with default template', function () {

    it('should open on click', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.aside').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.children('.aside').length).toBe(1);
    });

    it('should close on click', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.aside').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.children('.aside').length).toBe(0);
    });

    it('should correctly compile inner content', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.aside-title').html()).toBe(scope.aside.title);
      expect(sandboxEl.find('.aside-body').html()).toBe(scope.aside.content);
    });

    it('should support scope as object', function() {
      var elm = compileDirective('markup-scope');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.aside-title').html()).toBe(scope.aside.title);
      expect(sandboxEl.find('.aside-body').html()).toBe(scope.aside.content);
    });

    it('should support ngRepeat markup inside', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-aside]')).triggerHandler('click');
      expect(sandboxEl.find('.aside-title').html()).toBe(scope.items[0].aside.title);
      expect(sandboxEl.find('.aside-body').html()).toBe(scope.items[0].aside.content);
    });

  });


  describe('options', function () {

    describe('animation', function () {

      it('should default to `am-fade-and-slide-right` animation', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.aside')).toHaveClass('am-fade-and-slide-right');
      });

    });

    describe('placement', function () {

      it('should default to `top` placement', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.aside')).toHaveClass('right');
      });

      it('should support placement', function() {
        var elm = compileDirective('options-placement');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.aside')).toHaveClass('left');
      });

    });

    describe('html', function () {

      it('should not compile inner content by default', function() {
        var elm = compileDirective('default', {aside: {title: 'title<br>next', content: 'content<br>next'}});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.aside-title').html()).not.toBe('title<br>next');
        expect(sandboxEl.find('.aside-body').html()).not.toBe('content<br>next');
      });

      it('should compile inner content if html is truthy', function() {
        var elm = compileDirective('options-html', {html: 'true'});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.aside-title').html()).toBe('title<br>next');
        expect(sandboxEl.find('.aside-body').html()).toBe('content<br>next');
      });

      it('should NOT compile inner content if html is false', function() {
        var elm = compileDirective('options-html', {html: 'false'});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.aside-title').html()).not.toBe('title<br>next');
        expect(sandboxEl.find('.aside-body').html()).not.toBe('content<br>next');
      });

    });

    describe('template', function () {

      it('should support custom template', function() {
        $templateCache.put('custom', '<div class="aside"><div class="aside-inner">foo: {{title}}</div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.aside-inner').text()).toBe('foo: ' + scope.aside.title);
      });

      it('should support template with ngRepeat', function() {
        $templateCache.put('custom', '<div class="aside"><div class="aside-inner"><ul><li ng-repeat="item in items">{{item}}</li></ul></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.aside-inner').text()).toBe('foobarbaz');
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('click');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.aside-inner').text()).toBe('foobarbaz');
      });

      it('should support template with ngClick', function() {
        $templateCache.put('custom', '<div class="aside"><div class="aside-inner"><a class="btn" ng-click="aside.counter=aside.counter+1">click me</a></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(sandboxEl.find('.aside-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.aside.counter).toBe(1);
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('click');
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(sandboxEl.find('.aside-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.aside.counter).toBe(2);
      });

      it('should destroy inner scopes when hidding aside', function() {
        var scopeCount = countScopes(scope, 0);
        var originalScope = scope;
        scope = scope.$new();
        $templateCache.put('custom', '<div class="aside"><div class="aside-inner"><div ng-if="1===1">Fake element to force creation of a new $scope</div><div class="btn" ng-click="$hide()"></div></div></div>');
        var elm = compileDirective('options-template');

        // We are only destroying the aside element before showing another
        // aside. This is to avoid timming issues with the hide animation
        // callback, because we could be showing a new aside before the
        // hide animation callback has been called and then the aside element
        // variables would be replaced with the new aside.
        // So, for this test to work, we need to show/hide the aside once
        // before counting the number of scopes expected.
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(sandboxEl.find('.aside-inner > .btn')[0]).triggerHandler('click'));

        // repeat process to test creation/destruction of inner scopes
        var scopeCountAfterShow = countScopes(scope, 0);
        for (var i = 0; i < 10; i++) {
          // show aside
          angular.element(elm[0]).triggerHandler('click');

          // hide aside
          expect(angular.element(sandboxEl.find('.aside-inner > .btn')[0]).triggerHandler('click'));
        }

        // scope count should be the same as it was when directive finished initialization
        expect(countScopes(scope, 0)).toBe(scopeCountAfterShow);

        scope.$destroy();
        scope = originalScope;

        // scope count should be the same as it was before directive was initialized
        expect(countScopes(scope, 0)).toBe(scopeCount);
      });

    });

    describe('backdrop', function() {
      it('should show backdrop by default', function() {
        var elm = compileDirective('default');
        expect(bodyEl.find('.aside-backdrop').length).toBe(0);
        angular.element(elm[0]).triggerHandler('click');
        expect(bodyEl.find('.aside-backdrop').length).toBe(1);
      });

      it('should show backdrop if data-backdrop is truthy', function() {
        var elm = compileDirective('options-backdrop', {backdrop: 'true'});
        expect(bodyEl.find('.aside-backdrop').length).toBe(0);
        angular.element(elm[0]).triggerHandler('click');
        expect(bodyEl.find('.aside-backdrop').length).toBe(1);
      });

      it('should not show backdrop if data-backdrop is false', function() {
        var elm = compileDirective('options-backdrop', {backdrop: 'false'});
        expect(bodyEl.find('.aside-backdrop').length).toBe(0);
        angular.element(elm[0]).triggerHandler('click');
        expect(bodyEl.find('.aside-backdrop').length).toBe(0);
      });

      it('should show backdrop above a previous aside dialog using the z-index value', function() {
        var elm1 = compileDirective('default');
        var elm2 = compileDirective('default');

        expect(bodyEl.find('.aside-backdrop').length).toBe(0);

        angular.element(elm1[0]).triggerHandler('click');
        expect(bodyEl.find('.aside-backdrop').length).toBe(1);
        var backdrop1 = bodyEl.find('.aside-backdrop')[0];
        var aside1 = bodyEl.find('.aside')[0];

        angular.element(elm2[0]).triggerHandler('click');
        expect(bodyEl.find('.aside-backdrop').length).toBe(2);
        var backdrop2 = bodyEl.find('.aside-backdrop')[0];
        var aside2 = bodyEl.find('.aside')[1];

        expect(angular.element(backdrop1).css('z-index')).toBe('1040');
        expect(angular.element(aside1).css('z-index')).toBe('1050');
        expect(angular.element(backdrop2).css('z-index')).toBe('1060');
        expect(angular.element(aside2).css('z-index')).toBe('1070');
      });

    });

    describe('keyboard', function() {

      it('should remove aside when data-keyboard is truthy', function() {
        var elm = compileDirective('options-keyboard', {keyboard: 'true'});
        expect(bodyEl.find('.aside').length).toBe(0);
        angular.element(elm[0]).triggerHandler('click');
        var aside = bodyEl.find('.aside');
        expect(aside.length).toBe(1);
        var evt = jQuery.Event( 'keyup', { keyCode: 27, which: 27 } );
        aside.triggerHandler(evt)
        expect(bodyEl.find('.aside').length).toBe(0);
      });

      it('should NOT remove aside when data-keyboard is falsy', function() {
        var elm = compileDirective('options-keyboard', {keyboard: 'false'});
        expect(bodyEl.find('.aside').length).toBe(0);
        angular.element(elm[0]).triggerHandler('click');
        var aside = bodyEl.find('.aside');
        expect(aside.length).toBe(1);
        var evt = jQuery.Event( 'keyup', { keyCode: 27, which: 27 } );
        aside.triggerHandler(evt)
        expect(bodyEl.find('.aside').length).toBe(1);
      });

    });

    describe('container', function() {

      it('accepts element object', function() {
        var testElm = angular.element('<div></div>');
        sandboxEl.append(testElm);
        var myaside = $aside(angular.extend({}, templates['default'].scope.aside, {container: testElm}));
        scope.$digest();
        expect(angular.element(testElm.children()[0]).hasClass('aside')).toBeTruthy();
      });

      it('accepts data-container element selector', function() {
        var testElm = angular.element('<div id="testElm"></div>');
        sandboxEl.append(testElm);
        var elm = compileDirective('options-container', {container: '#testElm'});
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(testElm.children()[0]).hasClass('aside')).toBeTruthy();
      });

      it('should belong to sandbox when data-container is falsy', function() {
        var elm = compileDirective('options-container', angular.extend({}, templates['default'].scope.aside, {container: 'false'}));
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.aside').length).toBe(1);
      });

    });



  });

});

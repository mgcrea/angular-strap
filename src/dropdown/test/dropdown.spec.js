'use strict';
/* global describe, beforeEach, inject, it, expect, afterEach, spyOn, countScopes */

describe('dropdown', function() {

  var $compile, $templateCache, scope, sandboxEl, $animate, $timeout, $dropdown;

  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));
  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.dropdown'));
  beforeEach(module('mgcrea.ngStrap.modal'));

  beforeEach(inject(function($injector, _$rootScope_, _$compile_, _$templateCache_, _$animate_, _$timeout_, _$dropdown_) {
    scope = _$rootScope_.$new();
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo($('body'));
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    $animate = $injector.get('$animate');
    $timeout = $injector.get('$timeout');
    var flush = $animate.flush || $animate.triggerCallbacks;
    $animate.flush = function() {
      flush.call($animate); if (!$animate.triggerCallbacks) $timeout.flush();
    };
    $dropdown = _$dropdown_;
  }));

  afterEach(function() {
    scope.$destroy();
    sandboxEl.remove();
  });

  // Templates

  var templates = {
    'default': {
      scope: {dropdown: [{text: 'Another action', href: '#foo'}, {text: 'External link', href: '/auth/facebook', target: '_self'}, {text: 'Something else here', click: '$alert(\'working ngClick!\')'}, {divider: true}, {text: 'Separated link', href: '#separatedLink', active: true}]},
      element: '<a bs-dropdown="dropdown">click me</a>'
    },
    'default-with-id': {
      scope: {dropdown: [{text: 'Another action', href: '#foo'}, {text: 'External link', href: '/auth/facebook', target: '_self'}, {text: 'Something else here', click: '$alert(\'working ngClick!\')'}, {divider: true}, {text: 'Separated link', href: '#separatedLink'}]},
      element: '<a id="dropdown1" bs-dropdown="dropdown">click me</a>'
    },
    'in-navbar': {
      element: '<div class="collapse navbar-collapse"><ul class="nav navbar-nav"><li class="dropdown"><a bs-dropdown="dropdown">click me</a></li></ul>'
    },
    'markup-ngRepeat': {
      element: '<ul><li ng-repeat="i in [1, 2, 3]"><a bs-dropdown="dropdown">{{i}}</a></li></ul>'
    },
    'markup-inlineTemplate': {
      scope: {},
      element: '<a bs-dropdown>click me</a><ul class="dropdown-menu"><li ng-repeat="i in [1, 2, 3]"><a>{{i}}</a></li></ul>'
    },
    'markup-insideModal': {
      element: '<a data-template-url="custom" bs-modal>click me</a>'
    },
    'options-animation': {
      element: '<a data-animation="am-flip-x" bs-dropdown="dropdown">click me</a>'
    },
    'options-placement': {
      element: '<a data-placement="bottom" bs-dropdown="dropdown">click me</a>'
    },
    'options-placement-exotic': {
      element: '<a data-placement="bottom-right" bs-dropdown="dropdown">click me</a>'
    },
    'options-trigger': {
      element: '<a data-trigger="hover" bs-dropdown="dropdown">hover me</a>'
    },
    'options-html': {
      scope: {dropdown: [{text: 'hello<br>next', href: '#foo'}]},
      element: '<a data-html="{{html}}" bs-dropdown="dropdown">click me</a>'
    },
    'options-template': {
      element: '<a title="{{dropdown.title}}" data-template-url="custom" bs-dropdown="dropdown">click me</a>'
    },
    'bsShow-attr': {
      scope: {dropdown: [{text: 'Another action', href: '#foo'}, {text: 'External link', href: '/auth/facebook', target: '_self'}, {text: 'Something else here', click: '$alert(\'working ngClick!\')'}, {divider: true}, {text: 'Separated link', href: '#separatedLink'}]},
      element: '<a bs-dropdown="dropdown" bs-show="true">click me</a>'
    },
    'bsShow-binding': {
      scope: {isVisible: false, dropdown: [{text: 'Another action', href: '#foo'}, {text: 'External link', href: '/auth/facebook', target: '_self'}, {text: 'Something else here', click: '$alert(\'working ngClick!\')'}, {divider: true}, {text: 'Separated link', href: '#separatedLink'}]},
      element: '<a bs-dropdown="dropdown" bs-show="isVisible">click me</a>'
    },
    'options-container': {
      scope: {dropdown: [{text: 'bar', href: '#foo'}]},
      element: '<a data-container="{{container}}" bs-dropdown="dropdown">click me</a>'
    },
    'undefined-dropdown': {
      scope: {},
      element: '<a bs-dropdown="dropdown">click me</a>'
    }
  };

  function compileDirective(template, locals) {
    template = templates[template];
    angular.extend(scope, template.scope || templates.default.scope, locals);
    var element = $(template.element).appendTo(sandboxEl);
    element = $compile(element)(scope);
    scope.$digest();
    return jQuery(element[0]);
  }

  // Tests

  describe('with default template', function() {

    it('should open on click', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
    });

    it('should close on click', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
    });

    it('should correctly compile inner content', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.dropdown.length);
      expect(sandboxEl.find('.dropdown-menu a:eq(0)').text()).toBe(scope.dropdown[0].text);
      expect(sandboxEl.find('.dropdown-menu a:eq(0)').attr('href')).toBe(scope.dropdown[0].href);
      expect(sandboxEl.find('.dropdown-menu a:eq(0)').attr('ng-click')).toBeUndefined();
      expect(sandboxEl.find('.dropdown-menu a:eq(1)').text()).toBe(scope.dropdown[1].text);
      expect(sandboxEl.find('.dropdown-menu a:eq(1)').attr('href')).toBe(scope.dropdown[1].href);
      expect(sandboxEl.find('.dropdown-menu a:eq(1)').attr('target')).toBe(scope.dropdown[1].target);
      expect(sandboxEl.find('.dropdown-menu a:eq(1)').attr('ng-click')).toBeUndefined();
      expect(sandboxEl.find('.dropdown-menu a:eq(2)').attr('href')).toBeDefined();
      expect(sandboxEl.find('.dropdown-menu a:eq(2)').attr('ng-click')).toBe('$eval(item.click);$hide()');
      expect(sandboxEl.find('.dropdown-menu li:eq(4)').attr('class')).toContain('active');
    });

    it('should support ngRepeat markup', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-dropdown]:eq(0)')).triggerHandler('click');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.dropdown.length);
      expect(sandboxEl.find('.dropdown-menu a:eq(0)').text()).toBe(scope.dropdown[0].text);
    });

    it('should support inline sibling template markup', function() {
      var elm = compileDirective('markup-inlineTemplate');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
      expect(sandboxEl.children('.dropdown-menu').children('li').length).toBe(3);
    });

    it('should support being embedded in a modal', function() {
      $templateCache.put('custom', '<a bs-dropdown="dropdown">click me</a>');
      var elm = compileDirective('markup-insideModal');
      angular.element(elm[0]).triggerHandler('click');
      angular.element(elm[0]).triggerHandler('click');
      angular.element(elm[0]).triggerHandler('click');
    });

  });

  describe('resource allocation', function() {
    it('should not create additional scopes after first show', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('click');
      $animate.flush();
      expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
      angular.element(elm[0]).triggerHandler('click');
      $animate.flush();
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);

      var scopeCount = countScopes(scope, 0);

      for (var i = 0; i < 10; i++) {
        angular.element(elm[0]).triggerHandler('click');
        $animate.flush();
        angular.element(elm[0]).triggerHandler('click');
        $animate.flush();
      }

      expect(countScopes(scope, 0)).toBe(scopeCount);
    });

    it('should destroy scopes when destroying directive scope', function() {
      var scopeCount = countScopes(scope, 0);
      var originalScope = scope;
      scope = scope.$new();
      var elm = compileDirective('default');

      for (var i = 0; i < 10; i++) {
        angular.element(elm[0]).triggerHandler('click');
        $animate.flush();
        angular.element(elm[0]).triggerHandler('click');
        $animate.flush();
      }

      scope.$destroy();
      scope = originalScope;
      expect(countScopes(scope, 0)).toBe(scopeCount);
    });

    it('should remove body click handlers when the directive scope is destroyed', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('click');
      $timeout.flush();
      expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
      scope.$destroy();
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      expect(function() { $('body').triggerHandler('click'); }).not.toThrow();
    });
  });

  describe('bsShow attribute', function() {
    it('should support setting to a boolean value', function() {
      var elm = compileDirective('bsShow-attr');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
    });

    it('should support binding', function() {
      var elm = compileDirective('bsShow-binding');
      expect(scope.isVisible).toBeFalsy();
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      scope.isVisible = true;
      scope.$digest();
      expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
      scope.isVisible = false;
      scope.$digest();
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
    });

    it('should support initial value false', function() {
      var elm = compileDirective('bsShow-binding');
      expect(scope.isVisible).toBeFalsy();
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
    });

    it('should support initial value true', function() {
      var elm = compileDirective('bsShow-binding', {isVisible: true});
      expect(scope.isVisible).toBeTruthy();
      expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
    });

    it('should support undefined value', function() {
      var elm = compileDirective('bsShow-binding', {isVisible: undefined});
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
    });

    it('should support string value', function() {
      var elm = compileDirective('bsShow-binding', {isVisible: 'a string value'});
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      scope.isVisible = 'TRUE';
      scope.$digest();
      expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
      scope.isVisible = 'tooltip';
      scope.$digest();
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      scope.isVisible = 'dropdown,datepicker';
      scope.$digest();
      expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
    });
  });

  describe('in navbar', function() {
    it('should add class .open to the parent <li> when dropdown is open', function() {
      var elm = compileDirective('in-navbar');
      angular.element(elm.find('a')).triggerHandler('click');
      expect(sandboxEl.find('.dropdown').hasClass('open')).toBeTruthy();
      angular.element(elm.find('a')).triggerHandler('click');
      expect(sandboxEl.find('.dropdown').hasClass('open')).toBeFalsy();
    });
  });

  describe('show / hide events', function() {

    it('should dispatch show and show.before events', function() {
      var myDropdown = $dropdown(sandboxEl);
      var emit = spyOn(myDropdown.$scope, '$emit');
      scope.$digest();
      myDropdown.$promise
      .then(function() {
        myDropdown.$scope.content = templates.default.scope.dropdown;
        myDropdown.show();

        expect(emit).toHaveBeenCalledWith('dropdown.show.before', myDropdown);
        // show only fires AFTER the animation is complete
        expect(emit).not.toHaveBeenCalledWith('dropdown.show', myDropdown);
        $animate.flush();
        expect(emit).toHaveBeenCalledWith('dropdown.show', myDropdown);
      });
    });

    it('should dispatch hide and hide.before events', function() {
      var myDropdown = $dropdown(sandboxEl);
      scope.$digest();
      myDropdown.$promise.then( function() {
        myDropdown.$scope.content = templates.default.scope.dropdown;
        myDropdown.show();

        var emit = spyOn(myDropdown.$scope, '$emit');
        myDropdown.hide();

        expect(emit).toHaveBeenCalledWith('dropdown.hide.before', myDropdown);
        // hide only fires AFTER the animation is complete
        expect(emit).not.toHaveBeenCalledWith('dropdown.hide', myDropdown);
        $animate.flush();
        expect(emit).toHaveBeenCalledWith('dropdown.hide', myDropdown);
      });
    });

    it('should call show.before event with dropdown element instance id', function() {
      var elm = compileDirective('default-with-id');
      var id = '';
      scope.$on('dropdown.show.before', function(evt, dropdown) {
        id = dropdown.$id;
      });

      angular.element(elm[0]).triggerHandler('click');
      scope.$digest();
      expect(id).toBe('dropdown1');
    });

  });

  describe('options', function() {

    describe('animation', function() {

      it('should default to `am-fade` animation', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.dropdown-menu').hasClass('am-fade')).toBeTruthy();
      });

      it('should support custom animation', function() {
        var elm = compileDirective('options-animation');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.dropdown-menu').hasClass('am-flip-x')).toBeTruthy();
      });

    });

    describe('placement', function() {
      var $$rAF;
      beforeEach(inject(function(_$$rAF_) {
        $$rAF = _$$rAF_;
      }));

      it('should default to `top` placement', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        $$rAF.flush();
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom-left')).toBeTruthy();
      });

      it('should support placement', function() {
        var elm = compileDirective('options-placement');
        angular.element(elm[0]).triggerHandler('click');
        $$rAF.flush();
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom')).toBeTruthy();
      });

      it('should support exotic-placement', function() {
        var elm = compileDirective('options-placement-exotic');
        angular.element(elm[0]).triggerHandler('click');
        $$rAF.flush();
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom-right')).toBeTruthy();
      });

    });

    describe('trigger', function() {

      it('should support an alternative trigger', function() {
        var elm = compileDirective('options-trigger');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
        angular.element(elm[0]).triggerHandler('mouseleave');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      });

    });

    describe('html', function() {

      it('should correctly compile inner content when html is true', function() {
        var elm = compileDirective('options-html', {html: 'true'});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.dropdown.length);
        expect(sandboxEl.find('.dropdown-menu a:eq(0)').html()).toBe(scope.dropdown[0].text);
      });

      it('should NOT correctly compile inner content when html is false', function() {
        var elm = compileDirective('options-html', {html: 'false'});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.dropdown.length);
        expect(sandboxEl.find('.dropdown-menu a:eq(0)').html()).not.toBe(scope.dropdown[0].text);
      });

    });

    describe('template', function() {

      it('should support custom template', function() {
        $templateCache.put('custom', '<div class="dropdown"><div class="dropdown-inner">foo: {{dropdown.length}}</div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe('foo: ' + scope.dropdown.length);
      });

      it('should support template with ngRepeat', function() {
        $templateCache.put('custom', '<div class="dropdown"><div class="dropdown-inner"><ul><li ng-repeat="item in dropdown">{{$index}}</li></ul></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe('01234');
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('click');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe('01234');
      });

      it('should support template with ngClick', function() {
        $templateCache.put('custom', '<div class="dropdown"><div class="dropdown-inner"><a class="btn" ng-click="dropdown.counter=dropdown.counter+1">click me</a></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(sandboxEl.find('.dropdown-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.dropdown.counter).toBe(1);
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('click');
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(sandboxEl.find('.dropdown-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.dropdown.counter).toBe(2);
      });

    });

    describe('container', function() {

      it('should put dropdown in a container when specified', function() {
        var testElm = $('<div id="testElm"></div>');
        sandboxEl.append(testElm);
        var elm = compileDirective('options-container', {container: '#testElm'});
        // expect(testElm.children('.dropdown-menu').length).toBe(0);
        // angular.element(elm[0]).triggerHandler('click');
        // expect(testElm.children('.dropdown-menu').length).toBe(1);
      })

      it('should put dropdown in sandbox when container is falsy', function() {
        var elm = compileDirective('options-container', {container: 'false'});
        expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
      })

    })

  });

  describe('with undefined dropdown', function() {

    it('shouldn\'t open on click', function() {
      var elm = compileDirective('undefined-dropdown');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
      expect(sandboxEl.children('.dropdown-menu').hasClass('ng-hide')).toBeTruthy();
    });

  });

});

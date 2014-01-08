'use strict';

describe('navbar', function() {

  var $compile, $templateCache, $location, scope, sandboxEl;

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.navbar'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_, _$location_) {
    scope = _$rootScope_.$new();
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo($('body'));
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    $location = _$location_;
  }));

  afterEach(function() {
    scope.$destroy();
    sandboxEl.remove();
  });

  // Templates

  var templates = {
    'default': {
      scope: {},
      element: '<nav class="navbar" bs-navbar><ul class="nav"><li data-match-route="/network.*"><a href="#/network">Network</a></li><li data-match-route="/profile.*"><a href="#/profile">Profile</a></li></ul></nav>'
    },
    'markup-ngRepeat': {
      scope: {navItems: [
        {text: 'Network', href: 'network'},
        {text: 'Profile', href: 'profile'}
      ]},
      element: '<nav class="navbar" bs-navbar><ul class="nav"><li data-match-route="/{{item.href}}" ng-repeat="item in navItems"><a href="#/{{item.href}}">{{item.text}}</a></li></ul></nav>'
    },
    'options-route-attr': {
      scope: {routeAttr: 'data-route'},
      element: '<nav class="navbar" data-route-attr="{{routeAttr}}" bs-navbar><ul class="nav"><li data-route="/network.*"><a href="#/network">Network</a></li><li data-route="/profile.*"><a href="#/profile">Profile</a></li></ul></nav>'
    },
    'options-active-class': {
      scope: {activeClass: 'in'},
      element: '<nav class="navbar" data-active-class="{{activeClass}}" bs-navbar><ul class="nav"><li data-match-route="/network.*"><a href="#/network">Network</a></li><li data-match-route="/profile.*"><a href="#/profile">Profile</a></li></ul></nav>'
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

    it('should correctly toggle activeClass', function() {
      var elm = compileDirective('default');
      $location.path('/network');
      scope.$digest();
      expect(elm.find('li:nth-child(1)')).toHaveClass('active');
      $location.path('/profile');
      scope.$digest();
      expect(elm.find('li:nth-child(1)')).not.toHaveClass('active');
      expect(elm.find('li:nth-child(2)')).toHaveClass('active');
    });

    it('should work with regular expressions', function() {
      var elm = compileDirective('default');
      $location.path('/network');
      scope.$digest();
      expect(elm.find('li:first')).toHaveClass('active');
      $location.path('/network/config');
      scope.$digest();
      expect(elm.find('li:first')).toHaveClass('active');
    });

    it('should work with dynamic content', function() {
      var elm = compileDirective('markup-ngRepeat');
      $location.path('/network');
      scope.$digest();
      expect(elm.find('li:nth-child(1)')).toHaveClass('active');
      $location.path('/profile');
      scope.$digest();
      expect(elm.find('li:nth-child(1)')).not.toHaveClass('active');
      expect(elm.find('li:nth-child(2)')).toHaveClass('active');
    });

  });

  describe('options', function() {

    describe('template', function() {

      it('should support custom route-attr', function() {
        var elm = compileDirective('options-route-attr');
        $location.path('/network');
        scope.$digest();
        expect(elm.find('li:nth-child(1)')).toHaveClass('active');
        $location.path('/profile');
        scope.$digest();
        expect(elm.find('li:nth-child(1)')).not.toHaveClass('active');
        expect(elm.find('li:nth-child(2)')).toHaveClass('active');
      });

    });

    describe('active-class', function() {

      it('should support custom active-class', function() {
        var elm = compileDirective('options-active-class');
        $location.path('/network');
        scope.$digest();
        expect(elm.find('li:nth-child(1)')).toHaveClass(scope.activeClass);
        $location.path('/profile');
        scope.$digest();
        expect(elm.find('li:nth-child(1)')).not.toHaveClass(scope.activeClass);
        expect(elm.find('li:nth-child(2)')).toHaveClass(scope.activeClass);
      });

    });

  });

});

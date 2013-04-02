'use strict';

describe('navbar', function () {
  var scope, $sandbox, $compile, $timeout, $location;

  beforeEach(module('$strap.directives'));

  beforeEach(inject(function ($injector, $rootScope, _$compile_, _$timeout_, _$location_) {
    scope = $rootScope;
    $compile = _$compile_;
    $timeout = _$timeout_;
    $location = _$location_;

    $sandbox = $('<div id="sandbox"></div>').appendTo($('body'));
  }));

  afterEach(function() {
    $sandbox.remove();
    scope.$destroy();
  });

  var templates = {
    'default': '<nav class="navbar" bs-navbar><ul class="nav"><li data-match-route="/network.*"><a href="#/network">Network</a></li><li data-match-route="/profile.*"><a href="#/profile">Profile</a></li></ul></nav>',
    'ngRepeat': '<nav class="navbar" bs-navbar><ul class="nav"><li data-match-route="/{{item.href}}" ng-repeat="item in navItems"><a href="#/{{item.href}}">{{item.text}}</a></li></ul></nav>'
  };

  function compileDirective(template) {
    template = template ? templates[template] : templates['default'];
    template = $(template).appendTo($sandbox);
    var elm = $compile(template)(scope);
    scope.$digest();
    return elm;
  }

  // Tests

  it('should toggle "active" class for you', function () {
    var elm = compileDirective();
    $location.path('/network'); scope.$digest();
    expect(elm.find('li:nth-child(1)').hasClass('active')).toBe(true);
    $location.path('/profile'); scope.$digest();
    expect(elm.find('li:nth-child(1)').hasClass('active')).toBe(false);
    expect(elm.find('li:nth-child(2)').hasClass('active')).toBe(true);
  });

  it('should work with regular expressions', function () {
    var elm = compileDirective();
    $location.path('/network'); scope.$digest();
    expect(elm.find('li:first').hasClass('active')).toBe(true);
    $location.path('/network/config'); scope.$digest();
    expect(elm.find('li:first').hasClass('active')).toBe(true);
  });

  it('should work with dynamic content', function () {
    scope.navItems = [
      {text: "Network", href: "network"},
      {text: "Profile", href: "profile"}
    ];
    var elm = compileDirective('ngRepeat');
    $location.path('/network'); scope.$digest();
    expect(elm.find('li:nth-child(1)').hasClass('active')).toBe(true);
    $location.path('/profile'); scope.$digest();
    expect(elm.find('li:nth-child(1)').hasClass('active')).toBe(false);
    expect(elm.find('li:nth-child(2)').hasClass('active')).toBe(true);
  });

});

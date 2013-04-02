'use strict';
/* global describe, it, dump */

describe('dropdown', function () {
  var scope, $sandbox, $compile, $timeout;

  beforeEach(module('$strap.directives'));

  beforeEach(inject(function ($injector, $rootScope, _$compile_, _$timeout_) {
    scope = $rootScope;
    $compile = _$compile_;
    $timeout = _$timeout_;

    $sandbox = $('<div id="sandbox"></div>').appendTo($('body'));
  }));

  afterEach(function() {
    $sandbox.remove();
    scope.$destroy();
  });

  var templates = {
    'default': {
      element: '<button type="button" href="#" class="dropdown btn" bs-dropdown="items">Dropdown <b class="caret"></b></button>',
      scope: { click: function() { dump('click'); }, items: [
        {text: 'Another action', href:"#A"},
        {text: 'Something else here', href:"#B"},
        {divider: true},
        {text: 'Separated link', href:"#", click:"click(1)"}
      ]}
    },
    'submenu': {
      element: '<button type="button" href="#" class="dropdown btn" bs-dropdown="items">Dropdown <b class="caret"></b></button>',
      scope: { click: function() { }, items: [
        {text: 'Another action', href:"#A"},
        {text: 'Something else here', href:"#B"},
        {divider: true},
        {text: 'Separated link', href:"#", click:"click(1)",
        submenu: [
          {text: 'Second level link', href: "#"},
          {text: 'Second level link 2', href: "#", submenu: [
            {text: 'Second level link', href: "#"},
            {text: 'Second level link 2', href: "#", click:"click(2)"}
          ]}
        ]}
      ]}
    }
  };

  function compileDirective(template) {
    template = template ? templates[template] : templates['default'];
    angular.extend(scope, template.scope);
    $(template.element).appendTo($sandbox);
    var $element = $(template.element).appendTo($sandbox);
    $element = $compile($element)(scope);
    scope.$digest();
    $timeout.flush(); // relies on $timeout
    return $element;
  }
  // Tests

  it('should add "data-toggle" attr & "dropdown-toggle" class for you', function () {
    var elm = compileDirective();
    expect(elm.attr('data-toggle')).toBe('dropdown');
    expect(elm.hasClass('dropdown-toggle')).toBe(true);
  });

  it('should correctly build the dropdown ul element', function() {
    var elm = compileDirective();
    var ul = elm.next('ul');
    expect(ul.length).toBe(1);
    expect(ul.attr('class')).toBe('dropdown-menu ng-scope');
    expect(ul.children('li').length).toBe(scope.items.length);
  });

  it('should correctly set "href" & "ng-click" attrs', function() {
    var elm = compileDirective('submenu');
    var ul = elm.next('ul');
    expect(ul.find('li:first a').attr('href')).toBe(scope.items[0].href);
    expect(ul.find('li:eq(3) a').attr('ng-click')).toBe(scope.items[3].click);
  });

  it('should support ngClick directive', function() {
    var elm = compileDirective('submenu');
    var ul = elm.next('ul');
    var spy = spyOn(scope, 'click').andCallThrough();
    ul.find('li:eq(3) a').trigger('click');
    expect(spy).toHaveBeenCalled();
  });

  describe('submenus', function() {

    it('should correctly build submenus', function() {
      var elm = compileDirective('submenu');
      var ul = elm.next('ul');
      expect(ul.find('ul.dropdown-menu').length).toBe(2);
    });

  });

});

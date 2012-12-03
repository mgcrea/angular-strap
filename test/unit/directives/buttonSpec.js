'use strict';

describe('button', function () {
  var scope, $sandbox, $compile, $timeout;

  beforeEach(module('$strap.directives'));

  beforeEach(inject(function ($injector, $rootScope, _$compile_, _$timeout_) {
    scope = $rootScope;
    $compile = _$compile_;
    $timeout = _$timeout_;

    $sandbox = $('<div id="sandbox"></div>').appendTo($('body'));
    scope.model = {};
  }));

  afterEach(function() {
    $sandbox.remove();
    scope.$destroy();
  });

  var templates = {
    'default': '<div class="btn" ng-model="buttonValue" data-toggle="button" bs-button>'
  };

  function compileDirective(template) {
    template = template ? templates[template] : templates['default'];
    template = $(template).appendTo($sandbox);
    return $compile(template)(scope);
  }

  // Tests

  it('should remove "data-toggle" attr for you', function () {
    var elm = compileDirective();
    expect(elm.attr('data-toggle')).toBeUndefined();
  });

  describe('model change to view', function () {

    it('should add class', function () {
      var elm = compileDirective();
      scope.$apply(function () {
        scope.buttonValue = true;
      });
      expect(elm.hasClass('active')).toBe(true);
    });

    it('should remove class', function () {
      var elm = compileDirective();
      scope.$apply(function () {
        scope.buttonValue = false;
      });
      expect(elm.hasClass('active')).toBe(false);
    });
  });

  describe('view change to model', function () {

    it('should set model true on click', function () {
      var elm = compileDirective();
      expect(scope.buttonValue).toBeUndefined();
      elm.trigger('click');
      expect(scope.buttonValue).toBe(true);
    });

    it('should set model false on double-click', function () {
      var elm = compileDirective();
      expect(scope.buttonValue).toBeUndefined();
      elm.trigger('click');
      elm.trigger('click');
      expect(scope.buttonValue).toBe(false);
    });
  });
});

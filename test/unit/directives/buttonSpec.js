'use strict';

describe('button', function () {
  var elm, scope, $timeout;

  beforeEach(module('$bs.directives'));

  beforeEach(inject(function ($injector, $rootScope, $compile) {
    scope = $rootScope;
    elm = $compile(
      '<div class="btn" ng-model="buttonValue" bs-button>'
    )($rootScope);
  }));

  it('should add "data-toggle" attr for you', function () {
    expect(elm.attr('data-toggle') == 'button').toBe(true);
  });

  describe('model change to view', function () {
    it('should add class', function () {
      scope.$apply(function () {
        scope.buttonValue = true;
      });
      expect(elm.hasClass('active')).toBe(true);
    });

    it('should remove class', function () {
      scope.$apply(function () {
        scope.buttonValue = false;
      });
      expect(elm.hasClass('active')).toBe(false);
    });
  });

  describe('view change to model', function () {
    it('should set model true on click', function () {
      expect(scope.buttonValue).toBeUndefined();
      elm.trigger('click');
      expect(scope.buttonValue).toBe(true);
    });

    it('should set model false on double-click', function () {
      expect(scope.buttonValue).toBeUndefined();
      elm.trigger('click');
      elm.trigger('click');
      expect(scope.buttonValue).toBe(false);
    });
  });
});

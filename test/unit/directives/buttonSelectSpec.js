'use strict';

describe('buttonSelect', function () {
  var scope, $sandbox, $compile, $timeout;

  beforeEach(module('$strap.directives'));

  beforeEach(inject(function ($injector, $rootScope, _$compile_, _$timeout_) {
    scope = $rootScope;
    $compile = _$compile_;
    $timeout = _$timeout_;

    $sandbox = $('<div id="sandbox"></div>').appendTo($('body'));
    scope.buttonSelect = 'b';
  }));

  afterEach(function() {
    $sandbox.remove();
    scope.$destroy();
  });

  var templates = {
    'default': '<button type="button" class="btn" ng-model="buttonSelect" bs-button-select="[\'a\', \'b\', \'c\']"></button>'
  };

  function compileDirective(template) {
    template = template ? templates[template] : templates['default'];
    template = $(template).appendTo($sandbox);
    return $compile(template)(scope);
  }

  // Tests

  it('should set button text', function () {
    var elm = compileDirective();
    expect(elm.text()).toBe('b');
  });

  describe('model change to view', function () {

    it('should add class', function () {
      var elm = compileDirective();
      scope.$apply(function () {
        scope.buttonSelect = 'a';
      });
      expect(elm.text()).toBe('a');
    });

  });

  describe('view change to model', function () {

    it('should update model to next candidate on click', function () {
      var elm = compileDirective();
      expect(scope.buttonSelect).toBe('b');
      elm.trigger('click');
      expect(scope.buttonSelect).toBe('c');
      elm.trigger('click');
      expect(scope.buttonSelect).toBe('a');
    });

  });
});

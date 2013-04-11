'use strict';

describe('button', function () {
  var scope, $sandbox, $compile, $timeout, $q;

  beforeEach(module('$strap.directives'));

  beforeEach(function() {
    this.addMatchers({
      toEquals: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  beforeEach(inject(function ($injector, $rootScope, _$compile_, _$timeout_, _$q_) {
    scope = $rootScope;
    $compile = _$compile_;
    $timeout = _$timeout_;
    $q = _$q_;

    $sandbox = $('<div id="sandbox"></div>').appendTo($('body'));

    // Fix events not firing
    $(document)
      .off('click.button.data-api', '[data-toggle^=button]')
      .on('click.button.data-api', '[data-toggle^=button]', function (e) {
        var $btn = $(e.target);
        if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn');
        $btn.button('toggle');
      });

  }));

  afterEach(function() {
    $sandbox.remove();
    scope.$destroy();
  });

  var templates = {
    'default': {
      scope: {buttonValue: undefined},
      element: '<div class="btn" ng-model="buttonValue" data-toggle="button" bs-button>'
    },
    'promise': {
      scope: {},
      element: '<div class="btn" ng-model="buttonValue" data-toggle="button" bs-button>'
    },
    'checkbox': {
      scope: {checkbox: {left: false, middle: true, right: false}},
      element: '<div class="btn-group" bs-buttons-checkbox>'
      +   '<button type="button" class="btn" ng-model="checkbox.left">Left</button>'
      +   '<button type="button" class="btn" ng-model="checkbox.middle">Middle</button>'
      +   '<button type="button" class="btn" ng-model="checkbox.right">Right</button>'
      + '</div>'
    },
    'radio': {
      scope: {radio: {left: false, middle: true, right: false}},
      element: '<div class="btn-group" bs-buttons-radio>'
      +   '<button type="button" class="btn" ng-model="radio.left">Left</button>'
      +   '<button type="button" class="btn" ng-model="radio.middle">Middle</button>'
      +   '<button type="button" class="btn" ng-model="radio.right">Right</button>'
      + '</div>'
    },
    'radio-single-model': {
      scope: {radio: 'middle'},
      element: '<div class="btn-group" ng-model="radio" bs-buttons-radio>'
      +   '<button type="button" class="btn" value="left">Left</button>'
      +   '<button type="button" class="btn" value="middle">Middle</button>'
      +   '<button type="button" class="btn" value="right">Right</button>'
      + '</div>'
    }
  };

  function compileDirective(template) {
    template = template ? templates[template] : templates['default'];
    angular.extend(scope, template.scope);
    var $element = $(template.element).appendTo($sandbox);
    $element = $compile($element)(scope);
    scope.$digest();
    if(template === 'radio' || template === 'radio-single-model') {
      $timeout.flush();
    }
    return $element;
  }

  // Tests

  it('should add "data-toggle" attr for you', function () {
    var elm = compileDirective();
    expect(elm.attr('data-toggle')).toBe('button');
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

    it('should handle $q model', function () {
      var deferred = $q.defer();
      scope.buttonValue = deferred.promise;
      deferred.resolve(true);
      var elm = compileDirective('promise');
      expect(elm.hasClass('active')).toBe(true);
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

  describe('buttons checkbox', function () {

    it('should handle view to model changes', function () {
      var elm = compileDirective('checkbox');
      elm.find('[ng-model="checkbox.left"]').trigger('click');
      expect(scope.checkbox).toEquals({left: true, middle: true, right: false});
      elm.find('[ng-model="checkbox.left"]').trigger('click');
      expect(scope.checkbox).toEquals({left: false, middle: true, right: false});
    });

    it('should handle model to view changes', function () {
      var elm = compileDirective('checkbox');
      scope.$apply(function () {
        scope.checkbox = {left: true, middle: false, right: true};
      });
      expect(elm.find('[ng-model="checkbox.left"]').hasClass('active')).toBe(true);
      expect(elm.find('[ng-model="checkbox.middle"]').hasClass('active')).toBe(false);
      expect(elm.find('[ng-model="checkbox.right"]').hasClass('active')).toBe(true);
    });
  });

  describe('buttons radio', function () {

    it('should handle view to model changes', function () {
      var elm = compileDirective('radio');
      elm.find('[ng-model="radio.left"]').trigger('click');
      expect(scope.radio).toEquals({left: true, middle: false, right: false});
      elm.find('[ng-model="radio.left"]').trigger('click');
      expect(scope.radio).toEquals({left: true, middle: false, right: false});
    });

    it('should handle model to view changes', function () {
      var elm = compileDirective('radio');
      scope.$apply(function () {
        scope.radio = {left: false, middle: false, right: true};
      });
      expect(elm.find('[ng-model="radio.left"]').hasClass('active')).toBe(false);
      expect(elm.find('[ng-model="radio.middle"]').hasClass('active')).toBe(false);
      expect(elm.find('[ng-model="radio.right"]').hasClass('active')).toBe(true);
    });
  });

  describe('buttons radio single model', function () {

    it('should handle view to model changes', function () {
      var elm = compileDirective('radio-single-model');
      elm.find('[value="left"]').trigger('click');
      expect(scope.radio).toEquals('left');
      elm.find('[value="left"]').trigger('click');
      expect(scope.radio).toEquals('left');
    });

    it('should handle model to view changes', function () {
      var elm = compileDirective('radio-single-model');
      scope.$apply(function () {
        scope.radio = 'right';
      });
      expect(elm.find('[value="left"]').hasClass('active')).toBe(false);
      expect(elm.find('[value="middle"]').hasClass('active')).toBe(false);
      expect(elm.find('[value="right"]').hasClass('active')).toBe(true);
    });
  });

});

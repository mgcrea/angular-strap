'use strict';

describe('bs-checkbox', function () {

  var $compile, $q, $$rAF, scope, sandboxEl;

  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));
  beforeEach(module('mgcrea.ngStrap.button'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$q_, _$$rAF_) {
    scope = _$rootScope_;
    $$rAF = _$$rAF_;
    $compile = _$compile_;
    $q = _$q_;
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo('body');
  }));

  afterEach(function() {
    sandboxEl.remove();
    scope.$destroy();
  });

  var templates = {
    'checkbox-default': {
      element: '<label class="btn"><input type="checkbox" ng-model="checkbox.value" bs-checkbox>Foo</label>'
    },
    'checkbox-custom-boolean-values': {
      element: '<label class="btn"><input type="checkbox" ng-model="checkbox.value" data-true-value="true" data-false-value="false" bs-checkbox>Foo</label>'
    },
    'checkbox-custom-integer-values': {
      element: '<label class="btn"><input type="checkbox" ng-model="checkbox.value" data-true-value="1" data-false-value="0" bs-checkbox>Foo</label>'
    },
    'checkbox-custom-string-values': {
      element: '<label class="btn"><input type="checkbox" ng-model="checkbox.value" data-true-value="yes" data-false-value="no" bs-checkbox>Foo</label>'
    },
    'checkbox-custom-interpolated-values': {
      scope: {trueValue: 'yes', falseValue: 'no'},
      element: '<label class="btn"><input type="checkbox" ng-model="checkbox.value" data-true-value="{{ trueValue }}" data-false-value="{{ falseValue }}" bs-checkbox>Foo</label>'
    },
    'checkbox-button-markup': {
      element: '<button class="btn" ng-model="checkbox.value" data-true-value="1" data-false-value="0" bs-checkbox>Foo</button>'
    },
    'checkbox-div-markup': {
      element: '<div class="btn" ng-model="checkbox.value" data-true-value="yes" data-false-value="no" bs-checkbox>Foo</button>'
    },
    'checkbox-group': {
      element: '<div class="btn-group" ng-model="checkbox.value" bs-checkbox-group><label class="btn"><input type="checkbox" value="left">Left</label><label class="btn"><input type="checkbox" value="right">Right</label></div>'
    },
    'checkbox-with-ngrepeat': {
      scope: {items: [{value: 'left', label: 'Left'}, {value: 'right', label: 'Right'}]},
      element: '<div class="btn-group">' +
               '  <label class="btn" ng-repeat="item in items"><input type="checkbox" ng-model="checkbox.value[item.value]" value="{{ item.value }}" bs-checkbox>{{ item.label }}</label>' +
               '</div>'
    }
  };

  function compileDirective(template, locals) {
    template = templates[template];
    angular.extend(scope, template.scope, locals);
    var element = $(template.element).appendTo(sandboxEl);
    element = $compile(element)(scope);
    scope.$digest();
    $$rAF.flush();
    return jQuery(element[0]);
  }

  // Tests

  describe('model updates should correctly update the view', function () {

    it('with default model values', function () {
      var element = compileDirective('checkbox-default', {checkbox: {value: false}});
      expect(element).not.toHaveClass('active');
      expect(element.children('input').is(':checked')).toBeFalsy();
      scope.checkbox.value = true;
      scope.$digest();
      $$rAF.flush();
      expect(element).toHaveClass('active');
      expect(element.children('input').is(':checked')).toBeTruthy();
    });

    it('with custom boolean data-[true,false]-value', function () {
      var element = compileDirective('checkbox-custom-boolean-values', {checkbox: {value: true}});
      expect(element).toHaveClass('active');
      expect(element.children('input').is(':checked')).toBeTruthy();
      scope.checkbox.value = false;
      scope.$digest();
      $$rAF.flush();
      expect(element).not.toHaveClass('active');
      expect(element.children('input').is(':checked')).toBeFalsy();
    });

    it('with custom integer data-[true,false]-value', function () {
      var element = compileDirective('checkbox-custom-integer-values', {checkbox: {value: 1}});
      expect(element).toHaveClass('active');
      expect(element.children('input').is(':checked')).toBeTruthy();
      scope.checkbox.value = 0;
      scope.$digest();
      $$rAF.flush();
      expect(element).not.toHaveClass('active');
      expect(element.children('input').is(':checked')).toBeFalsy();
    });

    it('with custom string data-[true,false]-value', function () {
      var element = compileDirective('checkbox-custom-string-values', {checkbox: {value: 'yes'}});
      expect(element).toHaveClass('active');
      expect(element.children('input').is(':checked')).toBeTruthy();
      scope.checkbox.value = 'no';
      scope.$digest();
      $$rAF.flush();
      expect(element).not.toHaveClass('active');
      expect(element.children('input').is(':checked')).toBeFalsy();
    });

    it('with custom @-interpolated data-[true,false]-value', function () {
      var element = compileDirective('checkbox-custom-interpolated-values', {checkbox: {value: 'no'}});
      expect(element).not.toHaveClass('active');
      expect(element.children('input').is(':checked')).toBeFalsy();
      scope.checkbox.value = 'yes';
      scope.$digest();
      $$rAF.flush();
      expect(element).toHaveClass('active');
      expect(element.children('input').is(':checked')).toBeTruthy();
    });

    // @info dropped direct support in 1.2+
    /*it('with a promise-powered model', function () {
      var deferred = $q.defer();
      var element = compileDirective('checkbox-default', {checkbox: {value: deferred.promise}});
      expect(element).not.toHaveClass('active');
      expect(element.children('input').is(':checked')).toBeFalsy();
      deferred.resolve(true);
      scope.$digest();
      expect(element).toHaveClass('active');
      expect(element.children('input').is(':checked')).toBeTruthy();
    });*/

    it('with button.btn markup', function () {
      var element = compileDirective('checkbox-button-markup', {checkbox: {value: 0}});
      expect(element).not.toHaveClass('active');
      scope.checkbox.value = 1;
      scope.$digest();
      $$rAF.flush();
      expect(element).toHaveClass('active');
    });

    it('with div.btn markup', function () {
      var element = compileDirective('checkbox-div-markup', {checkbox: {value: 'yes'}});
      expect(element).toHaveClass('active');
      scope.checkbox.value = 'no';
      scope.$digest();
      $$rAF.flush();
      expect(element).not.toHaveClass('active');
    });

    it('with ngrepeat markup', function () {
      var element = compileDirective('checkbox-with-ngrepeat', {checkbox: {value: {left: false, right: true}}});
      var childInputs = element.find('input');
      expect(childInputs.eq(1).parent('label')).toHaveClass('active');
    });

  });

  describe('view updates should correctly update the model', function () {

    it('with default model values', function () {
      var element = compileDirective('checkbox-default', {checkbox: {value: false}});
      element.children('input').click();
      expect(scope.checkbox.value).toEqual(true);
      element.children('input').click();
      expect(scope.checkbox.value).toEqual(false);
    });

    it('with custom boolean data-[true,false]-value', function () {
      var element = compileDirective('checkbox-custom-boolean-values', {checkbox: {value: true}});
      element.children('input').click();
      expect(scope.checkbox.value).toEqual(false);
      element.children('input').click();
      expect(scope.checkbox.value).toEqual(true);
    });

    it('with custom integer data-[true,false]-value', function () {
      var element = compileDirective('checkbox-custom-integer-values', {checkbox: {value: 0}});
      element.children('input').click();
      expect(scope.checkbox.value).toEqual(1);
      element.children('input').click();
      expect(scope.checkbox.value).toEqual(0);
    });

    it('with custom string data-[true,false]-value', function () {
      var element = compileDirective('checkbox-custom-string-values', {checkbox: {value: 'yes'}});
      element.children('input').click();
      expect(scope.checkbox.value).toEqual('no');
      element.children('input').click();
      expect(scope.checkbox.value).toEqual('yes');
    });

    it('with custom @-interpolated data-[true,false]-value', function () {
      var element = compileDirective('checkbox-custom-interpolated-values', {checkbox: {value: 'no'}});
      element.children('input').click();
      expect(scope.checkbox.value).toEqual('yes');
      element.children('input').click();
      expect(scope.checkbox.value).toEqual('no');
    });

    it('with a promise-powered model', function () {
      var deferred = $q.defer();
      var element = compileDirective('checkbox-default', {checkbox: {value: deferred.promise}});
      element.children('input').click();
      expect(scope.checkbox.value).toEqual(true);
      element.children('input').click();
      expect(scope.checkbox.value).toEqual(false);
    });

  });

  describe('group directive should', function () {

    it('correctly compile the markup', function () {
      var element = compileDirective('checkbox-group', {checkbox: {value: {left: false, right: true}}});
      var firstChild = element.find('input').eq(0);
      expect(element.attr('data-toggle')).toBe('buttons');
      expect(firstChild.attr('ng-model')).toBe('checkbox.value.left');
      expect(firstChild.attr('bs-checkbox')).toBeDefined();
    });

    it('correctly link children directives', function () {
      var element = compileDirective('checkbox-group', {checkbox: {value: {left: false, right: true}}});
      var secondChild = element.find('input').eq(1);
      expect(secondChild.parent('label')).toHaveClass('active');
    });

  });

});

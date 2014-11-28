'use strict';

describe('bs-radio', function () {

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

  // Templates

  var templates = {
    'radio-default': {
      element: '<div class="btn-group">' +
               '  <label class="btn"><input type="radio" ng-model="radio.value" value="left" bs-radio>Left</label>' +
               '  <label class="btn"><input type="radio" ng-model="radio.value" value="right" bs-radio>Right</label>' +
               '</div>'
    },
    'radio-boolean-values': {
      element: '<div class="btn-group">' +
               '  <label class="btn"><input type="radio" ng-model="radio.value" value="true" bs-radio>True</label>' +
               '  <label class="btn"><input type="radio" ng-model="radio.value" value="false" bs-radio>False</label>' +
               '</div>'
    },
    'radio-integer-values': {
      element: '<div class="btn-group">' +
               '  <label class="btn"><input type="radio" ng-model="radio.value" value="1" bs-radio>One</label>' +
               '  <label class="btn"><input type="radio" ng-model="radio.value" value="0" bs-radio>Zero</label>' +
               '</div>'
    },
    'radio-interpolated-values': {
      scope: {trueValue: 'yes', falseValue: 'no'},
      element: '<div class="btn-group">' +
               '  <label class="btn"><input type="radio" ng-model="radio.value" value="{{ trueValue }}" bs-radio>Yes</label>' +
               '  <label class="btn"><input type="radio" ng-model="radio.value" value="{{ falseValue }}" bs-radio>No</label>' +
               '</div>'
    },
    'radio-ng-value': {
      scope: {trueValue: 'yes', falseValue: 'no'},
      element: '<div class="btn-group">' +
               '  <label class="btn"><input type="radio" ng-model="radio.value" ng-value="trueValue" bs-radio>Yes</label>' +
               '  <label class="btn"><input type="radio" ng-model="radio.value" ng-value="falseValue" bs-radio>No</label>' +
               '</div>'
    },
    'radio-button-markup': {
      element: '<div class="btn-group">' +
               '  <button type="button" class="btn" ng-model="radio.value" value="left" bs-radio>Left</button>' +
               '  <button type="button" class="btn" ng-model="radio.value" value="right" bs-radio>Right</button>' +
               '</div>'
    },
    'radio-div-markup': {
      element: '<div class="btn-group">' +
               '  <div class="btn" ng-model="radio.value" value="1" bs-radio>One</div>' +
               '  <div class="btn" ng-model="radio.value" value="0" bs-radio>Zero</div>' +
               '</div>'
    },
    'radio-group': {
      element: '<div class="btn-group" ng-model="radio.value" bs-radio-group>' +
               '  <label class="btn"><input type="radio" value="left">Left</label>' +
               '  <label class="btn"><input type="radio" value="right">Right</label>' +
               '</div>'
    },
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

    // @note In memory radio buttons are messed up in latest PhantomJS
    // https://github.com/ariya/phantomjs/issues/12039

    it('with string model values', function () {
      var element = compileDirective('radio-default', {radio: {value: 'right'}});
      var firstChild = element.children().eq(0), secondChild = element.children().eq(1);
      expect(firstChild).not.toHaveClass('active');
      // expect(firstChild.children('input').is(':checked')).toBeFalsy();
      expect(secondChild).toHaveClass('active');
      // expect(secondChild.children('input').is(':checked')).toBeTruthy();
      scope.radio.value = 'left';
      scope.$digest();
      $$rAF.flush();
      expect(firstChild).toHaveClass('active');
      // expect(firstChild.children('input').is(':checked')).toBeTruthy();
      expect(secondChild).not.toHaveClass('active');
      // expect(secondChild.children('input').is(':checked')).toBeFalsy();
    });

    it('with boolean model values', function () {
      var element = compileDirective('radio-boolean-values', {radio: {value: false}});
      var firstChild = element.children().eq(0), secondChild = element.children().eq(1);
      expect(firstChild).not.toHaveClass('active');
      // expect(firstChild.children('input').is(':checked')).toBeFalsy();
      expect(secondChild).toHaveClass('active');
      // expect(secondChild.children('input').is(':checked')).toBeTruthy();
      scope.radio.value = true;
      scope.$digest();
      $$rAF.flush();
      expect(firstChild).toHaveClass('active');
      // expect(firstChild.children('input').is(':checked')).toBeTruthy();
      expect(secondChild).not.toHaveClass('active');
      // expect(secondChild.children('input').is(':checked')).toBeFalsy();
    });

    it('with integer model values', function () {
      var element = compileDirective('radio-integer-values', {radio: {value: 1}});
      var firstChild = element.children().eq(0), secondChild = element.children().eq(1);
      expect(firstChild).toHaveClass('active');
      // expect(firstChild.children('input').is(':checked')).toBeTruthy();
      expect(secondChild).not.toHaveClass('active');
      // expect(secondChild.children('input').is(':checked')).toBeFalsy();
      scope.radio.value = 0;
      scope.$digest();
      $$rAF.flush();
      expect(firstChild).not.toHaveClass('active');
      // expect(firstChild.children('input').is(':checked')).toBeFalsy();
      expect(secondChild).toHaveClass('active');
      // expect(secondChild.children('input').is(':checked')).toBeTruthy();
    });

    it('with @-interpolated model values', function () {
      var element = compileDirective('radio-interpolated-values', {radio: {value: 'no'}});
      var firstChild = element.children().eq(0), secondChild = element.children().eq(1);
      expect(firstChild).not.toHaveClass('active');
      // expect(firstChild.children('input').is(':checked')).toBeFalsy();
      expect(secondChild).toHaveClass('active');
      // expect(secondChild.children('input').is(':checked')).toBeTruthy();
      scope.radio.value = 'yes';
      scope.$digest();
      $$rAF.flush();
      expect(firstChild).toHaveClass('active');
      // expect(firstChild.children('input').is(':checked')).toBeTruthy();
      expect(secondChild).not.toHaveClass('active');
      // expect(secondChild.children('input').is(':checked')).toBeFalsy();

      // Change true value
      scope.trueValue = 'completely different';
      scope.$digest();
      $$rAF.flush();

      expect(firstChild).not.toHaveClass('active');
      expect(secondChild).not.toHaveClass('active');

      // Match radio value to new true value
      scope.radio.value = scope.trueValue;
      scope.$digest();
      $$rAF.flush();

      expect(firstChild).toHaveClass('active');
      expect(secondChild).not.toHaveClass('active');
    });

    it('with ng-value interpolated values', function () {
      var element = compileDirective('radio-ng-value', {radio: {value: 'no'}});
      var firstChild = element.children().eq(0), secondChild = element.children().eq(1);
      expect(firstChild).not.toHaveClass('active');
      expect(secondChild).toHaveClass('active');
      scope.radio.value = 'yes';
      scope.$digest();
      $$rAF.flush();
      expect(firstChild).toHaveClass('active');
      expect(secondChild).not.toHaveClass('active');

      // Change true value
      scope.trueValue = 'completely different';
      scope.$digest();
      $$rAF.flush();

      expect(firstChild).not.toHaveClass('active');
      expect(secondChild).not.toHaveClass('active');

      // Match radio value to new true value
      scope.radio.value = scope.trueValue;
      scope.$digest();
      $$rAF.flush();

      expect(firstChild).toHaveClass('active');
      expect(secondChild).not.toHaveClass('active');
    });

    // @info dropped direct support in 1.2+
    /*it('with $q promises', function () {
      var deferred = $q.defer();
      var element = compileDirective('radio-default', {radio: {value: deferred.promise}});
      var firstChild = element.children().eq(0), secondChild = element.children().eq(1);
      expect(firstChild).not.toHaveClass('active');
      expect(firstChild.children('input').is(':checked')).toBeFalsy();
      expect(secondChild).not.toHaveClass('active');
      expect(secondChild.children('input').is(':checked')).toBeFalsy();
      deferred.resolve('left');
      scope.$digest();
      expect(firstChild).toHaveClass('active');
      expect(firstChild.children('input').is(':checked')).toBeTruthy();
      expect(secondChild).not.toHaveClass('active');
      expect(secondChild.children('input').is(':checked')).toBeFalsy();
    });*/

    it('with alternative button.btn markup', function () {
      var element = compileDirective('radio-button-markup', {radio: {value: 'left'}});
      var firstChild = element.children().eq(0), secondChild = element.children().eq(1);
      expect(firstChild).toHaveClass('active');
      expect(secondChild).not.toHaveClass('active');
      scope.radio.value = 'right';
      scope.$digest();
      $$rAF.flush();
      expect(firstChild).not.toHaveClass('active');
      expect(secondChild).toHaveClass('active');
    });

    it('with alternative div.btn markup', function () {
      var element = compileDirective('radio-div-markup', {radio: {value: 1}});
      var firstChild = element.children().eq(0), secondChild = element.children().eq(1);
      expect(firstChild).toHaveClass('active');
      expect(secondChild).not.toHaveClass('active');
      scope.radio.value = 0;
      scope.$digest();
      $$rAF.flush();
      expect(firstChild).not.toHaveClass('active');
      expect(secondChild).toHaveClass('active');
    });

  });

  describe('view updates should correctly update the model', function () {

    it('with string model values', function () {
      var element = compileDirective('radio-default', {radio: {value: 'right'}});
      var firstChild = element.children().eq(0);
      firstChild.children('input').click();
      expect(scope.radio.value).toEqual('left');
      firstChild.children('input').click();
      expect(scope.radio.value).toEqual('left');
    });

    it('with boolean model values', function () {
      var element = compileDirective('radio-boolean-values', {radio: {value: false}});
      var firstChild = element.children().eq(0);
      firstChild.children('input').click();
      expect(scope.radio.value).toEqual(true);
      firstChild.children('input').click();
      expect(scope.radio.value).toEqual(true);
    });

    it('with integer model values', function () {
      var element = compileDirective('radio-integer-values', {radio: {value: 1}});
      var secondChild = element.children().eq(1);
      secondChild.children('input').click();
      expect(scope.radio.value).toEqual(0);
      secondChild.children('input').click();
      expect(scope.radio.value).toEqual(0);
    });

    it('with @-interpolated model values', function () {
      var element = compileDirective('radio-interpolated-values', {radio: {value: 'no'}});
      var firstChild = element.children().eq(0);
      firstChild.children('input').click();
      expect(scope.radio.value).toEqual('yes');
      firstChild.children('input').click();
      expect(scope.radio.value).toEqual('yes');
    });

    // @info dropped direct support in 1.2+
    /*it('with $q promises', function () {
      var deferred = $q.defer();
      var element = compileDirective('radio-default', {radio: {value: deferred.promise}});
      var firstChild = element.children().eq(0);
      firstChild.children('input').click();
      expect(scope.radio.value).toEqual('left');
      firstChild.children('input').click();
      expect(scope.radio.value).toEqual('left');
    });*/

    it('with alternative button.btn markup', function () {
      var element = compileDirective('radio-button-markup', {radio: {value: 'left'}});
      var secondChild = element.children().eq(1);
      secondChild.click();
      expect(scope.radio.value).toEqual('right');
      secondChild.click();
      expect(scope.radio.value).toEqual('right');
    });

    it('with alternative div.btn markup', function () {
      var element = compileDirective('radio-div-markup', {radio: {value: 1}});
      var secondChild = element.children().eq(1);
      if(!/phantomjs/i.test(navigator.userAgent)) {
        // Won't work on PhantomJS 1.9.1, no clue why
        secondChild.click();
        expect(scope.radio.value).toEqual(0);
        secondChild.click();
        expect(scope.radio.value).toEqual(0);
      }
    });

  });

  describe('group directive should', function () {

    it('correctly compile the markup', function () {
      var element = compileDirective('radio-group', {radio: {value: 'right'}});
      var firstChild = element.find('input').eq(0);
      expect(element.attr('data-toggle')).toBe('buttons');
      expect(firstChild.attr('ng-model')).toBe('radio.value');
      expect(firstChild.attr('bs-radio')).toBeDefined();
    });

    it('correctly link children directives', function () {
      var element = compileDirective('radio-group', {radio: {value: 'right'}});
      var secondChild = element.find('input').eq(1);
      expect(secondChild.parent('label')).toHaveClass('active');
    });

  });

});

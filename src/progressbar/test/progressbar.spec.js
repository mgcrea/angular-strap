'use strict';

describe('progressbar', function () {
  beforeEach(module('mgcrea.ngStrap.progressbar'));

  var templates = {
    'default': {
      element: '<bs-progressbar animate="animate" type="{{type}}" value="value"><span>{{value}}%</span></bs-progressbar>',
      scope: {
        value: 50
      }
    }
  };
  var  scope, $compile;
  beforeEach(inject(function (_$compile_, $rootScope){
    $compile = _$compile_;
    scope = $rootScope.$new();
  }));

  afterEach(function() {
    scope.$destroy();
  });

  function compileDirective(template, locals) {
    template = templates[template];
    angular.extend(scope, angular.copy(template.scope || templates['default'].scope), locals);
    var element = $compile(template.element)(scope);
    scope.$digest();
    return jQuery(element[0]);
  }

  it("should correctly compile the inner content", function (){
    var element = compileDirective('default');
    expect(element.hasClass('progress')).toBe(true);

    var bar = element.children().eq(0);
    expect(bar.hasClass('progress-bar')).toBe(true);
    expect(bar.css('width')).toBe(scope.value + '%');
    expect(bar.attr('aria-valuenow')).toBe(scope.value.toString());
    expect(bar.attr('aria-valuemin')).toBe('0');
    expect(bar.attr('aria-valuemax')).toBe('100');

    var srValue = bar.children().eq(0);
    expect(srValue.text()).toBe(scope.value+'%');

    var transcludedElem = bar.children().eq(1);
    expect(transcludedElem.text()).toBe(scope.value+'%');
  });

  it("should update the progress bar width when the value is changed", function (){
    var element = compileDirective('default');
    var bar = element.children().eq(0);

    expect(bar.css('width')).toBe(scope.value + '%');
    scope.value = 10;
    scope.$digest();
    expect(bar.css('width')).toBe(scope.value + '%');
  });

  it("should disable css transitions if and only if animate is false", function (){
    scope.animate = false;
    var element = compileDirective('default');
    var bar = element.children().eq(0);
    // look for webkit transition because phantomjs doesn't support the "transition" css property
    expect(bar.css('webkit-transition')).toBe('none');

    scope.animate = true;
    scope.$digest();
    expect(bar.css('webkit-transition')).toBeFalsy();
  });

  it("should use the specified type of progress bar", function (){
    scope.type = 'success';
    var element = compileDirective('default');
    var bar = element.children().eq(0);

    expect(bar.hasClass('progress-bar-success')).toBe(true);

    scope.type = "info";
    scope.$digest();
    expect(bar.hasClass('progress-bar-info')).toBe(true);
    expect(bar.hasClass('progress-bar-success')).toBe(false);
  });
});

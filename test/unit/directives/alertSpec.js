'use strict';

describe('alert', function () {
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
      scope: {alert: {type:'error', title: 'Holy guacamole!', content: 'Hello Alert, <pre>2 + 3 = {{ 2 + 3 }}</pre>'}},
      element: '<div class="alert fade in" bs-alert="alert"></div>'
    }
  };

  function compileDirective(template) {
    template = template ? templates[template] : templates['default'];
    angular.extend(scope, template.scope || templates['default'].scope);
    var $element = $(template.element).appendTo($sandbox);
    $element = $compile($element)(scope);
    scope.$digest();
    return $element;
  }

  // Tests

  it('should correctly call $.fn.alert', function () {
    var spy = spyOn($.fn, 'alert').andCallThrough();
    var elm = compileDirective();
    expect(spy).toHaveBeenCalled();
  });

  it('should correctly build the alert', function () {
    var elm = compileDirective();
    expect(elm.data('alert')).toBeDefined();
    var expected = '<button type="button" class="close" data-dismiss="alert">×</button>' +
    '<strong class="ng-scope">Holy guacamole!</strong>' +
    '<span class="ng-scope">&nbsp;Hello Alert, </span><pre class="ng-scope ng-binding">2 + 3 = 5</pre>';
    expect(elm.html()).toBe(expected);
  });

  it('should correctly update the alert class', function () {
    var elm = compileDirective();
    scope.alert.type = 'info';
    scope.$digest();
    expect(elm.hasClass('error')).toBe(false);
    expect(elm.hasClass('info')).toBe(false);
  });

});

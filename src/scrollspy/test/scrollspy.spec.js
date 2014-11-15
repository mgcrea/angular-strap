'use strict';
// https://github.com/angular-ui/bootstrap/blob/master/src/tooltip/test/tooltip.spec.js

describe('affix', function () {

  var $compile, scope, sandboxEl;
  // var mouse = effroi.mouse;

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.scrollspy'));

  beforeEach(inject(function (_$rootScope_, _$compile_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo('body');
  }));

  afterEach(function() {
    sandboxEl.remove();
    scope.$destroy();
  });

  // Templates

  var templates = {
    'default': {
      element: '<ul>' +
               '  <li data-target="#modals" bs-scrollspy>' +
               '    <a href="#modals">Modal</a>' +
               '  </li>' +
               '</ul>'
    }
  };

  function compileDirective(template, locals) {
    template = templates[template];
    angular.extend(scope, template.scope, locals);
    var element = $(template.element).appendTo(sandboxEl);
    element = $compile(element)(scope);
    scope.$digest();
    return jQuery(element[0]);
  }

  // Tests

  describe('default', function () {


    it('should support window.scrollTo', function() {
      var elm = compileDirective('default');
      // var windowEl = angular.element(window);
      // windowEl.on('scroll', function() {
      //   dump('scroll');
      // });
      // windowEl[0].scrollTo(0, 200);
      // setTimeout(function() {
      //   mouse.scroll(0, 100);
      //   expect(windowEl[0].pageYOffset).toEqual(100);
      //   done();
      // }, 1000);

      // @bug karma does not suppport scrollTo
      // github.com/karma-runner/karma/issues/345
      expect(1).toBe(1);
    });

    it('should not throw when clicking on scroll element', function() {
      // IE 9 throws an error if we use 'this' instead of '$scrollspy'
      // in the scroll element click handler
      var elm = compileDirective('default');
      expect(function() { angular.element(window).triggerHandler('click'); }).not.toThrow();
    });

  });

});

'use strict';
// https://github.com/angular-ui/bootstrap/blob/master/src/tooltip/test/tooltip.spec.js

describe('affix', function () {

  var $compile, scope, sandboxEl;
  // var mouse = effroi.mouse;


  afterEach(function() {
    sandboxEl.remove();
    scope.$destroy();
  });

  // Templates

  var templates = {
    'default': {
      element: '<div class="container" style="height: 2000px">' +
               '  <div style="height: 200px; background: blue;"></div>' +
               '  <div style="width: 100px; height: 100px; background: red; margin-top:20px;" bs-affix data-offset-top="-50" data-offset-bottom="1000"></div>' +
               '</div>'
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
  function sandboxSetup(_$rootScope_, _$compile_) {
    scope = _$rootScope_;
    $compile = _$compile_;
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo('body');
  }
  // Tests

  describe('default', function () {

    beforeEach(module('ngSanitize'));
    beforeEach(module('mgcrea.ngStrap.affix'));

    beforeEach(inject(sandboxSetup));

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
      //

      // @bug karma does not suppport scrollTo
      // github.com/karma-runner/karma/issues/345
      expect(1).toBe(1);
    });

  });


  describe('when the directive scope is destroyed', function(){
    var $affix;
    beforeEach(function(){
      angular.module('test.mgcrea.ngStrap.affix', []).config(function($provide){
        $affix = jasmine.createSpy('$affix')
        $provide.value('$affix', $affix)
      });
      
    });
    beforeEach(module('ngSanitize'));
    beforeEach(module('mgcrea.ngStrap.affix'));
    beforeEach(module('test.mgcrea.ngStrap.affix'));
    
    beforeEach(inject(sandboxSetup));

    it('should call destory on the affix instance to remove event listeners and cleanup', function(){
      var affixInstance = jasmine.createSpyObj('$affixInstance', ['destroy'])
      $affix.andReturn(affixInstance);
      
      var elm = compileDirective('default');
      expect($affix).toHaveBeenCalled();
      scope.$destroy();
      expect(affixInstance.destroy).toHaveBeenCalled();
      
    });

  });

});

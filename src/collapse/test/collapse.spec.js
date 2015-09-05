'use strict';

describe('collapse', function () {

  var $compile, $templateCache, $animate, scope, sandboxEl;

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.collapse'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_, _$animate_) {
    scope = _$rootScope_.$new();
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo($('body'));
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    $animate = _$animate_;
  }));

  afterEach(function() {
    scope.$destroy();
    sandboxEl.remove();
  });

  // Templates
// '<div class="panel-group" bs-collapse><div class="panel panel-default" ng-repeat="panel in panels"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-1</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-1</div></div></div></div>'


  var templates = {
    'default': {
      element: '<div class="panel-group" bs-collapse><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-1</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-1</div></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-2</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-2</div></div></div></div>'
    },
    'jade-attributes': {
      element: '<div class="panel-group" bs-collapse="bs-collapse"><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle="bs-collapse-toggle">title-1</a></h4></div><div class="panel-collapse" bs-collapse-target="bs-collapse-target"><div class="panel-body">content-1</div></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle="bs-collapse-toggle">title-2</a></h4></div><div class="panel-collapse" bs-collapse-target="bs-collapse-target"><div class="panel-body">content-2</div></div></div></div>'
    },
    'template-ngRepeat': {
      scope: {panels: [
        {title:'Collapsible Group Item #1', body: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch.'},
        {title:'Collapsible Group Item #2', body: 'Food truck fixie locavore, accusamus mcsweeney\'s marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee.'},
        {title:'Collapsible Group Item #3', body: 'Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney\'s organic lomo retro fanny pack lo-fi farm-to-table readymade.'}
      ]},
      element: '<div class="panel-group" bs-collapse><div class="panel panel-default" ng-repeat="panel in panels"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-1</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-1</div></div></div></div>'
    },
    'template-ngRepeat-ngModel': {
      scope: {panels: [
        {title:'Collapsible Group Item #1', body: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch.'},
        {title:'Collapsible Group Item #2', body: 'Food truck fixie locavore, accusamus mcsweeney\'s marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee.'},
        {title:'Collapsible Group Item #3', body: 'Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney\'s organic lomo retro fanny pack lo-fi farm-to-table readymade.'}
      ], panel: {active: 1}},
      element: '<div class="panel-group" ng-model="panel.active" bs-collapse><div class="panel panel-default" ng-repeat="panel in panels"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-1</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-1</div></div></div></div>'
    },
    'binding-ngModel': {
      scope: {panel: {active: 1}},
      element: '<div class="panel-group" ng-model="panel.active" bs-collapse><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-1</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-1</div></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-2</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-2</div></div></div></div>'
    },
    'options-animation': {
      element: '<div data-animation="am-flip-x" class="panel-group" bs-collapse><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-1</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-1</div></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-2</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-2</div></div></div></div>'
    },
    'options-activeClass': {
      element: '<div data-active-class="active" class="panel-group" bs-collapse><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-1</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-1</div></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-2</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-2</div></div></div></div>'
    },
    // Note: for some reason, attributes send to a controller (as is the case in collapse) are NOT interpolated. Thus we can't do our usual:
    // data-disallow-toggle="{{disallowToggle}}", as the value received in the controller will be "{{disallowToggle}}" instead of the scope's value
    'options-disallowToggle-true': {
      element: '<div data-disallow-toggle="true" class="panel-group" bs-collapse><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-1</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-1</div></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-2</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-2</div></div></div></div>'
    },
    'options-disallowToggle-false': {
      element: '<div data-disallow-toggle="false" class="panel-group" bs-collapse><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-1</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-1</div></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-2</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-2</div></div></div></div>'
    },
    'options-startCollapsed-true': {
      element: '<div data-start-collapsed="true" class="panel-group" bs-collapse><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-1</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-1</div></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-2</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-2</div></div></div></div>'
    },
    'options-startCollapsed-false': {
      element: '<div data-start-collapsed="false" class="panel-group" bs-collapse><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-1</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-1</div></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-2</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-2</div></div></div></div>'
    },
    'default-multiple-true': {
      element: '<div class="panel-group" data-allow-multiple="true" bs-collapse><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-1</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-1</div></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-2</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-2</div></div></div></div>'
    },
    'default-multiple-false': {
      element: '<div class="panel-group" data-allow-multiple="false" bs-collapse><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-1</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-1</div></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-2</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-2</div></div></div></div>'
    },
    'binding-ngModel-multiple': {
      scope: {panel: {active: [1]}},
      element: '<div class="panel-group" data-allow-multiple="true" ng-model="panel.active" bs-collapse><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-1</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-1</div></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-2</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-2</div></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-3</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-3</div></div></div></div>'
    },
    'options-activeClass-multiple': {
      element: '<div data-active-class="active" data-allow-multiple="true" class="panel-group" bs-collapse><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-1</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-1</div></div></div><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a bs-collapse-toggle>title-2</a></h4></div><div class="panel-collapse" bs-collapse-target><div class="panel-body">content-2</div></div></div></div>'
    },
  };

  function compileDirective(template, locals) {
    template = templates[template];
    angular.extend(scope, angular.copy(template.scope || templates['default'].scope), locals);
    var element = $(template.element).appendTo(sandboxEl);
    element = $compile(element)(scope);
    scope.$digest();
    return jQuery(element[0]);
  }

  // Tests

  describe('with default template', function () {

    it('should navigate between panels on click', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeTruthy();
      sandboxEl.find('[bs-collapse-toggle]:eq(1)').triggerHandler('click');
      expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeFalsy();
      expect(sandboxEl.find('[bs-collapse-target]:eq(1)').hasClass('in')).toBeTruthy();
      sandboxEl.find('[bs-collapse-toggle]:eq(1)').triggerHandler('click');
      expect(sandboxEl.find('[bs-collapse-target]:eq(1)').hasClass('in')).toBeFalsy();
    });

  });

  describe('with jade-like template', function () {

    it('should navigate between panels on click', function() {
      var elm = compileDirective('jade-attributes');
      expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeTruthy();
      sandboxEl.find('[bs-collapse-toggle]:eq(1)').triggerHandler('click');
      expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeFalsy();
      expect(sandboxEl.find('[bs-collapse-target]:eq(1)').hasClass('in')).toBeTruthy();
      sandboxEl.find('[bs-collapse-toggle]:eq(1)').triggerHandler('click');
      expect(sandboxEl.find('[bs-collapse-target]:eq(1)').hasClass('in')).toBeFalsy();
    });

  });

  describe('with ngRepeat template', function () {

    it('should navigate between panels on click', function() {
      var elm = compileDirective('template-ngRepeat');
      expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeTruthy();
      sandboxEl.find('[bs-collapse-toggle]:eq(1)').triggerHandler('click');
      expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeFalsy();
      expect(sandboxEl.find('[bs-collapse-target]:eq(1)').hasClass('in')).toBeTruthy();
    });

    it('should reset collapse toogles/targets when ngRepeat source changes', function() {
      var elm = compileDirective('template-ngRepeat-ngModel');
      expect(scope.panels.length).toBe(3);
      expect(scope.panel.active).toBe(1);

      scope.panels = [
        {title:'Collapsible Group Item #1', body: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch.'},
        {title:'Collapsible Group Item #2', body: 'Food truck fixie locavore, accusamus mcsweeney\'s marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee.'},
        {title:'Collapsible Group Item #3', body: 'Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney\'s organic lomo retro fanny pack lo-fi farm-to-table readymade.'}
      ];

      scope.$digest();
      sandboxEl.find('[bs-collapse-toggle]:eq(2)').triggerHandler('click');
      expect(scope.panels.length).toBe(3);
      expect(scope.panel.active).toBe(2);
    });

  });

  describe('data-binding', function() {

    it('should correctly apply model changes to the view', function() {
      var elm = compileDirective('binding-ngModel');
      expect(scope.panel.active).toBe(1);
      expect(sandboxEl.find('[bs-collapse-target].in').parent('.panel-default').index()).toBe(scope.panel.active);
      scope.panel.active = 0;
      scope.$digest();
      expect(sandboxEl.find('[bs-collapse-target].in').parent('.panel-default').index()).toBe(scope.panel.active);
    });

    it('should correctly apply view changes to the model', function() {
      var elm = compileDirective('binding-ngModel');
      expect(scope.panel.active).toBe(1);
      sandboxEl.find('[bs-collapse-toggle]:eq(0)').triggerHandler('click');
      expect(scope.panel.active).toBe(0);
    });

    it('should correctly apply model when initial binding value equals default view value', function() {
      var elm = compileDirective('binding-ngModel', { panel: { active: 0 } });
      expect(scope.panel.active).toBe(0);
    });

  });

  describe('options', function () {

    describe('animation', function () {

      it('should default to `am-collapse` animation', function() {
        var elm = compileDirective('default');
        expect(sandboxEl.find('[bs-collapse-target]').hasClass('am-collapse')).toBeTruthy();
      });

      it('should support custom animation', function() {
        var elm = compileDirective('options-animation');
        expect(sandboxEl.find('[bs-collapse-target]').hasClass('am-flip-x')).toBeTruthy();
      });

    });

    describe('activeClass', function () {

      it('should support custom activeClass', function() {
        var elm = compileDirective('options-activeClass');
        expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeFalsy();
        expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('active')).toBeTruthy();
        sandboxEl.find('[bs-collapse-toggle]:eq(1)').triggerHandler('click');
        expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('active')).toBeFalsy();
        expect(sandboxEl.find('[bs-collapse-target]:eq(1)').hasClass('active')).toBeTruthy();
      });

    });

    describe('disallowToggle', function () {

      it('should support disallowToggle flag if true', function() {
        var elm = compileDirective('options-disallowToggle-true');
        var $heading = sandboxEl.find('a[bs-collapse-toggle]:eq(0)');
        var $target = sandboxEl.find('[bs-collapse-target]:eq(0)');
        expect($target.hasClass('in')).toBeTruthy();
        $heading.triggerHandler('click');
        expect($target.hasClass('in')).toBeTruthy();
      });

      it('should NOT support disallowToggle flag if false', function() {
        var elm = compileDirective('options-disallowToggle-false');
        var $heading = sandboxEl.find('a[bs-collapse-toggle]:eq(0)');
        var $target = sandboxEl.find('[bs-collapse-target]:eq(0)');
        expect($target.hasClass('in')).toBeTruthy();
        $heading.triggerHandler('click');
        expect($target.hasClass('in')).toBeFalsy();
      });

    });

    describe('startCollapsed', function () {

      it('should support startCollapsed flag when true', function() {
        var elm = compileDirective('options-startCollapsed-true');
        expect(sandboxEl.find('[bs-collapse-target]').hasClass('in')).toBeFalsy();
        sandboxEl.find('[bs-collapse-toggle]:eq(0)').triggerHandler('click');
        expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeTruthy();
        sandboxEl.find('[bs-collapse-toggle]:eq(0)').triggerHandler('click');
        expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeFalsy();
      });

      it('should NOT support startCollapsed flag when false', function() {
        var elm = compileDirective('options-startCollapsed-false');
        expect(sandboxEl.find('[bs-collapse-target]').hasClass('in')).toBeTruthy();
        sandboxEl.find('[bs-collapse-toggle]:eq(0)').triggerHandler('click');
        expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeFalsy();
        sandboxEl.find('[bs-collapse-toggle]:eq(0)').triggerHandler('click');
        expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeTruthy();
      });

    });

    describe('allowMultiple', function() {

      describe('with default template', function () {

        it('should open each panel on click when allowMultiple is true', function() {
          var elm = compileDirective('default-multiple-true');
          expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeTruthy();
          expect(sandboxEl.find('[bs-collapse-target]:eq(1)').hasClass('in')).toBeFalsy();
          sandboxEl.find('[bs-collapse-toggle]:eq(1)').triggerHandler('click');
          expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeTruthy();
          expect(sandboxEl.find('[bs-collapse-target]:eq(1)').hasClass('in')).toBeTruthy();
          sandboxEl.find('[bs-collapse-toggle]:eq(1)').triggerHandler('click');
          expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeTruthy();
          expect(sandboxEl.find('[bs-collapse-target]:eq(1)').hasClass('in')).toBeFalsy();
        });

        it('should open each panel on click when allowMultiple is false', function() {
          var elm = compileDirective('default-multiple-false');
          expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeTruthy();
          expect(sandboxEl.find('[bs-collapse-target]:eq(1)').hasClass('in')).toBeFalsy();
          sandboxEl.find('[bs-collapse-toggle]:eq(1)').triggerHandler('click');
          expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeFalsy();
          expect(sandboxEl.find('[bs-collapse-target]:eq(1)').hasClass('in')).toBeTruthy();
        });

      });

      describe('data-binding', function() {

        it('should correctly apply initial model values', function() {
          var elm = compileDirective('binding-ngModel-multiple', { panel: { active: [1,2] } });
          expect(scope.panel.active).toEqual([1,2]);
          expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeFalsy();
          expect(sandboxEl.find('[bs-collapse-target]:eq(1)').hasClass('in')).toBeTruthy();
          expect(sandboxEl.find('[bs-collapse-target]:eq(2)').hasClass('in')).toBeTruthy();
        });

        it('should correctly apply model changes to the view', function() {
          var elm = compileDirective('binding-ngModel-multiple');
          expect(scope.panel.active).toEqual([1]);
          expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeFalsy();
          expect(sandboxEl.find('[bs-collapse-target]:eq(1)').hasClass('in')).toBeTruthy();
          expect(sandboxEl.find('[bs-collapse-target]:eq(2)').hasClass('in')).toBeFalsy();
          scope.panel.active = [0,2];
          scope.$digest();
          expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeTruthy();
          expect(sandboxEl.find('[bs-collapse-target]:eq(1)').hasClass('in')).toBeFalsy();
          expect(sandboxEl.find('[bs-collapse-target]:eq(2)').hasClass('in')).toBeTruthy();
        });

        it('should correctly apply view changes to the model', function() {
          var outerModel = [1];
          var elm = compileDirective('binding-ngModel-multiple', {panel: {active: outerModel}});
          expect(scope.panel.active).toEqual([1]);
          sandboxEl.find('[bs-collapse-toggle]:eq(0)').triggerHandler('click');
          expect(scope.panel.active).toEqual([1,0]);
          expect(scope.panel.active).toEqual(outerModel);
        });

      });

      describe('activeClass', function () {

        it('should support custom activeClass', function() {
          var elm = compileDirective('options-activeClass-multiple');
          expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeFalsy();
          expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('active')).toBeTruthy();
          sandboxEl.find('[bs-collapse-toggle]:eq(1)').triggerHandler('click');
          expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('in')).toBeFalsy();
          expect(sandboxEl.find('[bs-collapse-target]:eq(0)').hasClass('active')).toBeTruthy();
          expect(sandboxEl.find('[bs-collapse-target]:eq(1)').hasClass('in')).toBeFalsy();
          expect(sandboxEl.find('[bs-collapse-target]:eq(1)').hasClass('active')).toBeTruthy();
        });

      });

    })

  });

});

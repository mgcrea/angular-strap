'use strict';

describe('tab', function () {

  var $compile, $templateCache, scope, sandboxEl;

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.tab'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_) {
    scope = _$rootScope_.$new();
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo($('body'));
    $compile = _$compile_;
    $templateCache = _$templateCache_;
  }));

  afterEach(function() {
    scope.$destroy();
    sandboxEl.remove();
  });

  // Templates

  var templates = {
    'default': {
      element: '<div bs-tabs><div data-title="title-1" bs-pane>content-1</div><div data-title="title-2" bs-pane>content-2</div></div>'
    },
    'defaultNested': {
      element: '<div bs-tabs><div data-title="title-1" bs-pane><div bs-tabs><div data-title="title-nested-11" bs-pane>content-nested-11</div><div data-title="title-nested-12" bs-pane>content-nested-12</div></div></div><div data-title="title-2" bs-pane><div bs-tabs><div data-title="title-nested-21" bs-pane>content-nested-21</div><div data-title="title-nested-22" bs-pane>content-nested-22</div></div></div></div>'
    },
    'template-ngRepeat': {
      scope: {tabs: [
        {title:'Home', content: 'Raw denim you probably haven\'t heard of...'},
        {title:'Profile', content: 'Food truck fixie locavore...'},
        {title:'About', content: 'Etsy mixtape wayfarers...'}
      ]},
      element: '<div bs-tabs><div ng-repeat="tab in tabs" data-title="{{ tab.title }}" ng-bind="tab.content" bs-pane></div>'
    },
    'binding-ngModel': {
      scope: {tab: {active: 1}},
      element: '<div ng-model="tab.active" bs-tabs><div data-title="title-1" bs-pane>content-1</div><div data-title="title-2" bs-pane>content-2</div></div>'
    },
    'binding-named-ngModel': {
      scope: {tab: {active: 'title-1'}},
      element: '<div ng-model="tab.active" bs-tabs><div data-title="title-1" name="title-1" bs-pane>content-1</div><div data-title="title-2" name="title-2" bs-pane>content-2</div></div>'
    },
    'template-ngModel-ngRepeat': {
      scope: {
        tab: {active: 1},
        tabs: [
          {title:'Home', content: 'Raw denim you probably haven\'t heard of...'},
          {title:'Profile', content: 'Food truck fixie locavore...'},
          {title:'About', content: 'Etsy mixtape wayfarers...'}
      ]},
      element: '<div ng-model="tab.active" bs-tabs><div ng-repeat="tab in tabs" data-title="{{ tab.title }}" ng-bind="tab.content" bs-pane></div>'
    },
    'binding-named-bsActivePane': {
      scope: {tab: {active: 'title-1'}},
      element: '<div bs-active-pane="tab.active" bs-tabs><div data-title="title-1" name="title-1" bs-pane>content-1</div><div data-title="title-2" name="title-2" bs-pane>content-2</div></div>'
    },
    'binding-bsActivePane': {
      scope: {tab: {active: 1}},
      element: '<div bs-active-pane="tab.active" bs-tabs><div data-title="title-1" bs-pane>content-1</div><div data-title="title-2" bs-pane>content-2</div></div>'
    },
    'template-bsActivePane-ngRepeat': {
      scope: {
        tab: {active: 1},
        tabs: [
          {title:'Home', content: 'Raw denim you probably haven\'t heard of...'},
          {title:'Profile', content: 'Food truck fixie locavore...'},
          {title:'About', content: 'Etsy mixtape wayfarers...'}
      ]},
      element: '<div bs-active-pane="tab.active" bs-tabs><div ng-repeat="tab in tabs" data-title="{{ tab.title }}" ng-bind="tab.content" bs-pane></div>'
    },
    'options-animation': {
      element: '<div data-animation="am-flip-x" bs-tabs><div data-title="title-1" bs-pane>content-1</div><div data-title="title-2" bs-pane>content-2</div></div>'
    },
    'options-template': {
      element: '<div data-template="custom" bs-tabs><div data-title="title-1" bs-pane>content-1</div><div data-title="title-2" bs-pane>content-2</div></div>'
    },
    'options-navClass': {
      element: '<div data-nav-class="nav-pills nav-stacked" bs-tabs><div data-title="title-1" bs-pane>content-1</div><div data-title="title-2" bs-pane>content-2</div></div>'
    },
    'options-activeClass': {
      element: '<div data-active-class="in" bs-tabs><div data-title="title-1" bs-pane>content-1</div><div data-title="title-2" bs-pane>content-2</div></div>'
    },
    'pane-options-disabled': {
      element: '<div bs-tabs><div data-title="title-1" bs-pane>content-1</div><div data-title="title-2" bs-pane disabled="true">content-2</div></div>'
    }
  };

  function compileDirective(template, locals) {
    template = templates[template];
    angular.extend(scope, angular.copy(template.scope) || angular.copy(templates['default'].scope), locals);
    var element = $(template.element).appendTo(sandboxEl);
    element = $compile(element)(scope);
    scope.$digest();
    return jQuery(element[0]);
  }

  // Tests

  describe('with default template', function () {

    it('should correctly compile inner content', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.find('.nav-tabs > li').length).toBe(2);
      expect(sandboxEl.find('.nav-tabs > li:eq(0)').text()).toBe('title-1');
      expect(sandboxEl.find('.tab-content > .tab-pane').length).toBe(2);
      expect(sandboxEl.find('.tab-content > .tab-pane:eq(0)').text()).toBe('content-1');
    });

    it('should navigate between panes on click', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.find('.nav-tabs > li.active').text()).toBe('title-1');
      expect(sandboxEl.find('.tab-content > .tab-pane.active').text()).toBe('content-1');
      sandboxEl.find('.nav-tabs > li:eq(1) > a').triggerHandler('click');
      expect(sandboxEl.find('.nav-tabs > li.active').text()).toBe('title-2');
      expect(sandboxEl.find('.tab-content > .tab-pane.active').text()).toBe('content-2');
      sandboxEl.find('.nav-tabs > li:eq(0) > a').triggerHandler('click');
      expect(sandboxEl.find('.nav-tabs > li.active').text()).toBe('title-1');
      expect(sandboxEl.find('.tab-content > .tab-pane.active').text()).toBe('content-1');
    });

  });

  describe('with nested default template', function () {

    it('should correctly compile inner content', function() {
      var elm = compileDirective('defaultNested');
      expect(sandboxEl.find('.nav-tabs:first > li').length).toBe(2);
      expect(sandboxEl.find('.nav-tabs:first > li:eq(0)').text()).toBe('title-1');
      expect(sandboxEl.find('.tab-content:first > .tab-pane').length).toBe(2);
      expect(sandboxEl.find('.tab-content:first > .tab-pane:eq(0) .tab-content:first > .tab-pane:eq(0)').text()).toBe('content-nested-11');
    });

    it('should navigate between panes on click', function() {
      var elm = compileDirective('defaultNested');
      expect(sandboxEl.find('.nav-tabs:first > li.active').text()).toBe('title-1');
      expect(sandboxEl.find('.tab-content:first > .tab-pane.active .tab-content:first > .tab-pane.active').text()).toBe('content-nested-11');
      sandboxEl.find('.nav-tabs:first > li:eq(1) > a').triggerHandler('click');
      expect(sandboxEl.find('.nav-tabs:first > li.active').text()).toBe('title-2');
      expect(sandboxEl.find('.tab-content:first > .tab-pane.active .tab-content:first > .tab-pane.active').text()).toBe('content-nested-21');
      sandboxEl.find('.nav-tabs:first > li:eq(0) > a').triggerHandler('click');
      expect(sandboxEl.find('.nav-tabs:first > li.active').text()).toBe('title-1');
      expect(sandboxEl.find('.tab-content:first > .tab-pane.active .tab-content:first > .tab-pane.active ').text()).toBe('content-nested-11');
    });

    it('should navigate between nested panes on click', function() {
      var elm = compileDirective('defaultNested');
      sandboxEl.find('.tab-content:first > .tab-pane.active .nav-tabs > li:eq(1) > a').triggerHandler('click');
      expect(sandboxEl.find('.tab-content:first > .tab-pane.active .nav-tabs > li.active').text()).toBe('title-nested-12');
      expect(sandboxEl.find('.tab-content:first > .tab-pane.active .tab-content:first > .tab-pane.active').text()).toBe('content-nested-12');
      sandboxEl.find('.tab-content:first > .tab-pane.active .nav-tabs > li:eq(0) > a').triggerHandler('click');
      expect(sandboxEl.find('.tab-content:first > .tab-pane.active .nav-tabs > li.active').text()).toBe('title-nested-11');
      expect(sandboxEl.find('.tab-content:first > .tab-pane.active .tab-content:first > .tab-pane.active').text()).toBe('content-nested-11');
    });

  });

  describe('with ngRepeat template', function () {

    it('should correctly compile inner content', function() {
      var elm = compileDirective('template-ngRepeat');
      expect(sandboxEl.find('.nav-tabs > li').length).toBe(scope.tabs.length);
      expect(sandboxEl.find('.nav-tabs > li:eq(0)').text()).toBe(scope.tabs[0].title);
      expect(sandboxEl.find('.tab-content > .tab-pane').length).toBe(scope.tabs.length);
      expect(sandboxEl.find('.tab-content > .tab-pane:eq(0)').text()).toBe(scope.tabs[0].content);
    });

    it('should navigate between panes on click', function() {
      var elm = compileDirective('template-ngRepeat');
      expect(sandboxEl.find('.nav-tabs > li.active').text()).toBe(scope.tabs[0].title);
      expect(sandboxEl.find('.tab-content > .tab-pane.active').text()).toBe(scope.tabs[0].content);
      sandboxEl.find('.nav-tabs > li:eq(1) > a').triggerHandler('click');
      expect(sandboxEl.find('.nav-tabs > li.active').text()).toBe(scope.tabs[1].title);
      expect(sandboxEl.find('.tab-content > .tab-pane.active').text()).toBe(scope.tabs[1].content);
      sandboxEl.find('.nav-tabs > li:eq(0) > a').triggerHandler('click');
      expect(sandboxEl.find('.nav-tabs > li.active').text()).toBe(scope.tabs[0].title);
      expect(sandboxEl.find('.tab-content > .tab-pane.active').text()).toBe(scope.tabs[0].content);
    });

    it('should add pane dynamically', function() {
      var elm = compileDirective('template-ngRepeat');
      expect(sandboxEl.find('.nav-tabs > li').length).toBe(scope.tabs.length);
      expect(sandboxEl.find('.tab-content > .tab-pane').length).toBe(scope.tabs.length);
      scope.tabs.push({title:'New Tab', content: 'New tab content...'});
      scope.$digest();
      expect(sandboxEl.find('.nav-tabs > li').length).toBe(scope.tabs.length);      
      expect(sandboxEl.find('.tab-content > .tab-pane').length).toBe(scope.tabs.length);
    });

    it('should remove tab dynamically', function() {
      var elm = compileDirective('template-ngRepeat');
      expect(sandboxEl.find('.nav-tabs > li').length).toBe(scope.tabs.length);
      scope.tabs.pop();
      scope.$digest();
      expect(sandboxEl.find('.nav-tabs > li').length).toBe(scope.tabs.length);      
    });

  });

  describe('data-binding', function() {

    function executeDataBindingTests(bindingAttribute) {

      it('should correctly apply model changes to the view', function() {
        var elm = compileDirective('binding-' + bindingAttribute);
        expect(sandboxEl.find('.nav-tabs > li.active').index()).toBe(scope.tab.active);
        expect(sandboxEl.find('.tab-content > .tab-pane.active').index()).toBe(scope.tab.active);
        scope.tab.active = 0;
        scope.$digest();
        expect(sandboxEl.find('.nav-tabs > li.active').index()).toBe(scope.tab.active);
        expect(sandboxEl.find('.tab-content > .tab-pane.active').index()).toBe(scope.tab.active);
      });

      it('should correctly apply view changes to the model', function() {
        var elm = compileDirective('binding-' + bindingAttribute);
        sandboxEl.find('.nav-tabs > li:eq(0) > a').triggerHandler('click');
        expect(scope.tab.active).toBe(0);
      });

      it('should set active tab by name', function() {
        var elm = compileDirective('binding-named-' + bindingAttribute, {tab: {active: 'title-2'}});
        expect(sandboxEl.find('.nav-tabs > li.active').index()).toBe(1);
        expect(sandboxEl.find('.tab-content > .tab-pane.active').attr('name')).toBe('title-2');
      });

      it('should set tab name into model if it is provided', function() {
        var elm = compileDirective('binding-named-' + bindingAttribute);
        sandboxEl.find('.nav-tabs > li:eq(1) > a').triggerHandler('click');
        expect(scope.tab.active).toBe('title-2');
      });

      it('should keep active pane when adding a new pane after', function() {
        var elm = compileDirective('template-' + bindingAttribute + '-ngRepeat');
        expect(sandboxEl.find('.nav-tabs > li.active').index()).toBe(1);
        scope.tabs.push({title:'New Tab', content: 'New tab content...'});
        scope.$digest();
        expect(sandboxEl.find('.nav-tabs > li').length).toBe(4);
        expect(sandboxEl.find('.nav-tabs > li.active').index()).toBe(1);
      });

      it('should keep active pane when removing another pane before', function() {
        var elm = compileDirective('template-' + bindingAttribute + '-ngRepeat');
        expect(sandboxEl.find('.nav-tabs > li.active').index()).toBe(1);
        scope.tabs.shift();
        scope.$digest();
        expect(sandboxEl.find('.nav-tabs > li').length).toBe(2);
        expect(sandboxEl.find('.nav-tabs > li.active').index()).toBe(0);
      });

      it('should keep active pane when removing another pane after', function() {
        var elm = compileDirective('template-' + bindingAttribute + '-ngRepeat');
        expect(sandboxEl.find('.nav-tabs > li.active').index()).toBe(1);
        scope.tabs.pop();
        scope.$digest();
        expect(sandboxEl.find('.nav-tabs > li').length).toBe(2);
        expect(sandboxEl.find('.nav-tabs > li.active').index()).toBe(1);
      });

      it('should keep active pane index when removing selected pane', function() {
        var elm = compileDirective('template-' + bindingAttribute + '-ngRepeat');
        expect(sandboxEl.find('.nav-tabs > li.active').index()).toBe(1);
        scope.tabs.splice(1, 1);
        scope.$digest();
        expect(sandboxEl.find('.nav-tabs > li').length).toBe(2);
        expect(sandboxEl.find('.nav-tabs > li.active').index()).toBe(1);
      });

      it('should select previous pane when removed selected pane is last', function() {
        var elm = compileDirective('template-' + bindingAttribute + '-ngRepeat', {tab: {active: 2}});
        expect(sandboxEl.find('.nav-tabs > li.active').index()).toBe(2);
        scope.tabs.pop();
        scope.$digest();
        expect(sandboxEl.find('.nav-tabs > li').length).toBe(2);
        expect(sandboxEl.find('.nav-tabs > li.active').index()).toBe(1);
      });
    }

    describe('ngModel [DEPRECATED]', function() {
      executeDataBindingTests('ngModel');
    });

    describe('bsActivePane', function() {
      executeDataBindingTests('bsActivePane');
    });

  });

  describe('options', function () {

    describe('animation', function () {

      it('should default to `am-fade` animation', function() {
        var elm = compileDirective('default');
        expect(sandboxEl.find('[bs-pane]').hasClass('am-fade')).toBeTruthy();
      });

      it('should support custom animation', function() {
        var elm = compileDirective('options-animation');
        expect(sandboxEl.find('[bs-pane]').hasClass('am-flip-x')).toBeTruthy();
      });

    });

    describe('template', function () {

      it('should support custom template', function() {
        $templateCache.put('custom', '<div ng-transclude class="tab-content-primary"></div>');
        var elm = compileDirective('options-template');
        expect(sandboxEl.find('.tab-content-primary .tab-pane:eq(0)').text()).toBe('content-1');
      });

    });

    describe('navClass', function () {

      it('should support custom navClass', function() {
        var elm = compileDirective('options-navClass');
        expect(sandboxEl.find('.nav')[0].className).toBe('nav nav-pills nav-stacked');
      });

    });

    describe('activeClass', function () {

      it('should support custom activeClass', function() {
        var elm = compileDirective('options-activeClass');
        expect(sandboxEl.find('.nav-tabs > li.active').length).toBe(0);
        expect(sandboxEl.find('.nav-tabs > li.in').text()).toBe('title-1');
        expect(sandboxEl.find('.tab-content > .tab-pane.in').text()).toBe('content-1');
        sandboxEl.find('.nav-tabs > li:eq(1) > a').triggerHandler('click');
        expect(sandboxEl.find('.nav-tabs > li.in').text()).toBe('title-2');
        expect(sandboxEl.find('.tab-content > .tab-pane.in').text()).toBe('content-2');
        sandboxEl.find('.nav-tabs > li:eq(0) > a').triggerHandler('click');
        expect(sandboxEl.find('.nav-tabs > li.in').text()).toBe('title-1');
        expect(sandboxEl.find('.tab-content > .tab-pane.in').text()).toBe('content-1');
      });

    });

  });

  describe('pane options', function() {

    describe('disable', function () {

      it('should disable pane', function() {
        var elm = compileDirective('pane-options-disabled');
        expect(sandboxEl.find('.nav-tabs > li:eq(1)').hasClass('disabled')).toBeTruthy();
      });

    });

  });

});

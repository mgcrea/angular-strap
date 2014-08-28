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
      element: '<div bs-tabs><div title="title-1" bs-pane>content-1</div><div title="title-2" bs-pane>content-2</div></div>'
    },
    'template-ngRepeat': {
      scope: {tabs: [
        {title:'Home', content: 'Raw denim you probably haven\'t heard of...'},
        {title:'Profile', content: 'Food truck fixie locavore...'},
        {title:'About', content: 'Etsy mixtape wayfarers...'}
      ]},
      element: '<div bs-tabs><div ng-repeat="tab in tabs" title="{{ tab.title }}" ng-bind="tab.content" bs-pane></div>'
    },
    'template-usePills': {
      element: '<div bs-tabs="tabs" data-use-pills="1"></div>'
    },
    'template-justified': {
      element: '<div bs-tabs="tabs" data-justified="1"></div>'
    },
    'template-stacked': {
      element: '<div bs-tabs="tabs" data-stacked="1"></div>'
    },
    'template-pills-stacked': {
      element: '<div bs-tabs="tabs" data-use-pills="1" data-stacked="1"></div>'
    },
    'binding-ngModel': {
      scope: {tab: {active: 1}},
      element: '<div ng-model="tab.active" bs-tabs><div title="title-1" bs-pane>content-1</div><div title="title-2" bs-pane>content-2</div></div>'
    },
    'options-animation': {
      element: '<div data-animation="am-flip-x" bs-tabs><div title="title-1" bs-pane>content-1</div><div title="title-2" bs-pane>content-2</div></div>'
    },
    'options-template': {
      element: '<div data-template="custom" bs-tabs><div title="title-1" bs-pane>content-1</div><div title="title-2" bs-pane>content-2</div></div>'
    }
  };

  function compileDirective(template, locals) {
    template = templates[template];
    angular.extend(scope, template.scope || templates['default'].scope, locals);
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

  });

  describe('with template modifiers', function () {

    it('should correctly apply `.nav-pills` to container el', function() {
      var elm = compileDirective('template-usePills');
      expect(sandboxEl.find('.nav-tabs').length).toBe(0);
      expect(sandboxEl.find('.nav-pills').length).toBe(1);
    });

    it('should correctly apply `.nav-justified` to container el', function() {
      var elm = compileDirective('template-justified');
      expect(sandboxEl.find('.nav-tabs').length).toBe(1);
      expect(sandboxEl.find('.nav-justified').length).toBe(1);
    });

    it('should correctly apply `.nav-stacked` if `attrs.usePills` truthy', function() {
      var elm = compileDirective('template-pills-stacked');
      expect(sandboxEl.find('.nav-tabs').length).toBe(0);
      expect(sandboxEl.find('.nav-pills').length).toBe(1);
      expect(sandboxEl.find('.nav-stacked').length).toBe(1);
    });

    it('should not apply `.nav-stacked` when `attrs.usePills` falsey', function() {
      var elm = compileDirective('template-stacked');
      expect(sandboxEl.find('.nav-tabs').length).toBe(1);
      expect(sandboxEl.find('.nav-pills').length).toBe(0);
      expect(sandboxEl.find('.nav-stacked').length).toBe(0);
    });

  });

  describe('data-binding', function() {

    it('should correctly apply model changes to the view', function() {
      var elm = compileDirective('binding-ngModel');
      expect(sandboxEl.find('.nav-tabs > li.active').index()).toBe(scope.tab.active);
      expect(sandboxEl.find('.tab-content > .tab-pane.active').index()).toBe(scope.tab.active);
      scope.tab.active = 0;
      scope.$digest();
      expect(sandboxEl.find('.nav-tabs > li.active').index()).toBe(scope.tab.active);
      expect(sandboxEl.find('.tab-content > .tab-pane.active').index()).toBe(scope.tab.active);
    });

    it('should correctly apply view changes to the model', function() {
      var elm = compileDirective('binding-ngModel');
      sandboxEl.find('.nav-tabs > li:eq(0) > a').triggerHandler('click');
      expect(scope.tab.active).toBe(0);
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

  });

});

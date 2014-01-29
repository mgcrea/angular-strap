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
      scope: {tab: {active: 1, counter: 0},tabs: [
        {title:'Home', content: 'Raw denim you probably haven\'t heard of...'},
        {title:'Profile', content: 'Food truck fixie locavore...'},
        {title:'About', content: 'Etsy mixtape wayfarers...'}
      ]},
      element: '<div bs-tabs="tabs"></div>'
    },
    'binding-ngModel': {
      element: '<div ng-model="tab.active" bs-tabs="tabs"></div>'
    },
    'options-animation': {
      element: '<div data-animation="am-flip-x" bs-tabs="tabs"></div>'
    },
    'options-template': {
      element: '<div data-template="custom" bs-tabs="tabs"></div>'
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
      expect(sandboxEl.find('.nav-tabs > li').length).toBe(scope.tabs.length);
      expect(sandboxEl.find('.nav-tabs > li:eq(0)').text()).toBe(scope.tabs[0].title);
      expect(sandboxEl.find('.tab-content > .tab-pane').length).toBe(scope.tabs.length);
      expect(sandboxEl.find('.tab-content > .tab-pane:eq(0)').text()).toBe(scope.tabs[0].content);
    });

    it('should navigate between panes on click', function() {
      var elm = compileDirective('default');
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

  describe('data-binding', function() {

    it('should correctly apply model changes to the view', function() {
      var elm = compileDirective('binding-ngModel');
      expect(sandboxEl.find('.nav-tabs > li.active').index()).toBe(scope.tab.active);
      expect(sandboxEl.find('.tab-content > .tab-pane.active').index()).toBe(scope.tab.active);
      scope.tab.active = 2;
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
        expect(sandboxEl.children('.tabs').hasClass('am-fade')).toBeTruthy();
      });

      it('should support custom animation', function() {
        var elm = compileDirective('options-animation');
        expect(sandboxEl.children('.tabs').hasClass('am-flip-x')).toBeTruthy();
      });

    });

    describe('template', function () {

      it('should support custom template', function() {
        $templateCache.put('custom', '<div class="tabs"><div class="tab-pane" ng-repeat="pane in panes">foo: {{pane.content}}</div></div>');
        var elm = compileDirective('options-template');
        expect(sandboxEl.find('.tab-pane:eq(0)').text()).toBe('foo: ' + scope.tabs[0].content);
      });

      it('should support template with ngClick', function() {
        $templateCache.put('custom', '<div class="tabs"><div class="tab-pane" ng-repeat="pane in panes"><a class="btn" ng-click="tab.counter=tab.counter+1">{{foo.title}}</a></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(angular.element(sandboxEl.find('.tab-pane:eq(0) > .btn')[0]).triggerHandler('click'));
        expect(scope.tab.counter).toBe(1);
      });

    });

  });

});

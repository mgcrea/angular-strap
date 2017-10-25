'use strict';

describe('select', function () {

  var $compile, $templateCache, $select, scope, sandboxEl, $timeout, $animate, $window;

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.select'));
  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));

  beforeEach(inject(function ($injector, _$rootScope_, _$compile_, _$templateCache_, _$select_) {
    scope = _$rootScope_.$new();
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo($('body'));
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    $select = _$select_;
    $animate = $injector.get('$animate');
    $timeout = $injector.get('$timeout');
    $window = $injector.get('$window');
    var flush = $animate.flush || $animate.triggerCallbacks;
    $animate.flush = function() {
      flush.call($animate); if(!$animate.triggerCallbacks) $timeout.flush();
    };
  }));

  afterEach(function() {
    scope.$destroy();
    sandboxEl.remove();
  });

  // Templates

  var templates = {
    'default': {
      scope: {selectedIcon: '', icons: [{value: 'Gear', label: '> Gear'}, {value: 'Globe', label: '> Globe'}, {value: 'Heart', label: '> Heart'}, {value: 'Camera', label: '> Camera'}]},
      element: '<button type="button" class="btn" ng-model="selectedIcon" bs-options="icon.value as icon.label for icon in icons" bs-select></button>'
    },
    'default-with-namespace': {
      scope: {selectedIcon: '', icons: [{value: 'Gear', label: '> Gear'}, {value: 'Globe', label: '> Globe'}, {value: 'Heart', label: '> Heart'}, {value: 'Camera', label: '> Camera'}]},
      element: '<button type="button" class="btn" ng-model="selectedIcon" bs-options="icon.value as icon.label for icon in icons" bs-select data-prefix-event="datepicker"></button>'
    },
    'default-with-null-option': {
      scope: {selectedIcon: null, icons: [{value: null, label: 'Null value'}, {value: 'Gear', label: '> Gear'}]},
      element: '<button type="button" class="btn" ng-model="selectedIcon" bs-options="icon.value as icon.label for icon in icons" bs-select data-prefix-event="datepicker"></button>'
    },
    'default-with-id': {
      scope: {selectedIcon: '', icons: [{value: 'Gear', label: '> Gear'}, {value: 'Globe', label: '> Globe'}, {value: 'Heart', label: '> Heart'}, {value: 'Camera', label: '> Camera'}]},
      element: '<button id="select1" type="button" class="btn" ng-model="selectedIcon" bs-options="icon.value as icon.label for icon in icons" bs-select></button>'
    },
    'default-toggle': {
      scope: {selectedIcon: '', icons: [{value: 'Gear', label: '> Gear'}, {value: 'Globe', label: '> Globe'}, {value: 'Heart', label: '> Heart'}, {value: 'Camera', label: '> Camera'}]},
      element: '<button type="button" class="btn" ng-model="selectedIcon" bs-options="icon.value as icon.label for icon in icons" data-toggle="true" bs-select></button>'
    },
    'markup-ngRepeat': {
      element: '<ul><li ng-repeat="i in [1, 2, 3]"><button type="button" class="btn" ng-model="selectedIcon" bs-options="icon.value as icon.label for icon in icons" bs-select></button></li></ul>'
    },
    'markup-select': {
      element: '<select type="button" class="btn" ng-model="selectedIcon" bs-options="icon.value as icon.label for icon in icons" bs-select></select>'
    },
    'markup-bsOptions-filtered': {
      element: '<button type="button" class="btn" ng-model="selectedIcon" bs-options="icon.value as icon.label for icon in icons | orderBy:\'icon.value\'" bs-select></button>'
    },
    'markup-bsOptions-array': {
      scope: {selectedMonth: 0, months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']},
      element: '<div type="button" class="btn" ng-model="selectedMonth" bs-options="months.indexOf(month) as month for month in months" bs-select></div>'
      // element: '<select type="button" class="btn" ng-model="selectedMonth" bs-options="months.indexOf(month) as month for month in months"></select>'
    },
    'options-multiple': {
      scope: {selectedIcons: ['Globe'], icons: [{value: 'Gear', label: '> Gear'}, {value: 'Globe', label: '> Globe'}, {value: 'Heart', label: '> Heart'}, {value: 'Camera', label: '> Camera'}]},
      element: '<button type="button" class="btn" data-multiple="1" ng-model="selectedIcons" bs-options="icon.value as icon.label for icon in icons" bs-select></button>'
    },
    'options-multiple-undefined-value': {
      scope: {selectedIcons: ['Globe'], icons: [{value: 'Gear', label: '> Gear'}, {value: 'Heart', label: '> Heart'}, {value: 'Camera', label: '> Camera'}]},
      element: '<button type="button" class="btn" data-multiple="1" ng-model="selectedIcons" bs-options="icon.value as icon.label for icon in icons" bs-select></button>'
    },
    'options-multiple-all-none-buttons': {
      scope: {selectedIcons: ['Globe'], icons: [{value: 'Gear', label: '> Gear'}, {value: 'Globe', label: '> Globe'}, {value: 'Heart', label: '> Heart'}, {value: 'Camera', label: '> Camera'}]},
      element: '<button type="button" class="btn" data-multiple="1" all-none-buttons="{{allNoneButtons}}" ng-model="selectedIcons" bs-options="icon.value as icon.label for icon in icons" bs-select></button>'
    },
    'options-multiple-all-none-buttons-text': {
      scope: {allText: 'select all', noneText: 'select none', selectedIcons: ['Globe'], icons: [{value: 'Gear', label: '> Gear'}, {value: 'Globe', label: '> Globe'}, {value: 'Heart', label: '> Heart'}, {value: 'Camera', label: '> Camera'}]},
      element: '<button type="button" class="btn" data-multiple="1" all-none-buttons="1" data-all-text="{{allText}}" data-none-text="{{noneText}}" ng-model="selectedIcons" bs-options="icon.value as icon.label for icon in icons" bs-select></button>'
    },
    'options-multiple-required': {
      scope: {selectedIcons: ['Globe'], icons: [{value: 'Gear', label: '> Gear'}, {value: 'Globe', label: '> Globe'}, {value: 'Heart', label: '> Heart'}, {value: 'Camera', label: '> Camera'}]},
      element: '<button type="button" class="btn" data-multiple="1" ng-model="selectedIcons" bs-options="icon.value as icon.label for icon in icons" required bs-select></button>'
    },
    'options-maxLength': {
      scope: {selectedIcons: ['Globe', 'Heart', 'Camera'], icons: [{value: 'Gear', label: '> Gear'}, {value: 'Globe', label: '> Globe'}, {value: 'Heart', label: '> Heart'}, {value: 'Camera', label: '> Camera'}]},
      element: '<button type="button" class="btn" data-multiple="1" data-max-length="2" ng-model="selectedIcons" bs-options="icon.value as icon.label for icon in icons" bs-select></button>'
    },
    'options-maxLengthHtml': {
      scope: {selectedIcons: ['Globe', 'Heart', 'Camera'], icons: [{value: 'Gear', label: '> Gear'}, {value: 'Globe', label: '> Globe'}, {value: 'Heart', label: '> Heart'}, {value: 'Camera', label: '> Camera'}]},
      element: '<button type="button" class="btn" data-multiple="1" data-max-length="2" data-max-length-html="foo" ng-model="selectedIcons" bs-options="icon.value as icon.label for icon in icons" bs-select></button>'
    },
    'options-animation': {
      element: '<button type="button" class="btn" data-animation="am-flip-x" ng-model="selectedIcon" bs-options="icon.value as icon.label for icon in icons" bs-select></button>'
    },
    'options-placement': {
      element: '<button type="button" class="btn" data-placement="bottom" ng-model="selectedIcon" bs-options="icon.value as icon.label for icon in icons" bs-select></button>'
    },
    'options-placement-exotic': {
      element: '<button type="button" class="btn" data-placement="bottom-right" ng-model="selectedIcon" bs-options="icon.value as icon.label for icon in icons" bs-select></button>'
    },
    'options-trigger': {
      element: '<button type="button" class="btn" data-trigger="hover" ng-model="selectedIcon" bs-options="icon.value as icon.label for icon in icons" bs-select></button>'
    },
    'options-html': {
      scope: {selectedIcon: '', icons: [{value: 'Gear', label: '<i class="fa fa-gear"></i> Gear'}, {value: 'Globe', label: '<i class="fa fa-globe"></i> Globe'}, {value: 'Heart', label: '<i class="fa fa-heart"></i> Heart'}, {value: 'Camera', label: '<i class="fa fa-camera"></i> Camera'}]},
      element: '<button type="button" class="btn" class="form-control" ng-model="selectedIcon" data-html="{{html}}" bs-options="icon.value as icon.label for icon in icons" bs-select></button>'
    },
    'options-template': {
      element: '<button type="button" class="btn" data-template-url="custom" ng-model="selectedIcon" bs-options="icon.value as icon.label for icon in icons" bs-select></button>'
    },
    'options-multiple-sort': {
      scope: {sort: true, selectedIcons: [], icons: [
        {value: 'Gear0', label: '> Gear0'}, {value: 'Globe1', label: '> Globe1'}, {value: 'Heart2', label: '> Heart2'}, {value: 'Camera3', label: '> Camera3'},
        {value: 'Gear4', label: '> Gear4'}, {value: 'Globe5', label: '> Globe5'}, {value: 'Heart6', label: '> Heart6'}, {value: 'Camera7', label: '> Camera7'},
        {value: 'Gear8', label: '> Gear8'}, {value: 'Globe9', label: '> Globe9'}, {value: 'Heart10', label: '> Heart10'}, {value: 'Camera11', label: '> Camera11'}
      ]},
      element: '<button type="button" class="btn" data-sort="{{ sort }}" data-multiple="1" ng-model="selectedIcons" bs-options="icon.value as icon.label for icon in icons" bs-select></button>'
    },
    'options-container': {
      scope: {selectedIcon: '', icons: [{value: 'Gear', label: '> Gear'}, {value: 'Globe', label: '> Globe'}, {value: 'Heart', label: '> Heart'}, {value: 'Camera', label: '> Camera'}]},
      element: '<button type="button" data-container="{{container}}" class="btn" ng-model="selectedIcon" bs-options="icon.value as icon.label for icon in icons" bs-select></button>'
    },
    'options-events': {
      scope: {selectedIcon: '', icons: [{value: 'Gear', label: '> Gear'}, {value: 'Globe', label: '> Globe'}, {value: 'Heart', label: '> Heart'}, {value: 'Camera', label: '> Camera'}]},
      element: '<button type="button" class="btn" ng-model="selectedIcon" bs-options="icon.value as icon.label for icon in icons" bs-on-before-hide="onBeforeHide" bs-on-hide="onHide" bs-on-before-show="onBeforeShow" bs-on-show="onShow" bs-on-select="onSelect" bs-select></button>'
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

  function triggerKeyDown(elm, keyCode) {
    var evt = $.Event('keydown');
    evt.which = evt.keyCode = keyCode;
    angular.element(elm[0]).triggerHandler(evt);
  }

  // Tests

  describe('with default template', function () {

    it('should open on focus', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.dropdown-menu.select').length).toBe(0);
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.children('.dropdown-menu.select').length).toBe(1);
    });

    it('should close on blur', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.dropdown-menu.select').length).toBe(0);
      angular.element(elm[0]).triggerHandler('focus');
      angular.element(elm[0]).triggerHandler('blur');
      expect(sandboxEl.children('.dropdown-menu.select').length).toBe(0);
    });

    it('should close on select', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.dropdown-menu.select').length).toBe(0);
      expect(elm.text().trim()).toBe('Choose among the following...');
      angular.element(elm[0]).triggerHandler('focus');
      angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a')[0]).triggerHandler('click');
      expect(scope.selectedIcon).toBe(scope.icons[1].value);
    });

    it('should correctly compile inner content', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.icons.length);
      expect(sandboxEl.find('.dropdown-menu li:eq(0)').text().trim()).toBe(scope.icons[0].label);
    });

    it('should support ngRepeat markup', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-select]:eq(0)')).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.icons.length);
      expect(sandboxEl.find('.dropdown-menu li:eq(0)').text().trim()).toBe(scope.icons[0].label);
    });

    it('should support select markup', function() {
      var elm = compileDirective('markup-select');
      angular.element(elm.next('button')[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.icons.length);
      expect(sandboxEl.find('.dropdown-menu li:eq(0)').text().trim()).toBe(scope.icons[0].label);
    });

    it('should support null ng-model initial value', function() {
      var elm = compileDirective('default', { selectedIcon: null });
      expect(function() { angular.element(elm[0]).triggerHandler('focus') }).not.toThrow();
      angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a')[0]).triggerHandler('click');
      expect(scope.selectedIcon).toBe(scope.icons[1].value);
    });

    it('should highlight null value', function() {
      var elm = compileDirective('default-with-null-option', { selectedIcon: null });
      expect(function() { angular.element(elm[0]).triggerHandler('focus') }).not.toThrow();
      expect(sandboxEl.find('.dropdown-menu li:eq(0)')).toHaveClass('active');
    });

    it('should not attempt to select an item when there is none highlighted and tab is pressed', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.active').length).toBe(0);
      $timeout.flush();
      triggerKeyDown( elm, 9 );
      expect(sandboxEl.find('.active').length).toBe(0);
    });

  });

  describe('when model has no initial selection', function() {

    it('should not have any selection upon open until down key', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.active').length).toBe(0);
      $timeout.flush();
      triggerKeyDown( elm, 40 );
      expect(sandboxEl.find('.active').length).toBe(1);
    });

    it('should not have any selection upon open until up key', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.active').length).toBe(0);
      $timeout.flush();
      triggerKeyDown( elm, 38 );
      expect(sandboxEl.find('.active').length).toBe(1);
    });

  });

  describe('bsOptions', function () {

    it('should correctly watch for changes', function() {
      var elm = compileDirective('default');
      scope.icons.unshift({value: 'Bullhorn', label: '> Bullhorn'});
      scope.$digest();
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.icons.length);
      expect(sandboxEl.find('.dropdown-menu li:eq(0)').text().trim()).toBe(scope.icons[0].label);
    });

    it('should correctly watch for changes for elements in arrays', function() {
      var elm = compileDirective('default');
      scope.icons[0].label = scope.icons[0].label + "s"
      scope.$digest();
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.icons.length);
      expect(sandboxEl.find('.dropdown-menu li:eq(0)').text().trim()).toBe(scope.icons[0].label);
    });

    it('should support bsOptions with filters', function() {
      var elm = compileDirective('markup-bsOptions-filtered');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.icons.length);
    });

    it('should support bsOptions with arrays', function() {
      var elm = compileDirective('markup-bsOptions-array');
      angular.element(elm[0]).triggerHandler('focus');
      expect(elm.text().trim()).toBe(scope.months[scope.selectedMonth]);
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.months.length);
      angular.element(elm[0]).triggerHandler('focus');
      angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a')[0]).triggerHandler('click');
      scope.$digest();
      expect(scope.selectedMonth).toBe(1);
    });

  });

  describe('ngModel', function () {

    it('should correctly watch for changes', function() {
      var elm = compileDirective('default');
      scope.selectedIcon = scope.icons[2].value;
      scope.$digest();
      expect(elm.text().trim()).toBe(scope.icons[2].label);
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li.active').length).toBe(1);
      expect(sandboxEl.find('.dropdown-menu li.active').index()).toBe(2);
    });

    it('should correctly update when model is cleared', function() {
      var elm = compileDirective('default');
      scope.selectedIcon = scope.icons[2].value;
      scope.$digest();
      expect(elm.text().trim()).toBe(scope.icons[2].label);
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li.active').length).toBe(1);
      expect(sandboxEl.find('.dropdown-menu li.active').index()).toBe(2);

      scope.selectedIcon = null;
      scope.$digest();
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li.active').length).toBe(0);
      expect(sandboxEl.find('.dropdown-menu li.active').index()).toBe(-1);
    });
  });

  describe('options', function () {

    describe('multiple', function () {

      it('should correctly compile inner content', function() {
        var elm = compileDirective('options-multiple');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.icons.length);
        expect(sandboxEl.find('.dropdown-menu li:eq(0)').text().trim()).toBe(scope.icons[0].label);
        expect(sandboxEl.find('.dropdown-menu li > a > i').length).toBe(scope.selectedIcons.length);
      });

      it('should select and deselect all items', function() {
        var elm = compileDirective('options-multiple-all-none-buttons', {allNoneButtons: 'true'});
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu li > div > button').length).toBe(2);

        expect(angular.element(sandboxEl.find('.dropdown-menu li > div > button')[0]).triggerHandler('click'));
        expect(sandboxEl.find('.dropdown-menu li.active').length).toBe(4);

        expect(angular.element(sandboxEl.find('.dropdown-menu li > div > button')[1]).triggerHandler('click'));
        expect(sandboxEl.find('.dropdown-menu li.active').length).toBe(0);
      });

      it('should set ng-invalid-required class after deselecting all items', function() {
        var elm = compileDirective('options-multiple-required');
        angular.element(elm[0]).triggerHandler('focus');
        expect(elm.hasClass('ng-invalid-required')).toBe(false);
        angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a')[0]).triggerHandler('click');
        expect(elm.hasClass('ng-invalid-required')).toBe(true);
      });

      it('should show default all/none button labels', function() {
        var elm = compileDirective('options-multiple-all-none-buttons', {allNoneButtons: 'true'});
        angular.element(elm[0]).triggerHandler('focus');

        expect(sandboxEl.find('.dropdown-menu li > div > button:eq(0)').text()).toBe('All');
        expect(sandboxEl.find('.dropdown-menu li > div > button:eq(1)').text()).toBe('None');
      });

      it('should support custom all/none button labels', function() {
        var elm = compileDirective('options-multiple-all-none-buttons-text');
        angular.element(elm[0]).triggerHandler('focus');

        expect(sandboxEl.find('.dropdown-menu li > div > button:eq(0)').text()).toBe('select all');
        expect(sandboxEl.find('.dropdown-menu li > div > button:eq(1)').text()).toBe('select none');
      });

      it('should NOT show allOrNothingButtons if allOrNothingButtons is falsy', function() {
        var elm = compileDirective('options-multiple-all-none-buttons', {allNoneButtons: 'false'});
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu li > div > button').length).toBe(0);

      });

      it('should support null ng-model initial value', function() {
        var elm = compileDirective('options-multiple', { selectedIcons: null });
        expect(function() { angular.element(elm[0]).triggerHandler('focus') }).not.toThrow();
        angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a')[0]).triggerHandler('click');
        expect(scope.selectedIcons).toEqual([ scope.icons[1].value ]);
      });
    });

    describe('maxLength', function () {

      it('should correctly support maxLength option', function() {
        var elm = compileDirective('options-maxLength');
        expect(elm.text().trim()).toBe(scope.selectedIcons.length + ' ' + $select.defaults.maxLengthHtml);
      });

    });

    describe('maxLengthHtml', function () {

      it('should correctly support maxLengthHtml option', function() {
        var elm = compileDirective('options-maxLengthHtml');
        expect(elm.text().trim()).toBe(scope.selectedIcons.length + ' ' + 'foo');
      });

    });

    describe('animation', function () {

      it('should default to `am-fade` animation', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.children('.dropdown-menu').hasClass('am-fade')).toBeTruthy();
      });

      it('should support custom animation', function() {
        var elm = compileDirective('options-animation');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.children('.dropdown-menu').hasClass('am-flip-x')).toBeTruthy();
      });

    });

    describe('placement', function () {
      var $$rAF;
      beforeEach(inject(function (_$$rAF_) {
        $$rAF = _$$rAF_;
      }));

      it('should default to `top` placement', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('focus');
        $$rAF.flush();
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom-left')).toBeTruthy();
      });

      it('should support placement', function() {
        var elm = compileDirective('options-placement');
        angular.element(elm[0]).triggerHandler('focus');
        $$rAF.flush();
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom')).toBeTruthy();
      });

      it('should support exotic-placement', function() {
        var elm = compileDirective('options-placement-exotic');
        angular.element(elm[0]).triggerHandler('focus');
        $$rAF.flush();
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom-right')).toBeTruthy();
      });

    });

    describe('trigger', function () {

      it('should support an alternative trigger', function() {
        var elm = compileDirective('options-trigger');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
        angular.element(elm[0]).triggerHandler('mouseleave');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      });

    });

    describe('html', function () {

      it('should correctly compile inner content when html is true', function() {
        var elm = compileDirective('options-html', {html: 'true'});
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.icons.length);
        expect(sandboxEl.find('.dropdown-menu li:eq(0) a > span').html()).toBe(scope.icons[0].label);
      });

      it('should NOT correctly compile inner content when html is false', function() {
        var elm = compileDirective('options-html', {html: 'false'});
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.icons.length);
        expect(sandboxEl.find('.dropdown-menu li:eq(0) a > span').html()).not.toBe(scope.icons[0].label);
      });

    });

    describe('template', function () {

      it('should support custom template', function() {
        $templateCache.put('custom', '<div class="dropdown-menu"><div class="dropdown-inner">foo: {{icons.length}}</div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-inner').text().trim()).toBe('foo: ' + scope.icons.length);
      });

      it('should support template with ngRepeat', function() {
        $templateCache.put('custom', '<div class="dropdown-menu"><div class="dropdown-inner"><ul><li ng-repeat="icon in icons">{{icon.label}}</li></ul></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-inner').text().trim()).toBe(scope.icons.map(function(obj) { return obj.label; }).join(''));
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('blur');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-inner').text().trim()).toBe(scope.icons.map(function(obj) { return obj.label; }).join(''));
      });

      it('should support template with ngClick', function() {
        $templateCache.put('custom', '<div class="dropdown-menu"><div class="dropdown-inner"><a class="btn" ng-click="dropdown.counter=dropdown.counter+1">click me</a></div></div>');
        var elm = compileDirective('options-template');
        scope.dropdown = {counter: 0};
        angular.element(elm[0]).triggerHandler('focus');
        expect(angular.element(sandboxEl.find('.dropdown-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.dropdown.counter).toBe(1);
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('blur');
        angular.element(elm[0]).triggerHandler('focus');
        expect(angular.element(sandboxEl.find('.dropdown-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.dropdown.counter).toBe(2);
      });

    });

    describe('sort', function () {

      it('should sort selected items by index when sort it true', function() {
        var elm = compileDirective('options-multiple-sort');
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(3) a')[0]).triggerHandler('click');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a')[0]).triggerHandler('click');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(2) a')[0]).triggerHandler('click');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(7) a')[0]).triggerHandler('click');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(6) a')[0]).triggerHandler('click');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(4) a')[0]).triggerHandler('click');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(9) a')[0]).triggerHandler('click');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(5) a')[0]).triggerHandler('click');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(10) a')[0]).triggerHandler('click');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(8) a')[0]).triggerHandler('click');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(11) a')[0]).triggerHandler('click');
        expect(scope.selectedIcons).toEqual([
          scope.icons[1].value, scope.icons[2].value, scope.icons[3].value,
          scope.icons[4].value, scope.icons[5].value, scope.icons[6].value,
          scope.icons[7].value, scope.icons[8].value, scope.icons[9].value,
          scope.icons[10].value, scope.icons[11].value
        ]);
      });

      it('should sort selected items by selection order when sort it false', function() {
        var elm = compileDirective('options-multiple-sort', { sort: false });
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(3) a')[0]).triggerHandler('click');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a')[0]).triggerHandler('click');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(2) a')[0]).triggerHandler('click');
        expect(scope.selectedIcons).toEqual([scope.icons[3].value, scope.icons[1].value, scope.icons[2].value]);
      });

      it('should sort selected items by selection order when sort value is empty', function() {
        var elm = compileDirective('options-multiple-sort', { sort: '' });
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(3) a')[0]).triggerHandler('click');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a')[0]).triggerHandler('click');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(2) a')[0]).triggerHandler('click');
        expect(scope.selectedIcons).toEqual([scope.icons[3].value, scope.icons[1].value, scope.icons[2].value]);
      });

    });

    describe('container', function() {

      it('should put select in a container when specified', function() {
        var testElm = $('<div id="testElm"></div>');
        sandboxEl.append(testElm);
        var elm = compileDirective('options-container', {container: '#testElm'});
        angular.element(elm[0]).triggerHandler('focus');
        expect(testElm.children('.dropdown-menu.select').length).toBe(1);
      })

      it('should put select in sandbox when container is falsy', function() {
        var elm = compileDirective('options-container', {container: 'false'});
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.children('.dropdown-menu.select').length).toBe(1);
      })


    })

    describe('prefix', function () {
      it('should call namespaced events through provider', function() {
        var fauxController = { $setViewValue : angular.noop };
        var mySelect = $select(sandboxEl, fauxController, {prefixEvent: 'datepicker'});
        var emit = spyOn(mySelect.$scope, '$emit');
        scope.$digest();
        mySelect.show();
        mySelect.hide();
        var option = {value : 'Canada'};
        mySelect.update([option]);
        mySelect.select(0);
        $animate.flush();

        expect(emit).toHaveBeenCalledWith('datepicker.show.before', mySelect);
        expect(emit).toHaveBeenCalledWith('datepicker.show', mySelect);
        expect(emit).toHaveBeenCalledWith('datepicker.hide.before', mySelect);
        expect(emit).toHaveBeenCalledWith('datepicker.hide', mySelect);
        expect(emit).toHaveBeenCalledWith('datepicker.select', option.value, 0, mySelect);
      });

      it('should call namespaced events through directive', function() {
        var elm = compileDirective('default-with-namespace');

        var select, beforeShow, show, beforeHide, hide;
        scope.$on('datepicker.select', function() {
          select = true;
        });
        scope.$on('datepicker.show.before', function() {
          beforeShow = true;
        });
        scope.$on('datepicker.show', function() {
          show = true;
        });
        scope.$on('datepicker.hide', function() {
          hide = true;
        });
        scope.$on('datepicker.hide.before', function() {
          beforeHide = true;
        });

        angular.element(elm[0]).triggerHandler('focus');
        $animate.flush();
        angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a')[0]).triggerHandler('click');

        angular.element(elm[0]).triggerHandler('blur');
        $animate.flush();

        expect(select).toBe(true);
        expect(beforeShow).toBe(true);
        expect(show).toBe(true);
        expect(hide).toBe(true);
        expect(beforeHide).toBe(true);
      });

    });

  });

  describe('onBeforeShow', function() {

    it('should invoke beforeShow event callback', function() {
      var beforeShow = false;

      function onBeforeShow(select) {
        beforeShow = true;
      }

      var elm = compileDirective('options-events', angular.extend({onBeforeShow: onBeforeShow}, templates['options-events'].scope));

      angular.element(elm[0]).triggerHandler('focus');

      expect(beforeShow).toBe(true);
    });
  });

  describe('onShow', function() {

    it('should invoke show event callback', function() {
      var show = false;

      function onShow(select) {
        show = true;
      }

      var elm = compileDirective('options-events', angular.extend({onShow: onShow}, templates['options-events'].scope));

      angular.element(elm[0]).triggerHandler('focus');
      $animate.flush();

      expect(show).toBe(true);
    });
  });

  describe('onBeforeHide', function() {

    it('should invoke beforeHide event callback', function() {
      var beforeHide = false;

      function onBeforeHide(select) {
        beforeHide = true;
      }

      var elm = compileDirective('options-events', angular.extend({onBeforeHide: onBeforeHide}, templates['options-events'].scope));

      angular.element(elm[0]).triggerHandler('focus');
      angular.element(elm[0]).triggerHandler('blur');

      expect(beforeHide).toBe(true);
    });
  });

  describe('onHide', function() {

    it('should invoke show event callback', function() {
      var hide = false;

      function onHide(select) {
        hide = true;
      }

      var elm = compileDirective('options-events', angular.extend({onHide: onHide}, templates['options-events'].scope));

      angular.element(elm[0]).triggerHandler('focus');
      angular.element(elm[0]).triggerHandler('blur');
      $animate.flush();

      expect(hide).toBe(true);
    });
  });

  describe('onSelect', function() {

    it('should invoke the onSelect callback', function () {
      var selected = null;

      function onSelect(value, index, select) {
        selected = index;
      }

      var elm = compileDirective('options-events', angular.extend({onSelect: onSelect}, templates['options-events'].scope));

      angular.element(elm[0]).triggerHandler('focus');
      angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a').get(0)).triggerHandler('click');

      expect(selected).toBe(1);
    });
  });

  describe('select event', function() {

    it('should dispatch .select event when item is selected', function() {
      var elm = compileDirective('default');

      var selected = null;
      scope.$on('$select.select', function(evt, value, index, select) {
        selected = index;
      });

      angular.element(elm[0]).triggerHandler('focus');
      angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a')[0]).triggerHandler('click');

      expect(selected).toBe(1);
    });

    it('should dispatch .select event when item is selected and replace undefined value', function() {
      var elm = compileDirective('options-multiple-undefined-value');

      var selected = null;
      scope.$on('$select.select', function(evt, value, index, select) {
        selected = index;
      });

      angular.element(elm[0]).triggerHandler('focus');
      angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a')[0]).triggerHandler('click');

      expect(selected).toBe(1);
    });



    it('should call .select event with select element instance id', function() {
      var elm = compileDirective('default-with-id');

      var id = '';
      scope.$on('$select.select', function(evt, value, index, select) {
        id = select.$id;
      });

      //scope.$digest();
      angular.element(elm[0]).triggerHandler('focus');
      angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a')[0]).triggerHandler('click');

      expect(id).toBe('select1');
    });
  });

  describe('toggle', function () {

    it('should allow user to toggle a selection', function() {
        var elm = compileDirective('default-toggle');
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a')[0]).triggerHandler('click');
        expect(scope.selectedIcon).toBe(scope.icons[1].value);
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a')[0]).triggerHandler('click');
        expect(scope.selectedIcon).toBe(undefined);
    });

    it('should not allow user to toggle a selection', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a')[0]).triggerHandler('click');
        expect(scope.selectedIcon).toBe(scope.icons[1].value);
        angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a')[0]).triggerHandler('click');
        expect(scope.selectedIcon).toBe(scope.icons[1].value);
    });
  });

  describe('on touch devices', function() {

    var isTouch;

    beforeEach(function() {
      var isNative = /(ip[ao]d|iphone|android)/ig.test($window.navigator.userAgent);
      isTouch = ('createTouch' in $window.document) && isNative;
    });

    it('should select entry on touchstart on span', function() {
      if (!isTouch) {
        return;
      }
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      $timeout.flush();
      var touchEvent = document.createEvent('TouchEvent');
      touchEvent.initEvent('touchstart', true, true);
      sandboxEl.find('.dropdown-menu li:eq(1) a span')[0].dispatchEvent(touchEvent);
      expect(scope.selectedIcon).toBe(scope.icons[1].value);
    });
  })

});

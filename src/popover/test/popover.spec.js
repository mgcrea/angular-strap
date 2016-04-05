'use strict';

describe('popover', function () {

  var $compile, $templateCache, scope, sandboxEl, $window, $timeout, $popover, $animate;

  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));
  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.popover'));
  jQuery.fn.triggerHandler = function(evt) {
    return angular.element(this[0]).triggerHandler(evt);
  };

  beforeEach(inject(function ($injector, _$rootScope_, _$compile_, _$templateCache_, _$window_, _$timeout_, _$popover_, _$animate_) {
    scope = _$rootScope_;
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo('body');
    $window = _$window_;
    $popover = _$popover_;
    $animate = $injector.get('$animate');
    $timeout = $injector.get('$timeout');
    var flush = $animate.flush || $animate.triggerCallbacks;
    $animate.flush = function() {
      flush.call($animate); if(!$animate.triggerCallbacks) $timeout.flush();
    };
  }));

  afterEach(function() {
    sandboxEl.remove();
    scope.$destroy();
  });

  // Templates

  var templates = {
    'default': {
      scope: {popover: {title: 'Title', content: 'Hello Popover!'}},
      element: '<a class="btn" title="{{popover.title}}" data-content="{{popover.content}}" bs-popover></a>'
    },
    'default-with-namespace': {
      scope: {popover: {title: 'Title', content: 'Hello Popover!'}},
      element: '<a class="btn" title="{{popover.title}}" data-content="{{popover.content}}" bs-popover data-prefix-event="datepicker"></a>'
    },
    'default-with-id': {
      scope: {popover: {title: 'Title', content: 'Hello Popover!'}},
      element: '<a id="popover1" class="btn" title="{{popover.title}}" data-content="{{popover.content}}" bs-popover></a>'
    },
    'markup-scope': {
      element: '<a bs-popover="popover">click me</a>'
    },
    'markup-ngRepeat': {
      scope: {items: [{name: 'foo', popover: {title: 'Title', content: 'Hello Popover!'}}]},
      element: '<ul><li ng-repeat="item in items"><a class="btn" bs-popover="item.popover">{{item.name}}</a></li></ul>'
    },
    'options-animation': {
      element: '<a data-animation="am-flip-x" bs-popover="popover">hover me</a>'
    },
    'options-placement': {
      element: '<a data-placement="bottom" bs-popover="popover">hover me</a>'
    },
    'options-placement-exotic': {
      element: '<a data-placement="bottom-right" bs-popover="popover">hover me</a>'
    },
    'options-trigger': {
      element: '<a data-trigger="hover" bs-popover="popover">hover me</a>'
    },
    'options-html': {
      scope: {popover: {title: 'title<br>next', content: 'content<br>next'}},
      element: '<a class="btn" data-html="{{html}}" bs-popover="popover"></a>'
    },
    'options-container': {
      scope: {popover: {title: 'Title', content: 'Hello Popover!'}},
      element: '<a data-container="{{container}}" bs-popover="popover">hover me</a>'
    },
    'options-template': {
      scope: {popover: {title: 'Title', content: 'Hello Popover!', counter: 0}, items: ['foo', 'bar', 'baz']},
      element: '<a data-template-url="custom" bs-popover="popover">click me</a>'
    },
    'options-autoClose': {
      scope: {popover: {title: 'Title', content: '<div class="message">Hello Popover<br>This is a multiline message!</div>'}},
      element: '<a class="btn" data-auto-close="{{autoClose}}" bs-popover="popover"></a>'
    },
    'options-autoClose-with-template': {
      scope: {popover: {title: 'Title', counter: 0, content: 'Hello'}},
      element: '<a class="btn" data-auto-close="true" data-template-url="custom" bs-popover="popover"></a>'
    },
    'bsShow-attr': {
      scope: {popover: {title: 'Title', content: 'Hello Popover!'}},
      element: '<a class="btn" title="{{popover.title}}" data-content="{{popover.content}}" bs-popover bs-show="true"></a>'
    },
    'bsShow-binding': {
      scope: {isVisible: false, popover: {title: 'Title', content: 'Hello Popover!'}},
      element: '<a class="btn" title="{{popover.title}}" data-content="{{popover.content}}" bs-popover bs-show="isVisible"></a>'
    },
    'options-contentTemplate': {
      scope: {foo: 'bar'},
      element: '<a class="btn" title="foo-title" data-content-template="custom" bs-popover bs-show="isVisible"></a>'
    },
    'options-events': {
      element: '<a bs-on-before-hide="onBeforeHide" bs-on-hide="onHide" bs-on-before-show="onBeforeShow" bs-on-show="onShow" bs-popover="popover">click me</a>'
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

  describe('default', function () {

    it('should open on click', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children().length).toBe(1);
      elm.triggerHandler('click');
      expect(sandboxEl.children().length).toBe(2);
    });

    it('should close on double-click', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children().length).toBe(1);
      elm.triggerHandler('click');
      elm.triggerHandler('click');
      expect(sandboxEl.children().length).toBe(1);
    });

    it('should correctly compile inner content', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.popover-title').html()).toBe(scope.popover.title);
      expect(sandboxEl.find('.popover-content').html()).toBe(scope.popover.content);
    });

    it('should support scope as object', function() {
      var elm = compileDirective('markup-scope');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.popover-title').html()).toBe(scope.popover.title);
      expect(sandboxEl.find('.popover-content').html()).toBe(scope.popover.content);
    });

    it('should support ngRepeat markup', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-popover]')).triggerHandler('click');
      expect(sandboxEl.find('.popover-title').html()).toBe(scope.items[0].popover.title);
      expect(sandboxEl.find('.popover-content').html()).toBe(scope.items[0].popover.content);
    });

  });

  describe('bsShow attribute', function() {
    it('should support setting to a boolean value', function() {
      var elm = compileDirective('bsShow-attr');
      expect(sandboxEl.children().length).toBe(2);
    });

    it('should support binding', function() {
      var elm = compileDirective('bsShow-binding');
      expect(scope.isVisible).toBeFalsy();
      expect(sandboxEl.children().length).toBe(1);
      scope.isVisible = true;
      scope.$digest();
      expect(sandboxEl.children().length).toBe(2);
      scope.isVisible = false;
      scope.$digest();
      expect(sandboxEl.children().length).toBe(1);
    });

    it('should support initial value false', function() {
      var elm = compileDirective('bsShow-binding');
      expect(scope.isVisible).toBeFalsy();
      expect(sandboxEl.children().length).toBe(1);
    });

    it('should support initial value true', function() {
      var elm = compileDirective('bsShow-binding', {isVisible: true});
      expect(scope.isVisible).toBeTruthy();
      expect(sandboxEl.children().length).toBe(2);
    });

    it('should support undefined value', function() {
      var elm = compileDirective('bsShow-binding', {isVisible: undefined});
      expect(sandboxEl.children().length).toBe(1);
    });

    it('should support string value', function() {
      var elm = compileDirective('bsShow-binding', {isVisible: 'a string value'});
      expect(sandboxEl.children().length).toBe(1);
      scope.isVisible = 'TRUE';
      scope.$digest();
      expect(sandboxEl.children().length).toBe(2);
      scope.isVisible = 'dropdown';
      scope.$digest();
      expect(sandboxEl.children().length).toBe(1);
      scope.isVisible = 'datepicker,popover';
      scope.$digest();
      expect(sandboxEl.children().length).toBe(2);
    });
  });

  describe('show / hide events', function() {

    it('should dispatch show and show.before events', function() {
      var myPopover = $popover(sandboxEl, templates['default'].scope.popover);
      var emit = spyOn(myPopover.$scope, '$emit');
      scope.$digest();
      myPopover.show();

      expect(emit).toHaveBeenCalledWith('tooltip.show.before', myPopover);
      // show only fires AFTER the animation is complete
      expect(emit).not.toHaveBeenCalledWith('tooltip.show', myPopover);
      $animate.flush();
      expect(emit).toHaveBeenCalledWith('tooltip.show', myPopover);
    });

    it('should dispatch hide and hide.before events', function() {
      var myPopover = $popover(sandboxEl, templates['default'].scope.popover);
      scope.$digest();
      myPopover.show();

      var emit = spyOn(myPopover.$scope, '$emit');
      myPopover.hide();

      expect(emit).toHaveBeenCalledWith('tooltip.hide.before', myPopover);
      // hide only fires AFTER the animation is complete
      expect(emit).not.toHaveBeenCalledWith('tooltip.hide', myPopover);
      $animate.flush();
      expect(emit).toHaveBeenCalledWith('tooltip.hide', myPopover);
    });

    it('should call show.before event with popover element instance id', function() {
      var elm = compileDirective('default-with-id');
      var id = "";
      scope.$on('tooltip.show.before', function(evt, popover) {
        id = popover.$id;
      });

      angular.element(elm[0]).triggerHandler('click');
      scope.$digest();
      expect(id).toBe('popover1');
    });

  });

  describe('options', function () {

    describe('animation', function () {

      it('should default to `am-fade` animation', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.popover').hasClass('am-fade')).toBeTruthy();
      });

      it('should support custom animation', function() {
        var elm = compileDirective('options-animation');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.popover').hasClass('am-flip-x')).toBeTruthy();
      });

    });

    describe('placement', function () {
      var $$rAF;
      beforeEach(inject(function (_$$rAF_) {
        $$rAF = _$$rAF_
      }));

      it('should default to `right` placement', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        $$rAF.flush();
        expect(sandboxEl.children('.popover').hasClass('right')).toBeTruthy();
      });

      it('should support placement', function() {
        var elm = compileDirective('options-placement');
        angular.element(elm[0]).triggerHandler('click');
        $$rAF.flush();
        expect(sandboxEl.children('.popover').hasClass('bottom')).toBeTruthy();
      });

      it('should support exotic-placement', function() {
        var elm = compileDirective('options-placement-exotic');
        angular.element(elm[0]).triggerHandler('click');
        $$rAF.flush();
        expect(sandboxEl.children('.popover').hasClass('bottom-right')).toBeTruthy();
      });

    });

    describe('trigger', function () {

      it('should support an alternative trigger', function() {
        var elm = compileDirective('options-trigger');
        expect(sandboxEl.children('.popover').length).toBe(0);
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.children('.popover').length).toBe(1);
        angular.element(elm[0]).triggerHandler('mouseleave');
        expect(sandboxEl.children('.popover').length).toBe(0);
      });

    });

    describe('html', function () {

      it('should NOT correctly compile inner content by default', function() {
        var elm = compileDirective('default', {popover: {title: 'title<br>next', content: 'content<br>next'}});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.popover-title').html()).not.toBe(scope.popover.title);
        expect(sandboxEl.find('.popover-content').html()).not.toBe(scope.popover.content);
      });

      it('should correctly compile inner content when truthy', function() {
        var elm = compileDirective('options-html', {html: 'true'});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.popover-title').html()).toBe(scope.popover.title);
        expect(sandboxEl.find('.popover-content').html()).toBe(scope.popover.content);
      });

      it('should NOT correctly compile inner content when falsy', function() {
        var elm = compileDirective('options-html', {html: 'false'});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.popover-title').html()).not.toBe(scope.popover.title);
        expect(sandboxEl.find('.popover-content').html()).not.toBe(scope.popover.content);
      });

    });

    describe('container', function() {
      it('accepts element object', function() {
        var testElm = angular.element('<div></div>');
        sandboxEl.append(testElm);
        var myPopover = $popover(sandboxEl, angular.extend({}, templates['default'].scope.popover, {container: testElm}));
        scope.$digest();
        myPopover.show();
        $animate.flush();
        expect(angular.element(testElm.children()[0]).hasClass('popover')).toBeTruthy();
      });

      it('should be contained by element specified in data-container', function() {
        var testElm = angular.element('<div id="testElm"></div>');
        sandboxEl.append(testElm);
        var elm = compileDirective('options-container', angular.extend({}, templates['default'].scope.popover, {container: '#testElm'}));
        expect(testElm.children('.popover').length).toBe(0);
        angular.element(elm[0]).triggerHandler('click');
        $animate.flush();
        expect(testElm.children('.popover').length).toBe(1);
      });

      it('should belong to sandbox when data-container is falsy', function() {
        var elm = compileDirective('options-container', angular.extend({}, templates['default'].scope.popover, {container: 'false'}));
        expect(sandboxEl.children('.popover').length).toBe(0);
        angular.element(elm[0]).triggerHandler('click');
        $animate.flush();
        expect(sandboxEl.children('.popover').length).toBe(1);
      });

    });


    describe('template', function () {

      it('should support custom template', function() {
        $templateCache.put('custom', '<div class="popover"><div class="popover-content">foo: {{content}}</div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.popover-content').text()).toBe('foo: ' + scope.popover.content);
      });

      it('should support template with ngRepeat', function() {
        $templateCache.put('custom', '<div class="popover"><div class="popover-content"><ul><li ng-repeat="item in items">{{item}}</li></ul></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.popover-content').text()).toBe('foobarbaz');
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('click');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.popover-content').text()).toBe('foobarbaz');
      });

      it('should support template with ngClick', function() {
        $templateCache.put('custom', '<div class="popover"><div class="popover-content"><a class="btn" ng-click="popover.counter=popover.counter+1">click me</a></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(sandboxEl.find('.popover-content > .btn')[0]).triggerHandler('click'));
        expect(scope.popover.counter).toBe(1);
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('click');
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(sandboxEl.find('.popover-content > .btn')[0]).triggerHandler('click'));
        expect(scope.popover.counter).toBe(2);
      });

    });


    describe('contentTemplate', function () {

      it('should support custom content templates', function() {
        $templateCache.put('custom', '{{foo}}: some content inside the template');
        var elm = compileDirective('options-contentTemplate');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.popover-title').text()).toBe('foo-title');
        expect(sandboxEl.find('.popover-content').text()).toBe('bar: some content inside the template');
      });

    });

    describe('autoClose', function() {
      it('should close when clicking outside popover when autoClose is truthy', function() {
        var elm = compileDirective('options-autoClose', {autoClose: 'true'});
        expect(sandboxEl.children().length).toBe(1);
        angular.element(elm[0]).triggerHandler('click');
        $timeout.flush();
        expect(sandboxEl.children().length).toBe(2);
        angular.element($window.document).triggerHandler('click');
        expect(sandboxEl.children().length).toBe(1);
      });

      it('should not close when clicking inside popover when autoClose is truthy', function() {
        var elm = compileDirective('options-autoClose', {autoClose: 'true'});
        expect(sandboxEl.children().length).toBe(1);
        angular.element(elm[0]).triggerHandler('click');
        $timeout.flush();
        expect(sandboxEl.children().length).toBe(2);
        angular.element(sandboxEl.find('.popover')[0]).triggerHandler('click');
        expect(sandboxEl.children().length).toBe(2);
      });

      it('should NOT close when clicking outside popover when autoClose is falsy', function() {
        var elm = compileDirective('options-autoClose', {autoClose: 'false'});
        expect(sandboxEl.children().length).toBe(1);
        angular.element(elm[0]).triggerHandler('click');
        $timeout.flush();
        expect(sandboxEl.children().length).toBe(2);
        angular.element($window.document).triggerHandler('click');
        expect(sandboxEl.children().length).toBe(2);
      });

      it('should not close when clicking inside popover when autoClose is falsy', function() {
        var elm = compileDirective('options-autoClose', {autoClose: 'false'});
        expect(sandboxEl.children().length).toBe(1);
        angular.element(elm[0]).triggerHandler('click');
        $timeout.flush();
        expect(sandboxEl.children().length).toBe(2);
        angular.element(sandboxEl.find('.popover')[0]).triggerHandler('click');
        expect(sandboxEl.children().length).toBe(2);
      });

      it('should not close when clicking link inside popover content', function() {
        $templateCache.put('custom', '<div class="popover"><div class="popover-content"><a class="btn" ng-click="popover.counter=popover.counter+1">click me</a></div></div>');
        var elm = compileDirective('options-autoClose-with-template');
        scope.popover.counter = 0;
        expect(sandboxEl.children().length).toBe(1);
        angular.element(elm[0]).triggerHandler('click');
        $timeout.flush();
        // sandboxEl.children().length === 2 indicates popover is in DOM/visible
        expect(sandboxEl.children().length).toBe(2);
        angular.element(sandboxEl.find('.popover-content > .btn')[0]).triggerHandler('click');
        angular.element(sandboxEl.find('.popover-content > .btn')[0]).triggerHandler('click');
        expect(scope.popover.counter).toBe(2);
        expect(sandboxEl.children().length).toBe(2);
        angular.element($window.document).triggerHandler('click');
        expect(sandboxEl.children().length).toBe(1);
      });

      it('should not close when clicking form controls inside popover content', function() {
        $templateCache.put('custom', '<div class="popover"><div class="popover-content"><form><input type="text" class="form-control" /><button class="btn">Click Me!</button></form></div></div>');
        var elm = compileDirective('options-autoClose-with-template');
        expect(sandboxEl.children().length).toBe(1);
        angular.element(elm[0]).triggerHandler('click');
        $timeout.flush();
        // sandboxEl.children().length === 2 indicates popover is in DOM/visible
        expect(sandboxEl.children().length).toBe(2);
        angular.element(sandboxEl.find('.popover-content > .form-control')[0]).triggerHandler('click');
        expect(sandboxEl.children().length).toBe(2);
        angular.element(sandboxEl.find('.popover-content > .btn')[0]).triggerHandler('click');
        expect(sandboxEl.children().length).toBe(2);
        angular.element($window.document).triggerHandler('click');
        expect(sandboxEl.children().length).toBe(1);
      });


    });

    describe('onBeforeShow', function() {

      it('should invoke beforeShow event callback', function() {
        var beforeShow = false;

        function onBeforeShow(select) {
          beforeShow = true;
        }

        var elm = compileDirective('options-events', {onBeforeShow: onBeforeShow});

        angular.element(elm[0]).triggerHandler('click');

        expect(beforeShow).toBe(true);
      });
    });

    describe('onShow', function() {

      it('should invoke show event callback', function() {
        var show = false;

        function onShow(select) {
          show = true;
        }

        var elm = compileDirective('options-events', {onShow: onShow});

        angular.element(elm[0]).triggerHandler('click');
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

        var elm = compileDirective('options-events', {onBeforeHide: onBeforeHide});

        angular.element(elm[0]).triggerHandler('click');
        angular.element(elm[0]).triggerHandler('click');

        expect(beforeHide).toBe(true);
      });
    });

    describe('onHide', function() {

      it('should invoke show event callback', function() {
        var hide = false;

        function onHide(select) {
          hide = true;
        }

        var elm = compileDirective('options-events', {onHide: onHide});

        angular.element(elm[0]).triggerHandler('click');
        angular.element(elm[0]).triggerHandler('click');
        $animate.flush();

        expect(hide).toBe(true);
      });
    });

    describe('prefix', function () {
      it('should call namespaced events through provider', function() {
        var myPopover = $popover(sandboxEl, angular.extend({prefixEvent: 'datepicker'}, templates['default'].scope.popover));
        var emit = spyOn(myPopover.$scope, '$emit');
        scope.$digest();
        myPopover.show();
        myPopover.hide();
        $animate.flush();

        expect(emit).toHaveBeenCalledWith('datepicker.show.before', myPopover);
        expect(emit).toHaveBeenCalledWith('datepicker.show', myPopover);
        expect(emit).toHaveBeenCalledWith('datepicker.hide.before', myPopover);
        expect(emit).toHaveBeenCalledWith('datepicker.hide', myPopover);
      });


      it('should call namespaced events through directive', function() {
        var elm = compileDirective('default-with-namespace');
        var showBefore, show, hide, hideBefore;
        scope.$on('datepicker.show.before', function() {
          showBefore = true;
        });
        scope.$on('datepicker.show', function() {
          show = true;
        });
        scope.$on('datepicker.hide.before', function() {
          hideBefore = true;
        });
        scope.$on('datepicker.hide', function() {
          hide = true;
        });

        angular.element(elm[0]).triggerHandler('click');
        $animate.flush();

        expect(showBefore).toBe(true);
        expect(show).toBe(true);

        angular.element(elm[0]).triggerHandler('click');
        $animate.flush();

        expect(hideBefore).toBe(true);
        expect(hide).toBe(true);
      });

    });

  });

});

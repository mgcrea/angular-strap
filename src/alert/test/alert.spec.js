'use strict';

describe('alert', function() {

  var bodyEl = $('body'), sandboxEl;
  var $compile, $templateCache, $animate, $timeout, $alert, scope;

  beforeEach(module('ngSanitize'));
  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));
  beforeEach(module('mgcrea.ngStrap.modal', 'mgcrea.ngStrap.alert'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_, _$alert_, _$animate_, _$timeout_) {
    scope = _$rootScope_.$new();
    bodyEl.html('');
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo($('body'));
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    $alert = _$alert_;
    $animate = _$animate_;
    $timeout = _$timeout_;
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
      scope: {alert: {title: 'Title', content: 'Hello alert!'}},
      element: '<a title="{{alert.title}}" data-content="{{alert.content}}" bs-alert>click me</a>'
    },
    'default-no-title': {
      scope: {alert: {content: 'Hello alert!'}, title: 'Title'},
      element: '<a data-content="{{alert.content}}" bs-alert>click me</a>'
    },
    'markup-scope': {
      element: '<a bs-alert="alert">click me</a>'
    },
    'markup-ngRepeat': {
      scope: {items: [{name: 'foo', alert: {title: 'Title', content: 'Hello alert!'}}]},
      element: '<ul><li ng-repeat="item in items"><a title="{{item.alert.title}}" data-content="{{item.alert.content}}" bs-alert>{{item.name}}</a></li></ul>'
    },
    'markup-ngClick-service': {
      element: '<a ng-click="showAlert()">click me</a>'
    },
    'options-placement': {
      element: '<a data-placement="left" bs-alert="alert">click me</a>'
    },
    'options-html': {
      scope: {alert: {title: 'title<br>next', content: 'content<br>next'}},
      element: '<a title="{{alert.title}}" data-content="{{alert.content}}" data-html="{{html}}" bs-alert>click me</a>'
    },
    'options-keyboard': {
      element: '<a bs-alert="alert" data-keyboard="{{keyboard}}">click me</a>'
    },
    'options-container': {
      element: '<a bs-alert="alert" data-container="{{container}}">click me</a>'
    },
    'options-dismissable': {
      element: '<a bs-alert="alert" data-dismissable="{{dismissable}}">click me</a>'
    },
    'options-template': {
      scope: {alert: {title: 'Title', content: 'Hello alert!', counter: 0}, items: ['foo', 'bar', 'baz']},
      element: '<a data-template-url="custom" bs-alert="alert">click me</a>'
    },
    'options-events': {
      element: '<a bs-on-before-hide="onBeforeHide" bs-on-hide="onHide" bs-on-before-show="onBeforeShow" bs-on-show="onShow" bs-alert="alert">click me</a>'
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

  describe('with default template', function() {

    it('should open on click', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.alert').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.children('.alert').length).toBe(1);
    });

    it('should close on click', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.alert').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.children('.alert').length).toBe(0);
    });

    it('should correctly compile inner content', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.alert strong').html()).toBe(scope.alert.title);
      expect(sandboxEl.find('.alert').html()).toContain(scope.alert.content);
    });

    it('should support scope as object', function() {
      var elm = compileDirective('markup-scope');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.alert strong').html()).toBe(scope.alert.title);
      expect(sandboxEl.find('.alert').html()).toContain(scope.alert.content);
    });

    it('should support ngRepeat markup inside', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-alert]')).triggerHandler('click');
      expect(sandboxEl.find('.alert strong').html()).toBe(scope.items[0].alert.title);
      expect(sandboxEl.find('.alert').html()).toContain(scope.items[0].alert.content);
    });

    it('should overwrite inherited title when no value specified', function() {
      var elm = compileDirective('default-no-title');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.alert strong').html()).toBeUndefined();
      expect(sandboxEl.find('.alert').html()).toContain(scope.alert.content);
    });

  });

  describe('using service', function() {

    it('should correctly open on next digest', function() {
      var myAlert = $alert(angular.extend({type: 'danger'}, templates['default'].scope.alert));
      scope.$digest();
      expect(bodyEl.children('.alert').length).toBe(1);
      myAlert.hide();
      expect(bodyEl.children('.alert').length).toBe(0);
    });

    it('should correctly be destroyed', function() {
      var myAlert = $alert(templates['default'].scope.alert);
      scope.$digest();
      expect(bodyEl.children('.alert').length).toBe(1);
      myAlert.destroy();
      expect(bodyEl.children('.alert').length).toBe(0);
      expect(bodyEl.children().length).toBe(1);
    });

    it('should correctly work with ngClick', function() {
      var elm = compileDirective('markup-ngClick-service');
      var myAlert = $alert(angular.extend({show: false}, templates['default'].scope.alert));
      scope.showAlert = function() {
        myAlert.$promise.then(myAlert.show);
      };
      expect(bodyEl.children('.alert').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      expect(bodyEl.children('.alert').length).toBe(1);
    });

  });

  describe('options', function() {

    describe('animation', function() {

      it('should default to `am-fade` animation', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.alert')).toHaveClass('am-fade');
      });

    });

    describe('placement', function() {

      it('should default to `null` placement', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.alert')).not.toHaveClass('top');
      });

      it('should support placement', function() {
        var elm = compileDirective('options-placement');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.alert')).toHaveClass('left');
      });

    });

/*
    describe('html', function() {

      //These tests currently fail because our current alert has ng-bind-html="content" instead of
      //ng-bind="content". I'm assuming this is an oversight as it renders the "html" option useless,
      //it's hardwired always on. When we fix that, we can uncomment these html tests.

      it('should not compile inner content by default', function() {
        var elm = compileDirective('default', {alert: {title: 'title<br>next', content: 'content<br>next'}});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.alert > strong').html()).not.toBe('title<br>next');
        expect(sandboxEl.find('.alert > span').html()).not.toBe('content<br>next');
      });

      it('should compile inner content if html is truthy', function() {
        var elm = compileDirective('options-html', {html: 'true'});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.alert > strong').html()).toBe('title<br>next');
        expect(sandboxEl.find('.alert > span').html()).toBe('content<br>next');
      });

      it('should NOT compile inner content if html is false', function() {
        var elm = compileDirective('options-html', {html: 'false'});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.alert > strong').html()).not.toBe('title<br>next');
        expect(sandboxEl.find('.alert > span').html()).not.toBe('content<br>next');
      });

    });
*/

    describe('template', function() {

      it('should support custom template', function() {
        $templateCache.put('custom', '<div class="alert"><div class="alert-inner">foo: {{title}}</div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.alert-inner').text()).toBe('foo: ' + scope.alert.title);
      });

      it('should support template with ngRepeat', function() {
        $templateCache.put('custom', '<div class="alert"><div class="alert-inner"><ul><li ng-repeat="item in items">{{item}}</li></ul></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.alert-inner').text()).toBe('foobarbaz');
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('click');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.alert-inner').text()).toBe('foobarbaz');
      });

      it('should support template with ngClick', function() {
        $templateCache.put('custom', '<div class="alert"><div class="alert-inner"><a class="btn" ng-click="alert.counter=alert.counter+1">click me</a></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(sandboxEl.find('.alert-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.alert.counter).toBe(1);
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('click');
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(sandboxEl.find('.alert-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.alert.counter).toBe(2);
      });

    });

    describe('keyboard', function() {
      // Note: this test "should" fail. I.e. we don't have keyboard capability on alerts because
      // we don't have tabindex attr on them, it causes focus issues. But... we want to allow them
      // this option in their custom templates (we have that in the docs eg), so the test is relevant,
      // it's just that the alert template used here "doesn't" have tabindex on it, and still
      // the test succeeds. Not sure why that is.
      it('should remove alert when data-keyboard is truthy', function() {
        var elm = compileDirective('options-keyboard', {keyboard: 'true'});
        expect(bodyEl.find('.alert').length).toBe(0);
        angular.element(elm[0]).triggerHandler('click');
        var alert = bodyEl.find('.alert');
        expect(alert.length).toBe(1);
        var evt = jQuery.Event( 'keyup', { keyCode: 27, which: 27 } );
        alert.triggerHandler(evt)
        expect(bodyEl.find('.alert').length).toBe(0);
      });

      it('should NOT remove alert when data-keyboard is falsy', function() {
        var elm = compileDirective('options-keyboard', {keyboard: 'false'});
        expect(bodyEl.find('.alert').length).toBe(0);
        angular.element(elm[0]).triggerHandler('click');
        var alert = bodyEl.find('.alert');
        expect(alert.length).toBe(1);
        var evt = jQuery.Event( 'keyup', { keyCode: 27, which: 27 } );
        alert.triggerHandler(evt)
        expect(bodyEl.find('.alert').length).toBe(1);
      });

    });

    describe('container', function() {

      it('accepts element object', function() {
        var testElm = angular.element('<div></div>');
        sandboxEl.append(testElm);
        var myalert = $alert(angular.extend({}, templates['default'].scope.alert, {container: testElm}));
        scope.$digest();
        expect(angular.element(testElm.children()[0]).hasClass('alert')).toBeTruthy();
      });

      it('accepts data-container element selector', function() {
        var testElm = angular.element('<div id="testElm"></div>');
        sandboxEl.append(testElm);
        var elm = compileDirective('options-container', {container: '#testElm'});
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(testElm.children()[0]).hasClass('alert')).toBeTruthy();
      });

      it('should belong to sandbox when data-container is falsy', function() {
        var elm = compileDirective('options-container', angular.extend({}, templates['default'].scope.alert, {container: 'false'}));
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.alert').length).toBe(1);
      });

    });

    describe('dismissable', function() {

      it('should be dismissable by default', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.alert button').length).toBe(1);
      })

      it('should be dismissable when data-dismissable is truthy', function() {
        var elm = compileDirective('options-dismissable', {dismissable: 'true'});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.alert button').length).toBe(1);
      })

      it('should NOT be dismissable when data-dismissable is falsy', function() {
        var elm = compileDirective('options-dismissable', {dismissable: 'false'});
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.alert button').length).toBe(0);
      })

    })

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

  });

});

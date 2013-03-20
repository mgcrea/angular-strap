'use strict';

describe('tab', function () {
  var scope, $sandbox, $compile, $timeout, $location;

  beforeEach(module('$strap.directives'));

  beforeEach(inject(function ($injector, $rootScope, _$compile_, _$timeout_, _$location_) {
    scope = $rootScope.$new();
    $compile = _$compile_;
    $timeout = _$timeout_;
    $location = _$location_;

    $sandbox = $('<div id="sandbox"></div>').appendTo($('body'));

    // Fix events not firing
    $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
      e.preventDefault();
      $(this).tab('show');
    });

  }));

  afterEach(function() {
    $sandbox.remove();
    scope.$destroy();
  });

  var templates = {
    'default': {
      element: '<div bs-tabs><div class="active" data-tab="\'Home\'"><p>A</p></div><div data-tab="\'Profile\'"><p>B</p></div><div data-tab="tab.title"><p>{{tab.content}}</p></div></div>',
      scope: {tab: {title: 'About', content: 'Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney\'s organic lomo retro fanny pack lo-fi farm-to-table readymade.'}}
    },
    'fade': {
      element: '<div bs-tabs><div class="active fade" data-tab="\'Home\'"><p>A</p></div><div class="fade" data-tab="\'Profile\'"><p>B</p></div><div class="fade" data-tab="tab.title"><p>{{tab.content}}</p></div></div>',
      scope: {tab: {title: 'About', content: 'Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney\'s organic lomo retro fanny pack lo-fi farm-to-table readymade.'}}
    },
    'repeat': {
      element: '<div bs-tabs><div ng-repeat="(i, tab) in tabs" ng-class="{active:!i}" data-tab="tab.title"><p>{{tab.content}}</p></div></div>',
      scope: {tabs: [
        {title:'Home', content: 'Raw denim you probably haven\'t heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica.'},
        {title:'Profile', content: 'Food truck fixie locavore, accusamus mcsweeney\'s marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee.'},
        {title:'About', content: 'Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney\'s organic lomo retro fanny pack lo-fi farm-to-table readymade.'}
      ]}
    }
  };

  function compileDirective(template) {
    template = template ? templates[template] : templates['default'];
    angular.extend(scope, template.scope);
    $(template.element).appendTo($sandbox);
    var $element = $(template.element).appendTo($sandbox);
    $element = $compile($element)(scope);
    scope.$digest();
    // tab relies on $timeout
    $timeout.flush();
    return $element;
  }

  // Tests

  it('should correctly build the ul.nav.nav-tabs for you', function() {
    var count = $(templates['default'].element).children('div').length;
    var elm = compileDirective();
    expect(elm.children('ul.nav.nav-tabs').length).toBe(1);
    expect(elm.children('ul.nav.nav-tabs').children('li').length).toBe(count);
    expect(elm.children('ul.nav.nav-tabs').find('li:first a').attr('data-toggle')).toBe('tab');
  });

  it('should correctly build the div.tab-content for you', function() {
    var count = $(templates['default'].element).children('div').length;
    var elm = compileDirective();
    expect(elm.children('div.tab-content').length).toBe(1);
    expect(elm.children('div.tab-content').children('div').length).toBe(count);
  });

  it('should correctly compile tab-content', function() {
    var elm = compileDirective();
    expect(elm.find('ul.nav-tabs li:nth-child(3)').text()).toBe(scope.tab.title);
    expect(elm.find('div.tab-content div:nth-child(3)').text()).toBe(scope.tab.content);
  });

  it('should correctly switch tabs', function() {
    var elm = compileDirective();
    expect(elm.find('ul.nav-tabs li:first').hasClass('active')).toBe(true);
    expect(elm.find('div.tab-content div.active').text()).toBe('A');
    elm.find('ul.nav-tabs li:nth-child(2) a').trigger('click');
    expect(elm.find('ul.nav-tabs li:nth-child(2)').hasClass('active')).toBe(true);
    expect(elm.find('div.tab-content div.active').text()).toBe('B');
  });

  it('should correctly switch tabs with fade class', function() {
    var elm = compileDirective('fade');
    expect(elm.find('ul.nav-tabs li:first').hasClass('active')).toBe(true);
    expect(elm.find('div.tab-content div.fade.active.in').text()).toBe('A');
    elm.find('ul.nav-tabs li:nth-child(2) a').trigger('click');
    expect(elm.find('ul.nav-tabs li:nth-child(2)').hasClass('active')).toBe(true);
    //expect(elm.find('div.tab-content div.fade.active.in').text()).toBe('B'); //@fixme fadein delay?
  });

  it('should correctly render tabs with ngRepeat directive', function() {
    var elm = compileDirective('repeat');
    expect(elm.find('ul.nav-tabs li:first').hasClass('active')).toBe(true);
    expect(elm.find('div.tab-content div.active').text()).toBe(scope.tabs[0].content);
    elm.find('ul.nav-tabs li:nth-child(2) a').trigger('click');
    expect(elm.find('ul.nav-tabs li:nth-child(2)').hasClass('active')).toBe(true);
    expect(elm.find('div.tab-content div.active').text()).toBe(scope.tabs[1].content);
  });

});

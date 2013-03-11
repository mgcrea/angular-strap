'use strict';

describe('tab', function () {
  var scope, $sandbox, $compile, $timeout, $location;

  beforeEach(module('$strap.directives'));

  beforeEach(inject(function ($injector, $rootScope, _$compile_, _$timeout_, _$location_) {
    scope = $rootScope;
    $compile = _$compile_;
    $timeout = _$timeout_;
    $location = _$location_;

    $sandbox = $('<div id="sandbox"></div>').appendTo($('body'));

    // Fix events not firing
    $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
      e.preventDefault();
      $(this).tab('show');
    });

    scope.tab = {title:'About', content: 'Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney\'s organic lomo retro fanny pack lo-fi farm-to-table readymade.'};
  }));

  afterEach(function() {
    $sandbox.remove();
    scope.$destroy();
  });

  var templates = {
    'default': '<div bs-tabs><div class="active" data-tab="\'Home\'"><p>A</p></div><div data-tab="\'Profile\'"><p>B</p></div><div data-tab="tab.title"><p>{{tab.content}}</p></div></div>',
    'fade': '<div bs-tabs><div class="active fade" data-tab="\'Home\'"><p>A</p></div><div class="fade" data-tab="\'Profile\'"><p>B</p></div><div class="fade" data-tab="tab.title"><p>{{tab.content}}</p></div></div>'
  };

  function compileDirective(template) {
    template = template ? templates[template] : templates['default'];
    template = $(template).appendTo($sandbox);
    var elm = $compile(template)(scope);
    scope.$digest();
    return elm;
  }

  // Tests

  it('should correctly build the ul.nav.nav-tabs for you', function() {
    var count = $(templates['default']).children('div').length;
    var elm = compileDirective();
    expect(elm.children('ul.nav.nav-tabs').length).toBe(1);
    expect(elm.children('ul.nav.nav-tabs').children('li').length).toBe(count);
    expect(elm.children('ul.nav.nav-tabs').find('li:first a').attr('data-toggle')).toBe('tab');
  });

  it('should correctly build the div.tab-content for you', function() {
    var count = $(templates['default']).children('div').length;
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
    //expect(elm.find('div.tab-content div.fade.active.in').text()).toBe('B'); //@fixme
  });

});

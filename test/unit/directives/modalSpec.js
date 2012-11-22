'use strict';

describe('modal', function () {
  var elm, scope, $httpBackend, $timeout;

  beforeEach(module('$strap.directives'));

  beforeEach(inject(function (_$httpBackend_, _$timeout_, $rootScope, $compile) {
    $httpBackend = _$httpBackend_,
    $timeout = _$timeout_,
    scope = $rootScope;

    scope.name = "World";

    $httpBackend
      .expectGET('partials/modal.html')
      .respond('Hello {{name}}');

    elm = $compile(
      '<a class="btn" bs-modal="\'partials/modal.html\'"></a>'
    )($rootScope);

    $httpBackend.flush();

  }));

  it('should fetch the partial and build the modal', function () {
    expect(elm.attr('data-toggle')).toBe('modal');
    expect(elm.attr('href')).toBeDefined();
    var $modal = $(elm.attr('href'));
    expect($modal.html()).toBe('Hello {{name}}');
    expect($modal.hasClass('modal')).toBe(true);
  });

  it('should resolve scope variables in the external partial', function() {
    var $modal = $(elm.attr('href'));
    $modal.modal('show'); $timeout.flush();
    expect($modal.text()).toBe('Hello World');
  });

  it('should show the modal on click', function(done) {
    var $modal = $(elm.attr('href'));
    expect($modal.hasClass('hide')).toBe(true);
    elm.trigger('click');
    $timeout(function() {
      expect($modal.hasClass('in')).toBe(true);
      expect($modal.hasClass('hide')).toBe(false);
      done();
    });
  });

});

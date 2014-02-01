'use strict';

describe('debounce', function() {

  var $compile, scope, debounce, throttle;

  beforeEach(module('mgcrea.ngStrap.helpers.debounce'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _debounce_, _throttle_) {
    scope = _$rootScope_;
    $compile = _$compile_;
    debounce = _debounce_;
    throttle = _throttle_;
  }));

  // Tests

  describe('debounce', function() {

    it('should correctly debounce a function', function(done) {
      var counter = 0;
      var incr = function() { counter++; };
      var debouncedIncr = debounce(incr, 12);
      debouncedIncr();
      debouncedIncr();
      expect(counter).toBe(0);
      setTimeout(function() {
        expect(counter).toBe(1);
        done();
      }, 12);
    });

  });

  describe('throttle', function() {

    it('should correctly throttle a function', function(done) {
      var counter = 0;
      var incr = function() { counter++; };
      var throttledIncr = throttle(incr, 12);
      throttledIncr();
      throttledIncr();
      expect(counter).toBe(1);
      setTimeout(function() {
        expect(counter).toBe(2);
        done();
      }, 12);
    });

  });

});

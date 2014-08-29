'use strict';

describe('debounce', function() {

  var $compile, $timeout, scope, debounce, throttle;

  beforeEach(module('mgcrea.ngStrap.helpers.debounce'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_, _debounce_, _throttle_) {
    scope = _$rootScope_;
    $compile = _$compile_;
    $timeout = _$timeout_;
    debounce = _debounce_;
    throttle = _throttle_;
  }));

  // Tests

  describe('debounce', function() {

    it('should correctly debounce a function', function() {
      var counter = 0;
      var incr = function() { counter++; };
      var debouncedIncr = debounce(incr, 12);
      debouncedIncr();
      debouncedIncr();
      expect(counter).toBe(0);
      $timeout.flush();
      expect(counter).toBe(1);
    });

  });

  describe('throttle', function() {

    it('should correctly throttle a function', function() {
      var counter = 0;
      var incr = function() { counter++; };
      var throttledIncr = throttle(incr, 12);
      throttledIncr();
      throttledIncr();
      expect(counter).toBe(1);
      $timeout.flush();
      expect(counter).toBe(2);
    });

  });

});

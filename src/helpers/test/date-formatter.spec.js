'use strict';

describe('dateUtil', function () {

  var $dateFormatter;
  var $locale;
  var dateFilter;

  beforeEach(module('mgcrea.ngStrap.helpers.dateFormatter'));

  // mock angular's dateFileter with a spy,
  // since we call it directly, not a method of it, we can't use jasmine.spyOn
  beforeEach(function() {
    dateFilter = jasmine.createSpy('dateFilter');
    module(function ($provide) {
      $provide.value('dateFilter', dateFilter);
    })
  });

  beforeEach(inject(function (_$dateFormatter_, _$locale_) {
    $dateFormatter = _$dateFormatter_;
    $locale = _$locale_;
  }));

  describe('getDefaultLocale', function() {
    it('should return $locale.id', function() {
      expect($dateFormatter.getDefaultLocale()).toBe($locale.id);

      $locale.id = 'fr';
      expect($dateFormatter.getDefaultLocale()).toBe('fr');

      $locale.id = 'he';
      expect($dateFormatter.getDefaultLocale()).toBe('he');
    });
  });

  describe('hoursFormat', function() {
    it('should return the hours part in a time format', function() {
      expect($dateFormatter.hoursFormat('h:mm a')).toBe('h'); //en
      expect($dateFormatter.hoursFormat('HH:mm')).toBe('HH'); // fr-fr
      expect($dateFormatter.hoursFormat('H.mm')).toBe('H'); // fi
    });
  });

  describe('minutesFormat', function() {
    it('should return the minutes part in a time format', function() {
      expect($dateFormatter.minutesFormat('h:mm a')).toBe('mm');
      expect($dateFormatter.minutesFormat('HH:mm')).toBe('mm');
      expect($dateFormatter.minutesFormat('H.mm')).toBe('mm');
    });
  });

  describe('timeSeparator', function() {
    it('should return the time-separator part in a time format', function() {
      expect($dateFormatter.timeSeparator('h:mm a')).toBe(':');
      expect($dateFormatter.timeSeparator('HH:mm')).toBe(':');
      expect($dateFormatter.timeSeparator('H.mm')).toBe('.');
    });
  });

  describe('showAM', function() {
    it('should return true/false if the time format contains AM/PM part', function() {
      expect($dateFormatter.showAM('h:mm a')).toBe(true);
      expect($dateFormatter.showAM('HH:mm')).toBe(false);
      expect($dateFormatter.showAM('H.mm')).toBe(false);
    });
  });

  describe('formatDate', function() {
    it('should call formatDate with only the date and format arguments', function() {
      $dateFormatter.formatDate('date', 'format', 'lang', 'timezone');
      expect(dateFilter.calls.count()).toBe(1);
      expect(dateFilter.calls.argsFor(0)).toEqual([ 'date', 'format', 'timezone' ]);
    });
  });

});
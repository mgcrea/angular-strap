'use strict';

describe('dateUtil', function () {

  var $dateUtil;

  beforeEach(module('mgcrea.ngStrap.helpers.dateParser'));

  beforeEach(inject(function (_$dateUtil_) {
    $dateUtil = _$dateUtil_;
  }));

  describe('hoursFormat', function() {
    it('should return the hours part in a time format', function() {
      expect($dateUtil.hoursFormat('h:mm a')).toBe('h'); //en
      expect($dateUtil.hoursFormat('HH:mm')).toBe('HH'); // fr-fr
      expect($dateUtil.hoursFormat('H.mm')).toBe('H'); // fi
    });
  });

  describe('minutesFormat', function() {
    it('should return the minutes part in a time format', function() {
      expect($dateUtil.minutesFormat('h:mm a')).toBe('mm');
      expect($dateUtil.minutesFormat('HH:mm')).toBe('mm');
      expect($dateUtil.minutesFormat('H.mm')).toBe('mm');
    });
  });

  describe('timeSeparator', function() {
    it('should return the time-separator part in a time format', function() {
      expect($dateUtil.timeSeparator('h:mm a')).toBe(':');
      expect($dateUtil.timeSeparator('HH:mm')).toBe(':');
      expect($dateUtil.timeSeparator('H.mm')).toBe('.');
    });
  });

  describe('showAM', function() {
    it('should return true/false if the time format contains AM/PM part', function() {
      expect($dateUtil.showAM('h:mm a')).toBe(true);
      expect($dateUtil.showAM('HH:mm')).toBe(false);
      expect($dateUtil.showAM('H.mm')).toBe(false);
    });
  });

});
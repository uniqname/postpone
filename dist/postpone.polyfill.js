/*!
 @name 			postpone.polyfill
 @description	implementation of postpone attribute (https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/ResourcePriorities/Overview.html#attr-postpone)
 @version		0.1.0 - 2014/04/16
 @author		Cory Brown
 @copyright		Copyright 2013 by Intellectual Reserve, Inc.
*/


(function() {
  var assessPostopnablity, el, srcAttrName, supportsAttr, supportsTestImg, _i, _len, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    _this = this;

  srcAttrName = 'data-src';

  supportsTestImg = document.createElement('img');

  supportsAttr = function(el, attr) {
    return !!(__indexOf.call(el, attr) >= 0);
  };

  assessPostopnablity = function(el) {
    var deltaVPB, deltaVPL, deltaVPR, deltaVPT, distanceFromInView, distanceFromTrigger, src, variance;
    variance = parseInt(el.getAttribute('postpone', 10));
    variance = isNaN(variance) ? 0 : variance;
    deltaVPB = el.offsetTop - window.innerHeight - window.scrollY;
    deltaVPT = window.scrollY - (el.offsetTop + el.offsetHeight);
    deltaVPL = window.scrollX - (el.offsetLeft + el.offsetWidth);
    deltaVPR = el.offsetLeft - (window.scrollX + window.innerWidth);
    distanceFromInView = Math.max(deltaVPT, deltaVPB, deltaVPL, deltaVPR, 0);
    distanceFromTrigger = distanceFromInView - variance;
    if (distanceFromTrigger <= 0) {
      src = el.getAttribute(srcAttrName);
      if (src) {
        el.src = src;
        el.removeAttribute(srcAttrName);
        return el.removeAttribute('postpone');
      }
    }
  };

  if (supportsAttr(supportsTestImg, 'postpone')) {
    Array.prototype.forEach.call(document.querySelectorAll('[postpone]'), function() {
      el.src = el.getAttribute(srcAttrName);
      return el.removeAttribute(srcAttrName);
    });
  } else {
    _ref = document.querySelectorAll('[postpone]');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      assessPostopnablity(el);
    }
    window.addEventListener('scroll', function(e) {
      var _j, _len1, _ref1, _results;
      _ref1 = document.querySelectorAll('[postpone]');
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        el = _ref1[_j];
        _results.push(assessPostopnablity(el));
      }
      return _results;
    });
    window.addEventListener('resize', function(e) {
      var _j, _len1, _ref1, _results;
      _ref1 = document.querySelectorAll('[postpone]');
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        el = _ref1[_j];
        _results.push(assessPostopnablity(el));
      }
      return _results;
    });
  }

}).call(this);

/*
//@ sourceMappingURL=postpone.polyfill.js.map
*/
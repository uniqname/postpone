/*!
@name          postpone.polyfill
@description   implementation of postpone getAttribute
                (https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/
                    ResourcePriorities/Overview.html#attr-postpone)
@version       0.1.0 - 2014/04/30
@author        Cory Brown
@copyright     Copyright 2013 by Intellectual Reserve, Inc.
*/


(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.addEventListener('DOMContentLoaded', function() {
    var assessPostopnablity, el, srcAttrName, supportsAttr, supportsTestImg, _i, _len, _ref;
    srcAttrName = 'data-postpone-src';
    supportsTestImg = document.createElement('img');
    supportsAttr = function(el, attr) {
      return !!(__indexOf.call(el, attr) >= 0);
    };
    assessPostopnablity = function(el) {
      var attr, deltaVPB, deltaVPL, deltaVPR, deltaVPT, distanceFromInView, distanceFromTrigger, src, variance, _ref;
      attr = (_ref = el.hasAttribute('data-postpone')) != null ? _ref : {
        'data-postpone': 'postpone'
      };
      variance = parseInt(el.getAttribute(attr, 10));
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
      return Array.prototype.forEach.call(document.querySelectorAll('[postpone], [data-postpone]'), function() {
        el.src = el.getAttribute(srcAttrName);
        return el.removeAttribute(srcAttrName);
      });
    } else {
      _ref = document.querySelectorAll('[postpone], [data-postpone]');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        assessPostopnablity(el);
      }
      window.addEventListener('scroll', function(e) {
        var _j, _len1, _ref1, _results;
        _ref1 = document.querySelectorAll('[postpone], [data-postpone]');
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          el = _ref1[_j];
          _results.push(assessPostopnablity(el));
        }
        return _results;
      });
      return window.addEventListener('resize', function(e) {
        var _j, _len1, _ref1, _results;
        _ref1 = document.querySelectorAll('[postpone], [data-postpone]');
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          el = _ref1[_j];
          _results.push(assessPostopnablity(el));
        }
        return _results;
      });
    }
  });

}).call(this);

/*
//@ sourceMappingURL=postpone.polyfill.js.map
*/
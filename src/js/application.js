
/**
 * @project:  ideo-static-site-boilerplate
 * @author:   ideonetwork (@ideonetwork)
 * Copyright (c) 2018 ideonetwork
*/
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';var _util=require('./util');document.addEventListener('DOMContentLoaded',function(){document.documentElement.className='js';});window.addEventListener('resize',(0,_util.debounce)(function(){},250));window.addEventListener('load',function(){});

},{"./util":2}],2:[function(require,module,exports){
'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.debounce=debounce;exports.throttle=throttle;exports.each=each;exports.$1=$1;exports.$=$;exports.whichTransitionEvent=whichTransitionEvent;exports.getClosest=getClosest;exports.insertAfter=insertAfter;function debounce(func,wait,immediate){var timeout;return function(){var context=this;var args=arguments;var later=function later(){timeout=null;if(!immediate)func.apply(context,args);};var callNow=immediate&&!timeout;clearTimeout(timeout);timeout=setTimeout(later,wait);if(callNow)func.apply(context,args);};}function throttle(callback,wait){var context=arguments.length>2&&arguments[2]!==undefined?arguments[2]:this;var timeout=null;var callbackArgs=null;var later=function later(){callback.apply(context,callbackArgs);timeout=null;};return function(){if(!timeout){callbackArgs=arguments;timeout=setTimeout(later,wait);}};}function each(array,callback,scope){for(var i=0;i<array.length;i+=1){callback.call(scope,i,array[i]);}}function $1(selector,context){return(context||document).querySelector(selector);}function $(selector,context){return(context||document).querySelectorAll(selector);}function whichTransitionEvent(){var t;var el=document.createElement('fakeelement');var transitions={'transition':'transitionend','OTransition':'oTransitionEnd','MozTransition':'transitionend','WebkitTransition':'webkitTransitionEnd'};for(t in transitions){if(el.style[t]!==undefined){return transitions[t];}}}function getClosest(elem,selector){if(!Element.prototype.matches){Element.prototype.matches=Element.prototype.matchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector||Element.prototype.oMatchesSelector||Element.prototype.webkitMatchesSelector||function(s){var matches=(this.document||this.ownerDocument).querySelectorAll(s),i=matches.length;while(--i>=0&&matches.item(i)!==this){}return i>-1;};}// Get the closest matching element
for(;elem&&elem!==document;elem=elem.parentNode){if(elem.matches(selector))return elem;}return null;}function insertAfter(newNode,referenceNode){referenceNode.parentNode.insertBefore(newNode,referenceNode.nextSibling);}

},{}]},{},[1])


//# sourceMappingURL=application.js.map

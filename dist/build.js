'use strict';Object.defineProperty(exports,'__esModule',{value:!0}),exports.packeryEvents=void 0;var _typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&'function'==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?'symbol':typeof a},_vue=require('vue'),_vue2=_interopRequireDefault(_vue),_packery=require('packery'),_packery2=_interopRequireDefault(_packery);function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}var ADD='itemAdded',CHANGE='itemChange',REMOVE='itemRemoved',LAYOUT='layout',packeryPlugin=function(){};exports.default=packeryPlugin;var packeryEvents=exports.packeryEvents=new _vue2.default({});function CustomEvent(a,b){b=b||{bubbles:!1,cancelable:!1,detail:void 0};var c=document.createEvent('CustomEvent');return c.initCustomEvent(a,b.bubbles,b.cancelable,b.detail),c}CustomEvent.prototype=window.Event.prototype,window.CustomEvent=CustomEvent,packeryPlugin.install=function(a){a.directive('packery',{bind:function j(b,c,d){b.packery=new _packery2.default(b,c.value);var e=!_typeof(b.packery.options.initLayout)||b.packery.options.initLayout,f=null,g=function(){e&&a.nextTick(function(){b.packery.reloadItems(),b.packery.layout()})},h=function(a,b){return d.componentInstance?void d.componentInstance.$emit(a,b):void d.elm.dispatchEvent(new CustomEvent(a,b))};b.packery.on('layoutComplete',function(a,b){h('layoutComplete',{event:a,laidOutItems:b})}),b.packery.on('dragItemPositioned',function(a,b){h('dragItemPositioned',{event:a,draggedItem:b})}),b.packery.on('fitComplete',function(a,b){h('fitComplete',{event:a,item:b})});var i=function(a){b.packery&&b.isSameNode(a)&&(clearTimeout(f),f=setTimeout(function(){g()},1))};packeryEvents.$on(ADD,function(a){i(a)}),packeryEvents.$on(CHANGE,function(a){i(a)}),packeryEvents.$on(REMOVE,function(a){i(a)}),packeryEvents.$on(LAYOUT,function(a){e=!0,i(a)})},unbind:function c(a){var b=setInterval(function(){document.body.contains(a)||(a.packery.destroy(),a.packery=null,clearTimeout(b))},1e3)}}),a.directive('packeryItem',{inserted:function b(a){a.packeryNode=a.parentNode,packeryEvents.$emit(ADD,a.packeryNode)},componentUpdated:function b(a){packeryEvents.$emit(CHANGE,a.packeryNode)},unbind:function b(a){packeryEvents.$emit(REMOVE,a.packeryNode)}})};

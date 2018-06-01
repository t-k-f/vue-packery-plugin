'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.packeryEvents = undefined;

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _packery = require('packery');

var _packery2 = _interopRequireDefault(_packery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable brace-style */

var ADD = 'itemAdded';
var CHANGE = 'itemChange';
var REMOVE = 'itemRemoved';
var LAYOUT = 'layout';

var packeryPlugin = function packeryPlugin() {};

exports.default = packeryPlugin;
var packeryEvents = exports.packeryEvents = new _vue2.default({});


/* IE polyfill */

function CustomEvent(event, params)
{
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
}

CustomEvent.prototype = window.Event.prototype;
window.CustomEvent = CustomEvent;

/* Plugin */

packeryPlugin.install = function (Vue, options) {
    Vue.directive('packery', {
        bind: function bind(el, binding, vnode) {
            /* Batch Timeout */

            var batchTimeout = null;

            /* Packery DOM Reference */

            var packery = new _packery2.default(el, binding.value);

            /* Redraw Packery */

            var packeryDraw = function packeryDraw(node) {
                if (!el.isSameNode(node)) {
                    return;
                }
                Vue.nextTick(function () {
                    packery.reloadItems();
                    packery.layout();
                });
            };

            var packeryEmit = function packeryEmit(name, eventObj) {
                if (vnode.componentInstance) {
                    vnode.componentInstance.$emit(name, eventObj);
                    return;
                }

                vnode.elm.dispatchEvent(new CustomEvent(name, eventObj));
            };

            packery.on('layoutComplete', function (event, laidOutItems) {
                packeryEmit('layoutComplete', { event: event, laidOutItems: laidOutItems });
            });

            packery.on('dragItemPositioned', function (event, draggedItem) {
                packeryEmit('dragItemPositioned', { event: event, draggedItem: draggedItem });
            });

            packery.on('fitComplete', function (event, item) {
                packeryEmit('fitComplete', { event: event, item: item });
            });

            /* Batch Events */

            var batchEvents = function batchEvents(node) {
                clearTimeout(batchTimeout);
                batchTimeout = setTimeout(function () {
                    packeryDraw(node);
                }, 1);
            };

            /* Redraw Handlers */

            packeryEvents.$on(ADD, function (node) {
                batchEvents(node);
            });

            packeryEvents.$on(CHANGE, function (node) {
                batchEvents(node);
            });

            packeryEvents.$on(REMOVE, function (node) {
                batchEvents(node);
            });

            packeryEvents.$on(LAYOUT, function (node) {
                batchEvents(node);
            });
        },
        unbind: function unbind(el) {
            var poll = setInterval(function () {
                if (!document.contains(el)) {
                    el.packery.destroy();
                    el.packery = null;
                    clearTimeout(poll);
                }
            }, 1000);
        }
    });

    Vue.directive('packeryItem', {
        inserted: function inserted(el) {
            el.packeryNode = el.parentNode;
            packeryEvents.$emit(ADD, el.packeryNode);
        },
        updated: function updated(el) {
            packeryEvents.$emit(CHANGE, el.packeryNode);
        },
        unbind: function unbind(el, binding, vnode) {
            packeryEvents.$emit(REMOVE, el.packeryNode);
        }
    });
};

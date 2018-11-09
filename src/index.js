/* eslint-disable brace-style */

import Vue from 'vue'
import Packery from 'packery'
import Draggabilly from 'draggabilly';

const ADD = 'itemAdded'
const CHANGE = 'itemChange'
const REMOVE = 'itemRemoved'
const LAYOUT = 'layout'

const packeryPlugin = () => {}

export default packeryPlugin
export const packeryEvents = new Vue({})

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

packeryPlugin.install = function (Vue, options)
{
    Vue.directive('packery', {
        bind (el, binding, vnode)
        {
            /* Batch Timeout */

            var batchTimeout = null

            /* Packery DOM Reference */

            el.packery = new Packery(el, binding.value)

            /* Redraw Packery */

            const packeryDraw = (node, args) =>
            {
                if (!el.packery || !el.isSameNode(node))
                {
                    return
                }
                Vue.nextTick(() =>
                {
                    el.packery.reloadItems()
                    el.packery.layout()
                    if (args && args.draggable) {
                        var itemElems = el.packery.getItemElements();
                        // make items draggable
                        for (var i = 0, len = itemElems.length; i < len; i++) {
                            if (args.draggable === true)
                                addDraggable(itemElems[i]);
                            else
                                addDraggable(itemElems[i], args.draggable);
                        }
                    }
                })
            }

            const addDraggable = (item, args = {}) => {
                if (item.draggabilly)
                {
                    el.packery.unbindDraggabillyEvents(item.draggabilly);
                }
                var draggable = new Draggabilly(item, args);
                item.draggabilly = draggable;
                el.packery.bindDraggabillyEvents(draggable);
                draggable.on('staticClick', function(event, pointer) {
                    emit(vnode, 'itemClicked', {event: event, element: draggable.element})
                });
            }

            const packeryEmit = (name, eventObj) =>
            {
                if (vnode.componentInstance)
                {
                    vnode.componentInstance.$emit(name, eventObj)
                    return
                }

                vnode.elm.dispatchEvent(new CustomEvent(name, eventObj))
            }

            el.packery.on('layoutComplete', (event, laidOutItems) =>
            {
                packeryEmit('layoutComplete', {event: event, laidOutItems: laidOutItems})
            })

            el.packery.on('dragItemPositioned', (event, draggedItem) =>
            {
                packeryEmit('dragItemPositioned', {event: event, draggedItem: draggedItem})
            })

            el.packery.on('fitComplete', (event, item) =>
            {
                packeryEmit('fitComplete', {event: event, item: item})
            })

            /* Batch Events */

            const batchEvents = (node, args) =>
            {
                clearTimeout(batchTimeout)
                batchTimeout = setTimeout(() =>
                {
                    packeryDraw(node, args)
                }, 1)
            }

            /* Redraw Handlers */

            packeryEvents.$on(ADD, (node, args) =>
            {
                batchEvents(node, args)
            })

            packeryEvents.$on(CHANGE, (node, args) =>
            {
                batchEvents(node, args)
            })

            packeryEvents.$on(REMOVE, (node, args) =>
            {
                batchEvents(node, args)
            })

            packeryEvents.$on(LAYOUT, (node, args) =>
            {
                batchEvents(node, args)
            })
        },
        unbind (el)
        {
            const poll = setInterval(() =>
            {
                if(!document.body.contains(el))
                {
                    el.packery.destroy()
                    el.packery = null
                    clearTimeout(poll)
                }
            }, 1000)
        }
    })

    Vue.directive('packeryItem', {
        inserted (el, binding, vnode)
        {
            el.packeryNode = el.parentNode
            var args = Object.assign({ 'vnode': vnode }, binding.value);
            packeryEvents.$emit(ADD, el.packeryNode, args)
        },
        componentUpdated (el, binding, vnode)
        {
            var args = Object.assign({ 'vnode': vnode }, binding.value);
            packeryEvents.$emit(CHANGE, el.packeryNode, args)
        },
        unbind (el, binding, vnode)
        {
            var args = Object.assign({ 'vnode': vnode }, binding.value);
            packeryEvents.$emit(REMOVE, el.packeryNode, args)
        }
    })
}

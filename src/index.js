/* eslint-disable brace-style */

import Vue from 'vue'
import 'packery/dist/packery'

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

            const packeryDraw = node =>
            {
                if (!el.packery || !el.isSameNode(node))
                {
                    return
                }
                Vue.nextTick(() =>
                {
                    el.packery.reloadItems()
                    el.packery.layout()
                })
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

            const batchEvents = node =>
            {
                clearTimeout(batchTimeout)
                batchTimeout = setTimeout(() =>
                {
                    packeryDraw(node)
                }, 1)
            }

            /* Redraw Handlers */

            packeryEvents.$on(ADD, node =>
            {
                batchEvents(node)
            })

            packeryEvents.$on(CHANGE, node =>
            {
                batchEvents(node)
            })

            packeryEvents.$on(REMOVE, node =>
            {
                batchEvents(node)
            })

            packeryEvents.$on(LAYOUT, node =>
            {
                batchEvents(node)
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
        inserted (el)
        {
            el.packeryNode = el.parentNode
            packeryEvents.$emit(ADD, el.packeryNode)
        },
        componentUpdated (el)
        {
            packeryEvents.$emit(CHANGE, el.packeryNode)
        },
        unbind (el, binding, vnode)
        {
            packeryEvents.$emit(REMOVE, el.packeryNode)
        }
    })
}

/* eslint-disable brace-style */

import Vue from 'vue'
import Packery from 'packery'

const ADD = 'itemAdded'
const CHANGE = 'itemChange'
const REMOVE = 'itemRemoved'
const LAYOUT = 'layout'
const DRAGGIE = 'draggie'

const packeryPlugin = () => {}

export default packeryPlugin
export const packeryEvents = new Vue({})

/* IE polyfill */

function CustomEvent(event, params)
{
    params = params || {bubbles: false, cancelable: false, detail: undefined};
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
            /* Packery DOM Reference */

            el.packery = new Packery(el, binding.value)

            /* init layout option */

            var initLayout = (typeof el.packery.options.initLayout) ? el.packery.options.initLayout : true

            /* init layout done? */

            var initLayoutDone = false

            /*Node List */

            var addNodes = []
            var removeNodes = []

            /* Batch Timeout */

            var batchTimeout = null

            /* Redraw Packery */

            const packeryDraw = () =>
            {
                if (!initLayout)
                {
                    return
                }

                Vue.nextTick(() =>
                {
                    if (!initLayoutDone)
                    {
                        el.packery.reloadItems()
                        el.packery.layout()
                    }

                    else if (initLayoutDone && (!addNodes.length && !removeNodes.length))
                    {
                        el.packery.layout()
                    }

                    else if (initLayoutDone && removeNodes.length)
                    {
                        el.packery.remove(removeNodes)
                        el.packery.shiftLayout()
                    }

                    else if (initLayoutDone && addNodes.length)
                    {
                        console.log(addNodes)
                        el.packery.appended(addNodes)
                        el.packery.shiftLayout()
                    }

                    addNodes = []
                    removeNodes = []
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
                initLayoutDone = true

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

            const batchEvents = event =>
            {
                if (!el.packery || !el.isSameNode(event.node))
                {
                    return
                }

                if (event.type == 'layout')
                {
                    initLayout = true
                }

                if (event.type === 'add')
                {
                    addNodes.push(event.item)
                }

                if (event.type === 'remove')
                {
                    removeNodes.push(event.item)
                }

                clearTimeout(batchTimeout)
                batchTimeout = setTimeout(() =>
                {
                    packeryDraw()
                }, 1)
            }

            /* Redraw Handlers */

            packeryEvents.$on(ADD, event =>
            {
                batchEvents(event)
            })

            packeryEvents.$on(CHANGE, event =>
            {
                batchEvents(event)
            })

            packeryEvents.$on(REMOVE, event =>
            {
                batchEvents(event)
            })

            packeryEvents.$on(LAYOUT, event =>
            {
                event = {node: event, type: 'layout'}

                batchEvents(event)
            })

            packeryEvents.$on(DRAGGIE, event =>
            {
                if (!el.isSameNode(event.node))
                {
                    return
                }

                el.packery.bindDraggabillyEvents(event.draggie)
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
            packeryEvents.$emit(ADD, {node: el.packeryNode, item: el, type: 'add'})
        },
        componentUpdated (el)
        {
            packeryEvents.$emit(CHANGE, {node: el.packeryNode, item: el, type: 'change'})
        },
        unbind (el, binding, vnode)
        {
            packeryEvents.$emit(REMOVE, {node: el.packeryNode, item: el, type: 'remove'})
        }
    })
}

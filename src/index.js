/* eslint-disable brace-style */

import Vue from 'vue'
import Packery from 'packery'

const ADD = 'itemAdded'
const CHANGE = 'itemChange'
const REMOVE = 'itemRemoved'

const packeryEvents = new Vue({})
const packeryPlugin = () => {}

export default packeryPlugin

packeryPlugin.install = function (Vue, options)
{
    Vue.directive('packery', {
        bind (el, binding)
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
        },
        unbind (el)
        {
            const poll = setInterval(() =>
            {
                if(!document.contains(el))
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

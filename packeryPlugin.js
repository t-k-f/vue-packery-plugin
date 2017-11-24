/* eslint-disable brace-style */

import Vue from 'Vue'
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
        bind (el, binding, vnode)
        {
            const packery = new Packery(el, binding.value)

            const packeryDraw = (node) =>
            {
                if (!node.isSameNode(el))
                {
                    return
                }
                Vue.nextTick(() =>
                {
                    packery.reloadItems()
                    packery.layout()
                })
            }

            packeryEvents.$on(ADD, (node) =>
            {
                packeryDraw(node)
            })

            packeryEvents.$on(CHANGE, (node) =>
            {
                packeryDraw(node)
            })

            packeryEvents.$on(REMOVE, (node) =>
            {
                packeryDraw(node)
            })
        }
    })

    Vue.directive('packeryItem', {
        inserted (el)
        {
            packeryEvents.$emit(ADD, el.parentNode)
        },
        componentUpdated (el)
        {
            packeryEvents.$emit(CHANGE, el.parentNode)
        },
        unbind (el)
        {
            packeryEvents.$emit(REMOVE, el.parentNode)
        }
    })
}

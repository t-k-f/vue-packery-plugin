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
            const packery = new Packery(el, binding.value)

            const packeryDraw = () =>
            {
                Vue.nextTick(() =>
                {
                    packery.reloadItems()
                    packery.layout()
                })
            }

            packeryEvents.$on(ADD, () =>
            {
                packeryDraw()
            })

            packeryEvents.$on(CHANGE, () =>
            {
                packeryDraw()
            })

            packeryEvents.$on(REMOVE, () =>
            {
                packeryDraw()
            })
        },
        unbind (el)
        {
            el.packery.destroy()
            el.packery = null
        }
    })

    Vue.directive('packeryItem', {
        inserted (el)
        {
            packeryEvents.$emit(ADD)
        },
        componentUpdated (el)
        {
            packeryEvents.$emit(CHANGE)
        },
        unbind (el, binding, vnode)
        {
            packeryEvents.$emit(REMOVE)
        }
    })
}

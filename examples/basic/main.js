import Vue from 'vue'
import App from './App.vue'
import packeryPlugin from '../../src/index.js'

Vue.use(packeryPlugin)

Vue.config.productionTip = false

new Vue({
    render: h => h(App)
}).$mount('#app')

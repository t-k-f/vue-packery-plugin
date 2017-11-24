# Vue.js Packery Plugin

A wrapper for the beloved packery for vue.js

### Installing

```
npm install --save vue-packery-plugin
```

then

```
import VuePackeryPlugin from 'vue-packery-plugin'

Vue.use(VuePackeryPlugin)
```

### Usage

```
<div v-packery='{itemSelector: ".packery-item", percentPosition: true}'>

    <div v-packery-item class='packery-item'></div>
    <div v-packery-item class='packery-item'></div>
    <div v-packery-item class='packery-item'></div>

</div>
```

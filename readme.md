This plugin is no longer maintained, in consideration that packery doesn't play very nice with Vue. Development of a "native" bin packer will continue here => [vue-binpacker-plugin](https://github.com/t-k-f/vue-binpacker-plugin).



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

### Receive events

All the packery events are emitted you can make use of it the following Way:

```
<div v-packery='{itemSelector: ".packery-item", percentPosition: true}' @layoutComplete='doStuff()'>
```

### Manually trigger layout

```
import {packeryEvents} from 'vue-packery-plugin'

...

packeryEvents.$emit('layout', MY_PACKERY_EL)
```
### Draggabilly

If you need draggabilly support follow instructions here [Vue.js Packery Draggabilly Plugin](https://github.com/t-k-f/vue-draggabilly-plugin).

### Examples

Examples can be run with [Vue CLI 3](https://cli.vuejs.org/guide/prototyping.html).

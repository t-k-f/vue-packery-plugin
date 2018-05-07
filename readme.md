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
import {packeryEvents} from 'vue-packery-plugin/src

...

packeryEvents.$emit('layout', MY_PACKERY_EL)
```

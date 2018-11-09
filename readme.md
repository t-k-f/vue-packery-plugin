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

```
<div v-packery-item='{draggable: true}' class='packery-item'></div>
```

Passing options
```
<div v-packery-item='{draggable: {handle: ".handle"}}' class='packery-item'></div>
```

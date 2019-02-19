<template>

    <div>

        <div v-packery='{itemSelector: ".packery-item", percentPosition: true}' class='packery-container'>

            <div v-for='(item, index) in items' :key='item.id' v-packery-item class='packery-item' :style='{height: item.height + "rem"}'>

                <span>{{ index }}</span>

                <input type='button' value='Remove' @click='setRemoveItem(index)'>

            </div>

        </div>

        <input type="button" value="Add Item" @click='setAddItem()'>

    </div>

</template>

<script>

module.exports = {
    name: 'App',
    data ()
    {
        return {
            items: []
        }
    },
    created ()
    {
        for (let i = 0; i < 6; i++)
        {
            this.setAddItem()
        }
    },
    methods:
    {
        setHeight ()
        {
            const rand = Math.random()

            return Math.round(rand * 20) + 5
        },
        setId ()
        {
            return Math.random().toString(36).substr(2, 9)
        },
        setAddItem ()
        {
            this.items.push({
                id: this.setId(),
                height: this.setHeight()
            })
        },
        setRemoveItem (index)
        {
            this.items.splice(index, 1)
        }
    }
}

</script>

<style>

* {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
}

.packery-container {
    background-color: #41f4a3;
}

.packery-item {
    width: 33.33%;
    padding: 1rem;
    background-color: #f4eb42;
    border: 0.2rem dashed #f4be41;
    box-sizing: border-box;
}

.packery-item span{
    display: block;
    font-size: 1.4rem;
    color: #f4be41;
}

.packery-item:nth-child(1) {
    height: 10rem;
}

.packery-item:nth-child(2) {
    height: 5rem;
}

.packery-item:nth-child(3) {
    height: 15rem;
}

.packery-item:nth-child(4) {
    height: 20rem;
}

.packery-item:nth-child(5) {
    height: 5rem;
}

.packery-item:nth-child(6) {
    height: 10rem;
}

</style>

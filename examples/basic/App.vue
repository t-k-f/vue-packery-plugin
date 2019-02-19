<template>

    <div>

        <div v-packery='{itemSelector: ".packery-item", percentPosition: true}' class='packery-container'>

            <div v-for='(item, index) in items' :key='index' v-packery-item class='packery-item' :style='{height: item.height + "rem"}'>

                <span>{{ item.id }}</span>

                <input type='button' value='Remove' @click='setRemoveItem(index)'>

            </div>

        </div>

        <div class='controls'>

            <input type="button" value="Add Item" @click='setAddItem()'>

            <input type="button" value="Shuffle Items" @click='setShuffleItems()'>

        </div>

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
        setAddItem ()
        {
            this.items.push({
                id: this.items.length + 1,
                height: this.setHeight()
            })
        },
        setRemoveItem (index)
        {
            this.items.splice(index, 1)
        },
        setShuffleItems ()
        {
            this.items.sort(() =>
            {
                return 0.5 - Math.random()
            })
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
    margin-bottom: 1rem;
}

.packery-item input{
    color: #fff;
    font-size: 1rem;
    padding: 0.5rem;
    background-color: #f4be41;
    border: none;
}

.controls {
    margin-top: 2rem;
    text-align: center;
}

.controls input {
    color: #fff;
    font-size: 1rem;
    padding: 0.5rem;
    background-color: #444;
    border: none;
    margin: 0 1rem;
}

</style>

<template>
    <img class="picture overlay-image" :src="uri" :alt="title" @click.stop="openOverlay">
</template>

<style lang="sass" scoped>
.picture
    height: auto
    width: 100%
    max-width: 100%
    border-radius: 12px
    box-shadow: var(--shadow)
    object-fit: cover
    background-color: var(--image-background)
</style>

<script>
export default {
    name: 'Picture',
    props: {
        uri: {
            type: String,
            default: null
        },
        title: {
            type: String,
            default: null
        }
    },
    methods: {
        openOverlay(event){
            const condition = true
            if (condition){
                this.$emit('openInOverlay', event.target)
            }
        }
    }
}
</script>
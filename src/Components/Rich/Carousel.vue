<template>
    <ul class="carousel"><slot /></ul>
</template>

<style lang="sass" scoped>
.carousel
    display: flex
    flex-wrap: nowrap
    overflow-x: auto
    overflow-y: hidden
    white-space: nowrap
    -webkit-overflow-scrolling: touch
    padding: 0 0 20px 0
    width: 100%

    *
        display: inline-block
        margin-right: 10px
        flex: 0 0 auto
</style>

<script>
export default {
    name: 'CarouselSelect'
}
</script>
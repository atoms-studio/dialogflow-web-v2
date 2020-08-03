<template>
    <header class="app-head">
        <img
            v-if="app.avatarUri"
            class="app-icon"
            :alt="app.displayName"
            :src="app.avatarUri"
            @click="scrollToTop"
        >
        <img v-else class="app-icon" src="https://chatbot-das-dev.demomwd.it/front/img/logo_bot.png" :alt="app.displayName">
        <div class="app-info">
            <!-- <div class="app-name">{{app.displayName}}</div> -->
        </div>
        <slot />
    </header>
</template>

<style lang="sass" scoped>
@import '@/Style/Mixins'

.app-head
    z-index: 666
    padding: 12px
    position: sticky
    width: 100%
    top: 0px

    .app-icon
        border-radius: 8px
        width: 40px
        height: 40px
        object-fit: contain
        background-color: white
        box-shadow: 1px 4px 8px rgba(0,0,0,0.4) !important
        padding: 4px

    .app-info
        display: inline-block
        margin-left: 10px

        .app-name
            font-size: 18px
            font-weight: 500
            color: var(--text)
            line-height: 15px

        .app-poweredby
            color: var(--text-secondary)
            font-size: 14px

            a[href]
                color: var(--text)
                text-decoration: none

.audio-toggle
    @include reset
    display: flex
    top: 0
    right: 0
    float: right
    margin-right: 13px
    z-index: 999
    padding: 8px
    background-color: #f9cc25
    border-radius: 20px 0 0 20px
    cursor: pointer
    fill: #033467
    transition: padding .25s ease
    border: 1px solid var(--border)
    border-right: 0px


    &:hover
        padding-right: 20px
</style>

<script>
export default {
    name: 'TopHead',
    props: {
        app: {
            type: Object,
            default: null
        }
    },
    methods: {
        scrollToTop(){
            this.$parent.$refs.appChat.scroll(0, 0)
        }
    }
}
</script>
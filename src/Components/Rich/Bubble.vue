<template>
    <div class="bubble" tabindex="0" :class="{'me': me, 'loading': loading}" v-html="marked(text)" />
</template>

<style lang="sass" scoped>
.bubble
    padding: 12px
    border-radius: 40px
    color: var(--text)
    border: 1px solid #E8EAED
    display: inline-block
    position: relative
    background-color: var(--background)
    min-width: 26px
    border-top-left-radius: 0px

    &::before
        content: url("https://chatbot-das-dev.demomwd.it/front/img/bubble-left.svg")
        position: absolute
        left: 0
        top: 0
        margin-top: -9px
        margin-left: -1px

    &.me
        background-color: var(--element-background)
        border: 1px solid var(--element-background)
        color: var(--text-secondary)
        border-top-left-radius: 40px

        &::before
            content: ''

        &::after
            content: url("https://chatbot-das-dev.demomwd.it/front/img/bubble-right.svg")
            position: absolute
            right: 0
            top: 0
            margin-top: -9px
            margin-right: -1px

    &.loading
        height: 16px
        animation: loading .8s ease infinite

@keyframes loading
    0%
        opacity: 0
    50%
        opacity: 1
    100%
        opacity: 0
</style>

<script>
import MarkdownMixin from '@/Mixins/Markdown.vue'

export default {
    name: 'Bubble',
    mixins: [MarkdownMixin],
    props: {
        text: {
            type: String,
            required: false,
            default: ''
        },
        me: {
            type: Boolean
        },
        loading: {
            type: Boolean
        }
    }
}
</script>
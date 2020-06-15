<template>
    <a
        v-if="uri"
        class="suggestion"
        target="_blank"
        rel="noopener noreferrer"
        :href="uri">
        {{title}}
    </a>
    <button v-else class="suggestion">{{title}}</button>
</template>

<style lang="sass" scoped>
@import '@/Style/Mixins'

.suggestion
    @include reset
    padding: 8px 12px
    border-radius: 40px
    border: 1px solid var(--border)
    color: var(--text)
    cursor: pointer
    margin-right: 5px
    font-weight: 500
    margin-bottom: 12px
    //flex-grow: 1

.suggestion[href]
    color: var(--accent)
    text-decoration: none
    border: 1px solid var(--border)
</style>

<script>
export default {
    name: 'Suggestion',
    props: {
        uri: {
            type: String,
            default: null
        },
        title: {
            type: String,
            default: null
        }
    }
}
</script>
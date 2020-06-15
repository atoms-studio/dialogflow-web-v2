<template>
    <div class="component markdown-reset"><slot /></div>
</template>

<style lang="sass" scoped>
.component
    padding-bottom: 8px
    word-break: break-word

    @media screen and (max-width: 720px)
        width: 100%

.markdown-reset::v-deep span,
.markdown-reset::v-deep h1,
.markdown-reset::v-deep h2,
.markdown-reset::v-deep h3,
.markdown-reset::v-deep h4,
.markdown-reset::v-deep h5,
.markdown-reset::v-deep h6,
.markdown-reset::v-deep p,
.markdown-reset::v-deep a,
.markdown-reset::v-deep li
        margin: 0 0 10px 0
        padding: 0
        border: 0
        font-size: 100%
        font: inherit
        vertical-align: baseline

        &:last-child
            margin: 0

</style>

<script>
export default {
    name: 'RichComponent'
}
</script>
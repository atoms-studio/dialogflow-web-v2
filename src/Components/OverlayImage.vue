<template>
    <transition name="fade" @after-leave="$emit('closeAnimationEnded')">
        <div
            v-show="show"
            class="overlay"
            style="
            margin: 0px !important;
            padding: 0px !important;
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            z-index: 1000 !important;
            background-color: white !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            cursor: zoom-out !important;"
            @click.stop="closeOverlay"
        >
            <span
                class="close-icon"
                style="
                font-family: Google Sans, Roboto, sans-serif !important;
                margin: 0px !important;
                padding: 0px !important;
                position: absolute !important;
                top: 2.5vw !important;
                right: 2.5vw !important;
                font-size: 36px;
                cursor: pointer !important;"
            >x</span
            >
            <img
                v-if="img"
                class="image"
                :src="img.src"
                :alt="img.alt"
                style="
                margin: 0px !important;
                padding: 0px !important;
                max-width: 100vw !important;
                max-height: 100vh !important;"
            >
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        img: {
            type: Object,
            default: null
        }
    },
    mounted(){
        document.addEventListener('keyup', e => {
            if (e.keyCode === 27){
                this.closeOverlay()
            }
        })
    },
    methods: {
        closeOverlay(){
            this.$emit('closeOverlay')
        }
    }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
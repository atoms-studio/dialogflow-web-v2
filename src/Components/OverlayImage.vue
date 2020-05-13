<template>
    <transition name="fade" @after-leave="$emit('closeAnimationEnded')">
        <div
            v-show="show"
            class="overlay"
            style="
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: zoom-out;
"
            @click.stop="closeOverlay">
            <span
                class="close-icon"
                style="  font-family: Google Sans, Roboto, sans-serif;
  position: absolute;
  top: 2.5vw;
  right: 2.5vw;
  cursor: pointer;">x</span>
            <img
                v-if="img"
                class="image"
                src="https://source.unsplash.com/user/riccardogiorato"
                :alt="img.alt"
                style="  max-width: 100vw;
  max-height: 100vh;">
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
    }}
</script>

<style lang="scss" scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>